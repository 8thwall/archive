/* eslint-disable max-len */
import type {AFrameAttribute} from '../aframe-primitives'

const SOUND_ATTRIBUTES: AFrameAttribute[] = [
  {
    name: 'autoplay',
    detail: 'sound.autoplay',
    description: 'Whether to automatically play sound once set.',
    default: 'false',
  },
  {
    name: 'loop',
    detail: 'sound.loop',
    description: 'Whether to loop the sound once the sound finishes playing.',
    default: 'false',
  },
  {
    name: 'on',
    detail: 'sound.on',
    description: 'An event for the entity to listen to before playing sound.',
    default: 'null',
  },
  {
    name: 'src',
    detail: 'sound.src',
    description: 'Selector to an asset <audio>or url()-enclosed path to sound file.',
    default: 'null',
  },
  {
    name: 'volume',
    detail: 'sound.volume',
    description: 'How loud to play the sound.',
    default: '1',
  },
]

export {SOUND_ATTRIBUTES}
