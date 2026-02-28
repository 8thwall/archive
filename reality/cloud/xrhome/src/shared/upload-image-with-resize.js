const sharp = require('sharp')
const base36 = require('base-x')('0123456789abcdefghijklmnopqrstuvwxyz')
const uuid = require('uuid')

// NOTE(dat): multer-s3-transform doesn't pass req.body along
const croppedSharp = (req) => {
  const {left, top, height, width} = req.query
  if (left && top && height && width) {
    const crop = {
      left: parseInt(left, 10),
      top: parseInt(top, 10),
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    }
    return sharp().extract(crop)
  } else {
    return sharp()
  }
}

/**
 * Generates a hash used which will be used to identify a cover image that is
 * uploaded to S3 for an app. See it used in the `coverImageId` column on the Apps table.
 */
const generateIconId = () => {
  const imageUuid = uuid.v4()
  const buffer = Buffer.from(imageUuid, 'utf8')
  return base36.encode(buffer)
}

/** shouldTransform has to be true for transforms to happen
 * https://www.npmjs.com/package/multer-s3-transform
 */
const alwaysTransform = (req, file, cb) => {
  cb(null, true)
}

/** Make a simple sharp-based transformation on uploaded images. See pwa-icon/index for common usage
 *
 * @param id the id to be used downstream @see multer-s3-transform
 * @param key a static string pointing to a path to store this file
 * @param sharpTransform a function that takes one parameter req and build a list of transformations to apply
*/
const makeSharpTransform = (id, keyString, sharpTransforms) => ({
  id,
  key(req, file, cb) {
    cb(null, keyString)
  },
  transform(req, file, cb) {
    cb(null, sharpTransforms(req))
  },
})

module.exports = {
  alwaysTransform,
  croppedSharp,
  generateIconId,
  makeSharpTransform,
}
