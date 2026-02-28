const DESCRIPTION_BUCKET = '8w-us-west-2-web'
const DESCRIPTION_PREFIX = 'web/modules/featured/text/'

const DESCRIPTION_MAX_LENGTH = 20000

const isValidFeaturedDescription = (description: any) => (
  typeof description === 'string' && description.length < DESCRIPTION_MAX_LENGTH
)

const getFeaturedDescriptionKey = (id: string) => `${DESCRIPTION_PREFIX}${id}`

const getFeaturedDescriptionUrl = (id: string) => (
  `https://cdn.8thwall.com/${getFeaturedDescriptionKey(id)}`
)

export {
  DESCRIPTION_PREFIX,
  DESCRIPTION_BUCKET,
  DESCRIPTION_MAX_LENGTH,
  isValidFeaturedDescription,
  getFeaturedDescriptionKey,
  getFeaturedDescriptionUrl,
}
