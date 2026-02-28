// @rule(js_binary)
// @attr(commonjs = True)
// @attr(esnext = True)
// @attr(export_library = True)
// @attr(externals = "*")
// @attr(target = "node")
// @package(npm-ecs-build)

import path from 'path'
import type {LoaderContext, LoaderOptionsPlugin} from 'webpack'
import {toUnixPath} from '@nia/reality/shared/studiohub/unix-path'

const makeExport = (srcPath: string) => (
  `module.exports = ${JSON.stringify(toUnixPath(srcPath))};`
)

// Export the asset path as asset content
function assetLoader(this: LoaderContext<LoaderOptionsPlugin>) {
  const srcPath = path.relative(path.join(this.rootContext, 'src'), this.resourcePath)
  const {fs} = this

  // Check if we are loading the .main file in asset bundle
  if (path.basename(this.resourcePath) === '.main') {
    try {
      // Check if .main file is empty
      const mainData = fs.readFileSync!(this.resourcePath, 'utf8').trim()
      if (!mainData) {
        return makeExport(path.dirname(srcPath))
      }

      // Check if the main bundle file exists in the bundle
      const mainBundleFile = path.join(path.dirname(this.resourcePath), mainData)
      if (!fs.statSync!(mainBundleFile)) {
        throw new Error(`Main bundle file does not exist: ${mainBundleFile}`)
      }

      // Export the relative path for the main bundle file
      return makeExport(path.join(path.dirname(srcPath), mainData))
    } catch (err) {
      throw new Error(`Failed to load asset file: ${err}`)
    }
  }

  // Check if we are loading a file within an asset bundle
  if (srcPath.match(/\..*\//)) {
    throw new Error(
      `Asset loader should not be used for files within an asset bundle: ${srcPath}`
    )
  }

  // Export the relative path for a plain asset file
  return makeExport(srcPath)
}

export default assetLoader
