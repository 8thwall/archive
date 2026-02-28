import React, {FunctionComponent, useEffect, useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import {Accordion, Button, Checkbox, Dimmer, Modal} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import type {DeepReadonly} from 'ts-essentials'

import {
  DependencyDiff,
  G8MergeAnalysisInfoStatus,
  IG8FileDiff,
  IG8FileInfoStatus,
  IG8MergeAnalysisInfo,
  IGit,
} from '../../git/g8-dto'
import {
  removeDependencies, removeIgnoredAssets, transformAssets, transformBlobContents,
} from '../../git/utils'
import {combine} from '../../common/styles'
import coreGitActions from '../../git/core-git-actions'
import {MAX_LAND_MESSAGE_LENGTH} from '../../../shared/module/module-constants'
import {useGitProgress, useGitRepo, useScopedGit} from '../../git/hooks/use-current-git'
import useActions from '../../common/use-actions'
import {useChangeEffect} from '../../hooks/use-change-effect'
import {isDependencyPath, isLandablePath} from '../../common/editor-files'
import ColoredMessage from '../../messages/colored-message'
import {AccountPathEnum, getPathForAccount} from '../../common/paths'
import useCurrentAccount from '../../common/use-current-account'
import {LandItemRow} from '../land/land-item-row'
import {ConditionalPopupWrap} from '../../widgets/conditional-popup-wrap'
import {createThemedStyles, UiThemeProvider} from '../../ui/theme'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {doesRepoHaveConflicts, getActiveClient} from '../../git/git-checks'
import {useOpenGits} from '../../git/hooks/use-open-gits'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {Icon} from '../../ui/components/icon'
import {useMultiRepoContext} from '../multi-repo-context'
import {ProgressBar} from '../../ui/components/progress-bar'
import {SpaceBetween} from '../../ui/layout/space-between'
import {LinkButton} from '../../ui/components/link-button'
import {PrimaryButton} from '../../ui/components/primary-button'
import {useDismissibleModal} from '../dismissible-modal-context'
import {EXPANSE_FILE_PATH} from '../../studio/common/studio-files'
import type {LandType} from '../hooks/use-land-publish-state'
import {Loader} from '../../ui/components/loader'

type DescriptionsByRepo = Record<string, string>
type ExcludedFiles = Record<string, boolean>
type ExcludedFilesByRepo = Record<string, ExcludedFiles>

const countTotalChanges = (gits: DeepReadonly<IGit[]>) => (
  gits.reduce((a, git) => {
    const diffList = removeDependencies(removeIgnoredAssets(git.diff.diffList))
    return a + diffList.length
  }, 0)
)

const getDiffFiles = (
  diffList: DeepReadonly<IG8FileDiff[]>,
  depDiff: DeepReadonly<DependencyDiff[]>
) => {
  const diffPaths = diffList.map(d => d.info.path).filter(path => !isDependencyPath(path))
  const depPaths = depDiff?.map(d => d.filePath)
  return depPaths ? diffPaths.concat(depPaths) : diffPaths
}

const getSelectedFiles = (
  diffFiles: DeepReadonly<string[]>,
  conflictedPaths: DeepReadonly<Set<string>>,
  excludedFiles: DeepReadonly<ExcludedFiles>
) => (diffFiles.filter(path => !conflictedPaths.has(path))
  .filter(isLandablePath)
  .filter(e => !excludedFiles?.[e]))

const hasSelectedFiles = (
  diffFiles: DeepReadonly<string[]>,
  excludedFiles: DeepReadonly<ExcludedFiles>
) => (
  diffFiles.some(path => isLandablePath(path) && !excludedFiles?.[path])
)

type StageStatus = 'READY' | 'SKIPPED' | 'CONFLICT' | 'MISSING_DESCRIPTION' | 'UNKNOWN'

const UNBLOCKED_STATUSES: DeepReadonly<StageStatus[]> = ['READY', 'SKIPPED']

const getLandStatuses = (
  openGits: DeepReadonly<IGit[]>,
  primaryRepoId: string,
  dependencyDiff: DependencyDiff[],
  excludedFilesByRepo: ExcludedFilesByRepo,
  descriptionsByRepo: DescriptionsByRepo
) => {
  const res: Record<string, StageStatus> = {}
  openGits.forEach((git) => {
    const {repoId} = git.repo
    const depDiff = repoId === primaryRepoId ? dependencyDiff : null
    const diffFiles = getDiffFiles(git.diff.diffList, depDiff)
    if (!hasSelectedFiles(diffFiles, excludedFilesByRepo[repoId])) {
      res[repoId] = 'SKIPPED'
    } else if (doesRepoHaveConflicts(git)) {
      res[repoId] = 'CONFLICT'
    } else if (!descriptionsByRepo[repoId]) {
      res[repoId] = 'MISSING_DESCRIPTION'
    } else {
      res[repoId] = 'READY'
    }
  })
  return res
}

const getConflictedPaths = (conflicts: DeepReadonly<IG8MergeAnalysisInfo[]>) => (
  new Set(conflicts
    .filter(info => info.status === G8MergeAnalysisInfoStatus.CONFLICTED)
    .map(({path}) => path))
)

const useStyles = createThemedStyles(theme => ({
  commitInputLabel: {
    '&:after': {
      content: '" *"',
      color: theme.fgError,
    },
  },
  landStageTitle: {
    'padding': '1em',
    '& label': {
      // NOTE(christoph): Overriding semantic here.
      color: [theme.fgMain, '!important'],
      paddingLeft: 'calc(16px + 1em) !important',  // Line up with LandItemRow
      fontWeight: 'bold',
    },
  },
  progressSection: {
    padding: '1rem',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  leftButtons: {
    marginRight: 'auto',
    display: 'flex',
    gap: '0.5rem',
  },
}))

interface ILandStageTitle {
  repoId: string
  checked: boolean
  onClick: () => void
}

const LandStageTitle: React.FC<ILandStageTitle> = ({repoId, checked, onClick}) => {
  const classes = useStyles()
  const title = useMultiRepoContext()?.repoIdToTitle[repoId]
  if (!title) {
    return null
  }
  return (
    <div className={classes.landStageTitle}>
      <Checkbox
        checked={checked}
        onClick={onClick}
        label={title}
      />
    </div>
  )
}

interface IMultiStageProgressSection {
  currentLandStage: number
  stageCount: number
  readyCount: number
  skippedCount: number
}

const MultiStageProgressSection: React.FC<IMultiStageProgressSection> = ({
  currentLandStage, stageCount, readyCount, skippedCount,
}) => {
  const {t} = useTranslation(['cloud-editor-pages'])

  return (
    <section className={useStyles().progressSection}>
      <p>
        {t('editor_page.land_modal.current_review_stage',
          {currentLandStage: currentLandStage + 1, stageCount})}
        {readyCount > 0 && t('editor_page.land_modal.ready_count', {readyCount})}
        {skippedCount > 0 && t('editor_page.land_modal.skipped_count', {skippedCount})}
      </p>
      <ProgressBar progress={(currentLandStage + 1) / stageCount} />
    </section>
  )
}

interface ILandModal {
  // When the modal is closed by either cancel or land complete.
  onClose: () => void

  // If this text is set, a secondary button will appear.
  secondaryButtonText?: string

  disableSecondaryButton: boolean

  // Fired when remote land is complete and new master commit ID is available.
  // DO NOT UNMOUNT THE COMPONENT!
  // onClose() will be called when the modal is ready to close.
  onRemoteLandComplete?: (landType: LandType, commitId: string) => void

  onBeforeExpanseLand?: () => Promise<void>

  // Closes land modal and opens the diff modal
  isLoading: boolean
  dependencyDiff: DependencyDiff[]
  landStages: string[]
  currentLandStage: number
  setCurrentLandStage: (stage: number) => void
}

const LandModal: FunctionComponent<ILandModal> = ({
  onClose, secondaryButtonText, disableSecondaryButton, onRemoteLandComplete, onBeforeExpanseLand,
  isLoading, dependencyDiff, landStages, currentLandStage, setCurrentLandStage,
}) => {
  const primaryState = {
    repo: useGitRepo(),
    gitProgress: useGitProgress(),
  }

  const primaryRepoId = primaryState.repo.repoId

  const account = useCurrentAccount()
  const descriptionInputRef = useRef(null)

  const {
    landFiles,
  } = useActions(coreGitActions)

  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  // Changeset info.
  const [descriptionsByRepo, setDescriptionsByRepo] = React.useState<DescriptionsByRepo>({})
  const [excludedFilesByRepo, setExcludedFilesByRepo] = React.useState<ExcludedFilesByRepo>({})

  const [isLandRunning, setIsLandRunning] = useState(false)
  const [isLandAndPublishRunning, setIsLandAndPublishRunning] = useState(false)

  const currentRepoId = landStages[currentLandStage] || primaryRepoId
  const currentGit = useScopedGit(currentRepoId)
  const openGits = useOpenGits()

  const progressStates = ['START', 'SYNCING', 'LOADING_FILES']

  const landInProgress = useOpenGits(
    e => e.progress.land
  ).some(p => progressStates.includes(p))

  useEffect(() => {
    descriptionInputRef.current?.focus()
  }, [])

  // This will close the modal during clean up tasks like deleting the ephemeral changeset.
  useChangeEffect(([prevLandProgress]) => {
    // This gets hit when remote land and local sync succeed.
    if (prevLandProgress && !landInProgress) {
      onClose()
    }
  }, [landInProgress])

  // ---- END HOOKS ---- //

  const diffList = removeDependencies(removeIgnoredAssets(currentGit.diff.diffList))

  const conflictedPaths = getConflictedPaths(currentGit.conflicts)
  const hasConflict = conflictedPaths.size > 0

  const currentExcludedFiles = excludedFilesByRepo[currentRepoId] || {}
  const currentDescription = descriptionsByRepo[currentRepoId] || ''
  const currentDependencyDiff = currentRepoId === primaryRepoId ? dependencyDiff : null

  const currentDiffFiles = getDiffFiles(currentGit.diff.diffList, currentDependencyDiff)
  const currentSelectedFiles = getSelectedFiles(
    currentDiffFiles, conflictedPaths, currentExcludedFiles
  )

  const landStatuses = getLandStatuses(
    openGits, primaryRepoId, dependencyDiff, excludedFilesByRepo, descriptionsByRepo
  )

  const stageNeedsAction = landStages.some(id => !UNBLOCKED_STATUSES.includes(landStatuses[id]))
  const landableRepos = landStages.filter(id => landStatuses[id] === 'READY')

  const landButtonsDisabled = landInProgress ||
    isLoading ||
    stageNeedsAction ||
    !landableRepos.length

  const handleLand = (landType: LandType) => {
    if (landButtonsDisabled) {
      return
    }
    if (landType === 'land') {
      setIsLandRunning(true)
    } else {
      setIsLandAndPublishRunning(true)
    }

    landableRepos.forEach(async (repoId) => {
      const git = openGits.find(g => g.repo.repoId === repoId)
      const isPrimaryRepo = repoId === primaryRepoId
      const description = descriptionsByRepo[repoId]
      const excludedFiles = excludedFilesByRepo[repoId]
      const depDiff = isPrimaryRepo ? dependencyDiff : null
      const diffFiles = getDiffFiles(git.diff.diffList, depDiff)
      // NOTE(christoph): Since the repo is landable we're assuming there are no conflicting files.
      const selectedFiles = getSelectedFiles(diffFiles, new Set<string>(), excludedFiles)

      // NOTE(pawel) We are responsible for telling landFiles renamed paths that we want deleted.
      const filesToLand = [...selectedFiles]
      selectedFiles.forEach((path) => {
        if (!isDependencyPath(path)) {
          const diffForFile = git.diff.diffList.find(({info}) => info.path === path)
          if (diffForFile?.info.status === IG8FileInfoStatus.RENAMED) {
            filesToLand.push(diffForFile.info.previousPath)
          }
        }
      })

      // Run pre expanse land hook to upload expance history to automerge storage service
      if (filesToLand.includes(EXPANSE_FILE_PATH)) {
        try {
          await onBeforeExpanseLand?.()
        } catch (e) {
          setIsLandRunning(false)
          onClose()
          throw e
        }
      }

      // NOTE(pawel) This function doesn't resolve until the whole landing process is complete.
      // This modal closes when land reaches the CLEAN_UP phase so onLandComplete is provided
      // and called asynchronously before clean up happens. Because the callback runs before
      // syncing, the modal is not in a place to be closed, and so we cannot close the modal here.
      // But since we have the landed commitId we can happily pass that to the parent.
      landFiles(git.repo, getActiveClient(git).name, description, filesToLand, (commitId) => {
        if (isPrimaryRepo) {
          onRemoteLandComplete?.(landType, commitId)
        }
      })
    })
  }

  const toggleFile = (filepath: string) => {
    setExcludedFilesByRepo((s) => {
      const isExcluded = s[currentRepoId]?.[filepath]
      return {...s, [currentRepoId]: {...s[currentRepoId], [filepath]: !isExcluded}}
    })
  }

  const handleClose = () => {
    if (isLandRunning || isLandAndPublishRunning) {
      return
    }
    onClose()
  }

  useDismissibleModal(handleClose)

  const dimmerActive = isLoading || openGits.some(git => (
    git.progress.diff !== 'READY' && landStages.includes(git.repo.repoId)
  ))

  const handleDescriptionChange = (value: string) => {
    setDescriptionsByRepo(s => ({...s, [currentRepoId]: value}))
  }

  // TODO(pawel) Figure out a better way to handle assets.
  const transformedDiffList = transformAssets(diffList)
  const transformedBlobContents = transformBlobContents(currentGit.diff.blobContents)

  const totalChanges = countTotalChanges(openGits) + dependencyDiff.length

  const handleGlobalToggle = () => {
    const newExcludedFiles = {}
    if (currentSelectedFiles.length) {
      transformedDiffList.forEach((d) => { newExcludedFiles[d.info.path] = true })
      currentDependencyDiff?.forEach((d) => { newExcludedFiles[d.filePath] = true })
    }
    setExcludedFilesByRepo(s => ({...s, [currentRepoId]: newExcludedFiles}))
  }

  return (
    <UiThemeProvider mode='dark'> {/* NOTE(christoph): The land modal styling is always dark */}
      <Modal
        open
        onClose={handleClose}
        size='fullscreen'
        className={combine('diff-modal', 'land-modal')}
      >
        <Dimmer active={dimmerActive} />
        {dimmerActive && (
          <Loader>
            {(isLandRunning || isLandAndPublishRunning)
              ? t('editor_page.land_modal.status.landing_changes')
              : t('editor_page.land_modal.status.preparing_files')}
          </Loader>
        )}
        <div className='land-title'>
          <Icon inline stroke='codeBranch' size={2} />
          <div>
            <h2>{t('editor_page.land_modal.header.review_changes')}</h2>
            {!isLoading &&
              <div className='sub-title'>
                {t('editor_page.land_modal.files_modified', {count: totalChanges})}
              </div>
            }
          </div>
        </div>
        <br />
        {!isLoading &&
          <>
            {landStages.length > 1 &&
              <MultiStageProgressSection
                currentLandStage={currentLandStage}
                stageCount={landStages.length}
                readyCount={landableRepos.length}
                skippedCount={landStages.reduce((count, repoId) => (
                  count + (landStatuses[repoId] === 'SKIPPED' ? 1 : 0)
                ), 0)}
              />
            }
            {(landStages.length > 1 || currentRepoId !== primaryRepoId) &&
              <LandStageTitle
                repoId={currentRepoId}
                checked={currentSelectedFiles.length > 0}
                onClick={handleGlobalToggle}
              />
            }
            <Accordion fluid styled className='diff-list'>
              {transformedDiffList.map(diff => (
                <LandItemRow
                  key={diff.info.path}
                  conflicted={conflictedPaths.has(diff.info.path)}
                  hasConflict={!!hasConflict}
                  checked={currentSelectedFiles.includes(diff.info.path)}
                  onToggle={() => toggleFile(diff.info.path)}
                  diff={diff}
                  blobContents={transformedBlobContents[diff.info.blobId]}
                />
              ))}
              {currentDependencyDiff?.map(depDiff => (
                <LandItemRow
                  key={depDiff.filePath}
                  conflicted={conflictedPaths.has(depDiff.filePath)}
                  hasConflict={!!hasConflict}
                  checked={currentSelectedFiles.includes(depDiff.filePath)}
                  onToggle={() => toggleFile(depDiff.filePath)}
                  depDiff={depDiff}
                />
              ))}
            </Accordion>
            {totalChanges > 0 &&
              <div className='land-controls'>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleLand('land')
                }}
                >
                  <SpaceBetween direction='vertical'>
                    <StandardTextField
                      id='land-message-input'
                      required
                      label={(
                        <span className={classes.commitInputLabel}>
                          {t('editor_page.land_modal.label.message')}
                        </span>
                      )}
                      maxLength={MAX_LAND_MESSAGE_LENGTH}
                      ref={descriptionInputRef}
                      value={currentDescription}
                      onChange={e => handleDescriptionChange(e.target.value)}
                      placeholder={
                      hasConflict
                        ? t('editor_page.land_modal.placeholder.sync_to_resolve')
                        : t('editor_page.land_modal.placeholder.description_of_changes')
                      }
                      disabled={hasConflict}
                    />
                    {disableSecondaryButton &&
                      <ColoredMessage
                        className='public-profile-notification margin-top-bottom land'
                        color='blue'
                        iconName='info circle'
                        iconClass='info'
                      >
                        <span>{t('editor_page.land_modal.warning.active_public_profile')}</span>
                        <Link
                          target='_blank'
                          rel='noopener noreferrerr'
                          to={getPathForAccount(account, AccountPathEnum.publicProfile)}
                          a8='click;cloud-editor-publish-flow;go-to-public-profile'
                        >{t('editor_page.land_modal.cta.go_to_public_profile')}
                          <Icon stroke='popOut' />
                        </Link>
                      </ColoredMessage>
                    }
                    <div className={classes.buttonRow}>
                      {landStages.length > 1 &&
                        <div className={classes.leftButtons}>
                          <TertiaryButton
                            disabled={currentLandStage === 0}
                            onClick={() => setCurrentLandStage(currentLandStage - 1)}
                          >
                            <Icon stroke='chevronLeft' inline />
                            {t('button.back', {ns: 'common'})}
                          </TertiaryButton>
                          <TertiaryButton
                            disabled={currentLandStage === landStages.length - 1 ||
                              (!UNBLOCKED_STATUSES.includes(landStatuses[currentRepoId]))
                            }
                            onClick={() => setCurrentLandStage(currentLandStage + 1)}
                          >
                            {t('button.next', {ns: 'common'})}
                            <Icon stroke='chevronRight' inline />
                          </TertiaryButton>
                        </div>
                      }
                      <SpaceBetween>
                        <LinkButton
                          onClick={handleClose}
                          a8='click;cloud-editor-land-flow;cancel-land-button'
                        >{t('button.cancel', {ns: 'common'})}
                        </LinkButton>
                        <ConditionalPopupWrap
                          wrap={hasConflict}
                          message={t('editor_page.land_modal.error.conflict_detected')}
                        >
                          <SpaceBetween>
                            {secondaryButtonText &&
                              <TertiaryButton
                                loading={isLandAndPublishRunning}
                                disabled={
                                  landButtonsDisabled ||
                                  disableSecondaryButton ||
                                  landStatuses[primaryRepoId] !== 'READY'
                                }
                                onClick={() => handleLand('land-and-publish')}
                                className='secondary-action'
                                a8='click;cloud-editor-land-flow;land-files-and-publish-button'
                              >
                                {secondaryButtonText}
                              </TertiaryButton>
                            }
                            <PrimaryButton
                              type='submit'
                              loading={isLandRunning}
                              disabled={landButtonsDisabled}
                              onClick={() => handleLand('land')}
                              a8='click;cloud-editor-land-flow;land-files-button'
                            >{t('editor_page.land_modal.button.land_files')}
                            </PrimaryButton>
                          </SpaceBetween>
                        </ConditionalPopupWrap>
                      </SpaceBetween>
                    </div>
                  </SpaceBetween>
                </form>
              </div>
            } {/* totalChanges > 0 */}
            {totalChanges === 0 &&
              <div className='land-controls no-changes'>
                <p>{t('editor_page.land_modal.message.no_file_changes')}</p>
                <Button
                  primary
                  className='no-outline cancel'
                  onClick={handleClose}
                  content={t('editor_page.land_modal.button.go_back')}
                />
              </div>
            }
          </>
        }
      </Modal>
    </UiThemeProvider>
  )
}

export {
  LandModal,
}

export type {
  ILandModal,
}
