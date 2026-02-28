import React from 'react'
import {useTranslation} from 'react-i18next'

import Accordion from '../../widgets/accordion'
import CollapsibleSettingsGroup from '../../settings/collapsible-settings-group'
import {AppSetting, AppSettingsGroup} from './app-settings-types'
import {useCollapsibleSettingsGroup} from '../../settings/use-collapsible-settings-group'
import DeveloperPreferenceSettingsView from './developer-preferences-settings-view'

const DeveloperPreferenceSettings: React.FunctionComponent = React.memo(() => {
  const {t} = useTranslation(['app-pages'])
  const {
    expandedSettings,
    areAllSettingsExpanded,
    toggleSetting,
    expandAllSettings,
    collapseAllSettings,
  } = useCollapsibleSettingsGroup(AppSettingsGroup.DEVELOPER_PREFERENCES, [AppSetting.CODE_EDITOR])

  return (
    <CollapsibleSettingsGroup
      header={t('project_settings_page.dev_preference_settings.collapsible.header')}
      showCollapseAll={areAllSettingsExpanded}
      onExpandAllClick={expandAllSettings}
      onCollapseAllClick={collapseAllSettings}
    >
      <Accordion>
        <Accordion.Title
          active={expandedSettings.has(AppSetting.CODE_EDITOR)}
          onClick={() => toggleSetting(AppSetting.CODE_EDITOR)}
          a8='click;xrhome-project-settings;code-editor-accordian'
        >
          {t('project_settings_page.dev_preference_settings.title.code_editor')}
        </Accordion.Title>
        <Accordion.Content>
          <DeveloperPreferenceSettingsView />
        </Accordion.Content>
      </Accordion>
    </CollapsibleSettingsGroup>
  )
})

export default DeveloperPreferenceSettings
