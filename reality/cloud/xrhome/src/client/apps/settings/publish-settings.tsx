import React from 'react'
import {useRouteMatch} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import Accordion from '../../widgets/accordion'
import EditBasicInfoCard from '../widgets/edit-basic-info-card'
import EditPwaSettingsCard from '../widgets/edit-pwa-settings-card'
import CollapsibleSettingsGroup from '../../settings/collapsible-settings-group'
import {isEditorEnabled} from '../../../shared/account-utils'
import isPwaSettingsVisible from '../../pwa/pwa-gating-utils'
import {AppPathEnum, getPathForApp, getRouteAccount, getRouteApp} from '../../common/paths'
import {makeHostedProductionUrl, makeHostedStagingUrl} from '../../../shared/hosting-urls'
import UnpublishWidget from '../widgets/unpublish-widget'
import {AppSetting, AppSettingsGroup} from './app-settings-types'
import {useCollapsibleSettingsGroup} from '../../settings/use-collapsible-settings-group'
import {useSelector} from '../../hooks'
import {useGitDeployments} from '../../git/hooks/use-deployment'
import EngineVersionControl from '../widgets/engine-version-control'
import useActions from '../../common/use-actions'
import {actions as gitActions} from '../../git/git-actions'
import PasscodeSettings from './passcode-settings'

const PublishSettings: React.FunctionComponent = React.memo(() => {
  const {t} = useTranslation(['app-pages', 'common'])
  const {undeployBranch} = useActions(gitActions)
  const match = useRouteMatch()
  const account = useSelector(state => getRouteAccount(state, match))
  const app = useSelector(state => getRouteApp(state, match))
  const deployment = useGitDeployments(app.repoId)

  const {
    expandedSettings,
    areAllSettingsExpanded,
    toggleSetting,
    expandAllSettings,
    collapseAllSettings,
  } = useCollapsibleSettingsGroup(AppSettingsGroup.PUBLISHER_SETTINGS, [AppSetting.BASIC_INFO])

  const {shortName} = account
  const stagingUrl = makeHostedStagingUrl(shortName, app.appName)
  const productionUrl = makeHostedProductionUrl(shortName, app.appName)

  if (!isEditorEnabled(account)) {
    return null
  }

  return (
    <CollapsibleSettingsGroup
      header={t('project_settings_page.publish_settings.collapsible_group.header')}
      showCollapseAll={areAllSettingsExpanded}
      onExpandAllClick={expandAllSettings}
      onCollapseAllClick={collapseAllSettings}
    >
      <EditBasicInfoCard
        account={account}
        app={app}
        deployment={deployment}
        active={expandedSettings.has(AppSetting.BASIC_INFO)}
        onTitleClick={() => toggleSetting(AppSetting.BASIC_INFO)}
      />
      {app.hostingType !== 'SELF' && <PasscodeSettings />}

      {isPwaSettingsVisible(account, app) &&
        <EditPwaSettingsCard
          app={app}
          onTitleClick={() => toggleSetting(AppSetting.PWA)}
          active={expandedSettings.has(AppSetting.PWA)}
        />
      }

      { app.hostingType !== 'SELF' && (
        <Accordion>
          <Accordion.Title
            active={expandedSettings.has(AppSetting.UNPUBLISH_APP)}
            onClick={() => toggleSetting(AppSetting.UNPUBLISH_APP)}
            a8='click;xrhome-project-settings;unpublish-app-accordian'
          >
            {t('project_settings_page.publish_settings.accordion.title.unpublish_app')}
          </Accordion.Title>
          <Accordion.Content>
            <UnpublishWidget
              urls={{staging: stagingUrl, production: productionUrl}}
              deployment={deployment}
              isFeatured={app.publicFeatured}
              undeployBranch={
              branch => undeployBranch(app.uuid, branch)
            }
              editorLink={getPathForApp(account, app, AppPathEnum.files)}
            />
          </Accordion.Content>
        </Accordion>)}
      <Accordion>
        <Accordion.Title
          active={expandedSettings.has(AppSetting.ENGINE_VERSION)}
          onClick={() => toggleSetting(AppSetting.ENGINE_VERSION)}
          a8='click;xrhome-project-settings;engine-version-accordian'
        >
          {t('project_settings_page.publish_settings.accordion.title.engine_version')}
        </Accordion.Title>
        <Accordion.Content>
          <EngineVersionControl app={app} account={account} />
        </Accordion.Content>
      </Accordion>
    </CollapsibleSettingsGroup>
  )
})

export default PublishSettings
