import React from 'react'
import {useTranslation} from 'react-i18next'
import {useLocation} from 'react-router-dom'

import '../static/styles/code-editor.scss'
import ErrorMessage from '../home/error-message'
import {G8ErrorMessage} from '../git/g8-error-message'
import Title from '../widgets/title'
import {getDisplayNameForApp, isCloudStudioApp} from '../../shared/app-utils'
import useCurrentApp from '../common/use-current-app'
import {useTheme} from '../user/use-theme'
import {EditorThemeProvider} from '../editor/editor-theme-provider'
import {InlineAppPreviewPane} from '../editor/app-preview/inline-app-preview-pane'
import {combine} from '../common/styles'
import useActions from '../common/use-actions'
import editorActions from '../editor/editor-actions'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import {useUuid} from '../hooks/use-uuid'
import {
  IMAGE_TARGET_SIMULATOR_GALLERY_ID as SIMULATOR_GALLERY_ID,
} from './image-targets/image-target-constants'

const SimulatorPage: React.FC = () => {
  const app = useCurrentApp()
  const themeName = useTheme()
  const {t} = useTranslation(['app-pages'])
  const location = useLocation()

  const [loaded, setLoaded] = React.useState(false)

  const {loadSimulatorState} = useActions(editorActions)

  const simulatorId = useUuid()

  const searchParams = new URLSearchParams(location.search)
  const sessionId = searchParams.get('sessionId')
  const titleId = sessionId.substring(0, 4)

  useAbandonableEffect(async (execute) => {
    await execute(loadSimulatorState(app.appKey))
    setLoaded(true)
  }, [app.appKey])

  return (
    <EditorThemeProvider>
      <div className={combine('studio-editor', themeName)}>
        <Title>
          {`${getDisplayNameForApp(app)} - ${t('simulator_page.page_title')} ${titleId}`}
        </Title>
        <ErrorMessage />
        <G8ErrorMessage appUuid={app.uuid} />
        {loaded && (
          <InlineAppPreviewPane
            app={app}
            simulatorId={simulatorId}
            isStandalone
            sessionId={sessionId}
            targetsGalleryUuid={SIMULATOR_GALLERY_ID}
            showVpsUnavailable={isCloudStudioApp(app)}
          />
        )}
      </div>
    </EditorThemeProvider>
  )
}

export default SimulatorPage
