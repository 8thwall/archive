import path from 'path'
import type {Compiler, InputFileSystem} from 'webpack'
import VirtualModulesPlugin from 'webpack-virtual-modules'

interface IDependencyImportPlugin {
  srcDir: string
  buildDir: string
}

const makeDependencyImportPlugin = ({srcDir, buildDir}: IDependencyImportPlugin) => {
  const srcDependencyDir = path.join(srcDir, '.dependencies')
  const buildDependencyDir = path.join(buildDir, 'modules')
  const virtualModules = new VirtualModulesPlugin()

  const makeDependencyPath = (alias: string) => path.join(buildDependencyDir, `${alias}.js`)

  let previousDependencies: Set<string> = new Set()

  const makeRuntimeImport = (moduleId: string) => (
    `module.exports = window.Modules8.getModule(${JSON.stringify({moduleId})});`
  )

  const makeErrorImport = (alias: string) => (
    `throw new Error("Dependency ${alias} not found.");`
  )

  const updateDependencyImports = (fs: InputFileSystem) => {
    if (!fs) {
      throw new Error('InputFileSystem is not available')
    }

    let dependencyFiles: string[]
    try {
      dependencyFiles = fs.readdirSync!(srcDependencyDir)
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        // Return if src/.dependencies doesn't exist
        return
      }
      throw err
    }

    // iterate through the folder to generate virtual module for each dependency json
    const dependencyWrappers: Record<string, string> = {}
    const currentDependencies = new Set<string>()

    dependencyFiles.forEach((file) => {
      const filePath = path.join(srcDependencyDir, file)
      try {
        const content = fs.readFileSync!(filePath, 'utf8')
        const {alias, moduleId} = JSON.parse(content)
        dependencyWrappers[makeDependencyPath(alias)] = makeRuntimeImport(moduleId)
        currentDependencies.add(alias)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Failed to parse dependency file: ${filePath}`, e)
      }
    })

    // check for removed dependencies
    previousDependencies.forEach((alias) => {
      if (!currentDependencies.has(alias)) {
        // NOTE(cindyhu): There isn't a direct way to remove a virtual module after creating one, so
        // having it throw an error to signal users there are still imports to deleted modules.
        dependencyWrappers[makeDependencyPath(alias)] = makeErrorImport(alias)
      }
    })

    Object.entries(dependencyWrappers).forEach(([fileName, fileContent]) => {
      virtualModules.writeModule(fileName, fileContent)
    })

    previousDependencies = currentDependencies
  }

  const apply = (compiler: Compiler) => {
    compiler.hooks.afterCompile.tap('DependencyImportPlugin', (compilation) => {
      compilation.contextDependencies.add(srcDependencyDir)
    })

    compiler.hooks.watchRun.tap('DependencyImportPlugin', (compilation) => {
      const {modifiedFiles} = compilation
      if (
        !modifiedFiles || Array.from(modifiedFiles).some(file => file.startsWith(srcDependencyDir))
      ) {
        updateDependencyImports(compiler.inputFileSystem!)
      }
    })

    compiler.hooks.beforeCompile.tapAsync('DependencyImportPlugin', (_, callback) => {
      if (!compiler.watching) {
        updateDependencyImports(compiler.inputFileSystem!)
      }
      callback()
    })

    virtualModules.apply(compiler)
  }

  return {apply}
}
export default makeDependencyImportPlugin
