/* eslint-disable max-len */
import type {AFrameAttribute} from '../aframe-primitives'

const VIDEO_ATTRIBUTES: AFrameAttribute[] = [
  {
    name: 'autoplay',
    detail: 'video.autoplay',
    description: '',
    default: 'true',
  }, {
    name: 'crossOrigin',
    detail: 'video.crossOrigin',
    description: '',
    default: 'anonymous',
  }, {
    name: 'loop',
    detail: 'video.loop',
    description: '',
    default: 'true',
  },
]

export {VIDEO_ATTRIBUTES}
