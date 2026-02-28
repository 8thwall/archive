import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import './set-three'
import ErrorMessage from '../home/error-message'
import Title from '../widgets/title'
import {SceneLocalEdit} from './scene-local-edit'

import {UiThemeProvider} from '../ui/theme'
import {useUserEditorSettings} from '../user/use-user-editor-settings'

const useStyles = createUseStyles({
  cloudStudioPage: {
    flex: '1 0 0',
    height: '100vh',
  },
})

const CloudStudioPage: React.FC = () => {
  const settings = useUserEditorSettings()
  const {t} = useTranslation(['cloud-studio-pages'])

  return (
    <div className={useStyles().cloudStudioPage}>
      <Title>{t('cloud_studio_page.title')}</Title>
      <ErrorMessage />
      <UiThemeProvider mode={settings.darkMode ? 'dark' : 'light'}>
        <SceneLocalEdit />
      </UiThemeProvider>
    </div>
  )
}

export default CloudStudioPage
