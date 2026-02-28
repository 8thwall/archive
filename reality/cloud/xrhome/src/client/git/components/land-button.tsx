import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useHotkeys} from 'react-hotkeys-hook'

import {
  useGitProgress,
  useGitRepo,
} from '../hooks/use-current-git'
import {ILandModal, LandModal} from '../../editor/modals/land-modal'
import {changesetNeedsLand, countLandableChanges, gitNeedsLand} from '../git-checks'
import {useOpenGits} from '../hooks/use-open-gits'
import coreGitActions from '../core-git-actions'
import useActions from '../../common/use-actions'
import type {DependencyDiff, IG8Changeset, IGit} from '../g8-dto'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'

type ILandButton = Partial<Pick<
ILandModal,
'secondaryButtonText' |'disableSecondaryButton' | 'onRemoteLandComplete'
>> & {
  renderButton: (props: {
    disabled: boolean
    onClick: () => void
    canLand?: boolean
    loading?: boolean
  }) => React.ReactElement
  showNumChanges?: boolean
  onBeforeExpanseLand?: () => Promise<void>
}

const useGitNumChangesMessage = () => {
  const count = useOpenGits(countLandableChanges).reduce((a, b) => a + b, 0)
  const {t} = useTranslation(['cloud-editor-pages'])

  return t('editor_page.land_button.changes_msg', {count})
}

const useGitNeedsLand = () => (useOpenGits().some(gitNeedsLand))

type LandState = {
  dependencyDiff: DependencyDiff[]
  landStages: string[]
  currentLandStage: number
}

const LandButton: React.FC<ILandButton> = ({
  renderButton, secondaryButtonText, disableSecondaryButton, onRemoteLandComplete,
  showNumChanges = true, onBeforeExpanseLand,
}) => {
  const primaryState = {
    repo: useGitRepo(),
    gitProgress: useGitProgress(),
  }

  const numChangesMessage = useGitNumChangesMessage()
  const needsG8Land = useGitNeedsLand()

  const [showLandModal, setShowLandModal] = useState<boolean>(false)

  const {
    saveClient, performDiff, syncRepo, getDependencyDiff,
  } = useActions(coreGitActions)

  const [isLoading, setIsLoading] = useState(true)
  const [currentLandState, setCurrentLandState] = useState<LandState>({
    dependencyDiff: [],
    landStages: [],
    currentLandStage: 0,
  })

  const openGits = useOpenGits()

  // Initial mounting/repo change.
  const initializeLandModal = useAbandonableFunction(async () => {
    setIsLoading(true)
    const changesetResults: IG8Changeset[][] = await Promise.all(openGits.map(git => (
      saveClient(git.repo, {forceSave: false})
    )))

    const landableGits: IGit[] = []

    changesetResults.forEach((changesets, i) => {
      if (changesets.some(changesetNeedsLand)) {
        landableGits.push(openGits[i])
      }
    })

    const [dependencyDiff] = await Promise.all([
      // NOTE(christoph): We only need the dependency diff for the primary repo.
      getDependencyDiff(primaryState.repo),
      ...landableGits.map(git => performDiff({
        repositoryName: git.repo.repositoryName,
        repoId: git.repo.repoId,
        findRenames: true,
      })),
      // When these resolve, conflicts are ready.
      ...landableGits.map(git => syncRepo(git.repo)),
    ])

    return {
      landStages: landableGits.map(git => git.repo.repoId),
      dependencyDiff,
      currentLandStage: 0,
    }
  })

  const openLandModal = async () => {
    setIsLoading(true)
    setShowLandModal(true)
    const initializedData = await initializeLandModal()
    setCurrentLandState(initializedData)
    setIsLoading(false)
  }

  const landInProgress = useOpenGits(
    e => e.progress.land
  ).some(p => p !== 'UNSPECIFIED' && p !== 'DONE')

  const canLand = needsG8Land && !landInProgress

  useHotkeys('mod+l', (e) => {
    e.preventDefault()
    openLandModal()
  })

  const setCurrentLandStage = (stage: number) => {
    setCurrentLandState(prev => ({
      ...prev,
      currentLandStage: stage,
    }))
  }

  const buttonAndModal = (
    <>
      {renderButton({
        disabled: landInProgress || !needsG8Land,
        onClick: openLandModal,
        canLand,
        loading: landInProgress,
      })}
      {showLandModal && <LandModal
        onClose={() => setShowLandModal(false)}
        secondaryButtonText={secondaryButtonText}
        disableSecondaryButton={disableSecondaryButton}
        onRemoteLandComplete={onRemoteLandComplete}
        onBeforeExpanseLand={onBeforeExpanseLand}
        isLoading={isLoading}
        dependencyDiff={currentLandState.dependencyDiff}
        landStages={currentLandState.landStages}
        currentLandStage={currentLandState.currentLandStage}
        setCurrentLandStage={setCurrentLandStage}
      />}
    </>
  )

  return (
    showNumChanges
      ? (
        <div>
          {buttonAndModal}
          {primaryState.gitProgress.load !== 'NEEDS_INIT' && (
            <small className='top-pane-label'>
              {numChangesMessage}
            </small>
          )}
        </div>
      )
      : buttonAndModal
  )
}

export {
  LandButton,
}
