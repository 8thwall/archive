import {Lang, parse, SgNode} from '@ast-grep/napi'
import {execSync} from 'node:child_process'
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {basename, dirname, join, relative, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {generate} from 'ts-to-zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const gitRoot = execSync('git rev-parse --show-toplevel', {encoding: 'utf-8'}).trim()

const ensureOutputPath = (filename: string) => {
  const relativePath = relative(process.cwd(), resolve(__dirname, `../src/schema/ecs/${filename}`))
  const dir = dirname(relativePath)
  mkdirSync(dir, {recursive: true})
  return relativePath
}

const createZodContents = (filename: string) => {
  // ts-to-zod expects relative paths
  const inputPath = relative(process.cwd(), join(gitRoot, 'c8/ecs/src/shared', filename))
  console.log(`Generating ${basename(inputPath)}...`)
  const generated = generate({sourceText: readFileSync(inputPath, 'utf-8')})
  return generated.getZodSchemasFile(inputPath)
}

const createExportStatement = (root: SgNode) => {
  const nodes = root.findAll('const $VAR = $VAL')
  const constants = nodes
    .map(node => node.getMatch('VAR')?.text())
    .filter(e => e !== undefined)
  return `
export {
  ${constants.join(',\n  ')},
}`
}

const replaceNewlinesWithSpaces = (root: SgNode) => root.findAll('$A.describe($B)').map((node) => {
  const descriptionNode = node.getMatch('B')
  if (!descriptionNode) {
    return undefined
  }

  const description = descriptionNode?.text()
  const newDescription = description.replace(/\\n+/g, ' ')
  return descriptionNode.replace(newDescription)
})
  .filter(e => e !== undefined)

// Fix-ups:
//   - Create export statement
const createFlexStyleTypesFile = () => {
  const filename = 'flex-style-types.ts'
  const contents = createZodContents(filename)
  const ast = parse(Lang.TypeScript, contents)
  const root = ast.root()
  const exportStatement = createExportStatement(root)
  const outputPath = ensureOutputPath(filename)
  writeFileSync(outputPath, contents.concat(exportStatement))
  return outputPath
}

// Fix-ups:
//   - Fix FlexStyles import
//   - Fix prefabInstanceDeletionsSchema
//   - Fix FlexStyles usage
//   - Replace newlines in description with spaces
//   - Create export statement
const createSceneGraphFile = () => {
  const filename = 'scene-graph.ts'
  const contents = createZodContents(filename)
  const ast = parse(Lang.TypeScript, contents)
  const root = ast.root()

  const importNode = root.find({
    rule: {
      pattern: 'import $$$IMPORTS from "$SOURCE"',
      kind: 'import_statement',
    },
    constraints: {
      SOURCE: {
        // Ignore the zod import
        regex: '^\\.',
      },
    },
  })
  const importPath = importNode?.getMatch('SOURCE')?.text()
  const importEdit = importNode?.replace(`import * as FlexStyles from "${importPath}"`)

  const prefabInstanceDeletionsNode = root.find('const prefabInstanceDeletionsSchema = $VAL')
  const prefabInstanceDeletionsEdit = prefabInstanceDeletionsNode
    ?.getMatch('VAL')
    ?.replace('z.record(z.string(), z.literal(true))')

  const flexStyleNodes = root.findAll('z.literal(FlexStyles.$TYPE)')
  const flexStyleEdits = flexStyleNodes.map((node) => {
    const pascalCaseType = node.getMatch('TYPE')?.text()
    if (!pascalCaseType) {
      return undefined
    }
    const camelCaseType = pascalCaseType.charAt(0).toLowerCase() + pascalCaseType.slice(1)
    return node.replace(`FlexStyles.${camelCaseType}Schema`)
  })

  const spaceEdits = replaceNewlinesWithSpaces(root)
  const exportStatement = createExportStatement(root)

  const fixedContents = root.commitEdits(
    [importEdit, prefabInstanceDeletionsEdit, ...flexStyleEdits, ...spaceEdits].filter(
      e => e !== undefined
    )
  )

  const outputPath = ensureOutputPath(filename)
  writeFileSync(outputPath, fixedContents.concat(exportStatement))
  return outputPath
}

const run = async () => {
  const files = [
    createFlexStyleTypesFile(),
    createSceneGraphFile(),
  ]
  execSync(`${gitRoot}/eslint.sh --fix ${files.join(' ')}`, {stdio: 'inherit'})
}

run()
