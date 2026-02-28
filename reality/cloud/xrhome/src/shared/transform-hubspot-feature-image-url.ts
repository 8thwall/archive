import {URL} from 'url'

const transformHubspotFeaturedImageURL = (imageUrl) => {
  if (!imageUrl) {
    return ''
  }
  const url = new URL(imageUrl)
  if (!url.hostname.includes('hubspot')) {
    return imageUrl
  }
  const [hubAccount, imageName] = url.pathname.split('/').filter(Boolean).slice(-2)
  return `${url.protocol}//${url.hostname}/hub/${hubAccount}/hubfs/${imageName}`
}

export {
  transformHubspotFeaturedImageURL,
}
