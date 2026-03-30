type TargetGeometry = {
  left: number
  top: number
  width: number
  height: number
  isRotated: boolean
  originalWidth: number
  originalHeight: number
  topRadius?: number
  bottomRadius?: number
  cylinderSideLength?: number
  cylinderCircumferenceTop?: number
  targetCircumferenceTop?: number
  cylinderCircumferenceBottom?: number
  arcAngle?: number
  coniness?: number
  inputMode?: 'BASIC' | 'ADVANCED'
  unit?: 'mm' | 'in'
  staticOrientation?: {
    rollAngle: number
    pitchAngle: number
  }
}

type TargetPaths = {
  originalImagePath?: string
  imagePath?: string
  luminanceImagePath?: string
  thumbnailImagePath?: string
  geometryTexturePath?: string
}

export type {
  TargetGeometry,
  TargetPaths,
}
