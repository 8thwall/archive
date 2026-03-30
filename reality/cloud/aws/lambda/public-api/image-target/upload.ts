import sharp from 'sharp'
import {v4 as uuidv4} from 'uuid'
import path from 'path'

import * as s3 from '../s3'
import {THUMBNAIL_HEIGHT, LUMINANCE_HEIGHT} from './constants'
import {unconify, computePixelPointsFromRadius} from './unconify'
import {ImageData} from './image-data'
import {toHundredths, getTargetCircumferenceBottom} from './curved-geometry'
import {validateCrop} from './validate'
import type {TargetGeometry} from './image-target-types'

const uploadTargetToS3 = async (image: Uint8Array, contentType: string, shortName: string) => {
  const imagePath = path.join('image-target', shortName, uuidv4())

  await s3.use().putObject({
    Bucket: process.env.IMAGE_TARGET_BUCKET,
    Key: imagePath,
    ContentType: contentType,
    Body: await image,
  })

  return imagePath
}

// Checks if image target needs to be rotated if isRotated was changed.
const maybeRotateFlatImage = async (
  image: Uint8Array,
  oldGeometry: TargetGeometry,
  newGeometry: TargetGeometry
) => {
  if (newGeometry.isRotated === oldGeometry.isRotated) {
    return {image}
  }

  const original = sharp(image)
  if (newGeometry.isRotated) {
    original.rotate(90)
  } else {
    original.rotate(-90)
  }

  const geometryOverrides = {
    originalWidth: oldGeometry.originalHeight,
    originalHeight: oldGeometry.originalWidth,
  }

  return {
    image: await original.clone().toBuffer(),
    geometryOverrides,
  }
}

const uploadFlatImage = async (
  image: Uint8Array,
  geometry: TargetGeometry,
  contentType: string,
  shortName: string
) => {
  const original = sharp(image)
  const cropped = original.clone().extract(geometry)
  const thumbnail = cropped.clone().resize(null, THUMBNAIL_HEIGHT)
  const luminance = cropped.clone().resize(null, LUMINANCE_HEIGHT).greyscale().toColorspace('b-w')

  const [
    originalImagePath,
    imagePath,
    thumbnailImagePath,
    luminanceImagePath,
  ] = await Promise.all(
    [original, cropped, thumbnail, luminance]
      .map(async i => uploadTargetToS3(await i.toBuffer(), contentType, shortName))
  )

  return {
    originalImagePath,
    imagePath,
    luminanceImagePath,
    thumbnailImagePath,
    geometryTexturePath: originalImagePath,
  }
}

const uploadConeImage = async (
  image: Uint8Array,
  geometryParams: TargetGeometry,
  contentType: string,
  shortName: string
) => {
  const original = sharp(image)

  const originalBuffer = await original.clone().raw().ensureAlpha().toBuffer()

  const originalData = new ImageData(originalBuffer, geometryParams.originalWidth)

  const pixelPoints = computePixelPointsFromRadius(
    geometryParams.topRadius, geometryParams.bottomRadius, originalData.width
  )

  const geometryTextureData = unconify(originalData, pixelPoints, originalData.width)

  const {width: geometryWidth, height: geometryHeight} = geometryTextureData

  const rotatedGeometryWidth = geometryParams.isRotated ? geometryHeight : geometryWidth
  const rotatedGeometryHeight = geometryParams.isRotated ? geometryWidth : geometryHeight

  const cropError = validateCrop(rotatedGeometryWidth, rotatedGeometryHeight, geometryParams)

  if (cropError) {
    return {validationError: cropError}
  }

  const geometryTexture = sharp(Buffer.from(geometryTextureData.data), {
    raw: {
      width: geometryTextureData.width,
      height: geometryTextureData.height,
      channels: 4,
    },
  }).toFormat((await original.metadata()).format)

  if (geometryParams.isRotated) {
    geometryTexture.rotate(90)
  }

  const cropped = geometryTexture.clone().extract(geometryParams)
  const thumbnail = cropped.clone().resize(null, THUMBNAIL_HEIGHT)
  const luminance = cropped.clone().resize(null, LUMINANCE_HEIGHT).greyscale().toColorspace('b-w')

  const [
    originalImagePath,
    geometryTexturePath,
    imagePath,
    thumbnailImagePath,
    luminanceImagePath,
  ] = await Promise.all(
    [original, geometryTexture, cropped, thumbnail, luminance]
      .map(async i => uploadTargetToS3(await i.toBuffer(), contentType, shortName))
  )

  const paths = {
    originalImagePath,
    geometryTexturePath,
    imagePath,
    luminanceImagePath,
    thumbnailImagePath,
  }

  const widerTargetCircumference = Math.max(
    geometryParams.targetCircumferenceTop,
    getTargetCircumferenceBottom(
      geometryParams.targetCircumferenceTop,
      geometryParams.cylinderCircumferenceTop,
      geometryParams.cylinderCircumferenceBottom
    )
  )

  // originalWidth/Height for conical is the dimensions of the post-rotation geometry texture.
  const geometryOverrides = {
    originalWidth: rotatedGeometryWidth,
    originalHeight: rotatedGeometryHeight,
    cylinderSideLength: toHundredths(widerTargetCircumference * (geometryHeight / geometryWidth)),
  }

  return {paths, geometryOverrides}
}

export {
  maybeRotateFlatImage,
  uploadFlatImage,
  uploadConeImage,
}
