const MODULE_FEATURED_IMAGE_PREFIX = 'images/modules/featured/'

const MODULE_FEATURED_IMAGE_DIMENSIONS = {
  LARGE: [1080, 1920],
  MEDIUM: [540, 960],
  SMALL: [270, 480],
} as const

type Dimensions = typeof MODULE_FEATURED_IMAGE_DIMENSIONS [
  keyof typeof MODULE_FEATURED_IMAGE_DIMENSIONS]

const getModuleFeaturedImageKey = (id: string) => `${MODULE_FEATURED_IMAGE_PREFIX}${id}`

const getModuleFeaturedImageUrl = (id: string, options?: {dimensions: Dimensions}) => {
  const dimensionSuffix = options?.dimensions
    ? `-${options.dimensions[0]}x${options.dimensions[1]}`
    : ''

  return `https://cdn.8thwall.com/${getModuleFeaturedImageKey(id)}${dimensionSuffix}`
}

export {
  MODULE_FEATURED_IMAGE_PREFIX,
  MODULE_FEATURED_IMAGE_DIMENSIONS,
  getModuleFeaturedImageKey,
  getModuleFeaturedImageUrl,
}
