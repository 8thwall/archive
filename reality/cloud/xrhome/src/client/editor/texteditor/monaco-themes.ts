import type {DeepReadonly} from 'ts-essentials'

import type {editor} from './monaco-types'
import type {EditorThemeName} from '../../../shared/user-editor-settings'

type MonacoTheme = editor.IStandaloneThemeData

// NOTE(Dale): this order controls which order the themes dropdown is
// Preserve dark -> light order in any additional themes
const MONACO_THEME_LOADERS: DeepReadonly<Record<EditorThemeName, () => Promise<MonacoTheme>>> = {
  '8th-wall-dark': () => import('./themes/dark8.json') as Promise<MonacoTheme>,
  'abyss': () => import('./themes/abyss.json') as Promise<MonacoTheme>,
  'monokai-dimmed': () => import('./themes/monokai-dimmed.json') as Promise<MonacoTheme>,
  'monokai': () => import('./themes/monokai.json') as Promise<MonacoTheme>,
  'night-owl-dark': () => import('./themes/night-owl-dark.json') as Promise<MonacoTheme>,
  'solarized-dark': () => import('./themes/solarized-dark.json') as Promise<MonacoTheme>,
  'kimbie-dark': () => import('./themes/kimbie-dark.json') as Promise<MonacoTheme>,
  'tomorrow-night-blue': () => import('./themes/tomorrow-night-blue.json') as Promise<MonacoTheme>,
  '8th-wall-light': () => import('./themes/light8.json') as Promise<MonacoTheme>,
  'night-owl-light': () => import('./themes/night-owl-light.json') as Promise<MonacoTheme>,
  'solarized-light': () => import('./themes/solarized-light.json') as Promise<MonacoTheme>,
  'quietlight': () => import('./themes/quietlight.json') as Promise<MonacoTheme>,
} as const

const MONACO_THEME_TO_DARK_MODE = {
  '8th-wall-dark': true,
  '8th-wall-light': false,
  'abyss': true,
  'kimbie-dark': true,
  'monokai-dimmed': true,
  'monokai': true,
  'night-owl-dark': true,
  'night-owl-light': false,
  'quietlight': false,
  'solarized-dark': true,
  'solarized-light': false,
  'tomorrow-night-blue': true,
} as const

export {
  MONACO_THEME_LOADERS,
  MONACO_THEME_TO_DARK_MODE,
}

export type {
  MonacoTheme,
  EditorThemeName,
}
