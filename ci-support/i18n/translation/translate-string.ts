import {translationConfig} from './translation-config'
import {Language} from './translation-engine'

const translateString = (content: string, language: Language): Promise<string> => (
  translationConfig.translationEngine().translate(content, language)
)

export {
  translateString
}
