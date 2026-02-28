const STATIC_URI_PREFIX = '/modules/v1/static/'
const STATIC_S3_PREFIX = 'code/dist/module/'

// Takes a request URI from CloudFront, and returns the S3 path where the build is located
const getStaticPath = (uri: string) => {
  if (!uri.startsWith(STATIC_URI_PREFIX)) {
    return null
  }

  return `/${STATIC_S3_PREFIX}${uri.substring(STATIC_URI_PREFIX.length)}`
}

// Takes an S3 prefix and a filename, and returns the static path for that file
const getUriForFile = (buildLocation: string, file: string) => {
  if (!buildLocation.startsWith(STATIC_S3_PREFIX)) {
    return null
  }

  return `${STATIC_URI_PREFIX}${buildLocation.substring(STATIC_S3_PREFIX.length)}/${file}`
}

export {
  getStaticPath,
  getUriForFile,
}
