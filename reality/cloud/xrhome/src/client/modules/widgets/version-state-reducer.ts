import type {CropArea, ImageFile} from '../../common/image-cropper'

type ModuleVersionState = {
  publishing: boolean
  commit: string
  isPreRelease: boolean
  versionType: 'patch' | 'minor' | 'major' | 'initial'
  versionDescription: string
  moduleTitle: string
  moduleDescription: string
  coverImagePreviewUrl: string
  cropResult: {cropAreaPixels: CropArea, original: ImageFile}
}

const versionStateReducer = (state: ModuleVersionState, action: Partial<ModuleVersionState>) => (
  {...state, ...action}
)

export {versionStateReducer}

export type {ModuleVersionState}
