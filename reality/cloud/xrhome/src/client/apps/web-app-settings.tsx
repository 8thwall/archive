import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {isEditorEnabled, isEntryWebAccount} from '../../shared/account-utils'
import WorkspaceCrumbHeading from '../widgets/workspace-crumb-heading'
import Page from '../widgets/page'
import ErrorMessage from '../home/error-message'
import PublishSettings from './settings/publish-settings'
import DeveloperPreferenceSettings from './settings/developer-preferences-settings'
import SelfHostingSettings from './settings/self-hosting-settings'
import DangerZoneSettings from './settings/danger-zone-settings'
import ShowcaseThisProject from './widgets/showcase-this-project-section'
import {isShowcaseSettingsEnabled} from '../../shared/account-utils'
import useAppSharingInfo from '../common/use-app-sharing-info'
import useCurrentApp from '../common/use-current-app'
import useCurrentAccount from '../common/use-current-account'
import {isSelfHosted, isCloudStudioApp} from '../../shared/app-utils'

const useStyles = createUseStyles({
  showcaseThisProject: {
    marginTop: '2.5rem',
  },
})

const WebAppSettings: React.FC = () => {
  const {t} = useTranslation(['app-pages'])
  const app = useCurrentApp()
  const account = useCurrentAccount()
  const classes = useStyles()
  const {isExternalApp} = useAppSharingInfo(app)
  const shouldShowShowcaseThisProject = isShowcaseSettingsEnabled(account) &&
    !app.publicFeatured &&
    !isExternalApp
  const shouldShowDeveloperPreferenceSettings =
    !app.isCamera && isEditorEnabled(account) &&
    app.hostingType !== 'SELF' && !isCloudStudioApp(app)
  const shouldShowSelfHostingSettings = !app.isCamera &&
    !isEntryWebAccount(account) &&
    isSelfHosted(app)
  const shouldShowDangerZoneSettings = !isExternalApp

  return (
    <Page headerVariant='workspace'>
      <WorkspaceCrumbHeading
        text={t('project_settings_page.web_app_settings.heading')}
        account={account}
        app={app}
      />
      <ErrorMessage />
      {shouldShowShowcaseThisProject &&
        <ShowcaseThisProject className={classes.showcaseThisProject} account={account} app={app} />
      }
      {shouldShowDeveloperPreferenceSettings && <DeveloperPreferenceSettings />}

      {isEditorEnabled(account) && <PublishSettings />}

      {shouldShowSelfHostingSettings && <SelfHostingSettings />}

      {shouldShowDangerZoneSettings && <DangerZoneSettings />}
    </Page>
  )
}

export default WebAppSettings
