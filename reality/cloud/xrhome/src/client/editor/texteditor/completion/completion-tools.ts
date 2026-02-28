import type {IPosition, editor, IRange} from '../monaco-types'

const HTML_VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img',
  'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']

const COMMENT_AND_STRING_SYMBOLS = ['"', '<!--', '\'']

type AreaInfo = {
  filteredText: string
  isCompletionAvailable: boolean
}

// NOTE(johnny): We could potentially get the token info from the tokenizer instead of using this
// regex once we get it working. The only concern is that it might be slower.
const getAreaInfo = (text: string): AreaInfo => {
  const filteredText = text.replace(
    // NOTE(johnny): Filters all comments and strings from html file
    // eslint-disable-next-line max-len
    /"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'|\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*|<!--[\s\S]*?-->$/gm, '$1'
  )

  return {
    filteredText,
    isCompletionAvailable:
    !COMMENT_AND_STRING_SYMBOLS.find(symbol => filteredText.includes(symbol)),
  }
}

const getDefaultReplaceRange = (model: editor.ITextModel, position: IPosition): IRange => {
  const wordUntilPosition = model.getWordUntilPosition(position)
  return {
    startLineNumber: position.lineNumber,
    startColumn: wordUntilPosition.startColumn,
    endLineNumber: position.lineNumber,
    endColumn: wordUntilPosition.endColumn,
  }
}

const getTextUntilPosition = (
  model: editor.ITextModel, position: IPosition
) => model.getValueInRange({
  startLineNumber: 1,
  startColumn: 1,
  endLineNumber: position.lineNumber,
  endColumn: position.column,
})

export {
  HTML_VOID_ELEMENTS,
  getAreaInfo,
  getDefaultReplaceRange,
  getTextUntilPosition,
}
