const prettifyLicenseType = (licenseString) => {
  switch (licenseString) {
    case 'DEMO':
      return 'Demo License'
    case 'DEV':
    case 'DEVELOP':
      return 'Develop License'
    case 'DEV_EXT':
      return 'Develop License'
    case 'LAUNCH':
    case 'CAMPAIGN':
    case 'CAMPAIGN_EXT':
      return 'Launch License'
    default:
      return licenseString
  }
}

module.exports = {
  prettifyLicenseType,
}
