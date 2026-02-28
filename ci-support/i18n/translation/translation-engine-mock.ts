import {TranslationEngine} from './translation-engine'

// A mock translation engine, which returns the original string prefixed with the language. For
// example, "My String" => "ja My String".
const mockTranslationEngine = () : TranslationEngine => ({
  translate: (content, language) => Promise.resolve(`${language} ${content}`),
})

export {
  mockTranslationEngine,
}
