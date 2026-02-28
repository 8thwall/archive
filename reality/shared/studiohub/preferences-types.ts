type HubPreferences = {
  codeEditorPath?: string
  firstTimeStatus?: 'pending' | 'complete'
}

type CodeEditor = {
  identifier?: 'vscode'
  name: string
  path: string
}

type InstalledPrograms = {
  availableEditors: Array<CodeEditor>
}

export type {
  HubPreferences,
  InstalledPrograms,
  CodeEditor,
}
