import type {Monaco} from '@monaco-editor/loader'
import type {
  editor, IPosition, IRange, IDisposable, languages, IKeyboardEvent, Selection,
} from 'monaco-editor/esm/vs/editor/editor.api'

type MonacoEditor = editor.IStandaloneCodeEditor

type ITextModel = editor.ITextModel

type IIdentifiedSingleEditOperation = editor.IIdentifiedSingleEditOperation

type ICommandHandler = editor.ICommandHandler

export type {
  MonacoEditor,
  ITextModel,
  IIdentifiedSingleEditOperation,
  editor,
  IDisposable,
  IPosition,
  IRange,
  IKeyboardEvent,
  ICommandHandler,
  Selection,
  languages,
  Monaco,
}
