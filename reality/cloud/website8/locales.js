const {join} = require('path')
const {readdirSync, lstatSync} = require('fs')

const DEFAULT_LANGUAGE = 'en-US'

// These must be explicitly added.
const PROD_LANGUAGES = [
  'en-US',
  'ja-JP',
  'fr-FR',
  'de-DE',
  'es-MX',
  // Add here to support more locales in staging and production
]

// based on the directories get the language codes
const languagesFromDirectories = readdirSync(join(__dirname, 'src/i18n')).filter((fileName) => {
  const joinedPath = join(join(__dirname, 'src/i18n'), fileName)
  const isDirectory = lstatSync(joinedPath).isDirectory()
  return isDirectory
})

const DEV_LANGUAGES = languagesFromDirectories

const SUPPORTED_LANGUAGES = process.env.NODE_ENV === 'production' ? PROD_LANGUAGES : DEV_LANGUAGES

module.exports = {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
}
