import path from 'path'
import type {Compiler, InputFileSystem} from 'webpack'
import VirtualModulesPlugin from 'webpack-virtual-modules'
import {toUnixPath, UnixPath} from '@nia/reality/shared/studiohub/unix-path'

interface AssetManifestPluginOptions {
  srcDir: string
  assetManifestPath: string
}

type AssetManifest = {
  assets: { [key: UnixPath]: UnixPath }
}

class AssetManifestPlugin {
  private srcDir: string

  private assetManifestPath: string

  private virtualModules: VirtualModulesPlugin

  constructor(options: AssetManifestPluginOptions) {
    this.srcDir = options.srcDir
    this.assetManifestPath = options.assetManifestPath
    this.virtualModules = new VirtualModulesPlugin()
  }

  private getAssetBundleFolders(fs: InputFileSystem, dir: string): string[] {
    let results: string[] = []
    const list = fs.readdirSync!(dir)
    list.forEach((file) => {
      const fullPath = path.join(dir, file)
      if (fs.lstatSync!(fullPath).isDirectory()) {
        if (file.includes('.')) {
          results.push(path.relative(this.srcDir, fullPath))
        }
        results = results.concat(this.getAssetBundleFolders(fs, fullPath))
      }
    })
    return results
  }

  private getMainBundleFilePath(fs: InputFileSystem, bundleFolderPath: string): UnixPath | null {
    const fullBundleFolderPath = path.join(this.srcDir, bundleFolderPath)
    const mainPointerPath = path.join(fullBundleFolderPath, '.main')
    try {
      fs.statSync!(mainPointerPath)
    } catch (err) {
      throw new Error(`.main file does not exist in asset bundle: ${bundleFolderPath}`)
    }

    const mainData = fs.readFileSync!(mainPointerPath, 'utf8').trim()
    if (!mainData) {
      return null
    }

    const mainBundleFile = path.join(fullBundleFolderPath, mainData)
    try {
      fs.statSync!(mainBundleFile)
    } catch (err) {
      throw new Error(`Main bundle file does not exist: ${mainBundleFile}`)
    }

    return toUnixPath(`/${bundleFolderPath}/${mainData}`)
  }

  private updateAssetManifest(fs: InputFileSystem) {
    const assetManifest: AssetManifest = {assets: {}}
    const assetDirPath = path.join(this.srcDir, 'assets')
    const assetBundleFolders = this.getAssetBundleFolders(fs, assetDirPath)

    assetBundleFolders.forEach((bundleFolder) => {
      try {
        const mainBundleFilePath = this.getMainBundleFilePath(fs, bundleFolder)
        if (mainBundleFilePath) {
          assetManifest.assets[toUnixPath(bundleFolder)] = mainBundleFilePath
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Error importing asset bundle: ${bundleFolder}`, err)
      }
    })

    const manifestContent = JSON.stringify(assetManifest, null, 2)
    const virtualModuleContent = `
      if (window.ecs.assets.setAssetManifest) {
        window.ecs.assets.setAssetManifest(${manifestContent});
      }
    `
    this.virtualModules.writeModule(this.assetManifestPath, virtualModuleContent)
  }

  apply(compiler: Compiler) {
    const assetsDir = path.join(this.srcDir, 'assets', path.sep)
    compiler.hooks.watchRun.tap('AssetManifestPlugin', (compilation) => {
      const {modifiedFiles} = compilation
      if (!modifiedFiles || Array.from(modifiedFiles).some(file => file.startsWith(assetsDir))) {
        this.updateAssetManifest(compilation.inputFileSystem!)
      }
    })

    compiler.hooks.beforeCompile.tapAsync('AssetManifestPlugin', (compilation, callback) => {
      if (!compiler.watching) {
        this.updateAssetManifest(compiler.inputFileSystem!)
      }
      callback()
    })

    this.virtualModules.apply(compiler)
  }
}

export default AssetManifestPlugin
