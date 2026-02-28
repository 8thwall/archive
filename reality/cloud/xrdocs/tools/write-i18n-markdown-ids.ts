/**
 * This script compares all non-English Markdown files (.mdx and .md) in i18n directory files to
 * their English versions, and re-writes the ID at the top if they aren't consistent. The reason we
 * have to do this is to keep URL for our docs from changing between languages which can lead to
 * broken links. Since Crowdin DeepL model and machine translation doesn't respect Markdown
 * Frontend consistency nor is there an easy way to enforce the rule to keep file id consistent for
 * all our translator, this is the easiest approach to keep XrDocs build working for now
 *
*/
import {readdirSync, readFileSync, statSync, writeFileSync, mkdirSync} from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {createObjectCsvWriter} from 'csv-writer'

const appRoot = process.cwd()
const i18nDir = path.join(appRoot, 'i18n')
const languages = readdirSync(i18nDir)
const foreignLangs = languages.filter(lang => lang !== 'en')
const DOC_SUB_PATHS = [
  'docusaurus-plugin-content-docs-account',
  'docusaurus-plugin-content-docs-api',
  'docusaurus-plugin-content-docs-legacy',
  'docusaurus-plugin-content-docs-quickstart',
  'docusaurus-plugin-content-docs-studio',
  'docusaurus-plugin-content-docs',
]

const PLUGIN_TO_SUB_PATHS = {
  'docusaurus-plugin-content-docs': 'legacy',
  'docusaurus-plugin-content-docs-account': 'account',
  'docusaurus-plugin-content-docs-api': 'api',
  'docusaurus-plugin-content-docs-legacy': 'legacy',
  'docusaurus-plugin-content-docs-quickstart': 'quickstart',
  'docusaurus-plugin-content-docs-studio': 'studio',
}

const outputDir = `${__dirname}/output`
mkdirSync(outputDir, {recursive: true})
const errorOutput = `${outputDir}/error-users-${Date.now()}.csv`
const errorLogWriter = createObjectCsvWriter({
  path: errorOutput,
  header: [
    {id: 'fileName', title: 'File Name'},
    {id: 'basePath', title: 'Base Path'},
    {id: 'docSubPath', title: 'Doc Sub Path'},
    {id: 'relativeFilePath', title: 'Relative File Path'},
    {id: 'sourceFilePath', title: 'Source File Path'},
  ],
})

type ErrorIdValues = 'fileName' | 'basePath' | 'docSubPath' | 'relativeFilePath' | 'sourceFilePath'
const errorLogRecords: Record<ErrorIdValues, string>[] = []
const versions: string[] = []

const walkSync = (dir: string, callback: any) => {
  if (!statSync(dir).isDirectory()) {
    return
  }
  const files = readdirSync(dir)
  files.forEach((file) => {
    const filepath = path.join(dir, file)
    const stats = statSync(filepath)
    if (stats.isDirectory()) {
      walkSync(filepath, callback)
    } else {
      callback(filepath)
    }
  })
}

const findDocSubPathInFilePath = (
  filePath: string, relativeFilePath: string
): string | undefined => {
  const isComponentsDir = relativeFilePath.includes('/components/')
  if (isComponentsDir) {
    return 'src'
  }

  const isHomeFile = path.basename(relativeFilePath) === '01-menu.mdx'
  if (isHomeFile) {
    return 'docs'
  }

  return PLUGIN_TO_SUB_PATHS[DOC_SUB_PATHS.find(subPath => filePath.includes(subPath))]
}

const doWrite = (basePath: string) => (file: string) => {
  if (!file.endsWith('.md') && !file.endsWith('.mdx')) {
    return
  }

  const relativeFilePath = file.slice(basePath.length).replace('/current', '')
  const docSubPath = findDocSubPathInFilePath(basePath, relativeFilePath)
  const sourceFilePath = path.join(docSubPath, relativeFilePath)
  try {
    const sourceFileContent = readFileSync(sourceFilePath, 'utf-8')
    const sourceFileMatter = matter(sourceFileContent)
    if (sourceFileMatter.data.id) {
      const fileContent = readFileSync(file, 'utf-8')
      const fileMatter = matter(fileContent)
      fileMatter.data.id = sourceFileMatter.data.id
      writeFileSync(file, matter.stringify(fileMatter.content, fileMatter.data), 'utf8')
    }
  } catch (e) {
    errorLogRecords.push({
      fileName: path.basename(file),
      basePath,
      docSubPath,
      relativeFilePath,
      sourceFilePath,
    })
  }
}

foreignLangs.forEach((lang: string) => {
  const langDir = path.join(i18nDir, lang)
  const langVersions = readdirSync(langDir)
  langVersions.forEach(v => versions.push(path.join(langDir, v)))
})

versions.forEach(v => walkSync(v, doWrite(v)))

errorLogWriter.writeRecords(errorLogRecords).then(() => {
  // eslint-disable-next-line no-console
  console.log(`Error log written to ${errorOutput}`)
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error writing error log:', err)
})
