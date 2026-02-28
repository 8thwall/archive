/* eslint-disable max-len */
import type {AFrameAttribute} from '../aframe-primitives'

const BASE_MATERIAL_ATTRIBUTES: AFrameAttribute[] = [
  {
    name: 'color',
    detail: 'material.color',
    description: 'Base diffuse color.',
    default: '#FFF',
  },
  {
    name: 'metalness',
    detail: 'material.metalness',
    description: 'How metallic the material is from 0 to 1.',
    default: '0',
  },
  {
    name: 'opacity',
    detail: 'material.opacity',
    description: 'Extent of transparency. If the transparent property is not true, then the material will remain opaque and opacity will only affect color.',
    default: '1',
  },
  {
    name: 'repeat',
    detail: 'material.repeat',
    description: 'How many times a texture (defined by src) repeats in the X and Y direction.',
    default: '',
  },
  {
    name: 'shader',
    detail: 'material.shader',
    description: 'Which material to use. Defaults to the standard material. Can be set to the flat material or to a registered custom shader material.',
    default: 'flat',
  },
  {
    name: 'side',
    detail: 'material.side',
    description: 'Which sides of the mesh to render. Can be one of front, back, or double.',
    default: 'double',
  },
  {
    name: 'src',
    detail: 'material.src',
    description: 'Image or video texture map. Can either be a selector to an <img> or <video>, or an inline URL.',
    default: '',
  },
  {
    name: 'transparent',
    detail: 'material.transparent',
    description: 'Whether material is transparent. Transparent entities are rendered after non-transparent entities.',
    default: 'true',
  },
]

const MATERIAL_ATTRIBUTES: AFrameAttribute[] = [
  {
    name: 'ambient-occlusion-map',
    detail: 'material.ambientOcclusionMap',
    description: 'Ambient occlusion map. Used to add shadows to the mesh. Can either be a selector to an <img>, or an inline URL. Requires 2nd set of UVs (see below).',
    default: '',
  },
  {
    name: 'ambient-occlusion-map-intensity',
    detail: 'material.ambientOcclusionMapIntensity',
    description: 'The intensity of the ambient occlusion map, a number between 0 and 1.',
    default: '1',
  },
  {
    name: 'ambient-occlusion-texture-repeat',
    detail: 'material.ambientOcclusionTextureRepeat',
    description: 'How many times the ambient occlusion texture repeats in the X and Y direction.',
    default: '1 1',
  },
  {
    name: 'ambient-occlusion-texture-offset',
    detail: 'material.ambientOcclusionTextureOffset',
    description: 'How the ambient occlusion texture is offset in the x y direction.',
    default: '0 0',
  },
  {
    name: 'color',
    detail: 'material.color',
    description: 'Base diffuse color.',
    default: '#FFF',
  },
  {
    name: 'displacement-map',
    detail: 'material.displacementMap',
    description: 'Displacement map. Used to distort a mesh. Can either be a selector to an <img>, or an inline URL.',
    default: '',
  },
  {
    name: 'displacement-scale',
    detail: 'material.displacementScale',
    description: 'The intensity of the displacement map effect',
    default: '1',
  },
  {
    name: 'displacement-bias',
    detail: 'material.displacementBias',
    description: 'The zero point of the displacement map.',
    default: '0.5',
  },
  {
    name: 'displacement-texture-repeat',
    detail: 'material.displacementTextureRepeat',
    description: 'How many times the displacement texture repeats in the X and Y direction.',
    default: '1 1',
  },
  {
    name: 'displacement-texture-offset',
    detail: 'material.displacementTextureOffset',
    description: 'How the displacement texture is offset in the x y direction.',
    default: '0 0',
  },
  {
    name: 'env-map',
    detail: 'material.envMap',
    description: 'Environment cubemap texture for reflections. Can be a selector to or a comma-separated list of URLs.',
    default: 'None',
  },
  {
    name: 'fog',
    detail: 'material.fog',
    description: 'Whether or not material is affected by fog.',
    default: 'true',
  },
  {
    name: 'metalness',
    detail: 'material.metalness',
    description: 'How metallic the material is from 0 to 1.',
    default: '0',
  },
  {
    name: 'normal-map',
    detail: 'material.normalMap',
    description: 'Normal map. Used to add the illusion of complex detail. Can either be a selector to an <img>, or an inline URL.',
    default: '',
  },
  {
    name: 'normal-scale',
    detail: 'material.normalScale',
    description: 'Scale of the effect of the normal map in the X and Y directions.',
    default: '1 1',
  },
  {
    name: 'normal-texture-repeat',
    detail: 'material.normalTextureRepeat',
    description: 'How many times the normal texture repeats in the X and Y direction.',
    default: '1 1',
  },
  {
    name: 'normal-texture-offset',
    detail: 'material.normalTextureOffset',
    description: 'How the normal texture is offset in the x y direction.',
    default: '0 0',
  },
  {
    name: 'repeat',
    detail: 'material.repeat',
    description: 'How many times a texture (defined by src) repeats in the X and Y direction.',
    default: '1 1',
  },
  {
    name: 'roughness',
    detail: 'material.roughness',
    description: 'How rough the material is from 0 to 1. A rougher material will scatter reflected light in more directions than a smooth material.',
    default: '0.5',
  },
  {
    name: 'spherical-env-map',
    detail: 'material.sphericalEnvMap',
    description: 'Environment spherical texture for reflections. Can either be a selector to an <img>, or an inline URL.',
    default: '',
  },
  {
    name: 'wireframe',
    detail: 'material.wireframe',
    description: 'Whether to render just the geometry edges.',
    default: 'false',
  },
  {
    name: 'wireframe-linewidth',
    detail: 'material.wireframeLinewidth',
    description: 'Width in px of the rendered line.',
    default: '2',
  },
  {
    name: 'src',
    detail: 'material.src',
    description: 'Image or video texture map. Can either be a selector to an <img> or <video>, or an inline URL.',
    default: '',
  },
]

const MATERIAL_ROUGHNESS = {
  name: 'roughness',
  detail: 'material.roughness',
  description: 'How rough the material is from 0 to 1. A rougher material will scatter reflected light in more directions than a smooth material.',
  default: '0.5',
}

const MATERIAL_WIDTH = {
  name: 'width',
  detail: 'material.width',
  description: 'Width of video (in pixels), if defining a video texture.',
  default: '512',
}

const MATERIAL_HEIGHT = {
  name: 'height',
  detail: 'material.height',
  description: 'Height of video (in pixels), if defining a video texture.',
  default: '256',
}

export {
  BASE_MATERIAL_ATTRIBUTES,
  MATERIAL_ATTRIBUTES,
  MATERIAL_ROUGHNESS,
  MATERIAL_HEIGHT,
  MATERIAL_WIDTH,
}
