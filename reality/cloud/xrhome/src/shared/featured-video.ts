const MAX_VIDEO_URL_LENGTH = 150

const VALID_VIMEO_PATTERN = /^(https:\/\/)?(vimeo\.com)(\/[A-Za-z0-9_-]+)(\/[A-Za-z0-9_-]*)?$/

const VALID_YOUTUBE_PATTERN = new RegExp([
  /^(https:\/\/)?/,
  /(www\.)?/,
  /(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)/,
  /([A-Za-z0-9_-]+)$/,
].map(reg => reg.source).join(''))

const VALID_VIDEO_PROVIDERS = /(vimeo|youtu\.be|youtube)/

// Combines vimeo and youtube valid regex lines
const VALID_VIDEO_URL_PATTERN = new RegExp([
  VALID_VIMEO_PATTERN,
  /|/,
  VALID_YOUTUBE_PATTERN,
].map(reg => reg.source).join(''))

const validVideoUrlRegex = new RegExp(VALID_VIDEO_URL_PATTERN)

const isValidVideoUrl = (url: string) => (
  typeof url === 'string' &&
  url.length <= MAX_VIDEO_URL_LENGTH &&
  validVideoUrlRegex.test(url)
)

const getShortenedYoutubeUrl = (url: string) => {
  const regexMatchingGroups = url.match(VALID_YOUTUBE_PATTERN)
  const videoId = regexMatchingGroups[4]
  return `youtu.be/${videoId}`
}

const getShortenedVimeoUrl = (url: string) => {
  const regexMatchingGroups = url.match(VALID_VIMEO_PATTERN)
  const baseUrl = regexMatchingGroups[2]
  const videoId = regexMatchingGroups[3]
  return `${baseUrl}${videoId}`
}

const getVideoUrlHandle = (url: string) => {
  const videoProvider = url.match(VALID_VIDEO_PROVIDERS)[0]
  const videoProviderMap = {
    'youtube': getShortenedYoutubeUrl,
    'youtu.be': getShortenedYoutubeUrl,
    'vimeo': getShortenedVimeoUrl,
  }
  return videoProviderMap[videoProvider](url)
}

const getFullVideoUrl = (url: string) => {
  if (isValidVideoUrl(url)) {
    return url.startsWith('https://') ? url : `https://${url}`
  } else {
    return ''
  }
}

export {
  isValidVideoUrl,
  getVideoUrlHandle,
  getFullVideoUrl,
}
