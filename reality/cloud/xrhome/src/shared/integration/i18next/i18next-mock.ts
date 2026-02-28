import type {i18n as i18nInstance} from 'i18next'

import {getSupportedLocales8w, SupportedLocale8w} from '../../i18n/i18n-locales'
import type {I18NextApi} from './i18next-api'

type i18NextInstances = Record<SupportedLocale8w, i18nInstance>

const makeThrowFunction = name => (() => {
  const msg = `Called mocked ${name} without stubbing`
  // Log and throw in case there is a try/catch
  // eslint-disable-next-line no-console
  console.error(msg)
  throw new Error(msg)
})

const createI18NextMockInstance = (): i18nInstance => {
  const instance = {
    hasResourceBundle: makeThrowFunction('hasResourceBundle'),
    t: makeThrowFunction('t'),
  }

  return (instance as unknown) as i18nInstance
}

const createI18NextInstances = (): i18NextInstances => {
  const supportedLanguages = getSupportedLocales8w()

  const i18nInstances = {} as i18NextInstances
  supportedLanguages.forEach((lng: SupportedLocale8w) => {
    i18nInstances[lng] = createI18NextMockInstance()
  })

  return i18nInstances
}

const createI18NextMock = (): I18NextApi => {
  const i18nInstances = createI18NextInstances()

  const getTranslation = async (locale: SupportedLocale8w) => {
    const returnedI18nInstance = i18nInstances[locale]

    return {
      i18n: returnedI18nInstance,
      t: returnedI18nInstance.t,
    }
  }

  return {
    getTranslation,
  }
}

export {
  createI18NextMock,
}
