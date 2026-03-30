import {validate as validateUuid} from 'uuid'

import {
  respondNotFound, respondNoContent, respondInvalidInput, respondJson, respondForbidden,
} from './responses'
import * as models from './models'
import {MAX_AUTO_TARGETS, ALLOWED_UNITS} from './image-target/constants'
import {makeExternalFormat} from './image-target/format'
import {
  getCircumferenceRatioWithFallback, toHundredths, getTargetCircumferenceBottom,
} from './image-target/curved-geometry'
import {getImageTargetForRequest} from './api-key'
import {
  validateName, validateUserMetadata, validateStaticOrientation,
} from './image-target/validate'
import {extractTargetMetadata, updateCropping} from './image-target/target-metadata'
import {readStandardizedHeader} from './headers'
import type {Request, Response} from './api-types'

const handleTargetGet = async (request: Request): Promise<Response> => {
  const {target: targetUuid} = request.pathParameters

  if (!validateUuid(targetUuid)) {
    return respondInvalidInput('Invalid UUID provided in path.')
  }

  const target = await getImageTargetForRequest({
    uuid: targetUuid,
  }, request, {
    extendAppInclude: {
      attributes: ['appKey'],
    },
  })

  if (!target) {
    return respondNotFound(`Image Target: ${request.pathParameters.target}`)
  }

  return respondJson(makeExternalFormat(target, target.App.appKey))
}

const handleTargetPatch = async (request: Request): Promise<Response> => {
  const {ImageTarget} = models.use()
  if (readStandardizedHeader(request.headers, 'Content-Type') !== 'application/json') {
    return respondInvalidInput('Unexpected or missing content-type, expected "application/json"')
  }

  let body

  try {
    body = JSON.parse(request.body)
  } catch (err) {
    return respondInvalidInput('Invalid JSON provided')
  }

  if (!body || typeof body !== 'object') {
    return respondInvalidInput('Invalid format provided')
  }

  const {
    loadAutomatically,
    metadata: userMetadata,
    metadataIsJson: userMetadataIsJson,
    name,
    geometry,
    ...rest
  } = body

  const unknownFields = Object.keys(rest)
  if (unknownFields.length) {
    return respondInvalidInput(`Unknown field(s) provided: ${unknownFields.join(', ')}`)
  }

  if (![undefined, true, false].includes(loadAutomatically)) {
    return respondInvalidInput('loadAutomatically must be true, false, or unspecified.')
  }

  if (userMetadata !== undefined && userMetadata !== null && typeof userMetadata !== 'string') {
    return respondInvalidInput('metadata must be a string, null, or unspecified.')
  }

  if (![undefined, true, false].includes(userMetadataIsJson)) {
    return respondInvalidInput('metadataIsJson must be true, false, or unspecified.')
  }

  if (name !== undefined) {
    const nameError = validateName(name)
    if (nameError) {
      return respondInvalidInput(nameError)
    }
  }

  if (geometry !== undefined && (typeof geometry !== 'object' || geometry === null)) {
    return respondInvalidInput('geometry must be a JSON object.')
  }

  const {target: targetUuid} = request.pathParameters

  if (!validateUuid(targetUuid)) {
    return respondInvalidInput('Invalid UUID provided in path.')
  }

  const target = await getImageTargetForRequest({
    uuid: targetUuid,
  }, request)

  if (!target) {
    return respondNotFound(`Image Target: ${request.pathParameters.target}`)
  }

  if (target.status === 'TAKEN_DOWN') {
    return respondForbidden('Cannot update a target that has been taken down.')
  }

  const isCurved = target.type === 'CYLINDER' || target.type === 'CONICAL'

  // Update geometry if provided for flat targets.
  if (geometry !== undefined && !isCurved) {
    const currentMetadata = extractTargetMetadata(target.metadata)
    const {
      left = currentMetadata.left,
      top = currentMetadata.top,
      width = currentMetadata.width,
      height = currentMetadata.height,
      isRotated = currentMetadata.isRotated,
      staticOrientation,
      ...geometryRest
    } = geometry

    const unknownGeometryFields = Object.keys(geometryRest)
    if (unknownGeometryFields.length) {
      return respondInvalidInput(
        `Unexpected geometry field(s) provided: ${unknownGeometryFields.join(', ')}`
      )
    }

    const staticOrientationError = validateStaticOrientation(staticOrientation)
    if (staticOrientationError) {
      return respondInvalidInput(staticOrientationError)
    }

    const updatedGeometry = {
      left,
      top,
      width,
      height,
      isRotated,
      originalWidth: currentMetadata.originalWidth,
      originalHeight: currentMetadata.originalHeight,
    }
    const updatedResult = await updateCropping(target, updatedGeometry)
    if (updatedResult && updatedResult.validationError) {
      return respondInvalidInput(updatedResult.validationError)
    } else if (updatedResult) {
      target.originalImagePath = updatedResult.paths.originalImagePath
      target.imagePath = updatedResult.paths.imagePath
      target.luminanceImagePath = updatedResult.paths.luminanceImagePath
      target.thumbnailImagePath = updatedResult.paths.thumbnailImagePath
      target.geometryTexturePath = updatedResult.paths.geometryTexturePath
    }
    const newMetadata = {
      ...currentMetadata,
      ...updatedResult?.geometryOverrides,
      left,
      top,
      width,
      height,
      isRotated,
    }
    if (staticOrientation) {
      if (Object.keys(staticOrientation).length === 0) {
        delete newMetadata.staticOrientation
      } else {
        newMetadata.staticOrientation = staticOrientation
      }
    }
    target.metadata = JSON.stringify(newMetadata)
  } else if (geometry !== undefined && isCurved) {
    // Update geometry if provided for curved targets.
    let currentMetadata = extractTargetMetadata(target.metadata)
    const {
      left = currentMetadata.left,
      top = currentMetadata.top,
      width = currentMetadata.width,
      height = currentMetadata.height,
      topRadius = currentMetadata.topRadius,
      bottomRadius = currentMetadata.bottomRadius,
      isRotated = currentMetadata.isRotated,
      cylinderCircumferenceTop = currentMetadata.cylinderCircumferenceTop,
      targetCircumferenceTop = currentMetadata.targetCircumferenceTop,
      inputMode = currentMetadata.inputMode || 'BASIC',
      unit = currentMetadata.unit,
      ...geometryRest
    } = geometry

    const unknownGeometryFields = Object.keys(geometryRest)
    //  Do not allow top and bottom radius for CYLINDER.
    if (target.type !== 'CONICAL') {
      const unexpectedFields = {
        topRadius: geometry.topRadius,
        bottomRadius: geometry.bottomRadius,
      }

      Object.entries(unexpectedFields).filter(([, value]) => value !== undefined).map(
        ([key]) => unknownGeometryFields.push(key)
      )
    }
    if (unknownGeometryFields.length) {
      return respondInvalidInput(
        `Unexpected geometry field(s) provided: ${unknownGeometryFields.join(', ')}`
      )
    }

    currentMetadata = {
      ...currentMetadata,
      left,
      top,
      width,
      height,
      isRotated,
      topRadius,
      bottomRadius,
    }
    // Only update if the cropping changed.
    const updatedResult = await updateCropping(target, currentMetadata)
    if (updatedResult && updatedResult.validationError) {
      return respondInvalidInput(updatedResult.validationError)
    } else if (updatedResult) {
      target.originalImagePath = updatedResult.paths.originalImagePath
      target.imagePath = updatedResult.paths.imagePath
      target.luminanceImagePath = updatedResult.paths.luminanceImagePath
      target.thumbnailImagePath = updatedResult.paths.thumbnailImagePath
      target.geometryTexturePath = updatedResult.paths.geometryTexturePath

      const {geometryOverrides} = updatedResult
      currentMetadata = {
        ...currentMetadata,
        ...geometryOverrides,
      }
    }

    // Recalculate cylinder values for curved targets.
    if (typeof cylinderCircumferenceTop !== 'number') {
      return respondInvalidInput('cylinderCircumferenceTop must be a number.')
    }

    if (typeof targetCircumferenceTop !== 'number') {
      return respondInvalidInput('targetCircumferenceTop must be a number.')
    }

    if ((unit !== undefined) && (typeof unit !== 'string' || !ALLOWED_UNITS.includes(unit))) {
      return respondInvalidInput(`unit must be one of: ${ALLOWED_UNITS.join(', ')}`)
    }

    const circumferenceRatio = target.type === 'CYLINDER' ? 1 : getCircumferenceRatioWithFallback(
      currentMetadata.cylinderCircumferenceTop,
      currentMetadata.cylinderCircumferenceBottom,
      currentMetadata.topRadius,
      currentMetadata.bottomRadius
    )

    const cylinderCircumferenceBottom = toHundredths(cylinderCircumferenceTop / circumferenceRatio)

    const widerTargetCircumference = Math.max(
      targetCircumferenceTop,
      getTargetCircumferenceBottom(
        targetCircumferenceTop,
        cylinderCircumferenceTop,
        cylinderCircumferenceBottom
      )
    )

    const originalAspectRatio = (currentMetadata.originalWidth / currentMetadata.originalHeight)

    const cylinderSideLength = toHundredths(
      currentMetadata.isRotated
        ? widerTargetCircumference * originalAspectRatio
        : widerTargetCircumference / originalAspectRatio
    )

    const arcAngle = 360 * (targetCircumferenceTop / cylinderCircumferenceTop)

    target.metadata = JSON.stringify({
      ...currentMetadata,
      cylinderCircumferenceTop,
      cylinderCircumferenceBottom,
      targetCircumferenceTop,
      cylinderSideLength,
      arcAngle,
      inputMode,
      unit,
    })
  }

  if (name !== undefined && name !== target.name) {
    // If api key has access to the previous target then presumable it has access to all targets
    // in the same account. Same applies to loadAutomatically query below.
    const targetWithSameName = await ImageTarget.findOne({where: {AppUuid: target.AppUuid, name}})
    if (targetWithSameName) {
      return respondInvalidInput(`App already has image target with name: ${name}`)
    }
    target.name = name
  }

  if (loadAutomatically !== undefined) {
    if (loadAutomatically && target.status !== 'ENABLED') {
      const autoTargetCount = await ImageTarget.count({
        where: {
          status: 'ENABLED',
          AppUuid: target.AppUuid,
        },
      })
      if (autoTargetCount >= MAX_AUTO_TARGETS) {
        return respondInvalidInput(`Cannot exceed ${MAX_AUTO_TARGETS} loadAutomatically targets.`)
      }
    }
    target.status = loadAutomatically ? 'ENABLED' : 'DRAFT'
  }

  if (userMetadataIsJson !== undefined) {
    target.userMetadataIsJson = userMetadataIsJson
  }

  if (userMetadata !== undefined) {
    target.userMetadata = userMetadata
  }

  if (userMetadata !== undefined || userMetadataIsJson !== undefined) {
    const metadataError = validateUserMetadata(target.userMetadata, target.userMetadataIsJson)
    if (metadataError) {
      return respondInvalidInput(metadataError)
    }
  }

  await target.save()

  return respondJson(makeExternalFormat(target))
}

const handleTargetDelete = async (request: Request): Promise<Response> => {
  const targetUuid = request.pathParameters.target

  if (!validateUuid(targetUuid)) {
    return respondInvalidInput('Invalid UUID provided in path.')
  }

  const target = await getImageTargetForRequest({
    uuid: targetUuid,
  }, request)
  if (!target) {
    return respondNotFound(`Image target: ${targetUuid}`)
  }

  await target.destroy()

  return respondNoContent()
}

export {
  handleTargetGet,
  handleTargetPatch,
  handleTargetDelete,
}
