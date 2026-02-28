import React from 'react'

import {useCollapsibleSettingsGroup} from '../settings/use-collapsible-settings-group'
import CollapsibleSettingsGroup from '../settings/collapsible-settings-group'
import {ModuleDeprecationCard} from './module-deprecation-card'
import type {IModule} from '../common/types/models'
import {ModuleCompatibilityCard} from './module-compatibility-card'

enum GroupSections {
  COMPATIBILITY,
  DEPRECATE
}

const SUPPORTED_SECTIONS = new Set([GroupSections.DEPRECATE, GroupSections.COMPATIBILITY])

interface IModuleSettingsDangerZone {
  module: IModule
}

const ModuleSettingsDangerZone: React.FC<IModuleSettingsDangerZone> = ({module}) => {
  const {
    expandedSettings,
    areAllSettingsExpanded,
    toggleSetting,
    expandAllSettings,
    collapseAllSettings,
  } = useCollapsibleSettingsGroup(SUPPORTED_SECTIONS)

  return (
    <CollapsibleSettingsGroup
      header='Danger Zone'
      showCollapseAll={areAllSettingsExpanded}
      onExpandAllClick={expandAllSettings}
      onCollapseAllClick={collapseAllSettings}
    >
      <ModuleCompatibilityCard
        module={module}
        active={expandedSettings.has(GroupSections.COMPATIBILITY)}
        onTitleClick={() => toggleSetting(GroupSections.COMPATIBILITY)}
      />
      <ModuleDeprecationCard
        module={module}
        active={expandedSettings.has(GroupSections.DEPRECATE)}
        onTitleClick={() => toggleSetting(GroupSections.DEPRECATE)}
      />
    </CollapsibleSettingsGroup>
  )
}

export {
  ModuleSettingsDangerZone,
}
