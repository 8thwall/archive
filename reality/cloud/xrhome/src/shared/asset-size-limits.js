const {
  MAX_TEXT_FILE_UPLOAD_IN_BYTES, MAX_ASSET_FILE_UPLOAD_IN_BYTES, MAX_BUNDLE_SIZE_IN_BYTES,
  MAX_HCAP_SIZE_IN_BYTES,
} = require('./app-constants')

const KILO = 2 ** 10
const MEGA = 2 ** 20
const GIGA = 2 ** 30

const parseSize = (value) => {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    const sizeRegex = /^ *(\d*\.?\d+) *(([gmk])b?)? *$/i
    const match = sizeRegex.exec(value)
    if (match === null) {
      return null
    }

    const type = match[3] ? match[3].toLowerCase() : 'b'
    const multipler = {b: 1, k: KILO, m: MEGA, g: GIGA}[type]
    return parseFloat(match[1]) * multipler
  }

  return null
}

const getLimitParameter = (assetLimitOverrides, property) => {
  if (!assetLimitOverrides) {
    return null
  }
  try {
    const overrides = JSON.parse(assetLimitOverrides)
    const value = overrides[property]
    if (!value && value !== 0) {
      return null
    } else {
      return parseSize(overrides[property])
    }
  } catch (err) {
    return null
  }
}

const makeLimitGetter = (property, defaultLimit) => (assetLimitOverrides) => {
  const limit = getLimitParameter(assetLimitOverrides, property)
  if (limit || limit === 0) {
    return limit
  } else {
    return defaultLimit
  }
}

const formatBytesToText = (bytes) => {
  if (!bytes && bytes !== 0) {
    return null
  }

  const kb = bytes / 1024
  const mb = kb / 1024
  const gb = mb / 1024
  if (gb > 1) {
    return `${gb.toFixed(2)} GB`
  } else if (mb > 1) {
    return `${mb.toFixed(2)} MB`
  } else if (kb > 1) {
    return `${kb.toFixed(2)} KB`
  } else {
    return `${bytes} bytes`
  }
}

const getTextSizeLimit = makeLimitGetter('text', MAX_TEXT_FILE_UPLOAD_IN_BYTES)
const getAssetSizeLimit = makeLimitGetter('asset', MAX_ASSET_FILE_UPLOAD_IN_BYTES)
const getBundleSizeLimit = makeLimitGetter('bundle', MAX_BUNDLE_SIZE_IN_BYTES)
const getHcapSizeLimit = makeLimitGetter('hcap', MAX_HCAP_SIZE_IN_BYTES)

module.exports = {
  getTextSizeLimit,
  getAssetSizeLimit,
  getBundleSizeLimit,
  getHcapSizeLimit,
  formatBytesToText,
}
