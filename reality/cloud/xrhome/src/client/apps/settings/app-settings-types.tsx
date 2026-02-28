enum AppSetting {
  CODE_EDITOR,
  BASIC_INFO,
  STAGING_PASSCODE,
  PWA,
  UNPUBLISH_APP,
  APP_KEY,
  ENGINE_VERSION,
  DISABLE_PROJECT,
  DELETE_PROJECT,
}

const AppSettingsGroup = {
  DEVELOPER_PREFERENCES: new Set([AppSetting.CODE_EDITOR]),
  PUBLISHER_SETTINGS: new Set([
    AppSetting.BASIC_INFO,
    AppSetting.STAGING_PASSCODE,
    AppSetting.PWA,
    AppSetting.UNPUBLISH_APP,
    AppSetting.ENGINE_VERSION,
  ]),
  SELF_HOSTING: new Set([AppSetting.APP_KEY]),
  DANGER_ZONE: new Set([AppSetting.DELETE_PROJECT]),
}

export {
  AppSetting,
  AppSettingsGroup,
}
