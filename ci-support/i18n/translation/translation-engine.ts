// Language code: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
const enum Language {
  EN = 'en',
  FR = 'fr',
  JA = 'ja',
}

const DefaultCountry = {
  [Language.EN]: 'US',
  [Language.FR]: 'FR',
  [Language.JA]: 'JP',
}

// Interface for an engine that does translation. This should be set at runtime on the Translation
// Config. This can be e.g. a Mock used for tests, or it can use some backend service under the
// hood, e.g. ChatGPT or Google Translate or DeepL.
interface TranslationEngine {
  translate: (string, Language) => Promise<string>,
}

export {
  DefaultCountry,
  Language,
  TranslationEngine,
}
