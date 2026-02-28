import {basename} from 'path'

const getProjectSrcPath = (projectDir: string) => `${projectDir}/src`

// TODO: Fill in the rest of the ignored files, think about .git
const IGNORED_FILES = ['.DS_Store', '.git']

const TEXT_FILES = ['js', 'ts', 'json', 'md', 'txt']

const fileExt = (filename: string) => (
  (filename && filename.includes('.'))
    ? filename.split('.').slice(-1)[0].toLowerCase()
    : ''
)

const isIgnoredFile = (filePath: string) => IGNORED_FILES.includes(basename(filePath))

const isAssetPath = (filePath: string) => (filePath.startsWith('assets/'))

const isTextFile = (filePath: string) => (
  filePath === 'LICENSE' ||
  (TEXT_FILES.includes(fileExt(filePath)))
)

const isValidFile = (filePath: string) => isAssetPath(filePath) || isTextFile(filePath)

export {
  getProjectSrcPath,
  isIgnoredFile,
  isAssetPath,
  isTextFile,
  isValidFile,
}
