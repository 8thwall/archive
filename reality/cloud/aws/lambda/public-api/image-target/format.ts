import type {ImageTarget} from '../../../../xrhome/src/shared/integration/db/models'

const AVAILABLE_STATUSES = new Set(['ENABLED', 'DISABLED', 'DRAFT'])

const makeCdnUrl = path => path && `https://cdn.8thwall.com/${path}`

const extractFlatGeometry = metadata => ({
  top: metadata.top,
  left: metadata.left,
  width: metadata.width,
  height: metadata.height,
  isRotated: metadata.isRotated,
  originalWidth: metadata.originalWidth,
  originalHeight: metadata.originalHeight,
  staticOrientation: metadata.staticOrientation,
})

const extractCylinderGeometry = metadata => ({
  ...extractFlatGeometry(metadata),
  cylinderCircumferenceTop: metadata.cylinderCircumferenceTop,
  cylinderCircumferenceBottom: metadata.cylinderCircumferenceBottom,
  targetCircumferenceTop: metadata.targetCircumferenceTop,
  cylinderSideLength: metadata.cylinderSideLength,
  inputMode: metadata.inputMode,
  coniness: metadata.coniness,
  arcAngle: metadata.arcAngle,
  unit: metadata.unit,
})

const extractConicalGeometry = metadata => ({
  ...extractCylinderGeometry(metadata),
  topRadius: metadata.topRadius,
  bottomRadius: metadata.bottomRadius,
})

const extractGeometry = (type, metadataString) => {
  const metadata = JSON.parse(metadataString)
  switch (type) {
    case 'PLANAR':
      return extractFlatGeometry(metadata)
    case 'CYLINDER':
      return extractCylinderGeometry(metadata)
    case 'CONICAL':
      return extractConicalGeometry(metadata)
    default:
      throw new Error(`Unexpected type: ${type}`)
  }
}

const makeExternalFormat = (imageTarget: ImageTarget, appKey?: string) => {
  const loadAutomatically = imageTarget.status === 'ENABLED'
  const status = AVAILABLE_STATUSES.has(imageTarget.status) ? 'AVAILABLE' : imageTarget.status

  return {
    name: imageTarget.name,
    uuid: imageTarget.uuid,
    type: imageTarget.type,
    loadAutomatically,
    status,
    appKey,
    geometry: extractGeometry(imageTarget.type, imageTarget.metadata),
    metadata: imageTarget.userMetadata,
    metadataIsJson: imageTarget.userMetadataIsJson,
    originalImageUrl: makeCdnUrl(imageTarget.originalImagePath),
    imageUrl: makeCdnUrl(imageTarget.imagePath),
    thumbnailImageUrl: makeCdnUrl(imageTarget.thumbnailImagePath),
    geometryTextureUrl: makeCdnUrl(imageTarget.geometryTexturePath),
    luminanceImageUrl: makeCdnUrl(imageTarget.luminanceImagePath),
    created: imageTarget.createdAt.getTime(),
    updated: imageTarget.updatedAt.getTime(),
  }
}

export {
  makeExternalFormat,
}
