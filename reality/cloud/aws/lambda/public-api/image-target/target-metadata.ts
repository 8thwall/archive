import path from 'path'

import type {ImageTarget} from '@nia/reality/cloud/xrhome/src/shared/integration/db/models'

import {validateCrop} from './validate'
import {getConinessForRadii} from './curved-geometry'
import {maybeRotateFlatImage, uploadFlatImage, uploadConeImage} from './upload'
import type {TargetGeometry, TargetPaths} from './image-target-types'

import * as s3 from '../s3'

const extractTargetMetadata = (metadata: string): TargetGeometry => {
  const targetMetadata = JSON.parse(metadata)
  return {
    left: targetMetadata.left,
    top: targetMetadata.top,
    width: targetMetadata.width,
    height: targetMetadata.height,
    isRotated: targetMetadata.isRotated,
    originalWidth: targetMetadata.originalWidth,
    originalHeight: targetMetadata.originalHeight,
    topRadius: targetMetadata.topRadius,
    bottomRadius: targetMetadata.bottomRadius,
    cylinderSideLength: targetMetadata.cylinderSideLength,
    cylinderCircumferenceTop: targetMetadata.cylinderCircumferenceTop,
    targetCircumferenceTop: targetMetadata.targetCircumferenceTop,
    cylinderCircumferenceBottom: targetMetadata.cylinderCircumferenceBottom,
    arcAngle: targetMetadata.arcAngle,
    coniness: targetMetadata.coniness,
    inputMode: targetMetadata.inputMode,
    unit: targetMetadata.unit,
    staticOrientation: targetMetadata.staticOrientation,
  }
}

const extractCropMetadata = (geometry: TargetGeometry): TargetGeometry => ({
  left: geometry.left,
  top: geometry.top,
  width: geometry.width,
  height: geometry.height,
  originalHeight: geometry.originalHeight,
  originalWidth: geometry.originalWidth,
  topRadius: geometry.topRadius,
  bottomRadius: geometry.bottomRadius,
  isRotated: geometry.isRotated,
})

const updateCropping = async (target: ImageTarget, geometry: TargetGeometry) => {
  let currentMetadata = extractTargetMetadata(target.metadata)
  const newParams = extractCropMetadata(geometry)
  const oldParams = extractCropMetadata(currentMetadata)
  const isCroppingUpdated = JSON.stringify(newParams) !== JSON.stringify(oldParams)
  if (!isCroppingUpdated) {
    return null
  }

  const {left, top, width, height, topRadius, bottomRadius, isRotated} = geometry

  if (typeof left !== 'number') {
    return {validationError: 'left must be a number.'}
  }

  if (typeof top !== 'number') {
    return {validationError: 'top must be a number.'}
  }

  if (typeof width !== 'number') {
    return {validationError: 'width must be a number.'}
  }

  if (typeof height !== 'number') {
    return {validationError: 'height must be a number.'}
  }

  if (typeof isRotated !== 'boolean') {
    return {validationError: 'isRotated must be a boolean.'}
  }

  // Get original image to crop.
  const {ContentType, Body} = await s3.use().getObject({
    Bucket: process.env.IMAGE_TARGET_BUCKET,
    Key: target.originalImagePath,
  })
  const imageBuffer = await Body.transformToByteArray()
  const shortName = path.basename(path.dirname(target.originalImagePath))
  let paths: TargetPaths = {}

  if (target.type === 'CONICAL') {
    if (typeof topRadius !== 'number') {
      return {validationError: 'topRadius must be a number.'}
    }
    if (typeof bottomRadius !== 'number') {
      return {validationError: 'bottomRadius must be a number.'}
    }

    // If the image is rotated, revert back to the original width to properly upload cone image.
    // Note that originalHeight isn't used for this as it will be recalculated.
    if (currentMetadata.isRotated) {
      geometry.originalWidth = currentMetadata.originalHeight
    }
    currentMetadata = {
      ...currentMetadata,
      ...geometry,
    }

    const result = await uploadConeImage(imageBuffer, currentMetadata, ContentType, shortName)
    if (result.validationError) {
      return {validationError: result.validationError}
    }
    // Recalculate the coniness to override the geometry values.
    const {geometryOverrides} = result
    Object.assign(geometryOverrides, {coniness: getConinessForRadii(topRadius, bottomRadius)})
    return {
      paths: result.paths,
      geometryOverrides,
    }
  } else {  // Cropping for FLAT and CYLINDER.
    const rotateResult = await maybeRotateFlatImage(imageBuffer, oldParams, newParams)
    const {geometryOverrides} = rotateResult

    if (geometryOverrides) {
      newParams.originalWidth = geometryOverrides.originalWidth
      newParams.originalHeight = geometryOverrides.originalHeight
    }

    const validationError = validateCrop(
      newParams.originalWidth,
      newParams.originalHeight,
      newParams
    )
    if (validationError) {
      return {validationError}
    }

    paths = await uploadFlatImage(rotateResult.image, newParams, ContentType, shortName)
    return {
      paths,
      geometryOverrides,
    }
  }
}

export {extractCropMetadata, extractTargetMetadata, updateCropping}
