/* eslint-disable no-console */
// @rule(js_binary)
// @attr(export_library = 1)
// @attr(externals = "*")
// @attr(target = "node")
// @package(npm-ecs-build)
// @attr(esnext = 1)
// @attr(commonjs = 1)
import fs from 'fs'
import path from 'path'

import {getArgs} from '@nia/c8/cli/args'
import {parseComponentAst} from '@nia/c8/ecs/src/shared/parse-component-ast'

const args = getArgs()
const componentFile = args._ordered[0]

if (!componentFile) {
  console.error('Usage: npx 8w-validate-ecs <component-file.ts>')
  console.error('Example: npx 8w-validate-ecs src/components/my-component.ts')
  process.exit(1)
}

const filePath = path.resolve(componentFile)

if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found: ${filePath}`)
  process.exit(1)
}

try {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const result = parseComponentAst(fileContent)

  if (result.errors.length > 0) {
    console.error(`Found ${result.errors.length} error(s):`)
    result.errors.forEach((error) => {
      const location = error.location
        ? `[${error.location.startLine}:${error.location.startColumn}]`
        : ''
      console.error(`${error.severity.toUpperCase()}${location}: ${error.message}`)
    })
    process.exit(1)
  } else {
    console.log('Validation passed with 0 errors.')
  }
} catch (error) {
  console.error(`Failed to parse component file: ${error.message}`)
  process.exit(1)
}
