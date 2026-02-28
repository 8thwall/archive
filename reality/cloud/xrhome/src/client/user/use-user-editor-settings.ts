import {parseUserEditorSettings} from './editor-settings'
import type {UserEditorSettings} from '../../shared/user-editor-settings'
import {useCurrentUser} from './use-current-user'

const useUserEditorSettings = (): UserEditorSettings => (
  useCurrentUser(user => parseUserEditorSettings(user['custom:themeSettings']))
)

export {useUserEditorSettings}

export type {UserEditorSettings}
