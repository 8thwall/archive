import {TranslationEngine} from './translation-engine'

type TranslationContentType = 'json' | 'md'

interface TranslationConfigData {
  baseDirectoryOutput: null | string,
  baseDirectorySource: null | string,
  contentType: null | TranslationContentType,
  localeDirectorySpecifier: null | string,
  translationEngine: null | TranslationEngine,
}

interface TranslationConfig {
  baseDirectoryOutput: () => string,
  baseDirectorySource: () => string,
  contentType: () => TranslationContentType,
  localeDirectorySpecifier: () => string,
  translationEngine: () => TranslationEngine,
}

const GLOBAL_TRANSLATION_CONFIG_DEFAULTS : TranslationConfigData = {
  baseDirectoryOutput: null,
  baseDirectorySource: null,
  contentType: null,
  localeDirectorySpecifier: null,
  translationEngine: null
}

const GLOBAL_TRANSLATION_CONFIG = Object.assign({}, GLOBAL_TRANSLATION_CONFIG_DEFAULTS)

// Set the configuration used for translation. This modifies global state.
const setTranslationConfig = (config : Partial<TranslationConfigData>) => {
  Object.assign(GLOBAL_TRANSLATION_CONFIG, config)
}

// Get the currently configured translation global state.
const translationConfig : TranslationConfig = {
  baseDirectoryOutput: () => {
    if (!GLOBAL_TRANSLATION_CONFIG.baseDirectoryOutput) {
      throw new Error('No output base directory configured.')
    }
    return GLOBAL_TRANSLATION_CONFIG.baseDirectoryOutput
  },
  baseDirectorySource: () => {
    if (!GLOBAL_TRANSLATION_CONFIG.baseDirectorySource) {
      throw new Error('No source base directory configured.')
    }
    return GLOBAL_TRANSLATION_CONFIG.baseDirectorySource
  },
  contentType: () => {
    if (!GLOBAL_TRANSLATION_CONFIG.contentType) {
      throw new Error('No contentType configured.')
    }
    return GLOBAL_TRANSLATION_CONFIG.contentType
  },
  localeDirectorySpecifier: () => {
    if (!GLOBAL_TRANSLATION_CONFIG.localeDirectorySpecifier) {
      throw new Error('No locale directory specifier configured.')
    }
    return GLOBAL_TRANSLATION_CONFIG.localeDirectorySpecifier
  },
  translationEngine: () => {
    if (!GLOBAL_TRANSLATION_CONFIG.translationEngine) {
      throw new Error('No translation engine was configured.')
    }
    return GLOBAL_TRANSLATION_CONFIG.translationEngine
  },
}

// Return the global translation config to its original settings.
const clearTranslationConfig = () => {
  Object.assign(GLOBAL_TRANSLATION_CONFIG, GLOBAL_TRANSLATION_CONFIG_DEFAULTS)
}

export {
  clearTranslationConfig,
  setTranslationConfig,
  translationConfig,
  TranslationContentType,
}
