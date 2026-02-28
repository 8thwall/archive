import type {
  MonacoEditor, IKeyboardEvent, IIdentifiedSingleEditOperation, Monaco, Selection,
} from '../monaco-types'
import {HTML_VOID_ELEMENTS, getAreaInfo, getTextUntilPosition} from './completion-tools'
import {isReactOrHtmlPath} from '../../../common/editor-files'

const autoCloseTag = (monaco: Monaco, editor: MonacoEditor, event: IKeyboardEvent) => {
  if (event.browserEvent.key !== '>') {
    return
  }

  const model = editor.getModel()

  if (!isReactOrHtmlPath(model.uri.path)) {
    return
  }

  const currentSelections = editor.getSelections()

  const edits: IIdentifiedSingleEditOperation[] = []
  const newSelections: Selection[] = []

  currentSelections.forEach((selection: Selection) => {
    const {startLineNumber, startColumn, endLineNumber, endColumn} = selection

    if (startColumn !== endColumn || startLineNumber !== endLineNumber) {
      return
    }

    newSelections.push(new monaco.Selection(
      startLineNumber,
      startColumn + 1,
      startLineNumber,
      startColumn + 1
    ))

    const textUntilPosition = getTextUntilPosition(model, {
      lineNumber: startLineNumber,
      column: startColumn,
    })

    const areaInfo = getAreaInfo(textUntilPosition)

    if (!areaInfo.isCompletionAvailable) {
      return
    }

    const lineBeforeChange = model.getValueInRange({
      startLineNumber: endLineNumber,
      startColumn: 1,
      endLineNumber,
      endColumn: startColumn,
    })

    // NOTE(johnny): This regex filters out all strings from the line of code.
    /* Examples:
    const sample1 = '// This string will be deleted //' => const sample1 =
    const sample2 = "\" This string too \"" => const sample2 =
    */
    const filteredLine = lineBeforeChange.replace(/((['"])(?:(?!\2|\\).|\\.)*\2)/g, '')

    // NOTE(johnny): This regex returns the opening tag if it is not in a comment.
    /* Examples:
    <tag => match
    // <tag => no match
    /* <tag => no match
    */
    /* RegExp Grouping:
    Random <text at the start <button-inspector onClick={click}
    [     group 1             ][    group 2   ]
    [              match                                      ]
    */
    const tag = filteredLine.match(/^[^/*]*(?!.*(\/\/|\/\*)).*<([\w-]+)[^>]*$/)?.[2]

    if (!tag || HTML_VOID_ELEMENTS.includes(tag)) {
      return
    }

    edits.push({
      range: {
        startLineNumber: endLineNumber,
        startColumn: endColumn + 1,
        endLineNumber,
        endColumn: endColumn + 1,
      },
      text: `</${tag}>`,
    })
  })

  if (edits.length === 0) {
    return
  }

  // NOTE(johnny): Wait for next tick to apply edits
  setTimeout(() => editor.executeEdits(model.getValue(), edits, newSelections), 0)
}

export {autoCloseTag}
