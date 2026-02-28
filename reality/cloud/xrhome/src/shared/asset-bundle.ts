import isEqual from 'lodash/isEqual'
import type {DeepReadonly} from 'ts-essentials'

type AssetBundleParams = {
  files: Record<string, string>
}

type AssetBundleFileList = Array<{filePath: string, assetPath: string}>

const assetBundleParamsEqual = (
  a: DeepReadonly<AssetBundleParams>,
  b: DeepReadonly<AssetBundleParams>
) => isEqual(a.files, b.files)

type AssetBundleActions = {
  getRemoteAssetHash: (file: string) => Promise<string>
  getFileHash: (file: string) => Promise<string>
  upload: (file: string) => Promise<string>
}

type UpsertAssetBundleOptions = {
  base: DeepReadonly<AssetBundleParams> | undefined
  paths: string[]
  actions: AssetBundleActions
}

const upsertAssetBundle = async (options: UpsertAssetBundleOptions): Promise<AssetBundleParams> => {
  const {base, paths, actions} = options

  const newBundle: AssetBundleParams = {
    files: {},
  }

  await Promise.all(paths.map(async (file) => {
    const prevPath = base?.files[file]

    if (prevPath) {
      const [existingHash, newHash] = await Promise.all([
        actions.getRemoteAssetHash(prevPath),
        actions.getFileHash(file),
      ])

      if (existingHash === newHash) {
        newBundle.files[file] = prevPath
        return
      }
    }
    newBundle.files[file] = await actions.upload(file)
  }))

  return newBundle
}

const assetBundleParamsToFileList = (
  params: DeepReadonly<AssetBundleParams>
): AssetBundleFileList => Object.entries(params.files).map(([filePath, assetPath]) => ({
  filePath,
  assetPath,
}))

export {
  assetBundleParamsEqual,
  upsertAssetBundle,
  assetBundleParamsToFileList,
  AssetBundleActions,
  UpsertAssetBundleOptions,
}
