// @rule(js_binary)
// @attr(export_library = 1)
// @attr(externals = "*")
// @attr(target = "node")
// @package(npm-ecs-build)
// @attr(esnext = 1)
// @attr(commonjs = 1)
import {execSync} from 'child_process'
import path from 'path'

import {getArgs} from '../../../../../c8/cli/args'

const buildDir = path.resolve(__dirname, '..')
let serveMode = false

const args = getArgs()

if (args.serve) {
  serveMode = true
}

const webpackConfig = path.join(buildDir, 'lib/webpack-local.js')
const command = serveMode
  ? `npx webpack-dev-server -c "${webpackConfig}" --port ${args.port || 9002}`
  : `npx webpack -c "${webpackConfig}"`

try {
  execSync(command, {stdio: 'inherit'})
} catch (err) {
  process.exit(err.status || 1)
}
