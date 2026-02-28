import fs from 'node:fs'
import path from 'node:path'

import type {
  ProcessedTooltipData, RuntimeTooltipData,
} from '../../../../c8/ecs/src/shared/tooltip-types'

// Usage:
// - npx ts-node generate-tables.ts

/* eslint-disable no-console */

const root = path.join(__dirname, '../../../..')
const docsDir = path.join(root, 'reality/cloud/xrdocs')
const xrhomeDir = path.join(root, 'reality/cloud/xrhome')
const ecsDir = path.join(root, 'c8/ecs')

const runtimeTooltipDataPath = path.join(ecsDir, 'gen/runtime-tooltip-data.json')

const makeTooltipStringsPath = (language: string) => (
  path.join(xrhomeDir, 'src', 'client', 'i18n', language, 'studio-tooltips.json')
)

const makeDocsGenPath = (language: string) => {
  if (language === 'en-US') {
    return path.join(docsDir, 'gen')
  }
  return path.join(docsDir, 'i18n', language.split('-')[0],
    'docusaurus-plugin-content-docs-api', 'gen')
}

const makeDocsTablePath = (language: string, runtimeAccessor: string) => (
  path.join(makeDocsGenPath(language), 'tables', `${runtimeAccessor}.md`)
)

const DOCS_LANGUAGES = [
  'en-US',
  'de-DE',
  'es-MX',
  'fr-FR',
  'ja-JP',
] as const

const run = () => {
  const res: RuntimeTooltipData = JSON.parse(fs.readFileSync(runtimeTooltipDataPath, 'utf8'))

  const languageStrings = DOCS_LANGUAGES.reduce((acc, language) => {
    fs.rmSync(makeDocsGenPath(language), {recursive: true, force: true})
    const stringsPath = makeTooltipStringsPath(language)
    const stringsContent = fs.readFileSync(stringsPath, 'utf8')
    acc[language] = JSON.parse(stringsContent)
    return acc
  }, {} as Record<typeof DOCS_LANGUAGES[number], ProcessedTooltipData['strings']>)

  const TABLE_HEADERS = {
    'en-US': 'Property | Type | Default | Description',
    'de-DE': 'Eigentum | Typ | Standard | Beschreibung',
    'es-MX': 'Propiedad | Tipo | Por defecto | Descripción',
    'fr-FR': 'Propriété | Type | Défaut | Description',
    'ja-JP': 'プロパティ | タイプ | デフォルト | 説明',
  } as const

  Object.keys(res.components).forEach((runtimeAccessor) => {
    const properties = Object.values(res.propertiesByRuntime)
      .filter(e => e.accessor === runtimeAccessor)
    DOCS_LANGUAGES.forEach((language) => {
      const tableRows = properties.map((property) => {
        const {name, type, defaultValue, textKey} = property
        if (!textKey) {
          return ''
        }
        const description = languageStrings['en-US'][textKey]
        if (!description) {
          throw new Error(`Missing description for: ${runtimeAccessor}.${name}`)
        }
        return `| ${name} | \`${type}\` | \`${defaultValue || ''}\` | ${description || ''} |`
      })

      const tableContent = `\
${TABLE_HEADERS[language]}
| :- | :- | :- | :- |
${tableRows.filter(Boolean).join('\n')}
`

      const tablePath = makeDocsTablePath(language, runtimeAccessor)
      fs.mkdirSync(path.dirname(tablePath), {recursive: true})
      fs.writeFileSync(tablePath, tableContent, 'utf8')
    })
  })
}

run()
