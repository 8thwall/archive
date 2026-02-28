import {join} from 'path'
import {createHash} from 'crypto'

import {dispatchify} from '../common/index'
import authenticatedFetch from '../common/authenticated-fetch'
import {xhrWithProgress} from '../common/xhr-with-progress'
import type {IRepo} from './g8-dto'
import {
  ASSET_FOLDER, isAssetPath, SPECIAL_TEXT_FILES, TEXT_FILES, validateFileError,
} from '../common/editor-files'
import {fileExt} from '../editor/editor-common'
import {makeRunQueue} from '../../shared/run-queue'
import {RepoAction, withWriteBlock} from './tab-synchronization'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import {showErr, createFile, syncRepoStateFromDisk, CreateFileOptions} from './core-git-actions'
import {publicApiFetch} from '../common/public-api-fetch'

// Permit only up to 10 parallel requests to upload assets to avoid overloading the server
const assetUploadRunQueue = makeRunQueue(10)

const getFormData = (name, file, fileName) => {
  const fd = new FormData()
  fd.append(name, file, fileName)
  return fd
}

enum UploadFileType {
  Text = 'text',
  Asset = 'asset',
}

const getFileType = (fileName: string): UploadFileType => {
  const fileext = fileExt(fileName)
  return TEXT_FILES.includes(fileext) || SPECIAL_TEXT_FILES.has(fileName)
    ? UploadFileType.Text
    : UploadFileType.Asset
}

const getFolderDest = (filetype: UploadFileType, folderPath: string) => {
  const isTextFile = filetype === 'text'
  const isTextFolder = !isAssetPath(folderPath)

  // Upload files to the correct place if they are dragged into an invalid target
  let folderDest
  if (isTextFile === isTextFolder) {
    folderDest = folderPath
  } else if (!isTextFile) {
    folderDest = ASSET_FOLDER
  }
  return folderDest
}

const uploadAsset = (
  repoId: string,
  repo: IRepo,
  file: Blob,
  fileName: string = undefined,
  onProgress?: (percentage: number) => void
): AsyncThunk<{file: string}> => (dispatch, getState) => (
  assetUploadRunQueue.next(async () => {
    const ext = fileExt(file.name) || fileExt(fileName) || ''
    try {
      const hash = createHash('sha256')
      hash.update(new Uint8Array(await file.arrayBuffer()))
      const sha256 = hash.digest('hex')
      return await dispatch(publicApiFetch<{file: string}>(
        `/asset-metadata/hash/sha256/${ext}/${sha256}`
      ))
    } catch (err) {
      if (err.status !== 404) {
        throw err
      }
    }

    const queryParams = new URLSearchParams({
      'selectedAccountUuid': getState().accounts.selectedAccount,
    })
    if (ext) {
      queryParams.set('fileExt', ext)
    }
    return (
      dispatch(xhrWithProgress<{file: string}>(
        `/v1/git/${repoId}/asset?${queryParams.toString()}`,
        {
          method: 'PUT',
          headers: {'file-size': file.size},
          body: getFormData('asset', file, fileName),
          json: false,
        }, onProgress
      ))
    )
  })
)

type ProgressCallback = (percent: number) => void

const readTextBlob = (
  file: Blob, onProgress?: ProgressCallback
) => new Promise<string>((resolve) => {
  const r = new FileReader()
  r.onload = () => {
    if (typeof r.result !== 'string') {
      throw new Error('Expected file reader result to be a string')
    } else {
      resolve(r.result)
    }
  }
  r.onprogress = (e) => {
    if (e.lengthComputable && onProgress) {
      onProgress?.((e.loaded / e.total) * 100)
    }
  }
  r.readAsText(file)
})

const uploadFile = (
  repo: IRepo,
  repoId: string,
  file: Blob,
  filetype: UploadFileType,
  targetPath: string,
  onProgress?: ProgressCallback,
  options: CreateFileOptions = {}
): AsyncThunk<Blob> => async (dispatch) => {
  // If this is just a text file, we don't actually need to upload it. Just add the file and its
  // contents to the list of git files.
  // 20% reading file progress + 20% reading file processing + 60% creating file in IndexedDB
  if (filetype === UploadFileType.Text) {
    try {
      const content = await readTextBlob(file, percent => onProgress?.(percent * 0.2))
      onProgress?.(40)
      await dispatch(createFile(repo, targetPath, content, options))
      onProgress?.(100)
      return file
    } catch (err) {
      dispatch(showErr(repo.repoId, `Couldn't create ${targetPath}`, err))
      throw err
    }
  }

  if (!options.skipValidate) {
  // Validate the asset file before uploading it
    const validationError = validateFileError(targetPath)
    if (validationError) {
      dispatch(showErr(repo.repoId, validationError))
      throw new Error(validationError)
    }
  }

  // 80% progress uploading file + 10% multer processing/s3.putObject + 10% create file in IndexedDB
  try {
    const res = await dispatch(uploadAsset(repoId, repo, file, undefined,
      (percentage => onProgress?.(Math.round(percentage * 0.8)))))
    onProgress?.(90)
    await dispatch(createFile(repo, targetPath, join('/', res.file), options))
    onProgress?.(100)
    return file
  } catch (err) {
    dispatch(showErr(repo.repoId, 'Couldn\'t upload file', err))
    throw err
  }
}

const createAssetBundle = (
  repo: IRepo,
  repoId: string,
  files: {filePath: string, assetPath: string}[]
): AsyncThunk<{bundlePath: string}> => (dispatch, getState) => dispatch(
  authenticatedFetch(`/v1/git/${repoId}/bundle`, {
    method: 'PUT',
    body: JSON.stringify({files, selectedAccountUuid: getState().accounts.selectedAccount}),
  })
)

const getAssetHash = (assetPath: string): AsyncThunk<string | string> => async (dispatch) => {
  const queryParams = new URLSearchParams({
    'file': assetPath,
  })

  try {
    const res = await dispatch(publicApiFetch<{hash: string}>(
      `/asset-metadata/hash/asset/sha256?${queryParams.toString()}`
    ))
    return res.hash
  } catch (err) {
    if (err.status === 404) {
      return undefined
    }
    throw err
  }
}

// NOTE(johnny): repo needs to be added to all the functions because syncRepoStateFromDisk needs
// repo. We are unable to extract repo from the args before passing it into the functions
// since uploadFile needs repo.
const synchronizedWriteBlock = <FIRST_ARG extends IRepo, P extends any[], R>(
  func: RepoAction<FIRST_ARG, P, R>, name: string
) => withWriteBlock(
    func, name, syncRepoStateFromDisk
  )

const rawActions = {
  uploadAsset,
  getAssetHash,
  uploadFile: synchronizedWriteBlock(uploadFile, 'uploadFile'),
  createAssetBundle: synchronizedWriteBlock(createAssetBundle, 'createAssetBundle'),
}

type GitUploadActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)

export {
  UploadFileType,
  GitUploadActions,
  getFileType,
  getFolderDest,
  rawActions,
}
