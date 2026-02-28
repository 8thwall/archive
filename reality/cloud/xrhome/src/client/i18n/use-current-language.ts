import {useState, useEffect, useContext} from 'react'
import {I18nContext, getI18n} from 'react-i18next'

const useCurrentLanguage = () => {
  // Attempt to get the i18n instance from the I18nextProvider
  // otherwise use the global instance.
  const i18nGlobal = getI18n()
  const {i18n: i18nFromContext} = useContext(I18nContext) || {}
  const i18n = i18nFromContext || i18nGlobal

  const [currentLang, setcurrentLang] = useState(i18n.language)

  useEffect(() => {
    const handleChange = (lng: string) => {
      setcurrentLang(lng)
    }

    i18n.on('languageChanged', handleChange)

    return () => i18n.off('languageChanged', handleChange)
  }, [])

  return currentLang
}

export {useCurrentLanguage}
