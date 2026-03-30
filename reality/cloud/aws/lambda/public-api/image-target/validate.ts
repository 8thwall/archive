import {
  DISALLOWED_NAME_CHARACTERS, USER_METADATA_LIMIT, MINIMUM_SHORT_LENGTH, MINIMUM_LONG_LENGTH,
  MAX_NAME_LENGTH,
} from './constants'

const validateName = (name) => {
  if (typeof name !== 'string') {
    return 'Image target name must be a string.'
  }

  if (name.length === 0) {
    return 'Image target name must not be an empty string.'
  }

  if (name.length > MAX_NAME_LENGTH) {
    return `Image target name must be ${MAX_NAME_LENGTH} characters or shorter.`
  }

  if (DISALLOWED_NAME_CHARACTERS.some(character => name.includes(character))) {
    return `Image target name must not include: ${DISALLOWED_NAME_CHARACTERS.join(',')}.`
  }

  return null
}

const validateUserMetadata = (metadata, metadataIsJson) => {
  if (metadata === null) {
    return null
  }
  if (typeof metadata !== 'string') {
    return 'metadata must be a string or unspecified.'
  }
  if (metadata.length > USER_METADATA_LIMIT) {
    return `metadata must be ${USER_METADATA_LIMIT} characters or shorter.`
  }
  if (typeof metadataIsJson !== 'boolean') {
    return 'metadataIsJson must be true or false.'
  }
  if (metadataIsJson) {
    try {
      JSON.parse(metadata)
    } catch (err) {
      return 'metadata must be in JSON format unless metadataIsJson is false.'
    }
  }
  return null
}

const validateStaticOrientation = (staticOrientation: {
  rollAngle?: number
  pitchAngle?: number
}) => {
  if (staticOrientation !== undefined && (typeof staticOrientation !== 'object' ||
    staticOrientation === null)) {
    return 'staticOrientation must be a valid JSON object.'
  }

  if (staticOrientation && typeof staticOrientation === 'object') {
    const keys = Object.keys(staticOrientation)
    // Allow empty object {}
    if (keys.length === 0) {
      return null
    }
    if ((staticOrientation.rollAngle === undefined) ||
        (staticOrientation.pitchAngle === undefined)) {
      return 'staticOrientation must include both rollAngle and pitchAngle.'
    }
    if ((typeof staticOrientation.rollAngle !== 'number' || staticOrientation.rollAngle < 0 ||
            staticOrientation.rollAngle > 360)) {
      return 'staticOrientation.rollAngle must be a number between 0 and 360.'
    }
    if ((typeof staticOrientation.pitchAngle !== 'number' || staticOrientation.pitchAngle < 0 ||
            staticOrientation.pitchAngle > 360)) {
      return 'staticOrientation.pitchAngle must be a number between 0 and 360.'
    }

    const expectedFields = new Set(['rollAngle', 'pitchAngle'])
    const receivedFields = Object.keys(staticOrientation)
    for (const field of receivedFields) {
      if (!expectedFields.has(field)) {
        return `Unexpected field in staticOrientation: ${field}.`
      }
    }
  }
  return null
}

const validateCrop = (originalWidth, originalHeight, {top, left, width, height}) => {
  if (top < 0) {
    return 'geometry.top must be 0 or greater.'
  }
  if (left < 0) {
    return 'geometry.left must be 0 or greater.'
  }
  if (height < MINIMUM_LONG_LENGTH) {
    return `geometry.height must be at least ${MINIMUM_LONG_LENGTH}.`
  }
  if (width < MINIMUM_SHORT_LENGTH) {
    return `geometry.width must be at least ${MINIMUM_SHORT_LENGTH}.`
  }
  if (top + height > originalHeight || left + width > originalWidth) {
    return 'Crop extends beyond image dimensions.'
  }

  const aspectRatio = width / height
  const goalAspectRatio = MINIMUM_SHORT_LENGTH / MINIMUM_LONG_LENGTH
  const aspectRatioDeviation = Math.abs(goalAspectRatio / aspectRatio - 1)
  if (aspectRatioDeviation > 0.01) {
    return 'Crop width:height must have a ratio of 3:4.'
  }

  return null
}

export {
  validateName,
  validateUserMetadata,
  validateCrop,
  validateStaticOrientation,
}
