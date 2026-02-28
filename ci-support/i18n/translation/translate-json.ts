import {translateString} from './translate-string'
import {Language} from './translation-engine'

const translateJson = async (content: string, language: Language): Promise<string> => {
  // Read JSON as a record of key / value pairs.
  const stringMap = JSON.parse(content) as Record<string, string>

  // Convert these to an array of Promise<[key, translated value]>)
  const translationPromises = Object.entries(stringMap).map(([k, v]) => (
    Promise.all([k, translateString(v, language)])
  ))

  // Wait for all translations to finish.
  const translations = await Promise.all(translationPromises)

  // Convert key / translated value pairs back to json.
  return JSON.stringify(Object.fromEntries(translations), null, 2)
}

export {
  translateJson
}
