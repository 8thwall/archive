import React from 'react'
import {Button, Dimmer, Icon, Modal, Radio} from 'semantic-ui-react'
import Measure from 'react-measure'
import type {DeepReadonly} from 'ts-essentials'

import {MergeChoice} from '../../git/g8-dto'
import coreGitActions from '../../git/core-git-actions'
import {SplitDiffView} from '../diff/split-diff-view'
import AceEditor from '../../../third_party/react-ace/lazy-ace'
import {
  decorateConflictLines,
  Decorations,
  generateSplitDiff,
  lineInfoToContent,
  replaceDecorations,
} from '../../git/utils'
import {fileNameToEditorMode, editorModeToMergeEditorMode} from '../editor-common'
import {
  getContentForCurrentChoice,
  getDiffDataForCurrentChoice,
  getFileIdForCurrentChoice,
  getMergeChoice,
  MergePhase,
} from './MergePhase'
import '../../static/styles/merge-diff-land.scss'
import {isDependencyPath, MANIFEST_FILE_PATH} from '../../common/editor-files'
import type ReactAce from '../../../third_party/react-ace/ace'
import {useLegacyState} from '../../hooks/use-legacy-state'
import {useCurrentGit, useGitActiveClient} from '../../git/hooks/use-current-git'
import useActions from '../../common/use-actions'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'
import {ProgressBar} from '../../ui/components/progress-bar'
import {SpaceBetween} from '../../ui/layout/space-between'
import {useDependencyContext} from '../dependency-context'
import {ConflictedDependencyView} from './merge-modal/conflicted-dependency-view'
import {useDismissibleModal} from '../dismissible-modal-context'
import {Loader} from '../../ui/components/loader'

const containsMergeMarkers = buffer => (
  /^((>>>> Original)|(==== (THEIRS|YOURS))|<<<<$)/m.test(buffer)
)

interface IMergeModal {
  onClose(): void
  title?: string
}

type MergeModalState = DeepReadonly<{
  isRunning: boolean
  currentMergePhaseIndex: number
  previousChoice: MergeChoice | 'edit'
  editing: boolean
  mergePhases: MergePhase[]
  unsavedEditBuffer: string
}>

const INIT_STATE = {
  isRunning: false,
  previousChoice: null,
  editing: false,
  currentMergePhaseIndex: 0,
  mergePhases: null,
  unsavedEditBuffer: '',
} as const

const MergeModal: React.FC<IMergeModal> = ({onClose, title}) => {
  useDismissibleModal(onClose)
  const [state, setState] = useLegacyState<MergeModalState>(INIT_STATE)
  const clientName = useGitActiveClient().name
  const [fileDisplayName, setFileDisplayName] = React.useState<string>('')

  const editorRef = React.useRef<ReactAce>(null)

  const {
    mergePhases, currentMergePhaseIndex, editing, unsavedEditBuffer, isRunning, previousChoice,
  } = state

  const {merges, mergeId, repo} = useCurrentGit()

  const {
    prepareMergePhases, createBlob, diffBlobs, completeSyncClient, getBlobs,
  } = useActions(coreGitActions)
  const completeSyncClientAbandonable = useAbandonableFunction(completeSyncClient)

  const dependencyContext = useDependencyContext()

  useAbandonableEffect(async (abandon) => {
    const newMergePhases = (await abandon(prepareMergePhases(repo))).mergePhases

    setState({
      mergePhases: newMergePhases,
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
      const getBlobRes = await abandon(getBlobs(repo, [merge.fileId.original]))
      const originalConfig = JSON.parse(getBlobRes.data[0])
      setFileDisplayName(originalConfig.alias)
      return
    }
    setFileDisplayName(merge.path)
  }, [merge])

  if (!mergePhases || !fileDisplayName) {
    return (
      <Modal open closeOnDimmerClick={false}>
        <Dimmer active>
          <Loader>Preparing Files</Loader>
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
    if (currentMergePhaseIndex < merges.length - 1) {
      advanceMerge()
      return
    }

    await setStateAsync({isRunning: true})

    const syncParams = {
      syncCommitId: mergeId.theirs,
      mergeDecisions: mergePhases.map(phase => ({
        fileId: phase.fileIds,
        mergeBlobId: getFileIdForCurrentChoice(phase),
        choice: getMergeChoice(phase),
      })),
    }

    await completeSyncClientAbandonable(repo, clientName, syncParams)
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
      return 'Resolve Conflicts'
    }
    if (currentMergePhaseIndex === mergePhases.length - 1) {
      return 'Finish Sync'
    } else {
      return 'Accept Merge'
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
    const {id} = await createBlob(repo, unsavedEditBuffer)
    const editDiff = await diffBlobs(repo, mergePhase.fileIds.yours, id)

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
    statusMessage = 'Your deleted file was modified by another commit'
  } else if (theirsDeleted) {
    statusMessage = 'Your modified file was deleted by another commit'
  }

  const showRightPaneOverlay = (yoursDeleted && mergePhase.choice === MergeChoice.Mine) ||
                                 (theirsDeleted && mergePhase.choice === MergeChoice.Theirs)

  const isDependencyConflict = !!mergePhase.dependencyConflictDetails

  return (
    <Modal
      open
      onClose={onClose}
      closeOnDimmerClick={false}
      size='fullscreen'
      className='merge-modal'
    >
      <Dimmer active={isRunning}>
        <Loader>Diffing your changes...</Loader>
      </Dimmer>

      <SpaceBetween direction='vertical'>
        <div className='split title-row'>
          <div>
            <Button
              className='no-outline cancel'
              content='Cancel Sync'
              onClick={onClose}
              size='mini'
            />
          </div>
          <div className='title-container'>
            <Icon name='sync alternate' size='large' />
            <h1>Review Sync</h1>
          </div>
          <div>
            <Button.Group size='mini'>
              <Button
                icon='chevron left'
                onClick={navigateToPreviousFile}
                disabled={editing || currentMergePhaseIndex === 0}
              />
              <Button
                icon='chevron right'
                onClick={handleSubmit}
                disabled={
                    editing || choiceContentHasMergeMarkers || !mergePhase.choiceMade
                }
              />
            </Button.Group>
              &emsp;
            <span>Reviewing file {currentMergePhaseIndex + 1} of {mergePhases.length}</span>
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
          <div>
            {title && `${title} / `}
            {fileDisplayName}
          </div>
          <div className='title'>
            {merge.status === 0 ? 'Mergeable' : 'Merge Conflict'}
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
              <div>mine</div>
              <div className='mine-pane-message'>{statusMessage}</div>
              <div />
            </div>
            <div className='split'>
              <div className='radios'>
                <Radio
                  label={yoursDeleted ? 'Keep my delete' : 'Keep mine'}
                  name='choiceRadio'
                  value={MergeChoice.Mine}
                  checked={mergePhase.choice === MergeChoice.Mine}
                  onChange={onChangeChoice}
                />
                <Radio
                  label={theirsDeleted ? 'Accept their delete' : 'Accept theirs'}
                  name='choiceRadio'
                  value={MergeChoice.Theirs}
                  checked={mergePhase.choice === MergeChoice.Theirs}
                  onChange={onChangeChoice}
                />
                {mergeAllowed && <Radio
                  label='Merge'
                  name='choiceRadio'
                  value={MergeChoice.Merge}
                  checked={mergePhase.choice === MergeChoice.Merge}
                  onChange={onChangeChoice}
                />}
                {(mergePhase.madeEdits || mergePhase.choice === 'edit') &&
                  <Radio
                    label='edit'
                    name='choiceRadio'
                    value='edit'
                    checked={mergePhase.choice === 'edit'}
                    onChange={onChangeChoice}
                  />}
              </div>
              <div className='edit-div'>
                {editing &&
                  <Button
                    className='cancel'
                    size='mini'
                    content='Cancel'
                    onClick={() => endEditing(false)}
                  />
                }
                {mergePhase.choice === 'merge' && mergePhase.totalHunks > 1 &&
                  <Button.Group size='tiny' className='navigate-hunks' compact>
                    <Button
                      icon='chevron left'
                      onClick={scrollToPreviousHunk}
                      disabled={!mergePhase.hasHunksBackward}
                    />
                    <Button
                      icon='chevron right'
                      onClick={scrollToNextHunk}
                      disabled={!mergePhase.hasHunksForward}
                    />
                  </Button.Group>
                }
                {mergePhase.choice === 'merge' &&
                  <span>
                  &emsp;{mergePhase.currentHunk + 1} of {mergePhase.totalHunks} changes&emsp;
                  </span>
                }
                {editsAllowed && <Button
                  className='edit-button'
                  size='mini'
                  content={editing ? 'Save Edits' : 'Edit'}
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
                  This file will be deleted
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
  )
}

export {
  MergeModal,
}
