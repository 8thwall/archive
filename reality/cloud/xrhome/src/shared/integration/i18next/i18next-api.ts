import type {TFunction, i18n} from 'i18next'

import type {SupportedLocale8w} from '../../i18n/i18n-locales'

import {entry} from '../../registry'

interface I18NextApi {
  getTranslation: (locale: SupportedLocale8w, namespaces?: string[]) => (
    Promise<{i18n: i18n, t: TFunction}>
  )
}

const I18Next = entry<I18NextApi>('i18next')

export {I18Next}

export type {I18NextApi}
