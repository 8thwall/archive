import { translationConfig } from './translation-config'
import {DefaultCountry, Language} from './translation-engine'

const outputPathForInputPath = (inputPath: string, language: Language) : string => {
  const srcBase = translationConfig.baseDirectorySource()
  const prefix = inputPath.substring(0, srcBase.length)
  const suffix = inputPath.substring(srcBase.length)

  if (prefix !== srcBase) {
    throw new Error(`Input path '${inputPath}' is not contained in '${srcBase}'`)
  }

  const defaultCountry = DefaultCountry[language]
  if (!defaultCountry) {
    throw new Error(`Unsupported language ${language}`)
  }

  const outBase = translationConfig.baseDirectoryOutput()
  const outLocale = translationConfig.localeDirectorySpecifier()
    .replace('{language}', language)
    .replace('{country}', DefaultCountry[language])

  return [outBase, outLocale, suffix].join('/').replace(/\/\//g, '/')
}

export {
  outputPathForInputPath,
}
