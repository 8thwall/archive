import type {DeepReadonly} from 'ts-essentials'

type ModuleCompatibility = typeof VALID_COMPATIBILITIES[number]

type AppHostingType = 'UNSET' | 'CLOUD_EDITOR' | 'CLOUD_STUDIO' | 'SELF' | 'INTERNAL' | 'AD'

const VALID_COMPATIBILITIES = [
  'UNSET', 'CLOUD_EDITOR_ONLY', 'SELF_ONLY', 'ANY', 'CLOUD_STUDIO_ONLY',
  'EDITOR_SELF', 'EDITOR_STUDIO', 'SELF_STUDIO',
] as const

type MinModule = {compatibility?: ModuleCompatibility}

type UnpackedCompatibility = DeepReadonly<{
  self: boolean
  editor: boolean
  studio: boolean
}>

const packCompatibility = (compatibility: UnpackedCompatibility): ModuleCompatibility | 'NONE' => {
  if (compatibility.self && compatibility.editor && compatibility.studio) {
    return 'ANY'
  } else if (compatibility.editor && compatibility.self) {
    return 'EDITOR_SELF'
  } else if (compatibility.editor && compatibility.studio) {
    return 'EDITOR_STUDIO'
  } else if (compatibility.self && compatibility.studio) {
    return 'SELF_STUDIO'
  } else if (compatibility.self) {
    return 'SELF_ONLY'
  } else if (compatibility.editor) {
    return 'CLOUD_EDITOR_ONLY'
  } else if (compatibility.studio) {
    return 'CLOUD_STUDIO_ONLY'
  } else {
    return 'NONE'
  }
}

type UnpackedCompatibilityMap = Record<ModuleCompatibility | 'NONE', UnpackedCompatibility>

const UNPACKED_COMPATIBILITIES: DeepReadonly<UnpackedCompatibilityMap> = {
  'UNSET': {self: false, editor: true, studio: false},
  'ANY': {self: true, editor: true, studio: true},
  'CLOUD_EDITOR_ONLY': {self: false, editor: true, studio: false},
  'SELF_ONLY': {self: true, editor: false, studio: false},
  'CLOUD_STUDIO_ONLY': {self: false, editor: false, studio: true},
  'EDITOR_SELF': {self: true, editor: true, studio: false},
  'EDITOR_STUDIO': {self: false, editor: true, studio: true},
  'SELF_STUDIO': {self: true, editor: false, studio: true},
  // Not a valid compatibility in the database, but needed for completeness.
  'NONE': {self: false, editor: false, studio: false},
}

const unpackCompatibility = (compatibility: ModuleCompatibility): UnpackedCompatibility => (
  UNPACKED_COMPATIBILITIES[compatibility]
)

const isModuleCompatible = (
  module: MinModule,
  isSelfHosted: boolean,
  appHostingType?: AppHostingType
) => {
  const compatibility = unpackCompatibility(module.compatibility)
  if (!compatibility) {
    return true
  }

  if (isSelfHosted) {
    return compatibility.self
  } else if (appHostingType === 'CLOUD_STUDIO') {
    return compatibility.studio
  } else {
    return compatibility.editor
  }
}

const filterCompatibleModules = <T extends MinModule>(
  modules: DeepReadonly<T[]>, isSelfHosted: boolean, appHostingType: AppHostingType
) => modules.filter(m => isModuleCompatible(m, isSelfHosted, appHostingType))

const isValidCompatibility = (c: any): c is ModuleCompatibility => VALID_COMPATIBILITIES.includes(c)

export {
  isModuleCompatible,
  isValidCompatibility,
  filterCompatibleModules,
  packCompatibility,
  unpackCompatibility,
}

export type {
  ModuleCompatibility,
  UnpackedCompatibility,
}
