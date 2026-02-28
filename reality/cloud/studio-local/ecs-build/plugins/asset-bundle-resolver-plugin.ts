import path from 'path'
import {promisify} from 'util'
import type {Resolver} from 'webpack'

type StatResult = {
  isDirectory: () => boolean
  isFile: () => boolean
}

interface AssetBundleResolverPluginOptions {
  srcPath: string
}

class AssetBundleResolverPlugin {
  private srcPath: string

  private assetPath: string

  constructor(options: AssetBundleResolverPluginOptions) {
    this.srcPath = options.srcPath
    this.assetPath = path.join(this.srcPath, 'assets')
  }

  private async getMainAssetBundleFile(
    fullPath: string, resolver: Resolver
  ): Promise<string | null> {
    if (!fullPath) {
      throw new Error('Request path is undefined')
    }
    // Check if it's an asset folder under /src/assets
    if (!fullPath.startsWith(this.assetPath)) {
      return null
    }

    const statAsync = promisify<string, StatResult | undefined>(resolver.fileSystem.stat)

    const fullPathStat = await statAsync(fullPath)
    // Check if the path is an asset bundle folder (is a folder and has dot in name)
    if (!fullPathStat!.isDirectory() || !path.basename(fullPath).includes('.')) {
      return null
    }

    // Check if the main pointer file exists in the bundle
    const mainPointerPath = path.join(fullPath, '.main')
    const mainPointerStat = await statAsync(mainPointerPath)
    if (!mainPointerStat!.isFile()) {
      throw new Error(`Invalid import: ${mainPointerPath} does not exist`)
    }
    return mainPointerPath
  }

  apply(resolver: Resolver) {
    resolver.getHook('resolve').tapAsync(
      'AssetBundleResolverPlugin',
      async (request, resolveContext, callback) => {
        try {
          const fullPath = path.resolve(request.path! || '', request.request!)
          const mainFilePath = await this.getMainAssetBundleFile(fullPath, resolver)
          if (mainFilePath) {
            resolver.doResolve(
              resolver.getHook('resolved'),
              {
                ...request,
                path: mainFilePath,
                request: mainFilePath,
              },
              `Resolved asset bundle ${fullPath} to ${mainFilePath}`,
              resolveContext,
              callback
            )
          } else {
            callback()
          }
        } catch (err: Error | any) {
          callback(err)
        }
      }
    )
  }
}

export default AssetBundleResolverPlugin
