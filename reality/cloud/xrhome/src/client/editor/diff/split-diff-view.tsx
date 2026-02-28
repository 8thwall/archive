import React from 'react'
import type {DeepReadonly} from 'ts-essentials'

import type {IG8FileInfo} from '../../git/g8-dto'
import {fileNameToEditorMode, editorModeToMergeEditorMode} from '../editor-common'
import {IDiffViewPane, lineInfoToContent, lineInfoToLines} from '../../git/utils'
import type {AceEditorClass} from '../../../third_party/react-ace/AceEditorClass'
import {Loader} from '../../ui/components/loader'

const SplitEditor = React.lazy(() => import('../../../third_party/react-ace/index').then(module => ({default: module.split})))

interface ISplitDiffView {
  info: IG8FileInfo
  left: DeepReadonly<IDiffViewPane>
  right: DeepReadonly<IDiffViewPane>

  // a scroll is performed when this prop is updated (to scroll to same line set null then reset)
  scrollToLine?: number
}

const getMaxScrollTop = (editor) => {
  const {renderer} = editor
  return renderer.layerConfig.maxHeight - renderer.$size.scrollerHeight + renderer.scrollMargin.bottom
}

const getMaxScrollHorizontal = (editor) => {
  const {renderer} = editor
  const {$getLongestLine, $padding, $size, scrollMargin} = editor.renderer
  return $getLongestLine.apply(renderer) + 2 * $padding - $size.scrollerWidth + scrollMargin.right
}

const SplitDiffView: React.FC<ISplitDiffView> = ({info, left, right, scrollToLine}) => {
  const handlingTopChangeRef = React.useRef(false)
  const handlingHorizontalChangeRef = React.useRef(false)

  const splitEditorRef = React.useRef<AceEditorClass>(null)

  const onEditorLoad = (splitEditor: AceEditorClass) => {
    splitEditorRef.current = splitEditor
    splitEditor.$editors[0].$blockScrolling = Infinity
    splitEditor.$editors[1].$blockScrolling = Infinity

    const leftEditor = splitEditor.$editors[0]
    const rightEditor = splitEditor.$editors[1]

    const leftSession = splitEditor.$editors[0].getSession()
    const rightSession = splitEditor.$editors[1].getSession()

    rightEditor.renderer.$cursorLayer.element.style.opacity = 0
    leftEditor.renderer.$cursorLayer.element.style.opacity = 0

    leftSession.on('changeScrollTop', (top) => {
      if (!handlingTopChangeRef.current && top >= 0) {
        const maxScrollTopRight = getMaxScrollTop(rightEditor)

        handlingTopChangeRef.current = true
        rightSession.setScrollTop(Math.min(top, maxScrollTopRight))
        handlingTopChangeRef.current = false
      }
    })

    rightSession.on('changeScrollTop', (top) => {
      if (!handlingTopChangeRef.current && top >= 0) {
        const maxScrollTopLeft = getMaxScrollTop(leftEditor)

        handlingTopChangeRef.current = true
        leftSession.setScrollTop(Math.min(top, maxScrollTopLeft))
        handlingTopChangeRef.current = false
      }
    })

    leftSession.on('changeScrollLeft', (horizontal) => {
      if (!handlingHorizontalChangeRef.current && horizontal >= 0) {
        const maxHorizontalRight = getMaxScrollHorizontal(rightEditor)

        handlingHorizontalChangeRef.current = true
        rightSession.setScrollLeft(Math.min(horizontal, maxHorizontalRight))
        handlingHorizontalChangeRef.current = false
      }
    })

    rightSession.on('changeScrollLeft', (horizontal) => {
      if (!handlingHorizontalChangeRef.current && horizontal >= 0) {
        const maxHorizontalLeft = getMaxScrollHorizontal(leftEditor)

        handlingHorizontalChangeRef.current = true
        leftSession.setScrollLeft(Math.min(horizontal, maxHorizontalLeft))
        handlingHorizontalChangeRef.current = false
      }
    })

    if (scrollToLine) {
      setTimeout(() => {
        // scrollToLine(Number line, Boolean center, Boolean animate, Function callback)
        leftEditor.scrollToLine(scrollToLine, true, true)
        rightEditor.scrollToLine(scrollToLine, true, true)
      }, 250)
    }
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      splitEditorRef.current?.resize()
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  React.useEffect(() => {
    // NOTE(pawel) the SplitEditor gets updated after us so we delay a bit before updating
    // to ensure our changes happens
    const timeout = setTimeout(() => {
      const splitEditor = splitEditorRef.current
      if (!splitEditor) {
        return
      }
      const [leftEditor, rightEditor] = splitEditor.$editors

      leftEditor.scrollToLine(scrollToLine, true, true)
      rightEditor.scrollToLine(scrollToLine, true, true)
    }, 50)

    return () => {
      clearTimeout(timeout)
    }
  }, [scrollToLine])

  const diffViewData = [
    left.diffViewData && lineInfoToContent(left.diffViewData),
    right.diffViewData && lineInfoToContent(right.diffViewData),
  ]
  return (
    <div className='code-editor diff-viewer' style={{width: '100%', height: '100%'}}>
      <React.Suspense fallback={<Loader />}>
        <SplitEditor
          onLoad={onEditorLoad}
          mode={editorModeToMergeEditorMode(fileNameToEditorMode(info.path))}
          theme='dark8'
          width='100%'
          height='100%'
          showPrintMargin={false}
          value={diffViewData}
          splits={2}
          style={{}}
          readOnly
          markers={[left.markers, right.markers]}
          leftLineNumbers={lineInfoToLines(left.diffViewData)}
          rightLineNumbers={lineInfoToLines(right.diffViewData)}
          gutterDecorations={[left.gutterDecorations, right.gutterDecorations]}
          highlightActiveLine={false}
          highlightGutterLine={false}
          enableLiveAutocompletion={false}
          enableBasicAutocompletion={false}
          setOptions={{
            highlightActiveLine: false,
            highlightGutterLine: false,
            highlightSelectedWord: false,
            showFoldWidgets: false,
            useWorker: false,
          }}
        />
      </React.Suspense>
    </div>
  )
}

export {
  SplitDiffView,
}
