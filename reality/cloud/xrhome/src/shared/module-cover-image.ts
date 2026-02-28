import {COVER_IMAGE_PREVIEW_SIZES} from './module/module-constants'

const DEFAULT_IMAGES = ['AeZ0ahv7', 'ahv7AeSi', 'Vaag3ais', 'eweu1Kai', 'oGhee5ze']

const getDefaultCoverImageIdForModule = (module) => {
  if (!module || !module.createdAt) {
    return DEFAULT_IMAGES[0]
  }
  const createdTime = new Date(module.createdAt).getTime()
  return DEFAULT_IMAGES[createdTime % DEFAULT_IMAGES.length]
}

const MODULE_CDN_URL = 'https://cdn.8thwall.com/images/modules'

const deriveModuleCoverImageUrl = (module, size = COVER_IMAGE_PREVIEW_SIZES[1200]) => {
  const width = size[0]
  const height = size[1]
  const imageId = module?.coverImageId || getDefaultCoverImageIdForModule(module)
  return `${MODULE_CDN_URL}/cover/${imageId}-${width}x${height}`
}

export {
  getDefaultCoverImageIdForModule,
  deriveModuleCoverImageUrl,
}
