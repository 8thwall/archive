/**
 * 144 - Required by Samsung Internet (https://hub.samsunginter.net/docs/ambient-badging/)
 * 120, 180 - Recommended for iOS(https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/#app-icon-sizes)
 * 192, 512 - Required by Chrome(https://developers.google.com/web/tools/lighthouse/audits/install-prompt#recommendations)
 * Others - Added to support a variety of resolutions.
 */
const PWA_ICON_SIZES = [120, 128, 144, 152, 167, 180, 192, 256, 512]

const MAX_PWA_ICON_HEIGHT = 512
const MAX_PWA_ICON_WIDTH = 512
const MAX_PWA_APP_NAME_LENGTH = 45
const MAX_PWA_APP_SHORT_NAME_LENGTH = 12
const DEFAULT_PWA_BACKGROUND_COLOR = '#7611B6'
const DEFAULT_PWA_THEME_COLOR = '#7611B6'
const DEFAULT_PWA_ICON_ID = 'default'

module.exports = {
  PWA_ICON_SIZES,
  MAX_PWA_ICON_HEIGHT,
  MAX_PWA_ICON_WIDTH,
  MAX_PWA_APP_NAME_LENGTH,
  MAX_PWA_APP_SHORT_NAME_LENGTH,
  DEFAULT_PWA_BACKGROUND_COLOR,
  DEFAULT_PWA_THEME_COLOR,
  DEFAULT_PWA_ICON_ID,
}
