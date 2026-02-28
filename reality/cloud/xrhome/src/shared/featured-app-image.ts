import type {DeepReadonly} from 'ts-essentials'

import type {IFeaturedAppImage} from '../client/common/types/models'

const FEATURED_APP_IMAGE_PREFIX = 'images/apps/featured/'

const FEATURED_APP_IMAGE_DIMENSIONS = {
  LARGE: [1080, 1920],
  MEDIUM: [540, 960],
  SMALL: [270, 480],
} as const

type Dimensions = typeof FEATURED_APP_IMAGE_DIMENSIONS [keyof typeof FEATURED_APP_IMAGE_DIMENSIONS]

const getFeaturedAppImageKey = (id: string) => `${FEATURED_APP_IMAGE_PREFIX}${id}`

const getFeaturedAppImageUrl = (id: string, options?: {dimensions: Dimensions}) => {
  const dimensionSuffix = options?.dimensions
    ? `-${options.dimensions[0]}x${options.dimensions[1]}`
    : ''

  return `https://cdn.8thwall.com/${getFeaturedAppImageKey(id)}${dimensionSuffix}`
}

const sortFeaturedImagesByCreated = (images: DeepReadonly<IFeaturedAppImage[]>) => (
  [...images].sort((a, b) => {
    if (a.createdAt === b.createdAt) {
      return 0
    }
    if ((new Date(a.createdAt)) > (new Date(b.createdAt))) {
      return 1
    } else {
      return -1
    }
  })
)

export {
  FEATURED_APP_IMAGE_PREFIX,
  FEATURED_APP_IMAGE_DIMENSIONS,
  getFeaturedAppImageKey,
  getFeaturedAppImageUrl,
  sortFeaturedImagesByCreated,
}
