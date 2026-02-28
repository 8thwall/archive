import THREE from './three'
import {DRACO_DECODER_PATH} from '../shared/draco-constants'
import type {GLTFLoader, TextureLoader} from './three-types'
import type {RGBELoader} from './three-types'

let _gltfLoader: GLTFLoader | null = null
const getGltfLoader = () => {
  if (_gltfLoader) {
    return _gltfLoader
  }

  const newLoader = new THREE.GLTFLoader()
  const dracoLoader = new THREE.DRACOLoader()
  dracoLoader.setDecoderPath(DRACO_DECODER_PATH)
  newLoader.setDRACOLoader(dracoLoader)

  _gltfLoader = newLoader

  return newLoader
}

let _rgbeLoader: RGBELoader
const getRGBELoader = (): RGBELoader => {
  if (_rgbeLoader) {
    return _rgbeLoader
  }
  _rgbeLoader = new THREE.RGBELoader()
  return _rgbeLoader
}

let _textureLoader: TextureLoader
const getTextureLoader = (): TextureLoader => {
  if (_textureLoader) {
    return _textureLoader
  }
  _textureLoader = new THREE.TextureLoader()
  return _textureLoader
}

export {
  getGltfLoader,
  getRGBELoader,
  getTextureLoader,
}
