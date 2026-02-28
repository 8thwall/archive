interface AssetDimension {
  width: Number
  height: Number
}

interface AdditionalAssetData {
  dimension: AssetDimension
  duration: Number
}

interface ModelInfo {
  vertices: number
  triangles: number
  sizeInBytes?: number
  maxTextureSize?: number
  isDraco?: boolean
}

interface HcapInfo {
  duration: number
  faces: number
}

export {
  AssetDimension,
  AdditionalAssetData,
  ModelInfo,
  HcapInfo,
}
