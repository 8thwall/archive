import path from 'path'
import type {Compiler, InputFileSystem} from 'webpack'
import VirtualModulesPlugin from 'webpack-virtual-modules'
import chokidar, {FSWatcher} from 'chokidar'
import {toUnixPath} from '@nia/reality/shared/studiohub/unix-path'

interface ICodeFileImportPlugin {
  srcDir: string
}

const isCodeFile = (file: string) => file.endsWith('.ts') || file.endsWith('.js')
const IGNORED_FOLDERS = ['assets', '.dependencies']

const makeCodeFileImportPlugin = ({srcDir}: ICodeFileImportPlugin) => {
  const virtualModules = new VirtualModulesPlugin()
  const importedFiles: Set<string> = new Set()
  const ignoredFoldersPaths = IGNORED_FOLDERS.map(folder => path.join(srcDir, folder))

  let hasInit = false
  let watcher: FSWatcher | null = null

  const removeImports = (files: string[]) => {
    files.forEach(file => importedFiles.delete(file))
  }

  const updateVirtualModules = () => {
    const appFiles = Array.from(importedFiles).filter(
      file => file === path.join(srcDir, 'app.js') || file === path.join(srcDir, 'app.ts')
    )
    const otherFiles = Array.from(importedFiles).filter(
      file => !appFiles.includes(file)
    )
    const content = [...appFiles, ...otherFiles]
      .map((file) => {
        const relativePath = path.relative(srcDir, file)
        return `import ${JSON.stringify(`./${toUnixPath(relativePath)}`)}`
      })
      .join('\n')
    virtualModules.writeModule(path.join(srcDir, '_imports.js'), content)
  }

  const initFileWatcher = () => {
    if (watcher) {
      return
    }

    watcher = chokidar.watch(srcDir, {
      ignored: filePath => ignoredFoldersPaths.some(folder => filePath.startsWith(folder)),
      persistent: true,
    })

    watcher.on('add', (filePath) => {
      if (isCodeFile(filePath)) {
        importedFiles.add(filePath)
        updateVirtualModules()
      }
    })
  }

  const closeFileWatcher = () => {
    if (watcher) {
      watcher.close()
      watcher = null
    }
  }

  const getCodeFiles = (fs: InputFileSystem, dir: string) => {
    const files = fs.readdirSync!(dir)
    files.forEach((file) => {
      const fullPath = path.join(dir, file)
      try {
        if (fs.lstatSync!(fullPath).isDirectory()) {
          if (!IGNORED_FOLDERS.includes(file)) {
            getCodeFiles(fs, fullPath)
          }
        } else if (isCodeFile(fullPath)) {
          importedFiles.add(fullPath)
        }
      } catch (err) {
        // ignore virtual files
      }
    })
  }

  const apply = (compiler: Compiler) => {
    compiler.hooks.watchRun.tap('CodeFileImportPlugin', (compilation) => {
      const {removedFiles} = compilation

      if (!hasInit) {
        hasInit = true
        initFileWatcher()
      }

      if (removedFiles) {
        const removedCodeFiles = Array.from(removedFiles).filter(isCodeFile)
        if (removedCodeFiles.length > 0) {
          removeImports(removedCodeFiles)
          updateVirtualModules()
        }
      }
    })

    compiler.hooks.shutdown.tap('CodeFileImportPlugin', () => {
      closeFileWatcher()
    })

    compiler.hooks.beforeCompile.tapAsync('CodeFileImportPlugin', (_, callback) => {
      if (!compiler.watching && !hasInit) {
        getCodeFiles(compiler.inputFileSystem!, srcDir)
        updateVirtualModules()
        hasInit = true
      }
      callback()
    })

    virtualModules.apply(compiler)
  }

  return {apply}
}
export default makeCodeFileImportPlugin
