import type {MonacoEditor, ICommandHandler} from './monaco-types'

// NOTE(Julie): The native monaco editor's addCommand is bugged and does not bind commands to the
// correct context when not provided a one. This work around for adding commands is based on:
// https://github.com/microsoft/monaco-editor/issues/2947#issuecomment-1416338287
const bindAddCommandContext = (monacoEditor: MonacoEditor, context: string) => {
  const {addCommand} = monacoEditor

  // NOTE(Julie): monacoEditor.addCommand can be provided a context,
  // but it will be ignored for the purpose of this fix.
  // The bound context will be used so commands will act on the correct editor.
  monacoEditor.addCommand = (
    keybinding: number,
    handler: ICommandHandler
  ) => addCommand.call(monacoEditor, keybinding, handler, context)

  return {
    dispose: () => {
      monacoEditor.addCommand = addCommand
    },
  }
}

export {
  bindAddCommandContext,
}
