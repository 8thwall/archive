import type {DeepReadonly} from 'ts-essentials'

import type {IAppTag} from '../../common/types/models'

const formatFeaturedTags = (
  featuredTags: DeepReadonly<IAppTag[]>, tagStrings: string[]
): IAppTag[] => {
  // Existing and new tags
  const newFeaturedTags = tagStrings.map(tagString => ({name: tagString})) as IAppTag[]

  // Being deleted tags
  if (featuredTags) {
    featuredTags.forEach((featuredTag) => {
      // Do not delete restricted tags.
      if (featuredTag.restricted) {
        return
      }

      const foundFeaturedTag = tagStrings.find(tagString => tagString === featuredTag.name)
      if (!foundFeaturedTag) {
        newFeaturedTags.push({...featuredTag, deleted: true})
      }
    })
  }

  return newFeaturedTags
}

export {
  formatFeaturedTags,
}
