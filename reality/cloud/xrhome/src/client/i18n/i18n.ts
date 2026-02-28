import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'

import LazyImportPlugin from './lazy-import-plugin'
import I18nMigrationDebugPlugin from './i18n-migration-debug-plugin'
import {
  FALLBACK_LOCALE,
  getSupportedLocales8w,
} from '../../shared/i18n/i18n-locales'
import {chooseDefaultLanguage} from './choose-default-language'
import {shouldLoadLightship} from '../lightship/common/lightship-settings'
import {SUPPORTED_LOCALES_LIGHTSHIP} from '../../shared/i18n/i18n-constants'

const I18N_DEBUG = false

i18n
  .use(initReactI18next)
  .use(LazyImportPlugin)
  .use(I18nMigrationDebugPlugin)
  .init({
    lng: chooseDefaultLanguage(),
    fallbackLng: FALLBACK_LOCALE,
    // TODO(alvinp): Properly decouple lightship and 8th wall i18n configurations.
    supportedLngs: shouldLoadLightship() ? SUPPORTED_LOCALES_LIGHTSHIP : getSupportedLocales8w(),
    ns: [],
    interpolation: {
      escapeValue: false,
    },
    postProcess: I18N_DEBUG ? ['i18nMigrationDebug'] : [],
  })
