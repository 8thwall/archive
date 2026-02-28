import type {IFeaturedAppImage} from '../../common/types/models'

export interface IFeaturedAppFields {
  featuredDescription: string
  featuredTagStrings: string[]
  featuredVideoUrl: string
  featuredAppImages: readonly IFeaturedAppImage[]
  isTryable: boolean
  isCloneable: boolean
}
