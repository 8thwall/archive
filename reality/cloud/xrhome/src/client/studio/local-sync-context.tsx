import React from 'react'
import type {DeepReadonly} from 'ts-essentials'
import {useTranslation} from 'react-i18next'
import PATH from 'path'

import type {
  LocalSyncMessage, LocalSyncFileChanged, LocalSyncDirChanged, LocalSyncAssetChanged,
  LocalSyncInvalidFile, FileSnapshotResponse,
} from '../../shared/studiohub/local-sync-types'
import {useCurrentGit} from '../git/hooks/use-current-git'
import {isAssetPath, isFolderPath, isTextPath} from '../common/editor-files'
import {useEvent} from '../hooks/use-event'
import {
  initializeLocal, watchLocal, stopWatchLocal, pushFile, getFileStateSnapshot, deleteLocalFile,
  pullSrcFile, getFileHash, pullAssetFile, getProjectStatus, setProjectInitialized,
  listFileDirectory,
} from './local-sync-api'
import useCurrentApp from '../common/use-current-app'
import useActions from '../common/use-actions'
import coreGitActions from '../git/core-git-actions'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import {retrieveAssetBlob} from '../common/download-utils'
import {
  parse as parseAsset, isBundle, BundleAssetPointer, AssetPointer,
} from '@nia/reality/shared/asset-pointer'
import type {IGit} from '../git/g8-dto'
import {getWebsocketChannelName} from '../common/hosting-urls'
import {useSaveSemaphore} from '../editor/hooks/save-challenge-semaphore'
import {basename, dirname} from '../editor/editor-common'
import gitUploadActions from '../git/git-upload-actions'
import {useStudioStateContext} from './studio-state-context'
import {
  assetBundleParamsEqual, assetBundleParamsToFileList, upsertAssetBundle,
  AssetBundleActions, UpsertAssetBundleOptions,
} from '../../shared/asset-bundle'

type FileSyncStatus =
| 'checking'  // Checking what the local state is
| 'needs-initialization'  // We need to push redux changes to local
| 'initialized'  // Local sync was already initialized, ready to start listening
| 'listening'  // Listening for local changes
| 'active'  // Actively syncing files, changes are being processed

type ILocalSyncContext = {
  appKey: string
  localBuildUrl?: string
  localBuildRemoteUrl?: string
  assetVersions: Record<string, string>
  fileSyncStatus: FileSyncStatus
}

const LocalSyncContext = React.createContext<ILocalSyncContext | null>(null)

const useLocalSyncContext = () => {
  const ctx = React.useContext(LocalSyncContext)
  if (!ctx) {
    throw new Error('useLocalSyncContext must be used within a LocalSyncContextProvider')
  }
  return ctx
}

const shouldSyncFile = (path: string) => (
  !isFolderPath(path) && (isTextPath(path, () => false) || isAssetPath(path))
)

type PendingWrites = Record<string, 'redux' | 'disk'>
type PendingWritesRef = {current: PendingWrites | undefined}

const clearPendingWrite = (pendingWrites: PendingWritesRef, path: string) => {
  if (!pendingWrites.current) {
    return
  }
  delete pendingWrites.current[path]
}
const getPendingWrite = (pendingWrites: PendingWritesRef, path: string) => {
  if (!pendingWrites.current) {
    return undefined
  }
  return pendingWrites.current[path]
}

// NOTE(christoph): Accepts 'assets/textures/my-bundle.cubemap/negx.png' and returns
// ['assets/textures/my-bundle.cubemap', 'negx.png']
const decomposeAssetBundlePath = (diskPath: string) => {
  if (!isAssetPath(diskPath)) {
    return null
  }

  let folderPath = dirname(diskPath)
  if (!folderPath.includes('.')) {
    return null
  }

  while (folderPath) {
    if (basename(folderPath).includes('.')) {
      return [folderPath, diskPath.substring(folderPath.length + 1)]
    }
    folderPath = dirname(folderPath)
  }
  throw new Error('Unable to resolve asset path')
}

const diskPathToReduxPath = (diskPath: string) => {
  const decomposed = decomposeAssetBundlePath(diskPath)
  return decomposed?.[0] || diskPath
}

const setPendingWrite = (
  pendingWrites: PendingWritesRef, path: string, target: 'redux' | 'disk'
) => {
  if (!pendingWrites.current) {
    pendingWrites.current = {}
  }
  pendingWrites.current[path] = target
}

// NOTE(christoph): We're receiving changes from disk, and changes from redux constantly
// as the user makes changes.
// If we forwarded every write between the two, we would end up in an infinite loop of writes.
// When we have a pending write from redux, we ignore the disk change, because it'll (probably) be
// what we just wrote. The same applies the other way around.
const maybeIgnoreWrite = (
  pendingWrites: PendingWritesRef,
  path: string,
  source: 'redux' | 'disk'
) => {
  const pendingWrite = getPendingWrite(pendingWrites, path)
  if (pendingWrite === source) {
    // We already have a pending write from the source. This write has made it to the
    // destination and back so we ignore this change and clear our pending record.
    clearPendingWrite(pendingWrites, path)
    return true
  }
  return false
}

const maybeIgnoreDiskWrite = (
  pendingWrites: PendingWritesRef,
  path: string
) => maybeIgnoreWrite(pendingWrites, path, 'disk')

const maybeIgnoreReduxWrite = (
  pendingWrites: PendingWritesRef,
  path: string
) => maybeIgnoreWrite(pendingWrites, path, 'redux')

const LocalSyncContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {t} = useTranslation('cloud-studio-pages')
  const stateCtx = useStudioStateContext()
  const app = useCurrentApp()
  const {appKey} = app
  const git = useCurrentGit()
  const {filesByPath, repo} = git
  const [fileSyncStatus, setFileSyncStatus] = React.useState<FileSyncStatus>('checking')
  const {saveFiles, deleteFile, deleteFiles, createFolder, mutateFile} = useActions(coreGitActions)
  const {uploadAsset, getAssetHash, createAssetBundle} = useActions(gitUploadActions)
  const [localBuildUrl, setLocalBuildUrl] = React.useState<string>('')
  const [localBuildRemoteUrl, setLocalBuildRemoteUrl] = React.useState<string>('')
  const prevFilesByPathRef = React.useRef<DeepReadonly<IGit['filesByPath']> | undefined>(undefined)
  const pendingWritesRef = React.useRef<PendingWrites | undefined>(undefined)
  const socketChannel = getWebsocketChannelName({git, app}, 'current-client')
  const deferredAssetsRef = React.useRef<Set<string>>()
  const [assetVersions, setAssetVersions] = React.useState<Record<string, string> | undefined>({})

  const getDeferredAssets = () => {
    if (!deferredAssetsRef.current) {
      deferredAssetsRef.current = new Set()
    }
    return deferredAssetsRef.current!
  }

  const consumeDeferredAssets = () => {
    const assets = getDeferredAssets()
    const assetsToSync = Array.from(assets)
    assets.clear()
    return assetsToSync
  }

  const maybeDeleteItem = async (path: string) => {
    clearPendingWrite(pendingWritesRef, path)
    await deleteFile(repo, path)
  }

  const maybeCreateFolder = async (path: string) => {
    if (filesByPath[path]) {
      return
    }
    await createFolder(repo, path)
  }

  const handleFileChange = async (msg: LocalSyncFileChanged) => {
    const {path, content} = msg
    if (maybeIgnoreDiskWrite(pendingWritesRef, path)) {
      return
    }
    setPendingWrite(pendingWritesRef, path, 'redux')
    await saveFiles(repo, [{filePath: path, content}])
  }

  const handleDirChange = (msg: LocalSyncDirChanged) => {
    switch (msg.change) {
      case 'created':
        maybeCreateFolder(msg.path)
        break
      case 'deleted':
        maybeDeleteItem(msg.path)
        break
      default:
        // eslint-disable-next-line no-console
        console.warn('Unknown directory change: ', msg.change)
    }
  }

  const pullLocalFiles = async (paths: string[]) => {
    try {
      const filesToSave: {filePath: string, content: string}[] = []

      const assetBundlesToSync = new Set<string>()

      await Promise.all(paths.map(async (path) => {
        const bundlePath = decomposeAssetBundlePath(path)
        if (bundlePath) {
          assetBundlesToSync.add(bundlePath[0])
          return
        }

        if (isAssetPath(path)) {
          const storedAssetKey = filesByPath[path]?.content
          if (storedAssetKey) {
            const [localHash, existingHash] = await Promise.all([
              getFileHash(appKey, path),
              getAssetHash(storedAssetKey),
            ])
            if (localHash === existingHash) {
              // No need to push if the hash matches
              clearPendingWrite(pendingWritesRef, path)
              return
            }
          }

          const file = await pullAssetFile(appKey, path)
          const uploaded = await uploadAsset(repo.repoId, repo, file, basename(path))

          if (storedAssetKey && uploaded.file === storedAssetKey) {
            // If the uploaded file matches the existing content, we can skip saving
            clearPendingWrite(pendingWritesRef, path)
            return
          }

          filesToSave.push({
            filePath: path,
            content: uploaded.file,
          })
        } else {
          const fileContent = await pullSrcFile(appKey, path)
          filesToSave.push({
            filePath: path,
            content: fileContent,
          })
        }
      }))

      await Promise.all([...assetBundlesToSync].map(async (bundlePath) => {
        let contents: string[]
        try {
          ({contents} = await listFileDirectory(appKey, bundlePath))
        } catch (err) {
          // Directory doesn't exist anymore, it should already be gone, so hopefully no need to
          // delete.
        }

        if (!contents?.length) {
          // Directory is empty, nothing to do
          return
        }

        const actions: AssetBundleActions = {
          getRemoteAssetHash: file => getAssetHash(file),
          getFileHash: file => getFileHash(appKey, PATH.join(bundlePath, file)),
          upload: async (file) => {
            const diskPath = PATH.join(bundlePath, file)
            const diskFile = await pullAssetFile(appKey, diskPath)
            return (await uploadAsset(repo.repoId, repo, diskFile, basename(file))).file
          },
        }

        const pathWithoutMain = contents.filter(e => e !== '.main')

        const options: UpsertAssetBundleOptions = {
          base: undefined,
          paths: pathWithoutMain,
          actions,
        }

        const currentBundle = parseAsset(filesByPath[bundlePath]?.content)

        if (currentBundle && currentBundle.type === 'bundle') {
          options.base = currentBundle
        }

        const newBundleParams = await upsertAssetBundle(options)

        if (options.base && assetBundleParamsEqual(options.base, newBundleParams)) {
          return
        }

        const files = assetBundleParamsToFileList(newBundleParams)

        const {bundlePath: uploadedBundlePath} = await createAssetBundle(repo, repo.repoId, files)

        const res: AssetPointer = {
          type: 'bundle',
          path: PATH.join('/', uploadedBundlePath),
          main: pathWithoutMain.length !== contents.length
            ? (await pullSrcFile(appKey, PATH.join(bundlePath, '.main'))).trim()
            : undefined,
          files: newBundleParams.files,
        }

        filesToSave.push({filePath: bundlePath, content: JSON.stringify(res, null, 2)})
      }))

      if (filesToSave.length) {
        filesToSave.forEach(f => setPendingWrite(pendingWritesRef, f.filePath, 'redux'))
        await saveFiles(repo, filesToSave)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to pull local files:', error)
    }
  }

  const handleAssetChange = async (msg: LocalSyncAssetChanged) => {
    switch (msg.change) {
      case 'created':
      case 'modified': {
        const reduxPath = diskPathToReduxPath(msg.path)
        setAssetVersions(prev => ({
          ...prev,
          [reduxPath]: Date.now().toString(36),
        }))
        if (maybeIgnoreDiskWrite(pendingWritesRef, msg.path)) {
          return
        }
        const bundlePath = decomposeAssetBundlePath(msg.path)
        if (bundlePath) {
          getDeferredAssets().add(msg.path)
          // If the bundle doesn't exist, we don't want to upload yet because we get multiple
          // change events, one for each file in the bundle. Instead we wait until the next save
          // to upload the bundle.
          // If the bundle does exist, we need to make sure the .main file is up to date.
          const mainChanged = bundlePath[1] === '.main'
          const needsCreate = !filesByPath[bundlePath[0]]
          if (needsCreate || mainChanged) {
            await mutateFile(
              repo,
              {
                filePath: bundlePath[0],
                transform: async (prev) => {
                  if (!mainChanged) {
                    return prev.content
                  }
                  const main = await pullSrcFile(appKey, PATH.join(bundlePath[0], '.main'))
                  const bundle: BundleAssetPointer = {
                    ...JSON.parse(prev.content),
                    main: main.trim() || null,
                  }
                  return JSON.stringify(bundle, null, 2)
                },
                generate: async () => {
                  const main = await pullSrcFile(appKey, PATH.join(bundlePath[0], '.main'))
                  const bundle: BundleAssetPointer = {
                    type: 'bundle',
                    path: '',
                    main: main.trim() || null,
                    files: {},
                  }
                  return JSON.stringify(bundle, null, 2)
                },
              }
            )
          }
          return
        }
        if (filesByPath[reduxPath]) {
          // If the file already exists on redux, we can pull it later
          getDeferredAssets().add(msg.path)
        } else {
          // If it doesn't exist, we need to create it immediately to show up in the file browser
          await pullLocalFiles([msg.path])
        }
        break
      }
      case 'deleted': {
        const bundlePath = decomposeAssetBundlePath(msg.path)
        if (bundlePath) {
          getDeferredAssets().add(msg.path)
          setAssetVersions(prev => ({
            ...prev,
            [bundlePath[0]]: Date.now().toString(36),
          }))
          return
        }
        getDeferredAssets().delete(msg.path)
        await maybeDeleteItem(msg.path)
        break
      }
      default:
        // eslint-disable-next-line no-console
        console.log('Asset change detected: ', msg)
    }
  }

  const handleInvalidFile = (msg: LocalSyncInvalidFile) => {
    stateCtx.update({
      errorMsg: t('local_sync.error.invalid_file', {filePath: msg.path}),
    })
  }

  const handleLocalSyncMessage = useEvent((msg: LocalSyncMessage) => {
    switch (msg.action) {
      case 'STUDIO_FILE_CHANGE':
        handleFileChange(msg)
        break
      case 'STUDIO_FILE_DELETE':
        maybeDeleteItem(msg.path)
        break
      case 'STUDIO_DIR_CHANGE':
        handleDirChange(msg)
        break
      case 'STUDIO_ASSET_CHANGE':
        handleAssetChange(msg)
        break
      case 'STUDIO_INVALID_FILE':
        handleInvalidFile(msg)
        break
      default:
        // eslint-disable-next-line no-console
        console.warn('Unknown message type: ', msg)
        break
    }
  })

  const canListen = (
    fileSyncStatus === 'initialized' ||
    fileSyncStatus === 'listening' ||
    fileSyncStatus === 'active'
  )
  React.useEffect(() => {
    if (!canListen) {
      return undefined
    }
    window.electron.fileWatch?.addHandler(appKey, handleLocalSyncMessage)
    setFileSyncStatus('listening')

    return () => {
      window.electron.fileWatch?.removeHandler(appKey)
    }
  }, [appKey, canListen])

  const canSyncFiles = fileSyncStatus === 'listening'
  useAbandonableEffect(async (abandon) => {
    if (!canSyncFiles) {
      return
    }
    try {
      const {
        timestampsByPath, invalidPaths,
      }: FileSnapshotResponse = await abandon(getFileStateSnapshot(appKey))

      if (invalidPaths?.length) {
        stateCtx.update({
          errorMsg: t('local_sync.error.invalid_file', {filePath: invalidPaths.join(', ')}),
        })
      }

      const filesThatShouldExistOnRedux = new Set<string>()

      const filesToPull = Object.entries(timestampsByPath).filter(([diskPath, diskTimestamp]) => {
        if (!shouldSyncFile(diskPath)) {
          return false
        }
        const reduxPath = diskPathToReduxPath(diskPath)
        filesThatShouldExistOnRedux.add(reduxPath)
        const existingFile = filesByPath[reduxPath]
        if (!existingFile) {
          return true
        }
        const reduxTimestamp = existingFile.timestamp.getTime()
        // Sync changes that have been made on disk since the last sync
        return diskTimestamp > reduxTimestamp
      }).map(([path]) => path)

      const filesToDelete = Object.keys(filesByPath).filter(path => (
        shouldSyncFile(path) && !filesThatShouldExistOnRedux.has(path)
      ))

      await abandon(deleteFiles(repo, filesToDelete))

      await abandon(pullLocalFiles(filesToPull))
      setFileSyncStatus('active')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to get file state snapshot:', error)
    }
  }, [appKey, canSyncFiles])

  const handlePushSourceFile = async (path: string, content: string, storeWrite: boolean) => {
    try {
      const storeAndPushDiskFile = async (
        diskPath: string,
        diskContent: string | Blob
      ) => {
        if (storeWrite) {
          setPendingWrite(pendingWritesRef, diskPath, 'disk')
        }
        await pushFile(appKey, diskPath, diskContent)
      }

      // handle text files
      if (!isAssetPath(path)) {
        await storeAndPushDiskFile(path, content)
        return
      }

      // handle plain asset file
      const assetPointer = parseAsset(content)
      if (!isBundle(assetPointer)) {
        const body = await retrieveAssetBlob(assetPointer)
        await storeAndPushDiskFile(path, body)
        return
      }

      // handle asset bundle
      const promises = Object.entries(assetPointer.files).map(async ([fileName, assetPath]) => {
        const fileBlob = await retrieveAssetBlob({type: 'single', path: assetPath})
        const filePathWithExt = `${path}/${fileName}`
        await storeAndPushDiskFile(filePathWithExt, fileBlob)
      })
      await Promise.all(promises)
      await storeAndPushDiskFile(`${path}/.main`, assetPointer.main || '')
    } catch (error) {
      stateCtx.update({
        errorMsg: t('local_sync.error.invalid_file', {filePath: path}),
      })
    }
  }

  const needsInitialization = fileSyncStatus === 'needs-initialization'
  useAbandonableEffect(async (abandon) => {
    if (!needsInitialization) {
      return
    }
    const projectFiles = Object.values(filesByPath).filter(f => shouldSyncFile(f.filePath))

    try {
      await abandon(Promise.all(projectFiles.map(file => (
        // NOTE(christoph): We don't store pending writes here, because this is the initial push
        // and we're not listening to changes yet.
        handlePushSourceFile(file.filePath, file.content, /* storeWrite */ false)
      ))))
      setProjectInitialized(appKey)
      setFileSyncStatus('initialized')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to push project files:', error)
    }
  }, [appKey, needsInitialization])

  useAbandonableEffect(async (abandon) => {
    const {initialization} = await abandon(initializeLocal(appKey, app.appName))
    if (initialization === 'needs-initialization') {
      setFileSyncStatus('needs-initialization')
    } else {
      setFileSyncStatus('initialized')
    }
  }, [appKey])

  const canWatchServer = fileSyncStatus === 'active'
  useAbandonableEffect(async (abandon) => {
    if (!canWatchServer) {
      return
    }
    await abandon(watchLocal(appKey))
    const {buildUrl, buildRemoteUrl} = await abandon(getProjectStatus(appKey))
    if (buildUrl) {
      const previewUrl = new URL(buildUrl)
      previewUrl.searchParams.set('channel', socketChannel)
      setLocalBuildUrl(previewUrl.toString())
    } else {
      setLocalBuildUrl('')
    }

    if (buildRemoteUrl) {
      const previewUrl = new URL(buildRemoteUrl)
      previewUrl.searchParams.set('channel', socketChannel)
      setLocalBuildRemoteUrl(previewUrl.toString())
    } else {
      setLocalBuildRemoteUrl('')
    }
  }, [appKey, canWatchServer])

  // Close running dev server on unmount
  React.useEffect(() => () => {
    stopWatchLocal(appKey)
  }, [appKey])

  const canPushToLocal = fileSyncStatus === 'active'
  useAbandonableEffect(async () => {
    if (!canPushToLocal) {
      return
    }

    const prevFilesByPath = prevFilesByPathRef.current
    prevFilesByPathRef.current = filesByPath
    if (!prevFilesByPath) {
      return
    }
    const prevFilePaths = Object.keys(prevFilesByPath)
    const currentFilePaths = Object.keys(filesByPath)
    const removedFiles = prevFilePaths.filter(path => (
      shouldSyncFile(path) && !currentFilePaths.includes(path)
    ))

    try {
      await Promise.all(removedFiles.map(async (path) => {
        clearPendingWrite(pendingWritesRef, path)
        await deleteLocalFile(appKey, path)
      }))

      await Promise.all(Object.values(filesByPath).map(async ({filePath, content}) => {
        if (!shouldSyncFile(filePath)) {
          return
        }
        const prevFile = prevFilesByPath[filePath]
        if (prevFile && prevFile.content === content) {
          return
        }

        if (maybeIgnoreReduxWrite(pendingWritesRef, filePath)) {
          return
        }
        await handlePushSourceFile(filePath, content, /* storeWrite */ true)
      }))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to push studio changes to local: ', error)
    }
  }, [appKey, canPushToLocal, filesByPath])

  useSaveSemaphore(async () => {
    const assetsToSync = consumeDeferredAssets()
    await pullLocalFiles(assetsToSync)
  })

  const ctx: ILocalSyncContext = {
    appKey,
    localBuildUrl,
    localBuildRemoteUrl,
    assetVersions,
    fileSyncStatus,
  }

  return (
    <LocalSyncContext.Provider value={ctx}>
      {children}
    </LocalSyncContext.Provider>
  )
}

type DeviceRemoteType = 'same-device' | 'remote-device'
const useLocalBuildUrl = (deviceType: DeviceRemoteType = 'same-device') => {
  const ctx = React.useContext(LocalSyncContext)
  return deviceType === 'remote-device' ? ctx?.localBuildRemoteUrl : ctx?.localBuildUrl
}

const useMaybeLocalSyncContext = (): ILocalSyncContext | null => (
  React.useContext(LocalSyncContext)
)

export {
  DeviceRemoteType,
  LocalSyncContextProvider,
  useLocalSyncContext,
  useLocalBuildUrl,
  useMaybeLocalSyncContext,
}

export type {
  FileSyncStatus,
}
