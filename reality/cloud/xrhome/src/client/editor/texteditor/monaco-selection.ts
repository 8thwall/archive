import type {MonacoEditor} from './monaco-types'

const getSelection = (monacoEditor: MonacoEditor) => {
  if (!monacoEditor) {
    return ''
  }

  const selection = monacoEditor.getSelection()
  // returns the selection text if the selection exists
  return selection ? monacoEditor.getModel().getValueInRange(selection.toJSON()) : ''
}

export {
  getSelection,
}
