import {createContext} from 'react'

import type {IFeaturedAppImage} from '../../common/types/models'
import type {IFeaturedAppFields} from './featured-app-fields'

interface IShowcaseSettingsContext {
  featuredVideoUrl: string
  setFeaturedVideoUrl: (featuredVideoUrl: string) => void
  featuredAppImages: readonly IFeaturedAppImage[]
  setFeaturedAppImages: (featuredAppImage: IFeaturedAppImage[]) => void
  featuredDescription: string
  setFeaturedDescription: (value: string) => void
  featuredDescriptionIsLoading: boolean
  setFeaturedDescriptionIsLoading: (value: boolean) => void
  restrictedTags: string[]
  setRestrictedTags: (tags: string[]) => void
  suggestedTags: string[]
  setSuggestedTags: (tags: string[]) => void
  featuredAppImageIsUploading: boolean
  setFeaturedAppImageIsUploading: (isUploading: boolean) => void
  deletedFeaturedAppImages: readonly IFeaturedAppImage[]
  setDeletedFeaturedAppImages: (deletedFeaturedAppImage: IFeaturedAppImage[]) => void
  isTryable: boolean
  setIsTryable: (isTryable: boolean) => void
  isCloneable: boolean
  setIsCloneable: (isCloneable: boolean) => void
  errorMessage: string
  setErrorMessage: (errorMessage: string) => void
  featuredTagStrings: string[]
  setFeaturedTagStrings: (tags: string[]) => void
  publishedFormState: IFeaturedAppFields
  setPublishedFormState: (newState: IFeaturedAppFields) => void
}

const ShowcaseSettingsContext = createContext<IShowcaseSettingsContext>(null)

export default ShowcaseSettingsContext
