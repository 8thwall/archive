import {translateString} from './translate-string'
import {Language} from './translation-engine'

const translateMd = (content: string, language: Language): Promise<string> => {
  // TODO(nbutko): If needed, split long markdown content into chunks, and translate these
  // individually.
  return translateString(content, language)
}

export {
  translateMd
}
