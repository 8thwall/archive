import React from 'react'
import {Button, Dimmer, Icon, Modal, Radio} from 'semantic-ui-react'
import Measure from 'react-measure'
import type {DeepReadonly} from 'ts-essentials'

import {createUseStyles} from 'react-jss'

import {useTranslation} from 'react-i18next'

import {MergeChoice} from '../../git/g8-dto'
import coreGitActions from '../../git/core-git-actions'
import {SplitDiffView} from '../diff/split-diff-view'
import AceEditor from '../../../third_party/react-ace/lazy-ace'
import {
  decorateConflictLines,
  Decorations,
  findMergeMarkers,
  generateSplitDiff,
  lineInfoToContent,
  MergeMarker,
  replaceDecorations,
} from '../../git/utils'
import {fileNameToEditorMode, editorModeToMergeEditorMode} from '../editor-common'
import {
  getContentForCurrentChoice,
  getDiffDataForCurrentChoice,
  getFileIdForCurrentChoice,
  getMergeChoice,
  MergePhase, NonLogicalConflictMerge,
} from './MergePhase'
import '../../static/styles/merge-diff-land.scss'
import {isDependencyPath, MANIFEST_FILE_PATH} from '../../common/editor-files'
import type ReactAce from '../../../third_party/react-ace/ace'
import {useLegacyState} from '../../hooks/use-legacy-state'
import useActions from '../../common/use-actions'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'
import {ProgressBar} from '../../ui/components/progress-bar'
import {SpaceBetween} from '../../ui/layout/space-between'
import {useDependencyContext} from '../dependency-context'
import {ConflictedDependencyView} from './merge-modal/conflicted-dependency-view'
import {useMultiRepoContext} from '../multi-repo-context'
import {UiThemeProvider} from '../../ui/theme'
import {Badge} from '../../ui/components/badge'
import {combine} from '../../common/styles'
import {IconButton} from '../../ui/components/icon-button'
import {useDismissibleModal} from '../dismissible-modal-context'
import {Loader} from '../../ui/components/loader'

const useStyles = createUseStyles({
  fileLabelButtons: {
    display: 'flex',
    flexGrow: '0',
    alignItems: 'center',
    gap: '0.5em',
  },
  centered: {
    display: 'flex',
    alignItems: 'center',
  },
  editContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  conflictResButtons: {
    display: 'flex',
    padding: '0.5em',
    justifyContent: 'center',
    gap: '0.5em',
  },
})

const containsMergeMarkers = buffer => (
  /^((>>>> Original)|(==== (THEIRS|YOURS))|<<<<$)/m.test(buffer)
)

interface IMergeModal {
  onClose(): void
  repoIds: string[]
}

type MergeModalState = DeepReadonly<{
  isRunning: boolean
  currentMergePhaseIndex: number
  previousChoice: MergeChoice | 'edit'
  editing: boolean
  mergePhases: MergePhase[]
  nonLogicalConflicts: NonLogicalConflictMerge[]
  unsavedEditBuffer: string
}>

const INIT_STATE = {
  isRunning: false,
  previousChoice: null,
  editing: false,
  currentMergePhaseIndex: 0,
  mergePhases: null,
  nonLogicalConflicts: null,
  unsavedEditBuffer: '',
} as const

type ConflictResolutionChoice = 'yours' | 'theirs' | 'both'

const SuperMergeModal: React.FC<IMergeModal> = ({onClose, repoIds}) => {
  useDismissibleModal(onClose)
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  const [state, setState] = useLegacyState<MergeModalState>(INIT_STATE)
  const [fileDisplayName, setFileDisplayName] = React.useState<string>('')

  const editorRef = React.useRef<ReactAce>(null)

  const {
    mergePhases, currentMergePhaseIndex, editing, unsavedEditBuffer, isRunning, previousChoice,
  } = state

  const {
    prepareMergePhases, createBlob, diffBlobs, completeSyncClient, getBlobs,
  } = useActions(coreGitActions)
  const completeSyncClientAbandonable = useAbandonableFunction(completeSyncClient)

  const dependencyContext = useDependencyContext()
  const multiRepoContext = useMultiRepoContext()

  useAbandonableEffect(async (abandon) => {
    const promises = Promise.all(repoIds.map(prepareMergePhases))
    const newPhases = await abandon(promises)
    const newMergePhases = newPhases.map(res => res.mergePhases)
    const newNonLogicalConflicts = newPhases.map(res => res.nonLogicalConflicts)

    setState({
      mergePhases: newMergePhases.flat(1),
      nonLogicalConflicts: newNonLogicalConflicts.flat(1),
    })
  }, [])

  const mergePhase = mergePhases && mergePhases[currentMergePhaseIndex]
  const merge = mergePhase?.merge

  useAbandonableEffect(async (abandon) => {
    if (!merge) {
      return
    }
    if (isDependencyPath(merge.path)) {
      const ourAlias = dependencyContext.dependenciesByPath[merge.path]?.alias
      if (ourAlias) {
        setFileDisplayName(ourAlias)
        return
      }
      // Missing entry in the dependencyContext means we deleted the file, get the original name.
      const getBlobRes = await abandon(getBlobs(mergePhase.repoId, [merge.fileId.original]))
      const originalConfig = JSON.parse(getBlobRes.data[0])
      setFileDisplayName(originalConfig.alias)
      return
    }
    setFileDisplayName(merge.path)
  }, [merge])

  // Handle per conflict resolution options
  const [cursorPos, setCursorPos] = React.useState(-1)
  const [cursorHasConflict, setCursorHasConflict] = React.useState(false)
  const [conflicts, rowToConflictMap, unsavedContent] = React.useMemo(() => {
    const conflictMap: Map<number, MergeMarker> = new Map()
    const content = unsavedEditBuffer.split('\n')
    const rowMap = new Array(content.length).fill(-1)

    const mergeMarkers = findMergeMarkers(unsavedEditBuffer)
    mergeMarkers.forEach((marker, idx) => {
      conflictMap[idx] = marker
      for (let i = marker.start; i <= marker.end; i++) {
        rowMap[i] = idx
      }
    })

    return [conflictMap, rowMap, content]
  }, [unsavedEditBuffer])

  React.useEffect(() => {
    setCursorPos(-1)
  }, [editing])

  React.useEffect(() => {
    setCursorHasConflict(
      cursorPos >= 0 && cursorPos < rowToConflictMap.length && rowToConflictMap[cursorPos] >= 0
    )
  }, [cursorPos, rowToConflictMap])

  const handleConflictResolution = (choice: ConflictResolutionChoice) => {
    if (!cursorHasConflict) {
      return
    }
    const conflict = conflicts[rowToConflictMap[cursorPos]]
    const before = unsavedContent.slice(0, conflict.start)
    const after = unsavedContent.slice(conflict.end + 1)
    const theirs = unsavedContent.slice(conflict.theirs + 1, conflict.yours)
    const yours = unsavedContent.slice(conflict.yours + 1, conflict.end)
    let resolved: string[]
    if (choice === 'yours') {
      resolved = yours
    } else if (choice === 'theirs') {
      resolved = theirs
    } else {
      resolved = [...theirs, ...yours]
    }
    const newContent = [...before, ...resolved, ...after]
    setState({unsavedEditBuffer: newContent.join('\n')})
  }

  if (!mergePhases || !fileDisplayName) {
    return (
      <Modal open closeOnDimmerClick={false}>
        <Dimmer active>
          <Loader>{t('editor_page.merge_modal.status.loading')}</Loader>
        </Dimmer>
      </Modal>
    )
  }

  const updateCurrentPhase = (
    update: Partial<MergePhase>
  ): DeepReadonly<MergePhase[]> => mergePhases.map((phase, i) => {
    if (i !== currentMergePhaseIndex) {
      return phase
    }
    return {
      ...phase,
      ...update,
    }
  })

  const applyMergePhaseUpdate = (update: Partial<MergePhase>) => {
    setState({
      mergePhases: updateCurrentPhase(update),
    })
  }

  const setStateAsync = (data: Partial<MergeModalState>) => (
    new Promise<void>(resolve => setState(data, resolve))
  )

  const advanceMerge = () => {
    if (currentMergePhaseIndex < mergePhases.length - 1) {
      setState({
        currentMergePhaseIndex: currentMergePhaseIndex + 1,
        mergePhases: updateCurrentPhase({
          choiceMade: true,
        }),
      })
    }
  }

  const navigateToPreviousFile = () => {
    setState(s => ({
      currentMergePhaseIndex: Math.max(0, s.currentMergePhaseIndex - 1),
    }))
  }

  const handleSubmit = async () => {
    if (currentMergePhaseIndex < mergePhases.length - 1) {
      advanceMerge()
      return
    }

    await setStateAsync({isRunning: true})

    await Promise.all(repoIds.map(repoId => completeSyncClientAbandonable(repoId, null, {
      syncCommitId: mergePhases.find(phase => phase.repoId === repoId).mergeId.theirs,
      mergeDecisions: [
        ...mergePhases.filter(phase => phase.repoId === repoId).map(phase => ({
          fileId: phase.fileIds,
          mergeBlobId: getFileIdForCurrentChoice(phase),
          choice: getMergeChoice(phase),
        })),
        ...state.nonLogicalConflicts.filter(nc => nc.repoId === repoId).map(nc => ({
          fileId: nc.fileIds,
          choice: MergeChoice.Merge,
          mergeBlobId: nc.mergeBlobId,
        })),
      ],
    })))

    onClose()
  }

  const onChangeChoice = (e, {value}) => {
    if (!editing) {
      setState({
        mergePhases: updateCurrentPhase({
          choice: value,
        }),
      })
    }
  }

  const mergeButtonText = () => {
    if (containsMergeMarkers(mergePhases[currentMergePhaseIndex].editBuffer)) {
      return t('editor_page.merge_modal.button.resolve_conflicts')
    }
    if (currentMergePhaseIndex === mergePhases.length - 1) {
      return t('editor_page.merge_modal.button.finish_sync')
    } else {
      return t('editor_page.merge_modal.button.accept_merge')
    }
  }

  const beginEditing = () => {
    const initialEditBuffer = getContentForCurrentChoice(mergePhase)

    let {editBuffer} = mergePhase
    if (!mergePhase.madeEdits) {
      editBuffer = initialEditBuffer
    }

    setState({
      editing: true,
      mergePhases: updateCurrentPhase({
        editBuffer,
        choice: 'edit',
      }),
      previousChoice: mergePhase.choice,
      unsavedEditBuffer: initialEditBuffer,
    })
  }

  const endEditing = async (save) => {
    if (!save || mergePhase.editBuffer === unsavedEditBuffer) {
      setState({
        mergePhases: updateCurrentPhase({
          choice: mergePhase.madeEdits ? 'edit' : previousChoice,
        }),
        editing: false,
      })
      return
    }

    await setStateAsync({
      isRunning: true,
      editing: false,
    })

    // Generate a diff view for the saved edit
    const {id} = await createBlob(mergePhase.repoId, unsavedEditBuffer)
    const editDiff = await diffBlobs(mergePhase.repoId, mergePhase.fileIds.yours, id)

    const [saveDiffA, saveDiffB] = generateSplitDiff(
      mergePhase.mineBuffer, unsavedEditBuffer, editDiff.lines
    )
    const decorsB = [saveDiffB.markers, saveDiffB.gutterDecorations] as Decorations

    // we need to find conflict markers for the diff view because generating the diff
    // view inserts empty lines
    const [conflictMarkers, conflictGutters] = replaceDecorations(
      decorsB, decorateConflictLines(lineInfoToContent(saveDiffB.diffViewData))
    )
    saveDiffB.markers = conflictMarkers
    saveDiffB.gutterDecorations = conflictGutters

    setState({
      isRunning: false,
      mergePhases: updateCurrentPhase({
        editBlobId: id,
        mineEditDiffView: [saveDiffA, saveDiffB],
        madeEdits: true,
        choice: 'edit',
        editBuffer: unsavedEditBuffer,
      }),
    })
  }

  const toggleEditing = () => {
    if (editing) {
      endEditing(true)
    } else {
      beginEditing()
    }
  }

  const resizeEditor = () => {
    if (editorRef.current) {
      editorRef.current.editor.resize()
    }
  }

  const scrollToNextHunk = () => {
    const {hunkStarts, currentHunk, hasHunksForward} = mergePhase

    if (hasHunksForward) {
      const nextHunk = currentHunk + 1
      setState({
        mergePhases: updateCurrentPhase({
          currentHunk: nextHunk,
          currentScrollLine: hunkStarts[nextHunk],
          hasHunksForward: nextHunk < hunkStarts.length - 1,
          hasHunksBackward: true,  // we had to have come from _somewhere_
        }),
      })
    }
  }

  const scrollToPreviousHunk = () => {
    const {hunkStarts, currentHunk, hasHunksBackward} = mergePhase

    if (hasHunksBackward) {
      const nextHunk = currentHunk - 1
      setState({
        mergePhases: updateCurrentPhase({
          currentHunk: nextHunk,
          currentScrollLine: hunkStarts[nextHunk],
          hasHunksForward: true,
          hasHunksBackward: nextHunk > 0,
        }),
      })
    }
  }

  const [diffDataA, diffDataB] = getDiffDataForCurrentChoice(mergePhase)
  const choiceContentHasMergeMarkers = containsMergeMarkers(
    getContentForCurrentChoice(mergePhase)
  )

  const yoursDeleted = !merge.fileId.yours
  const theirsDeleted = !merge.fileId.theirs
  const deleteHappened = yoursDeleted || theirsDeleted

  const editsAllowed = !isDependencyPath(merge.path) && merge.path !== MANIFEST_FILE_PATH
  const mergeAllowed = !deleteHappened && !isDependencyPath(merge.path)

  let statusMessage = ''
  if (yoursDeleted) {
    statusMessage = t('editor_page.merge_modal.message.yours_deleted')
  } else if (theirsDeleted) {
    statusMessage = t('editor_page.merge_modal.message.theirs_deleted')
  }

  const showRightPaneOverlay = (yoursDeleted && mergePhase.choice === MergeChoice.Mine) ||
                                 (theirsDeleted && mergePhase.choice === MergeChoice.Theirs)

  const isDependencyConflict = !!mergePhase.dependencyConflictDetails

  const title = multiRepoContext.repoIdToTitle[mergePhase.repoId]

  const fileConflictResOptions = (
    <>
      <Radio
        label={yoursDeleted
          ? t('editor_page.merge_modal.button.keep_my_delete')
          : t('editor_page.merge_modal.button.keep_mine')
        }
        name='choiceRadio'
        value={MergeChoice.Mine}
        checked={mergePhase.choice === MergeChoice.Mine}
        onChange={onChangeChoice}
      />
      <Radio
        label={theirsDeleted
          ? t('editor_page.merge_modal.button.theirs_deleted')
          : t('editor_page.merge_modal.button.accept_theirs')
        }
        name='choiceRadio'
        value={MergeChoice.Theirs}
        checked={mergePhase.choice === MergeChoice.Theirs}
        onChange={onChangeChoice}
      />
      {mergeAllowed && <Radio
        label={t('editor_page.merge_modal.button.merge')}
        name='choiceRadio'
        value={MergeChoice.Merge}
        checked={mergePhase.choice === MergeChoice.Merge}
        onChange={onChangeChoice}
      />}
      {(mergePhase.madeEdits || mergePhase.choice === 'edit') &&
        <Radio
          label={t('editor_page.merge_modal.button.edit')}
          name='choiceRadio'
          value='edit'
          checked={mergePhase.choice === 'edit'}
          onChange={onChangeChoice}
        />}
    </>
  )

  const perConflictResOptions = Object.keys(conflicts).length === 0
    ? (<p>{t('editor_page.merge_modal.message.all_resolved')}</p>)
    : (
      <>
        <Button
          className='edit-button'
          size='mini'
          content={t('editor_page.merge_modal.button.keep_mine')}
          onClick={() => handleConflictResolution('yours')}
          disabled={!cursorHasConflict}
        />
        <Button
          className='edit-button'
          size='mini'
          content={t('editor_page.merge_modal.button.accept_theirs')}
          onClick={() => handleConflictResolution('theirs')}
          disabled={!cursorHasConflict}
        />
        <Button
          className='edit-button'
          size='mini'
          content={t('editor_page.merge_modal.button.keep_both')}
          onClick={() => handleConflictResolution('both')}
          disabled={!cursorHasConflict}
        />
      </>
    )

  return (
    // TODO(pawel) Make light mode for merge modal.
    // This is needed for StandardRadioButton to have correct styles.
    <UiThemeProvider mode='dark'>
      <Modal
        open
        onClose={onClose}
        closeOnDimmerClick={false}
        size='fullscreen'
        className='merge-modal'
      >
        <Dimmer active={isRunning}>
          <Loader>{t('editor_page.merge_modal.status.diffing')}</Loader>
        </Dimmer>

        <SpaceBetween direction='vertical'>
          <div className='split title-row'>
            <SpaceBetween centered>
              <span>{t(
                'editor_page.merge_modal.message.reviewing_files',
                {current: currentMergePhaseIndex + 1, total: mergePhases.length}
              )}
              </span>
              <IconButton
                stroke='chevronLeft'
                onClick={navigateToPreviousFile}
                disabled={editing || currentMergePhaseIndex === 0}
                text={t('editor_page.merge_modal.icon_button.previous_file')}
              />
              <IconButton
                stroke='chevronRight'
                onClick={handleSubmit}
                disabled={editing || choiceContentHasMergeMarkers || !mergePhase.choiceMade}
                text={t('editor_page.merge_modal.icon_button.next_file')}
              />
            </SpaceBetween>
            <div className='title-container'>
              <Icon name='sync alternate' size='large' />
              <h1>{t('editor_page.merge_modal.title')}</h1>
            </div>
            <div>
              <Button
                className='no-outline cancel'
                content={t('editor_page.merge_modal.button.cancel_sync')}
                onClick={onClose}
                size='mini'
              />
              <Button
                className='accept-merge'
                content={mergeButtonText()}
                primary
                onClick={handleSubmit}
                size='mini'
                disabled={choiceContentHasMergeMarkers}
              />
            </div>
          </div>

          <ProgressBar progress={(currentMergePhaseIndex + 1) / mergePhases.length} />

          <div className='split status-row'>
            <div className={classes.fileLabelButtons}>
              {title && <Badge color='blue' variant='outlined'>{title}</Badge>}
              {fileDisplayName}
            </div>
            <div className='title'>
              {merge.status === 0
                ? t('editor_page.merge_modal.message.mergeable')
                : t('editor_page.merge_modal.message.conflict')}
            </div>
            {/* This div for the spacing of the right third of 'split status-row' */}
            <div />
          </div>
        </SpaceBetween>

        {mergePhase.dependencyConflictDetails &&
          <ConflictedDependencyView
            mergePhase={mergePhase}
            applyMergePhaseUpdate={applyMergePhaseUpdate}
          />
        }

        {!isDependencyConflict &&
          <>
            <div className='split choice-row'>
              <div className='split'>
                <div>{t('editor_page.merge_modal.section.mine')}</div>
                <div className='mine-pane-message'>{statusMessage}</div>
                <div />
              </div>
              {editing &&
                <div className={classes.conflictResButtons}>
                  {perConflictResOptions}
                </div>
              }
              <div className='split'>
                {!editing &&
                  <div className='radios'>
                    {fileConflictResOptions}
                  </div>
                }
                <div className={combine(classes.editContainer, 'edit-div')}>
                  {editing &&
                    <Button
                      className='cancel'
                      size='mini'
                      content={t('button.cancel', {ns: 'common'})}
                      onClick={() => endEditing(false)}
                    />
                          }
                  {mergePhase.choice === 'merge' && mergePhase.totalHunks > 1 &&
                    <SpaceBetween>
                      <IconButton
                        stroke='chevronLeft'
                        onClick={scrollToPreviousHunk}
                        disabled={!mergePhase.hasHunksBackward}
                        text={t('editor_page.merge_modal.icon_button.previous_change')}
                      />
                      <IconButton
                        stroke='chevronRight'
                        onClick={scrollToNextHunk}
                        disabled={!mergePhase.hasHunksForward}
                        text={t('editor_page.merge_modal.icon_button.next_change')}
                      />
                    </SpaceBetween>
                  }
                  {mergePhase.choice === 'merge' &&
                    <span>
                    &emsp;{t('editor_page.merge_modal.message.reviewing_changes', {
                      current: mergePhase.currentHunk + 1,
                      total: mergePhase.totalHunks,
                    })}&emsp;
                    </span>
                  }
                  {editsAllowed && <Button
                    className='edit-button'
                    size='mini'
                    content={editing
                      ? t('editor_page.merge_modal.button.save_edits')
                      : t('editor_page.merge_modal.button.edit')}
                    onClick={toggleEditing}
                    primary={!!editing}
                  />}
                </div>
              </div>
            </div>

            <div className='editor-container'>
              {showRightPaneOverlay &&
                <div className='right-pane-overlay'>
                  <div />
                  <div>
                    {t('editor_page.merge_modal.message.file_will_be_deleted')}
                  </div>
                </div>
                  }
              {editing
                ? (
                  <Measure onResize={resizeEditor}>
                    {({measureRef}) => {
                      const [editMarkers, editGutterDecorations] = decorateConflictLines(
                        unsavedEditBuffer
                      )
                      return (
                        <div className='code-editor diff-viewer edit-container' ref={measureRef}>
                          <AceEditor
                            name='syncEditor'
                            theme='dark8'
                            mode={
                                  editorModeToMergeEditorMode(fileNameToEditorMode(mergePhase.merge.path))
                                }
                            width='100%'
                            height='100%'
                            value={unsavedEditBuffer}
                            markers={editMarkers}
                            gutterDecorations={editGutterDecorations}
                            onChange={buffer => setState({unsavedEditBuffer: buffer})}
                            readOnly={false}
                            ref={editorRef}
                            onCursorChange={value => setCursorPos(value.cursor.row)}
                          />
                        </div>
                      )
                    }}
                  </Measure>
                )
                : (
                  <SplitDiffView
                    info={mergePhase.mineYoursDiff.info}
                    left={diffDataA}
                    right={diffDataB}
                    scrollToLine={mergePhase.currentScrollLine}
                  />
                )
                  }
            </div>
          </>
        }
      </Modal>
    </UiThemeProvider>
  )
}

export {
  SuperMergeModal,
}
