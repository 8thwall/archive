import {exec as execNode} from 'child_process'
import path from 'path'
import {promises as fs} from 'fs'

import {isBlockedFileName, isConventionalFileName} from './valid-file-name'

const BYTES_PER_KB = 1000
const BYTES_PER_MB = BYTES_PER_KB * 1000
const BYTES_PER_GB = BYTES_PER_MB * 1000

const WARNING_THRESHOLD_PERCENT = 80
const SOURCE_CODE_SIZE_LIMIT_BYTES = 10 * BYTES_PER_MB

const niceBytes = (bytes: number) => {
  if (bytes > BYTES_PER_GB) {
    return `${(bytes / BYTES_PER_GB).toFixed(1)} GB`
  }
  if (bytes > BYTES_PER_MB) {
    return `${(bytes / BYTES_PER_MB).toFixed(1)} MB`
  }
  if (bytes > BYTES_PER_KB) {
    return `${(bytes / BYTES_PER_KB).toFixed(1)} KB`
  }
  return `${bytes} bytes`
}

const LFS_QUOTA_FILENAME = '.lfs_quota'

type Notification = {type: 'warning' | 'error', message: string, file: string}

const scriptRoot = path.join(__dirname, '../..') + path.sep
const cwd = process.cwd()
const root = cwd.startsWith(scriptRoot) ? scriptRoot : cwd

const getCommandOutput = (command: string) => new Promise<string>((resolve, reject) => {
  execNode(command, {cwd: root, maxBuffer: 10_000_000}, (err, stdout) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error('Command failed', command)
      reject(err)
    } else {
      resolve(stdout.toString().trim())
    }
  })
})

const listChangedFiles = async (fromCommit: string, toCommit: string = '') => {
  const changedFilesCommand = [
    'git diff',
    '--name-status',      // Show filenames instead of lines
    '--diff-filter=MAR',  // Limit to modified, added, renamed, or deleted files
    '-z',                 // Use a NUL character delimited output
    fromCommit,
    toCommit,
  ].join(' ')

  const outputParts = (await getCommandOutput(changedFilesCommand)).split('\x00').filter(Boolean)

  const changedFiles: string[] = []

  let index = 0
  while (index < outputParts.length) {
    // Rename lines have two filenames, the rest have one.
    switch (outputParts[index][0]) {
      case 'M':
        changedFiles.push(outputParts[index + 1])
        index += 2
        break
      case 'A':
        changedFiles.push(outputParts[index + 1])
        index += 2
        break
      case 'R':
        changedFiles.push(outputParts[index + 2])
        index += 3
        break
      default:
        throw new Error(`Unexpected element: ${outputParts[index]}`)
    }
  }

  return changedFiles
}

const validateLfsQuotas = async (folderPath: string): Promise<Notification | null> => {
  try {
    const quotaPath = path.join(folderPath, LFS_QUOTA_FILENAME)
    const contents = await fs.readFile(quotaPath, 'utf8')
    const limit = parseInt(contents, 10)
    if (Number.isNaN(limit)) {
      return {type: 'error', file: quotaPath, message: 'Unable to parse file'}
    }

    const prefixSpecifier = folderPath === '.' ? '' : `-I "${folderPath}"`

    const output = await getCommandOutput(`git lfs ls-files -d ${prefixSpecifier}`)
    const sizeMatches = [...output.matchAll(/^ *size: (\d+)$/gm)]

    let totalLfsContents = 0
    sizeMatches.forEach(([, sizeString]) => {
      const size = parseInt(sizeString, 10)
      if (Number.isNaN(size)) {
        throw new Error('Unable to parse LFS information.')
      }
      totalLfsContents += size
    })

    const percent = Math.ceil((totalLfsContents / limit) * 100)
    if (percent > 100) {
      return {
        type: 'error',
        file: quotaPath,
        message: `LFS files exceed quota - \
${niceBytes(totalLfsContents)}/${niceBytes(limit)}`,
      }
    }
    if (percent > WARNING_THRESHOLD_PERCENT) {
      return {
        type: 'warning',
        file: quotaPath,
        message: `LFS files nearing quota - \
${niceBytes(totalLfsContents)}/${niceBytes(limit)}`,
      }
    }
  } catch (err) {
    // ENOENT means the folder doesn't have a quota, which is fine.
    if (err.code !== 'ENOENT') {
      throw err
    }
  }

  return null
}

const validateFile = async (file: string, isLfs: boolean): Promise<Notification | null> => {
  if (isBlockedFileName(file)) {
    return {type: 'error', file, message: 'Invalid characters in filename.'}
  }

  const stat = await fs.lstat(file)
  if (!stat.size || !stat.isFile()) {
    return null  // Could be a symlink for example
  }

  const fileInfo = await getCommandOutput(`file "${file}" -b  --mime-type --mime-encoding`)
  const isBinary = fileInfo.includes('charset=binary')

  // TODO(christoph): This might need more work.
  const isPlatformDependentExecutable = isBinary && fileInfo.includes('executable')

  if (isBinary && !isLfs) {
    return {type: 'error', file, message: 'Binary file should be stored in LFS'}
  }

  if (isPlatformDependentExecutable) {
    return {type: 'warning', file, message: 'Avoid storing executable files in git.'}
  }

  if (!isLfs) {
    const {size} = stat
    const sizePercent = Math.ceil((size / SOURCE_CODE_SIZE_LIMIT_BYTES) * 100)
    if (sizePercent > 100) {
      return {
        type: 'error',
        file,
        message: `File size exceeds limit - \
${niceBytes(size)}/${niceBytes(SOURCE_CODE_SIZE_LIMIT_BYTES)}`,
      }
    }
    if (sizePercent > WARNING_THRESHOLD_PERCENT) {
      return {
        type: 'warning',
        file,
        message: `File size nearing limit - \
${niceBytes(size)}/${niceBytes(SOURCE_CODE_SIZE_LIMIT_BYTES)}`,
      }
    }
  }

  if (!isConventionalFileName(file)) {
    return {type: 'warning', file, message: 'Unusual characters in filename, might be unintended.'}
  }

  return null
}

const collectLfsFolders = (lfsFiles: string[]) => {
  const folders = new Set<string>()

  const crawlParent = async (filePath: string) => {
    const parent = path.dirname(filePath)
    if (folders.has(parent)) {
      return
    }
    folders.add(parent)
    crawlParent(parent)
  }

  lfsFiles.forEach((e) => {
    crawlParent(e)
  })

  return [...folders]
}

const getUncleanMessage = (file: string) => (
  file === 'MODULE.bazel.lock'
    ? 'Instability detected, running "bazel mod deps" may resolve.'
    : 'Unexpected unclean checkout, LFS may be misconfigured.'
)

const getErrors = async (forkPoint: string, currentSha: string = ''): Promise<Notification[]> => {
  if (currentSha) {
    const uncleanCheckoutFiles = await listChangedFiles(currentSha)
    if (uncleanCheckoutFiles.length) {
      return uncleanCheckoutFiles.map(e => ({
        type: 'error',
        file: e,
        message: getUncleanMessage(e),
      }))
    }
  }

  const filesToCheck = await listChangedFiles(forkPoint, currentSha)

  const allLfsFiles = new Set((await getCommandOutput('git lfs ls-files -n')).split('\n'))

  const changedLfsFiles = filesToCheck.filter(e => (
    allLfsFiles.has(e) || path.basename(e) === LFS_QUOTA_FILENAME
  ))

  const quotaChecks = collectLfsFolders(changedLfsFiles).map(validateLfsQuotas)
  const fileChecks = filesToCheck.map(e => validateFile(e, allLfsFiles.has(e)))

  return [
    ...await Promise.all(quotaChecks),
    ...await Promise.all(fileChecks),
  ].filter((e): e is Notification => !!e)
}

export {
  getErrors,
}

export type {
  Notification,
}
