import React from 'react'

import type {IG8FileInfo} from '../../git/g8-dto'
import AceEditor from '../../../third_party/react-ace/lazy-ace'
import {fileNameToEditorMode} from '../editor-common'
import {
  IDiffViewPane,
  FurledLineInfo,
  furlLineInfo,
  unfurlLineInfo,
  lineInfoToContent,
  lineInfoToLines,
} from '../../git/utils'
import type ReactAce from '../../../third_party/react-ace/ace'
import type {AceEditorClass} from '../../../third_party/react-ace/AceEditorClass'
import {isDependencyPath} from '../../common/editor-files'

interface IUnifiedDiffView extends IDiffViewPane {
  info: IG8FileInfo
}

const UnifiedDiffView: React.FC<IUnifiedDiffView> = ({
  diffViewData, markers, gutterDecorations, info,
}) => {
  const editorRef = React.useRef<AceEditorClass>()

  const isDependency = isDependencyPath(info.path)

  const [state, setState] = React.useState<{furled: FurledLineInfo, info: IG8FileInfo}>()

  // Need to update state if it's a different file or version
  if (!isDependency && info !== state?.info) {
    setState({
      furled: furlLineInfo(diffViewData, markers, gutterDecorations),
      info,
    })
  }

  const refreshEditor = React.useCallback(() => {
    const editor = editorRef.current
    if (!editor) {
      return
    }
    editor.setOptions({
      highlightActiveLine: false,
      highlightSelectedWord: false,
      showFoldWidgets: false,
      useWorker: false,
    })
    editor.renderer.setOptions({
      highlightGutterLine: false,
      showFoldWidgets: false,
      maxLines: diffViewData.length,
    })
    editor.resize()
  }, [diffViewData])

  React.useEffect(() => {
    refreshEditor()
  }, [refreshEditor])

  if (isDependency) {
    return <div>TODO(pawel) Use DependencyDiffView here.</div>
  }

  if (!state) {
    return null
  }

  const setEditorRef = (ref: ReactAce) => {
    editorRef.current = ref?.editor
    refreshEditor()
  }

  const unfurl = (index: number) => {
    const {furledHiddenLineInfo} = state.furled
    if (furledHiddenLineInfo.has(index)) {
      setState(prevState => ({
        ...prevState,
        furled: unfurlLineInfo({...prevState.furled, index}),
      }))
    }
  }

  const {
    furledLineInfo: furledDiffViewData,
    furledMarkers,
    furledGutterDecorations,
  } = state.furled

  return (
    <div className='code-editor diff-viewer'>
      <AceEditor
        mode={fileNameToEditorMode(info.path)}
        theme='dark8'
        width='100%'
        height='100%'
        showPrintMargin={false}
        value={furledDiffViewData?.length
          ? lineInfoToContent(furledDiffViewData)
          : '[NO DIFF DATA]'}
        ref={setEditorRef}
        readOnly
        lineNumbers={furledDiffViewData?.length && lineInfoToLines(furledDiffViewData)}
        markers={furledMarkers}
        gutterDecorations={furledGutterDecorations}
        unfurl={unfurl}
        enableBasicAutocompletion={false}
        enableLiveAutocompletion={false}
      />
    </div>
  )
}

export {
  UnifiedDiffView,
}
