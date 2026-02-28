import React from 'react'

import {UiThemeProvider} from '../ui/theme'
import {useUserEditorSettings} from '../user/use-user-editor-settings'

const EditorThemeProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const settings = useUserEditorSettings()

  return (
    <UiThemeProvider mode={settings.darkMode ? 'dark' : 'light'}>
      {children}
    </UiThemeProvider>
  )
}

export {
  EditorThemeProvider,
}
