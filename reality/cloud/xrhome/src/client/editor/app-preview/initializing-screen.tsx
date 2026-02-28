import React from 'react'
import {useTranslation} from 'react-i18next'

import {createUseStyles} from 'react-jss'

import {useSelector} from '../../hooks'
import {UiThemeProvider} from '../../ui/theme'
import useCurrentApp from '../../common/use-current-app'
import {Loader} from '../../ui/components/loader'
import {brandWhite, darkBlue, gray5} from '../../static/styles/settings'

const useIsInitializingBuild = (): boolean => {
  const currentApp = useCurrentApp()
  return useSelector(state => state.editor.byKey[currentApp.appKey]?.isNewClientWithoutBuild)
}

const useStyles = createUseStyles({
  background: {
    background: `radial-gradient(circle, ${gray5}, ${darkBlue})`,
    color: brandWhite,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    userSelect: 'none',
  },
})

const InitializingScreen: React.FC = () => {
  const classes = useStyles()

  const {t} = useTranslation(['cloud-editor-pages'])

  return (
    <UiThemeProvider mode='dark'>
      <div className={classes.background}>
        <Loader size='medium'>
          {t('editor_page.inline_app_preview.initializing')}
        </Loader>
      </div>
    </UiThemeProvider>
  )
}

export {
  useIsInitializingBuild,
  InitializingScreen,
}
