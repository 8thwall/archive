enum ShowcaseSetting {
  BASIC_INFO,
  PROJECT_DETAILS,
  MEDIA,
  TOGGLES,
}

const ShowcaseSettingsGroup = {
  SHOWCASE_SETTINGS: new Set(Object.values(ShowcaseSetting) as ShowcaseSetting[]),
}

export {
  ShowcaseSetting,
  ShowcaseSettingsGroup,
}
