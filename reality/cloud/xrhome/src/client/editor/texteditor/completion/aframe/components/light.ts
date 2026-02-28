/* eslint-disable max-len */
import type {AFrameAttribute} from '../aframe-primitives'

const LIGHT_ATTRIBUTES: AFrameAttribute[] = [
  {
    name: 'angle',
    detail: 'light.angle',
    description: 'Maximum extent of spot light from its direction (in degrees).',
    default: '60',
  },
  {
    name: 'color',
    detail: 'light.color',
    description: 'Light color from above.',
    default: '#fff',
  },
  {
    name: 'decay',
    detail: 'light.decay',
    description: 'Amount the light dims along the distance of the light.',
    default: '1',
  },
  {
    name: 'distance',
    detail: 'light.distance',
    description: 'Distance where intensity becomes 0. If distance is 0, then the point light does not decay with distance.',
    default: '0.0',
  },
  {
    name: 'envmap',
    detail: 'light.envmap',
    description: 'Cube Map to load',
    default: 'null',
  },
  {
    name: 'ground-color',
    detail: 'light.groundColor',
    description: 'Light color from below.',
    default: '#fff',
  },
  {
    name: 'intensity',
    detail: 'light.intensity',
    description: 'Light strength.',
    default: '1.0',
  },
  {
    name: 'penumbra',
    detail: 'light.penumbra',
    description: 'Percent of the spotlight cone that is attenuated due to penumbra.',
    default: '0.0',
  },
  {
    name: 'type',
    detail: 'light.type',
    description: 'Maximum distance under which resulting entities are returned. Cannot be lower than near.',
    default: 'directional',
  },
  {
    name: 'target',
    detail: 'light.target',
    description: 'element the spot should point to. set to null to transform spotlight by orientation, pointing to it\'s -Z axis.',
    default: 'null',
  },
]

export {LIGHT_ATTRIBUTES}
