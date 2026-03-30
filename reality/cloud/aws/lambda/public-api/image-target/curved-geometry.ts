// Adapted from reality/cloud/xrhome/src/client/apps/image-targets/curved-geometry.ts

import {DEFAULT_CONINESS, MAX_CONINESS, MIN_CONINESS} from './constants'

// When filling a calculated field, we don't want to have a large number of decimals, so round to
// hundredths before saving the value
const toHundredths = n => Math.round(n * 100) / 100

const getTargetCircumferenceBottom = (
  targetCircumferenceTop, cylinderCircumferenceTop, cylinderCircumferenceBottom
) => targetCircumferenceTop * cylinderCircumferenceBottom / cylinderCircumferenceTop

// Returns the ratio between circumferenceTop and circumferenceBottom, using top/bottomRadius
// if available, otherwise using the preexisting circumference values.
// circumferenceTop/Bottom can degrade because of rounding, but if the radii haven't been set
// on the target, we fall back to circumference.
const getCircumferenceRatio = (topRadius, bottomRadius) => {
  if (topRadius < 0) {
    return -bottomRadius / topRadius
  } else {
    return topRadius / bottomRadius
  }
}

const getConinessForRadii = (topRadius, bottomRadius) => {
  if (typeof topRadius !== 'number' || typeof bottomRadius !== 'number') {
    return DEFAULT_CONINESS
  }

  if (Number.isNaN(topRadius) || Number.isNaN(bottomRadius)) {
    return DEFAULT_CONINESS
  }

  if (topRadius === 0) {
    return DEFAULT_CONINESS
  }

  if (bottomRadius === 0) {
    return topRadius > 0 ? MAX_CONINESS : MIN_CONINESS
  }

  const baseConiness = Math.log2(Math.abs(topRadius / bottomRadius))

  const signedConiness = topRadius < 0 ? -baseConiness : baseConiness

  return Math.min(MAX_CONINESS, Math.max(MIN_CONINESS, signedConiness))
}

// Returns the ratio between circumferenceTop and circumferenceBottom, using top/bottomRadius
// if available, otherwise using the preexisting circumference values.
// circumferenceTop/Bottom can degrade because of rounding, but if the radii haven't been set
// on the target, we fall back to circumference.
const getCircumferenceRatioWithFallback = (
  circumferenceTop, circumferenceBottom, topRadius, bottomRadius
) => {
  if (topRadius && bottomRadius) {
    return getCircumferenceRatio(topRadius, bottomRadius)
  }
  return circumferenceTop / circumferenceBottom
}

export {
  getTargetCircumferenceBottom,
  toHundredths,
  getCircumferenceRatio,
  getConinessForRadii,
  getCircumferenceRatioWithFallback,
}
