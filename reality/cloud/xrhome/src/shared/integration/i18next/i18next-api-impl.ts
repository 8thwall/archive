import i18n, {i18n as i18nInstance} from 'i18next'

import {FALLBACK_LOCALE, getSupportedLocales8w, SupportedLocale8w} from '../../i18n/i18n-locales'
import type {I18NextApi} from './i18next-api'
import {loadSSRI18nResources} from '../../../server/i18n/ssr-i18n-resources'

type i18NextInstances = Record<SupportedLocale8w, i18nInstance>

const createI18NextInstances = async (): Promise<i18NextInstances> => {
  const supportedLanguages = getSupportedLocales8w()

  i18n
    .init({
      debug: false,
      fallbackLng: FALLBACK_LOCALE,
      load: 'currentOnly',
      supportedLngs: supportedLanguages,
      interpolation: {
        escapeValue: false,
      },
    })

  const i18nInstances = {} as i18NextInstances
  await Promise.all(supportedLanguages.map(async (locale: SupportedLocale8w) => {
    // Create SSR I18n resources for each supported language
    await loadSSRI18nResources(i18n, locale)
    i18nInstances[locale] = i18n.cloneInstance({lng: locale})
  }))

  return i18nInstances
}

const loadServerI18nResources = async (
  instance: i18nInstance, namespace: string
): Promise<void> => {
  if (!instance.hasResourceBundle(instance.language, namespace)) {
    const translations =
      await import(`../../../server/i18n/${instance.language}/${namespace}.json`)
    instance.addResources(instance.language, namespace, {...translations})
  }
}

const createI18Next = async (): Promise<I18NextApi> => {
  const i18nInstances = await createI18NextInstances()

  const getTranslation = async (locale: SupportedLocale8w, namespaces = null) => {
    const returnedI18nInstance = i18nInstances[locale]

    if (Array.isArray(namespaces)) {
      await Promise.all(namespaces.map(ns => loadServerI18nResources(returnedI18nInstance, ns)))
    }

    const defaultNamespace = namespaces ? namespaces[0] : namespaces

    return {
      i18n: returnedI18nInstance,
      t: returnedI18nInstance.getFixedT('en-US', defaultNamespace),
    }
  }

  return {
    getTranslation,
  }
}

export {
  createI18Next,
}
