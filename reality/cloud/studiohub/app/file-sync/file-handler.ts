import {shell} from 'electron'
import {createReadStream, createWriteStream, ReadStream, Stats} from 'fs'
import {mkdir, rm, readdir, stat} from 'fs/promises'
import path from 'path'
import {Readable} from 'stream'
import {createHash} from 'crypto'
import mime from 'mime-types'
import type {FileSnapshotResponse} from '@nia/reality/shared/studiohub/local-sync-types'
import {toUnixPath} from '@nia/reality/shared/studiohub/unix-path'

import {
  FilePushParams, FilePullParams, FileDeleteParams, FileStateParams,
} from './file-handler-types'
import {
  MAX_ASSET_FILE_UPLOAD_IN_BYTES, MAX_TEXT_FILE_UPLOAD_IN_BYTES,
} from '../../constants'
import {getProjectSrcPath, isIgnoredFile, isTextFile, isValidFile} from '../../project-helpers'
import {getLocalProject} from '../../local-project-db'
import {makeCodedError, withErrorHandlingResponse} from '../../errors'
import {
  FILE_PATH, FILE_STATE_SNAPSHOT_PATH, FILE_METADATA_PATH, FILE_HASH_SHA256_PATH,
  FILE_SHOW_PATH, FILE_OPEN_PATH, FILE_DIRECTORY_PATH,
} from './paths'
import {makeJsonResponse} from '../../json-response'
import {getQueryParams} from '../../query-params'
import {openInCodeEditor} from '../preferences/code-editor'
import {updateGeneratedFiles} from './create-project-files'

const createReadStreamPromise = (filePath: string) => new Promise<ReadStream>((resolve, reject) => {
  const contentStream = createReadStream(filePath)

  contentStream.on('open', () => {
    resolve(contentStream)
  })

  contentStream.on('error', (error) => {
    if ('code' in error && error.code === 'ENOENT') {
      reject(makeCodedError('File not found', 404))
    } else {
      // eslint-disable-next-line no-console
      console.error('Error reading file: ', error)
      reject(makeCodedError('Error reading file', 500))
    }
  })
})

const getLocalFile = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = FilePullParams.safeParse(getQueryParams(requestUrl))
  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  const {appKey, path: filePath} = params.data

  if (isIgnoredFile(filePath) || !isValidFile(filePath)) {
    throw makeCodedError('Invalid file', 400)
  }

  const project = getLocalProject(appKey)
  if (!project) {
    throw makeCodedError('Project not found', 404)
  }

  const projectPath = getProjectSrcPath(project.location)
  const fullPath = path.join(projectPath, filePath)

  try {
    const stats = await stat(fullPath)
    const sizeLimit = isTextFile(fullPath)
      ? MAX_TEXT_FILE_UPLOAD_IN_BYTES
      : MAX_ASSET_FILE_UPLOAD_IN_BYTES

    if (stats.size > sizeLimit) {
      return new Response('File size exceeds limit', {status: 413})
    }
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && error.code === 'ENOENT') {
        throw makeCodedError('File not found', 404)
      }
    }
    throw makeCodedError('Error reading file data', 500)
  }

  const contentStream = await createReadStreamPromise(fullPath)

  // log errors that occur when streaming
  contentStream.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error(`Error reading file '${contentStream.path}':`, error)
  })

  return new Response(contentStream, {
    headers: {
      'Content-Type': mime.lookup(filePath) || 'application/octet-stream',
    },
  })
})

const headLocalFile = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = FilePullParams.safeParse(getQueryParams(requestUrl))
  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  const {appKey, path: filePath} = params.data

  if (isIgnoredFile(filePath) || !isValidFile(filePath)) {
    throw makeCodedError('Invalid file', 400)
  }

  const project = getLocalProject(appKey)
  if (!project) {
    throw makeCodedError('Project not found', 404)
  }

  const projectPath = getProjectSrcPath(project.location)
  const fullPath = path.join(projectPath, filePath)

  let stats: Stats
  try {
    stats = await stat(fullPath)
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && error.code === 'ENOENT') {
        throw makeCodedError('File not found', 404)
      }
    }
    throw makeCodedError('Error reading file data', 500)
  }

  return new Response('', {
    headers: {
      'Content-Type': mime.lookup(filePath) || 'application/octet-stream',
      'Content-Length': stats.size.toString(),
    },
  })
})

const saveFile = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = FilePushParams.safeParse(getQueryParams(requestUrl))

  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  const {appKey, path: filePath} = params.data

  if (isIgnoredFile(filePath) || !isValidFile(filePath)) {
    throw makeCodedError('Invalid file', 400)
  }

  if (typeof req.body === 'undefined' || req.body === null) {
    throw makeCodedError('Missing request body', 400)
  }

  const project = getLocalProject(appKey)
  if (!project) {
    throw makeCodedError('Project not found', 404)
  }

  const projectPath = getProjectSrcPath(project.location)
  const fullPath = path.join(projectPath, filePath)
  const dirPath = path.dirname(fullPath)
  await mkdir(dirPath, {recursive: true})

  const stream = createWriteStream(fullPath)
  Readable.fromWeb(req.body).pipe(stream)

  const res = await new Promise<{}>((resolve, reject) => {
    stream.on('finish', async () => {
      // Check if this is a .expanse.json file and update generated files if needed
      if (filePath === '.expanse.json' || filePath === 'manifest.json') {
        await updateGeneratedFiles(project.location, appKey)
      }
      resolve({})
    })
    stream.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.error('Error writing file:', error)
      reject(makeCodedError('Error writing file', 500))
    })
  })

  return makeJsonResponse(res)
})

const deleteFile = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = FileDeleteParams.safeParse(getQueryParams(requestUrl))

  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  const {appKey, path: filePath} = params.data

  if (isIgnoredFile(filePath) || !isValidFile(filePath)) {
    throw makeCodedError('Invalid file', 400)
  }

  const project = getLocalProject(appKey)
  if (!project) {
    throw makeCodedError('Project not found', 404)
  }

  const projectPath = getProjectSrcPath(project.location)
  const fullPath = path.join(projectPath, filePath)
  await rm(fullPath, {recursive: true, force: true})
  return makeJsonResponse({})
})

const getFileStateSnapshot = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = FileStateParams.safeParse(getQueryParams(requestUrl))

  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  const {appKey} = params.data

  const project = getLocalProject(appKey)
  if (!project) {
    throw makeCodedError('Project not found', 404)
  }

  const projectPath = getProjectSrcPath(project.location)
  const contents = await readdir(projectPath, {recursive: true})

  const response: FileSnapshotResponse = {
    invalidPaths: [],
    timestampsByPath: {},
  }

  await Promise.all(contents.map(async (filePath) => {
    const unixPath = toUnixPath(filePath)
    if (isIgnoredFile(unixPath)) {
      return
    }
    const fileInfo = await stat(path.join(projectPath, filePath))
    if (!fileInfo.isFile()) {
      return
    }
    if (isValidFile(unixPath)) {
      response.timestampsByPath[unixPath] = fileInfo.mtimeMs
    } else {
      response.invalidPaths.push(unixPath)
    }
  }))

  return makeJsonResponse(response)
})

const getFileHashSha256 = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = FilePullParams.safeParse(getQueryParams(requestUrl))
  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }
  const {appKey, path: filePath} = params.data
  if (isIgnoredFile(filePath) || !isValidFile(filePath)) {
    throw makeCodedError('Invalid file', 400)
  }
  const project = getLocalProject(appKey)
  if (!project) {
    throw makeCodedError('Project not found', 404)
  }
  const projectPath = getProjectSrcPath(project.location)
  const fullPath = path.join(projectPath, filePath)
  const contentStream = await createReadStreamPromise(fullPath)
  const hasher = createHash('sha256')
  const hash = await new Promise<string>((resolve, reject) => {
    contentStream.on('data', chunk => hasher.update(chunk))
    contentStream.on('end', () => resolve(hasher.digest('hex')))
    contentStream.on('error', (error) => {
      if ('code' in error && error.code === 'ENOENT') {
        reject(makeCodedError('File not found', 404))
      } else {
        reject(error)
      }
    })
  })
  return makeJsonResponse({hash})
})

// TODO
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getFileMetadata = withErrorHandlingResponse(async (req: Request) => makeJsonResponse({}))

const handleFileOperationRequest = (request: Request) => {
  switch (request.method) {
    case 'HEAD':
      return headLocalFile(request)
    case 'GET':
      return getLocalFile(request)
    case 'POST':
      return saveFile(request)
    case 'DELETE':
      return deleteFile(request)
    default:
      return new Response('Method Not Allowed', {status: 405})
  }
}

const postShowFile = withErrorHandlingResponse(async (req) => {
  const requestUrl = new URL(req.url)
  const params = FilePullParams.safeParse(getQueryParams(requestUrl))
  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  const {appKey, path: filePath} = params.data

  const project = getLocalProject(appKey)
  if (!project) {
    throw makeCodedError('Project not found', 404)
  }

  const projectPath = getProjectSrcPath(project.location)
  const fullPath = path.join(projectPath, filePath)

  try {
    const info = await stat(fullPath)
    if (info.isDirectory()) {
      const error = await shell.openPath(fullPath)
      if (error) {
        throw makeCodedError(`Error opening directory: ${error}`, 500)
      }
    } else {
      shell.showItemInFolder(fullPath)
    }
    return makeJsonResponse({})
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && error.code === 'ENOENT') {
        throw makeCodedError('File not found', 404)
      }
    }
    throw error
  }
})

const handleFileShowRequest = (request: Request) => {
  switch (request.method) {
    case 'POST':
      return postShowFile(request)
    default:
      return new Response('Method Not Allowed', {status: 405})
  }
}

const postOpenFile = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = FilePullParams.safeParse(getQueryParams(requestUrl))
  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  const {appKey, path: filePath} = params.data
  if (isIgnoredFile(filePath) || !isValidFile(filePath)) {
    throw makeCodedError('Invalid file', 400)
  }

  const project = getLocalProject(appKey)
  if (!project) {
    throw makeCodedError('Project not found', 404)
  }

  const projectPath = getProjectSrcPath(project.location)
  const fullPath = path.join(projectPath, filePath)

  try {
    await openInCodeEditor(project.location, fullPath)
  } catch (err) {
    throw makeCodedError(`Error opening file: ${err}`, 500)
  }

  return makeJsonResponse({})
})

const handleFileOpenRequest = (request: Request) => {
  switch (request.method) {
    case 'POST':
      return postOpenFile(request)
    default:
      return new Response('Method Not Allowed', {status: 405})
  }
}

const handleFileSnapshotRequest = (request: Request) => {
  if (request.method === 'GET') {
    return getFileStateSnapshot(request)
  }

  return new Response('Method Not Allowed', {status: 405})
}

const handleFileMetadataRequest = (request: Request) => {
  if (request.method === 'GET') {
    return getFileMetadata(request)
  }

  return new Response('Method Not Allowed', {status: 405})
}

const handleFileHashSha256Request = (request: Request) => {
  if (request.method === 'GET') {
    return getFileHashSha256(request)
  }
  return new Response('Method Not Allowed', {status: 405})
}

// NOTE(christoph): Asset bundles use relative routing so we need a way to directly address files
// without query params.
const handleDirectFileOperationRequest = (request: Request) => {
  const requestUrl = new URL(request.url)
  const [
    appKey, appUuid, /* cache bust */, ...pathParts
  ] = requestUrl.pathname.split('/').slice(3)  // skip leading slash, 'file' and 'direct'
  requestUrl.searchParams.set('appUuid', appUuid)
  requestUrl.searchParams.set('appKey', appKey)
  requestUrl.searchParams.set('path', pathParts.join('/'))
  requestUrl.pathname = FILE_PATH
  return handleFileOperationRequest(new Request(requestUrl.toString(), {
    method: request.method,
    body: request.body,
    headers: request.headers,
  }))
}

const getFileDirectory = withErrorHandlingResponse(async (request) => {
  const requestUrl = new URL(request.url)
  const params = FilePullParams.safeParse(getQueryParams(requestUrl))
  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  const {appKey, path: filePath} = params.data

  const project = getLocalProject(appKey)
  if (!project) {
    throw makeCodedError('Project not found', 404)
  }

  const projectPath = getProjectSrcPath(project.location)
  const fullPath = path.join(projectPath, filePath)
  const contents = await readdir(fullPath, {recursive: true})
  return makeJsonResponse({
    contents: contents.filter(f => !isIgnoredFile(f)).map(toUnixPath),
  })
})

const handleFileDirectoryRequest = (request: Request) => {
  if (request.method === 'GET') {
    return getFileDirectory(request)
  }

  return new Response('Method Not Allowed', {status: 405})
}

const handleFileRequest = (request: Request) => {
  const requestUrl = new URL(request.url)
  const {pathname} = requestUrl

  if (pathname.startsWith('/file/direct/')) {
    return handleDirectFileOperationRequest(request)
  }

  switch (pathname) {
    case FILE_PATH:
      return handleFileOperationRequest(request)
    case FILE_STATE_SNAPSHOT_PATH:
      return handleFileSnapshotRequest(request)
    case FILE_DIRECTORY_PATH:
      return handleFileDirectoryRequest(request)
    case FILE_METADATA_PATH:
      return handleFileMetadataRequest(request)
    case FILE_HASH_SHA256_PATH:
      return handleFileHashSha256Request(request)
    case FILE_OPEN_PATH:
      return handleFileOpenRequest(request)
    case FILE_SHOW_PATH:
      return handleFileShowRequest(request)
    default: {
      // eslint-disable-next-line no-console
      console.error('Unknown file sync request:', pathname)
      return new Response('Not Found', {status: 404})
    }
  }
}

export {
  handleFileRequest,
}
