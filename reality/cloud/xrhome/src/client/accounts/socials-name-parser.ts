enum SocialLinkType {
  Twitter = 'twitter',
  LinkedIn = 'linkedin',
  Youtube = 'youtube',
}

// Function to construct platform URL based on platform type
const constructPlatformUrl = (handle: string, platform: SocialLinkType): string => {
  if (!handle) {
    return ''
  }
  switch (platform) {
    case SocialLinkType.LinkedIn:
      return handle.includes('in/') || handle.includes('company/')
        ? `https://www.linkedin.com/${handle}`
        : `https://www.linkedin.com/company/${handle}`
    case SocialLinkType.Youtube:
      return `https://www.youtube.com/${handle}`
    case SocialLinkType.Twitter:
      return `https://twitter.com/${handle}`
    default: {
      throw new Error(`Unexpected SocialLinkType: ${platform}`)
    }
  }
}

// Function to extract handle from for each platform
const extractPlatformHandle = (input: string): string => {
  let pattern
  if (input.toLowerCase().includes('linkedin.com')) {
    pattern = /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(in\/|company\/)([^/?#]+).*$/
  } else if (input.toLowerCase().includes('youtube.com')) {
    // eslint-disable-next-line max-len
    pattern = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(c\/|channel\/|user\/|@)?([a-zA-Z0-9_]{1,30})/
  } else if (input.toLowerCase().includes('twitter.com')) {
    pattern = /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/([a-zA-Z0-9_]{1,15})/
  } else {
    return ''
  }
  const match = input.match(pattern)
  if (!match) {
    return ''
  }
  return match[2] ? `${match[1]}${match[2]}` : `${match[1]}`
}

export {
  constructPlatformUrl,
  SocialLinkType,
  extractPlatformHandle,
}
