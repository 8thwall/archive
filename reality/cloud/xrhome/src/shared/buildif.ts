import {extractBuildIf} from './extract-buildif'

// See "Data Realms and Deployments"
// https://github.com/8thwall/code8/blob/main/reality/cloud/xrhome/README.md#data-realms-and-deployments
// in xrhome/README.md
type DefinitionValue = (
  'isTest' |
  'isQa' |
  'isLocal' |
  'isExperimental' |
  'isMature' |
  boolean
)

const definitions = {
  LOCAL_DEV: 'isLocal',
  ALL_QA: 'isQa',
  EXPERIMENTAL: 'isExperimental',
  MATURE: 'isMature',
  LOCAL: 'isLocal',
  DISABLED: false,
  FULL_ROLLOUT: true,
  UI_TEST: 'isTest',
  UNIT_TEST: false,
  ALWAYS_BRAND8_20251009: 'isExperimental',
  ASSET_LAB_DOWNLOAD_ASSETS_20251201: true,
  BRANDING_REFRESH_HOMEPAGE_20251006: false,
  BRANDING_REFRESH_PRICING_20251008: false,
  CLOUD_STUDIO_AI_20240413: false,
  CMS_EMBEDDED_20250911: false,
  CMS_NEW_ENDPOINTS_ADDITION_20251006: false,
  CMS_OLD_ENDPOINTS_REMOVAL_20251006: false,
  CONFIGURATOR_TOOLTIPS_20250808: 'isExperimental',
  DATA_RECORDER_20250729: 'isLocal',
  DEFAULT_DARK_MODE_20251009: false,
  DEV_TOKEN_SIMULATOR_20240618: 'isMature',
  DISABLE_COGNITO_ACCESS_TOKENS_20250708: 'isLocal',
  DOWNLOAD_EXTENSION_20251022: false,
  EXPORT_BUILDABLE_CODE_20251205: true,
  EXPORT_CODE_20251114: true,
  EXPORT_IMAGE_TARGETS_20251217: true,
  EXTERIOR_DARK_MODE_20251009: false,
  LEGACY_HOSTING_RETIRED_20250318: true,
  MANIFEST_EDIT_20250618: 'isExperimental',
  MIGRATE_PADDING_20250610: 'isExperimental',
  NAE_IOS_APP_CONNECT_API_20250822: false,
  NAE_LAUNCH_SCREEN_UPLOAD_20250910: 'isLocal',
  NESTED_PREFABS_20250625: false,
  PRIVATE_NAVIGATION_20251009: false,
  PROJECT_LIBRARY_REVAMP_20250929: false,
  PUBLIC_NAVIGATION_20251009: false,
  REALTIME_20250825: true,
  SCANIVERSE_GSB_VPS_REACTIVATION_20241125: true,
  SCANIVERSE_INTERNAL_ACCESS_20250204: 'isExperimental',
  SCENE_DIFF_20250730: 'isExperimental',
  SCENE_JSON_VISIBLE_20240616: 'isMature',
  STATIC_IMAGE_TARGETS_20250721: 'isExperimental',
  STUDIO_MESH_MATERIAL_CONFIGURATOR_20240828: 'isLocal',
  STUDIO_MULTI_ADD_COMPONENTS_20241202: 'isExperimental',
  STUDIO_PLAYGROUND_20240508: 'isMature',
  SUNSET_ANNOUNCEMENT_20250917: true,
  // NOTE(christoph): These keys are alphabetically sorted
} as const

type DefinitionKey = keyof typeof definitions

type DefinitionRecord = Record<DefinitionKey, DefinitionValue>

// If definitions is not assignable to definitionsRecord, it means there is a typo in definitions
const definitionsRecord: DefinitionRecord = definitions

type BuildIfReplacements = {
  [x in DefinitionKey]: boolean
}

type BuildIfEnv = {
  isLocalDev: boolean
  isRemoteDev: boolean
  isTest: boolean
  flagLevel: 'experimental' | 'mature' | 'launch'
}

const getBuildIfReplacements = (env: BuildIfEnv, overrides: DefinitionRecord = null) => (
  extractBuildIf({...definitionsRecord, ...overrides}, env)
)

export {
  BuildIfEnv,
  BuildIfReplacements,
  getBuildIfReplacements,
  DefinitionKey,
  DefinitionRecord,
}
