import type {FS} from './emscripten'

type FsHandle = {
  root: string
  fs: typeof FS
}

type JustFsHandle = Pick<FsHandle, 'fs'>
type JustRootHandle = Pick<FsHandle, 'root'>

interface FsEntry {
  timestamp: Date
  mode: number
  contents?: Uint8Array
}

const makeKey = ({root}: JustRootHandle, repositoryName: string, filename?: string) => (
  `${root}/${repositoryName}${filename !== undefined ? '/' : ''}${filename || ''}`
)

const getPath = ({fs, root}: FsHandle, repositoryName: string, filename?: string) => {
  const path = makeKey({root}, repositoryName, filename)
  let node = null
  try {
    node = fs.lookupPath(path).node
  } catch (e) {
    // file not found
    return undefined
  }
  const ret: FsEntry = {timestamp: new Date(node.timestamp), mode: node.mode}
  if (fs.isFile(node.mode)) {
    ret.contents = new Uint8Array(node.contents)
  }
  return ret
}

const getAllPathsRecursive = ({fs}: JustFsHandle, path: string) => {
  const found = fs.lookupPath(path)
  if (!found || !found.node) {
    return []
  }
  const {node} = found
  if (fs.isDir(node.mode)) {
    return Object.keys(node.contents)
      .reduce((arr, v) => arr.concat(getAllPathsRecursive({fs}, `${path}/${v}`)), [path])
  }
  return [path]
}

const getAllPaths = ({fs, root}: FsHandle): string[] => {
  const found = fs.lookupPath(root)
  if (!found || !found.node) {
    return []
  }
  const {node} = found
  return Object.keys(node.contents)
    .reduce((arr, v) => arr.concat(getAllPathsRecursive({fs}, `${root}/${v}`)), [])
    .sort()
}

const createDirectory = (
  {fs, root}: FsHandle, repositoryName: string, dirname?: string
) => (
  fs.mkdir(makeKey({root}, repositoryName, dirname))
)

const getOrCreateDirectory = (
  {fs, root}: FsHandle,
  repositoryName: string,
  dirname?: string
) => {
  const row = getPath({fs, root}, repositoryName, dirname)
  if (!row) {
    createDirectory({fs, root}, repositoryName, dirname)
  }
}

type PutOptions = {
  timestamp?: number
}

const putFile = (
  {fs, root}: FsHandle,
  repositoryName: string,
  filename: string,
  text: string,
  options: PutOptions = {}
) => {
  const {timestamp} = options
  const path = makeKey({root}, repositoryName, filename)
  fs.writeFile(path, new TextEncoder().encode(text))
  if (timestamp) {
    fs.utime(path, timestamp, timestamp)
  }
}

const renameFile = (
  {fs, root}: FsHandle, repositoryName: string, fileSrc: string, fileDest: string
) => (
  fs.rename(makeKey({root}, repositoryName, fileSrc), makeKey({root}, repositoryName, fileDest))
)

const delFullPath = ({fs}: JustFsHandle, path: string) => {
  let found = null
  try {
    found = fs.lookupPath(path)
  } catch (e) {
    // We might have deleted this file already.
  }
  if (!found || !found.node) {
    return
  }
  const {node} = found
  if (fs.isDir(node.mode)) {
    Object.keys(node.contents).map(v => delFullPath({fs}, `${path}/${v}`))
    fs.rmdir(path)
    return
  }
  fs.unlink(path)
}

const delPath = ({fs, root}: FsHandle, repositoryName: string, filename: string) => (
  delFullPath({fs}, makeKey({root}, repositoryName, filename))
)

// Creates the indexdb directory for a repository if it doesn't yet exist.
const initRepoImpl = (repositoryName: string) => ({fs, root}: FsHandle) => (
  getOrCreateDirectory({fs, root}, repositoryName)
)

const getImpl = (repositoryName: string, filename?: string) => ({fs, root}: FsHandle) => {
  const row = getPath({fs, root}, repositoryName, filename)
  if (!row) {
    return undefined
  }
  const {contents, mode, timestamp} = row
  return {
    repositoryName,
    filePath: filename,
    mode,
    timestamp,
    content: new TextDecoder().decode(contents),
  }
}

const ensureDirectoryPathForFilename = (
  {fs, root}: FsHandle, repositoryName: string, filename: string
) => {
  const split = filename.split('/')

  for (let i = 0; i < split.length - 1; i++) {
    const directoryToCreate = split.slice(0, i + 1).join('/')
    getOrCreateDirectory({fs, root}, repositoryName, directoryToCreate)
  }
}

const putImpl = (
  repositoryName: string, filename: string, text: string, options?: PutOptions
) => (
  ({fs, root}: FsHandle) => {
    ensureDirectoryPathForFilename({fs, root}, repositoryName, filename)
    putFile({fs, root}, repositoryName, filename, text, options)
  }
)

const mkdirImpl = (repositoryName: string, dirname: string) => ({fs, root}: FsHandle) => {
  ensureDirectoryPathForFilename({fs, root}, repositoryName, dirname)
  createDirectory({fs, root}, repositoryName, dirname)
}

const renameImpl = (
  repositoryName: string,
  fileSrc: string,
  fileDest: string
) => ({fs, root}: FsHandle) => {
  ensureDirectoryPathForFilename({fs, root}, repositoryName, fileDest)
  renameFile({fs, root}, repositoryName, fileSrc, fileDest)
}

const delImpl = (repositoryName: string, filename: string) => ({fs, root}: FsHandle) => (
  delPath({fs, root}, repositoryName, filename)
)

/**
 * If supplied, list all of the files within the repo, otherwise return the list of all repos.
 */
const keysImpl = (repositoryName: string) => ({fs, root}: FsHandle) => {
  const key = makeKey({root}, repositoryName, '')
  const re = new RegExp(`^${makeKey({root}, '\\w+\\.(\\w|-)+$')}`)
  const keys = getAllPaths({fs, root})
  return keys
    .filter(k => (repositoryName ? !k.includes('.git') && k.startsWith(key) : k.match(re)))
    .map(k => (repositoryName ? k.replace(key, '') : k.replace({fs, root}.root, '')))
}

const deleteRepoImpl = (repositoryName: string) => ({fs, root}: FsHandle) => {
  const repodir = makeKey({root}, repositoryName)
  const repoPrefix = makeKey({root}, repositoryName, '')
  const keys = getAllPaths({fs, root})
  const keysToDelete = keys.filter(k => k === repodir || k.startsWith(repoPrefix))
  keysToDelete.forEach(k => delFullPath({fs}, k))
}

export {
  delFullPath,
  initRepoImpl,
  getImpl,
  putImpl,
  mkdirImpl,
  renameImpl,
  delImpl,
  keysImpl,
  deleteRepoImpl,
}

export type {
  FsEntry,
  FsHandle,
}
