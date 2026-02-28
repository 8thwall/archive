type EditorThemeName = '8th-wall-dark' | '8th-wall-light' | 'abyss' | 'kimbie-dark' |
  'monokai-dimmed' | 'monokai' | 'night-owl-dark' | 'night-owl-light' | 'quietlight' |
  'solarized-dark' | 'solarized-light' | 'tomorrow-night-blue'

interface UserEditorSettings {
  darkMode: boolean
  monacoTheme: EditorThemeName
  autoFormat: boolean
  minimap: boolean
  localLinkSharing: boolean
  keyboardHandler: 'vim' | 'emacs' | 'vscode' | null
  liveSync: boolean
  saveDebugEdits: boolean
  viewExpanseDiff: boolean
}

export {
  UserEditorSettings,
  EditorThemeName,
}
