import * as React from 'react'
import Measure from 'react-measure'

import {fileNameToEditorMode} from './editor-common'
import {applyOptions} from './ace-options'
import {useUserEditorSettings} from '../user/use-user-editor-settings'

const LazyAceEditor = React.lazy(() => import('../../third_party/react-ace/ace'))
const LazyCodeHighlight = React.lazy(() => import('../browse/code-highlight'))

interface ITextPreview {
  src: string
  isPublicView: boolean
}

const TextPreview: React.FunctionComponent<ITextPreview> = ({src, isPublicView}) => {
  const [content, setContent] = React.useState<string>(null)
  const [editor, setEditor] = React.useState<any>()
  const editorSettings = useUserEditorSettings()

  React.useEffect(() => {
    setContent(null)
    fetch(src).then(res => res.text()).then(text => setContent(text))
  }, [src])

  const handleRefUpdate = (ref) => {
    setEditor(ref?.editor)
    if (ref?.editor) {
      applyOptions(ref.editor, src)
    }
  }

  if (!content) {
    return null
  }

  if (isPublicView) {
    const language = fileNameToEditorMode(src)
    return (
      <React.Suspense fallback={null}>
        <LazyCodeHighlight content={content} language={language} />
      </React.Suspense>
    )
  }

  return (
    <React.Suspense fallback={null}>
      <Measure onResize={() => editor?.resize?.()}>
        {({measureRef}) => (
          <div className='code-editor expand-1 measure-container' ref={measureRef}>
            <LazyAceEditor
              mode={fileNameToEditorMode(src)}
              theme={editorSettings.darkMode ? 'dark8' : 'light8'}
              width='100%'
              height='100%'
              value={content}
              ref={handleRefUpdate}
              readOnly
            />
            <div className='read-only-indicator'>Read-Only</div>
          </div>
        )}
      </Measure>
    </React.Suspense>
  )
}

export default TextPreview
