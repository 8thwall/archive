import {getEditorTheme} from './editor-settings'
import {useCurrentUser} from './use-current-user'

type ThemeName = 'dark' | 'light'

const useTheme = (): ThemeName => (
  useCurrentUser(user => getEditorTheme(user))
)

export {useTheme}

export type {ThemeName}
