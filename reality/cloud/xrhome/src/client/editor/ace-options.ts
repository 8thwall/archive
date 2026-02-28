import {fileExt, fileNameToEditorMode} from './editor-common'
import {JS_FILES} from '../common/editor-files'

export const applyOptions = (editor, filePath: string) => {
  // Editor options: see https://github.com/ajaxorg/ace/wiki/Configuring-Ace#editor-options
  editor.setOptions({
    highlightActiveLine: true,
    autoScrollEditorIntoView: false,
    useSoftTabs: true,
    showLineNumbers: true,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: false, /* TODO(nb): live autocomplete needs to use tab not enter */
  })

  // Renderer options: see https://github.com/ajaxorg/ace/wiki/Configuring-Ace#renderer-options
  editor.renderer.setOptions({
    showPrintMargin: true,
    printMargin: 100,
    showFoldWidgets: true,
    fadeFoldWidgets: true,
    showGutter: true,
    displayIndentGuides: false,
    scrollPastEnd: 0.5,
  })

  // Session options: see https://github.com/ajaxorg/ace/wiki/Configuring-Ace#session-options
  const sessionOptions = {
    tabSize: 2,
    useSoftTabs: true,
    // navigateWithinSoftTabs is documented as an editor option and not a session option; but it
    // appears to have no effect if set as an editor option and it does the right thing here.
    navigateWithinSoftTabs: true,
    mode: `ace/mode/${fileNameToEditorMode(filePath)}`,
  }

  const session = editor.getSession()
  if (!session) {
    console.warn(`[editor] Missing ace session when configuring tab for path ${filePath}`)
    return
  }

  session.setOptions(sessionOptions)

  const filetype = fileExt(filePath) || 'txt'

  // Allow ASI on javascript files.
  if (session.$worker && JS_FILES.includes(filetype)) {
    session.$worker.call('changeOptions', [{asi: true}])
  }

  // Remove some unhelpful html warnings (missing doctype, etc.)
  session.on('changeAnnotation', () => {
    const annotations = session.getAnnotations() || []
    const len = annotations.length
    let i = len
    while (i--) {
      const removeAnnotation = /doctype first\. Expected/.test(annotations[i].text) ||
        /Expected DOCTYPE\./.test(annotations[i].text)

      if (removeAnnotation) {
        annotations.splice(i, 1)
      }
    }
    if (len > annotations.length) {
      session.setAnnotations(annotations)
    }
  })
}
