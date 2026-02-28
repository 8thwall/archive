const {PWA_ICON_SIZES} = require('./pwa-constants')

const getIconUrl = (iconId, size) => (
  // eslint-disable-next-line max-len
  `https://cdn.<REMOVED_BEFORE_OPEN_SOURCING>.com/<REMOVED_BEFORE_OPEN_SOURCING>/<REMOVED_BEFORE_OPEN_SOURCING>/<REMOVED_BEFORE_OPEN_SOURCING>/<REMOVED_BEFORE_OPEN_SOURCING>/${iconId}/icon-${size}`
)

/**
 * Converts the provided icon id into an Object containing all of the URLs for the
 * respective icon. Each URL will represent the icon in a different size, as given by
 * PWA_ICON_SIZES.
 * @param {string} iconId - the id for the icon
 */
const derivePwaIconUrls = iconId => PWA_ICON_SIZES.reduce((urls, size) => {
  urls[size] = getIconUrl(iconId, size)
  return urls
}, {})

module.exports = {
  derivePwaIconUrls,
}
