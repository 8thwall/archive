const {createHash} = require('crypto')
const base = require('base-x')

const {floorToInterval, MILLISECONDS_PER_HOUR} = require('./time-utils')
const {S3} = require('./integration/s3/s3-api')

const SHORTLINK_BUCKET = '8w-<REMOVED_BEFORE_OPEN_SOURCING>'
const CHARACTER_SUBSET = 'abcdefghjkmnpqrstuvwxyz23456789'
const MAX_RANDOM_RETRIES = 50
const DEFAULT_SHORT_NAME_LENGTH = 5

const subsetBase = base(CHARACTER_SUBSET)

function randomShortLink(Prefix = '', Postfix = '', length = DEFAULT_SHORT_NAME_LENGTH) {
  let res = Prefix
  for (let i = 0; i < length; ++i) {
    res += CHARACTER_SUBSET[Math.floor(Math.random() * CHARACTER_SUBSET.length)]
  }
  return res + Postfix
}

async function isShortLinkInUse(shortLink, Bucket = SHORTLINK_BUCKET) {
  try {
    await S3.use().getObject({
      Bucket,
      Key: shortLink,
    }).promise()
    return true
  } catch (err) {
    return false
  }
}

async function getUnusedShortLink(args) {
  const options = {
    shortLinkGenerator: randomShortLink,
    retries: MAX_RANDOM_RETRIES,
    Bucket: SHORTLINK_BUCKET,
    Prefix: '',
    Postfix: '',
    ...args,
  }
  for (let i = 0; i < options.retries; i++) {
    const link = options.shortLinkGenerator(options.Prefix, options.Postfix)
    // eslint-disable-next-line no-await-in-loop
    if (!await isShortLinkInUse(link, options.Bucket)) {
      return link
    }
  }
  throw new Error('Couldn\'t find unused short link')
}

function writeShortLink(shortLink, target) {
  return S3.use().putObject({
    Bucket: SHORTLINK_BUCKET,
    Key: shortLink,
    Body: '',
    WebsiteRedirectLocation: target,
  }).promise().then(() => ({shortLink, webUrl: target}))
}

const getCurrentTarget = async (shortLink) => {
  try {
    const info = await S3.use().headObject({
      Bucket: SHORTLINK_BUCKET,
      Key: shortLink,
    }).promise()
    return info.WebsiteRedirectLocation
  } catch (err) {
    // An error is thrown if the key doesn't exist yet
    if (err?.code === 'ResourceNotFoundException' || err?.code === 'NotFound') {
      return null
    }
    throw err
  }
}

const createTemporaryShortLink = async (targetUrl) => {
  // If the temporary shortlink for a targetUrl was generated 23.9 hours ago, it will expire soon,
  // even though it would show as currently existing on S3. To get around this, we include the
  // timestamp rounded to 12 hours in the hash, so it changes twice per day if we repeatedly
  // generate a temporary shortlink for the same URL.
  const refreshBreaker = floorToInterval(Date.now(), 12 * MILLISECONDS_PER_HOUR)

  for (let tryCount = 0; tryCount < MAX_RANDOM_RETRIES; tryCount++) {
    // By including "tries" in the hash we can handle collisions by retrying with a
    // different, but still deterministic, hash.
    const hashBuffer = createHash('sha256')
      .update([targetUrl, refreshBreaker, tryCount].join('|'), 'utf-8')
      .digest()

    const hash = subsetBase.encode(hashBuffer).substr(0, 8)

    // The "t/" prefix indicates temporary.
    const shortLink = `t/${hash}`

    // eslint-disable-next-line no-await-in-loop
    const current = await getCurrentTarget(shortLink)

    if (current === targetUrl) {
      // We can reuse a shortlink that was already created for the required targetUrl.
      return shortLink
    } else if (!current) {
      // eslint-disable-next-line no-await-in-loop
      await writeShortLink(shortLink, targetUrl)
      return shortLink
    }
    // Loop again until we find a usable shortlink.
  }
  throw new Error('Couldn\'t find unused temporary short link')
}

module.exports = {
  getUnusedShortLink,
  isShortLinkInUse,
  writeShortLink,
  MAX_RANDOM_RETRIES,
  DEFAULT_SHORT_NAME_LENGTH,
  CHARACTER_SUBSET,
  createTemporaryShortLink,
}
