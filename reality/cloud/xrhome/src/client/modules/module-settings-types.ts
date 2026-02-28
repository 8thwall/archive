enum ModuleSetting {
  BASIC_INFO,
  PUBLISH_MODULE
}

const moduleSettingGroup = {
  BASIC_SETTINGS: new Set([ModuleSetting.BASIC_INFO]),
  PUBLISH_SETTINGS: new Set([ModuleSetting.PUBLISH_MODULE]),
}

export {
  ModuleSetting,
  moduleSettingGroup,
}
