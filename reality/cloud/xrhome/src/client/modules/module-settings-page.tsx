import React from 'react'

import useCurrentAccount from '../common/use-current-account'
import {getPathForModules, getPathForModule, ModulePathEnum} from '../common/paths'
import Page from '../widgets/page'
import HeadingBreadcrumbs from '../widgets/heading-breadcrumbs'
import {useCurrentModule} from '../common/use-current-module'
import {useCollapsibleSettingsGroup} from '../settings/use-collapsible-settings-group'
import {ModuleSetting, moduleSettingGroup} from './module-settings-types'
import CollapsibleSettingsGroup from '../settings/collapsible-settings-group'
import EditBasicInfoCard from './widgets/module-edit-basic-info-card'
import DeveloperPreferenceSettings from '../apps/settings/developer-preferences-settings'
import {ModuleSettingsDangerZone} from './module-settings-danger-zone'
import PublishSettingsCard from './widgets/module-publish-settings-card'

const ModuleSettingsPage: React.FC = React.memo(() => {
  const account = useCurrentAccount()
  const module = useCurrentModule()

  const {
    expandedSettings,
    areAllSettingsExpanded,
    toggleSetting,
    expandAllSettings,
    collapseAllSettings,
  } = useCollapsibleSettingsGroup(
    moduleSettingGroup.BASIC_SETTINGS, [ModuleSetting.BASIC_INFO]
  )

  return (
    <Page>
      <HeadingBreadcrumbs
        title='Module Settings'
        links={[
          {
            text: account.shortName,
            path: getPathForModules(account),
            key: 'account-name-link',
          },
          {
            text: module.name,
            // TODO(tri) change this path to editor or dashboard when path is implemented
            path: getPathForModule(account, module, ModulePathEnum.settings),
            key: 'module-name-link',
          }]}
      />
      <DeveloperPreferenceSettings />
      <CollapsibleSettingsGroup
        header='Basic Settings'
        showCollapseAll={areAllSettingsExpanded}
        onExpandAllClick={expandAllSettings}
        onCollapseAllClick={collapseAllSettings}
      >
        <EditBasicInfoCard
          account={account}
          module={module}
          active={expandedSettings.has(ModuleSetting.BASIC_INFO)}
          onTitleClick={() => toggleSetting(ModuleSetting.BASIC_INFO)}
        />
      </CollapsibleSettingsGroup>
      <PublishSettingsCard
        module={module}
        account={account}
      />
      <ModuleSettingsDangerZone module={module} />
    </Page>
  )
})

export default ModuleSettingsPage
