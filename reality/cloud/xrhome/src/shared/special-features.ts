const PRIVATE_VPS_BETA = 'privateVpsBeta'

const BACKEND_AUTHOR = 'backendAuthor'

const DEV_SCANNING_BETA = 'devScanningBeta'

const DEV_SCANNING_INTERNAL_TOOLS = 'devScanningInternalTools'

const NIA = 'nia'

const CLOUD_STUDIO_BETA = 'cloudStudioBeta'

const STUDIO_SPACES_BETA = 'studioSpacesBeta'

const STUDIO_EXPANSE_DIFF_BETA = 'studioExpanseDiffBeta'

// used for allowing the S4D QR code to generate an internal access token in RC environment
const DEV_SCANNING_INTERNAL_ACCESS = 'devScanningInternalAccess'

const UNLIMITED_WHITE_LABEL_ACCESS = 'unlimitedWhiteLabel'

const AGENT_BETA = 'agentBeta'

type SpecialFeatureFlag =
  typeof PRIVATE_VPS_BETA |
  typeof BACKEND_AUTHOR |
  typeof NIA |
  typeof DEV_SCANNING_BETA |
  typeof CLOUD_STUDIO_BETA |
  typeof STUDIO_SPACES_BETA |
  typeof STUDIO_EXPANSE_DIFF_BETA |
  typeof DEV_SCANNING_INTERNAL_ACCESS |
  typeof DEV_SCANNING_INTERNAL_TOOLS |
  typeof UNLIMITED_WHITE_LABEL_ACCESS |
  typeof AGENT_BETA

export {
  NIA,
  PRIVATE_VPS_BETA,
  BACKEND_AUTHOR,
  DEV_SCANNING_BETA,
  CLOUD_STUDIO_BETA,
  STUDIO_SPACES_BETA,
  STUDIO_EXPANSE_DIFF_BETA,
  DEV_SCANNING_INTERNAL_ACCESS,
  DEV_SCANNING_INTERNAL_TOOLS,
  UNLIMITED_WHITE_LABEL_ACCESS,
  AGENT_BETA,
}

export type {
  SpecialFeatureFlag,
}
