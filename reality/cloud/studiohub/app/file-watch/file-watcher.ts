import chokidar from 'chokidar'
import log from 'electron-log'
import fs from 'fs'
import path from 'path'
import type {LocalSyncMessage, UnixPath} from '@nia/reality/shared/studiohub/local-sync-types'
import {toUnixPath} from '@nia/reality/shared/studiohub/unix-path'

import {getLocalProject} from '../../local-project-db'
import {getProjectSrcPath, isAssetPath, isIgnoredFile, isValidFile} from '../../project-helpers'

type FileWatcher = {
  start: () => void
  suspend: () => void
  close: () => void
}

const initFileWatcher = (appKey: string, send: (msg: LocalSyncMessage) => void): FileWatcher => {
  const project = getLocalProject(appKey)
  if (!project) {
    throw new Error(`Project not found for appKey: ${appKey}`)
  }

  const srcPath = getProjectSrcPath(project.location)

  const fileWatcher = chokidar.watch('.', {
    cwd: srcPath,
    ignoreInitial: true,
    alwaysStat: false,  // We don't need file stats
    awaitWriteFinish: {
      // The default delay is 2000 which is too long. We need to get write confirmations sooner.
      stabilityThreshold: 150,
      pollInterval: 50,
    },
  })

  const handleFileChange = (filePath: UnixPath) => {
    log.info('File changed:', filePath)
    if (isIgnoredFile(filePath)) {
      return
    }

    if (!isValidFile(filePath)) {
      send({
        action: 'STUDIO_INVALID_FILE',
        appKey,
        path: filePath,
      })
      return
    }

    send({
      ...(isAssetPath(filePath)
        ? {
          action: 'STUDIO_ASSET_CHANGE',
        }
        : {
          action: 'STUDIO_FILE_CHANGE',
          content: fs.readFileSync(path.join(srcPath, filePath), 'utf-8'),
        }),
      appKey,
      change: 'modified',
      path: filePath,
    })
  }

  const handleFileAdd = (filePath: UnixPath) => {
    log.info('File added:', filePath)
    if (isIgnoredFile(filePath)) {
      return
    }

    if (!isValidFile(filePath)) {
      send({
        action: 'STUDIO_INVALID_FILE',
        appKey,
        path: toUnixPath(filePath),
      })
      return
    }

    send({
      ...(isAssetPath(filePath)
        ? {
          action: 'STUDIO_ASSET_CHANGE',
        }
        : {
          action: 'STUDIO_FILE_CHANGE',
          content: fs.readFileSync(path.join(srcPath, filePath), 'utf-8'),
        }),
      appKey,
      change: 'created',
      path: toUnixPath(filePath),
    })
  }

  const handleDelete = (filePath: UnixPath) => {
    log.info('File deleted:', filePath)
    if (isIgnoredFile(filePath) || !isValidFile(filePath)) {
      return
    }

    send({
      ...(isAssetPath(filePath)
        ? {
          action: 'STUDIO_ASSET_CHANGE',
          change: 'deleted',
        }
        : {
          action: 'STUDIO_FILE_DELETE',
        }),
      appKey,
      path: filePath,
    })
  }

  const handleFolderAdd = (filePath: UnixPath) => {
    log.info('Directory added:', filePath)
    send({
      action: isAssetPath(filePath) ? 'STUDIO_ASSET_CHANGE' : 'STUDIO_DIR_CHANGE',
      appKey,
      change: 'created',
      path: filePath,
    })
  }

  const handleFolderDelete = (filePath: UnixPath) => {
    log.info('Directory deleted:', filePath)
    send({
      action: isAssetPath(filePath) ? 'STUDIO_ASSET_CHANGE' : 'STUDIO_DIR_CHANGE',
      appKey,
      change: 'deleted',
      path: filePath,
    })
  }

  fileWatcher
    .on('change', (filePath: string) => handleFileChange(toUnixPath(filePath)))
    .on('add', (filePath: string) => handleFileAdd(toUnixPath(filePath)))
    .on('unlink', (filePath: string) => handleDelete(toUnixPath(filePath)))
    .on('addDir', (filePath: string) => handleFolderAdd(toUnixPath(filePath)))
    .on('unlinkDir', (filePath: string) => handleFolderDelete(toUnixPath(filePath)))

  const start = () => {
    fileWatcher.add('.')
  }

  const suspend = () => {
    fileWatcher.unwatch('.')
  }

  const close = () => {
    fileWatcher.close()
  }

  const watcher = {
    start,
    suspend,
    close,
  }

  return watcher
}

export {
  initFileWatcher,
}

export type {
  FileWatcher,
}
