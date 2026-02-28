type EditorOption =
  | 'minLines'
  | 'maxLines'
  | 'readOnly'
  | 'highlightActiveLine'
  | 'tabSize'
  | 'enableBasicAutocompletion'
  | 'enableLiveAutocompletion'
  | 'enableSnippets';

const editorOptions: EditorOption[] = [
  'minLines',
  'maxLines',
  'readOnly',
  'highlightActiveLine',
  'tabSize',
  'enableBasicAutocompletion',
  'enableLiveAutocompletion',
  'enableSnippets',
]

type EditorEvent =
  | 'onChange'
  | 'onFocus'
  | 'onInput'
  | 'onBlur'
  | 'onCopy'
  | 'onPaste'
  | 'onSelectionChange'
  | 'onCursorChange'
  | 'onScroll'
  | 'handleOptions'
  | 'updateRef';

const editorEvents: EditorEvent[] = [
  'onChange',
  'onFocus',
  'onInput',
  'onBlur',
  'onCopy',
  'onPaste',
  'onSelectionChange',
  'onCursorChange',
  'onScroll',
  'handleOptions',
  'updateRef',
]

const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timer: any = null
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}
export {editorOptions, editorEvents, debounce}
