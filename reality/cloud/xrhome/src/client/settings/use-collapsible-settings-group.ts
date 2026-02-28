import {useState} from 'react'

export type CollapsibleStateHookResult<T> = {
  expandedSettings: Set<T>
  areAllSettingsExpanded: boolean
  toggleSetting: (setting: T) => void
  expandAllSettings: () => void
  collapseAllSettings: () => void
}

const useCollapsibleSettingsGroup = <T>(
  // eslint-disable-next-line arrow-parens
  group: Set<T>,
  defaultExpanded: Array<T> = []
): CollapsibleStateHookResult<T> => {
  if (!defaultExpanded.every(setting => group.has(setting))) {
    throw new Error('Default expanded setting is not in group.')
  }
  const [expandedSettings, setExpandedSettings] = useState(new Set<T>(defaultExpanded))

  const toggleSetting = (setting: T) => {
    if (!group.has(setting)) {
      throw new Error('Cannot toggle setting that is not in group.')
    }

    const updatedSettings = new Set(expandedSettings)
    if (updatedSettings.has(setting)) {
      updatedSettings.delete(setting)
    } else {
      updatedSettings.add(setting)
    }
    setExpandedSettings(updatedSettings)
  }

  const expandAllSettings = () => {
    const updatedSettings = new Set(expandedSettings)
    group.forEach(setting => updatedSettings.add(setting))
    setExpandedSettings(updatedSettings)
  }

  const collapseAllSettings = () => {
    const updatedSettings = new Set(expandedSettings)
    group.forEach(setting => updatedSettings.delete(setting))
    setExpandedSettings(updatedSettings)
  }

  const areAllSettingsExpanded = Array.from(group).every(setting => expandedSettings.has(setting))
  return {
    expandedSettings,
    areAllSettingsExpanded,
    toggleSetting,
    expandAllSettings,
    collapseAllSettings,
  }
}

export {
  useCollapsibleSettingsGroup,
}
