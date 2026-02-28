// based on reality/cloud/xrhome/src/server/pwa-icon/index.js
import multer from 'multer'
import multerS3 from 'multer-s3-transform'
import type {Express, Request, Response} from 'express'

import {
  croppedSharp,
  alwaysTransform,
  generateIconId,
  makeSharpTransform,
} from './upload-image-with-resize'
import {S3} from './integration/s3/s3-api'
import {ImageTypeError} from './image-exceptions'
import {STANDARD_IMAGE_TYPES} from './standard-image-type'
import {WEB_BUCKET} from './s3-buckets'

const ICON_SIZES = [16, 40, 100, 200, 400]

const transformForResolution = (iconId: string, maxSize: number) => makeSharpTransform(
  `s3IconImage-${maxSize}`,
  `web/users/profile/${iconId}-${maxSize}x${maxSize}`,
  req => croppedSharp(req).resize(null, maxSize, {withoutEnlargement: true})
)

const fileFilter = (_: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!STANDARD_IMAGE_TYPES.some(type => file.mimetype === type)) {
    return cb(new ImageTypeError('File must be a PNG or JPEG', file.mimetype))
  }
  return cb(null, true)
}

/**
 * Uploads the given profile icon to S3, returning the unique icon ID used when storing the icon.
 */
const uploadIcon = (req: Request, res: Response): Promise<{ iconId: string }> => new Promise(
  (resolve, reject) => {
    const iconId = generateIconId()

    return multer({
      fileFilter,
      storage: multerS3({
        s3: S3.use(),
        bucket: WEB_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: alwaysTransform,
        // Transform for every resolution
        transforms: ICON_SIZES.map(size => transformForResolution(iconId, size)),
      }),
    }).single('profileIconFile')(req, res, (err) => {
      if (err) {
        return reject(err)
      }

      // Upload succeeded.
      return resolve({iconId})
    })
  }
)

export {
  uploadIcon,
}
