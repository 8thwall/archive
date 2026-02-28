import {join, dirname, basename} from 'path'
import uuidv4 from 'uuid/v4'

import {MAX_BACKEND_NAME_LENGTH} from '../../shared/gateway/limits'

import {fileExt, joinExt} from '../editor/editor-common'

const ASSET_FOLDER_PREFIX = 'assets/'
const ASSET_FOLDER = ASSET_FOLDER_PREFIX.replace(/\/$/, '')

const BACKEND_FOLDER_PREFIX = 'backends/'
const BACKEND_FOLDER = BACKEND_FOLDER_PREFIX.replace(/\/$/, '')
const BACKEND_FILE_EXT = '.backend.json'

const DEPENDENCY_FOLDER_PREFIX = '.dependencies/'
const DEPENDENCY_FOLDER = DEPENDENCY_FOLDER_PREFIX.replace(/\/$/, '')
const CLIENT_FILE_PATH = '.client.json'
const MANIFEST_FILE_PATH = 'manifest.json'
const README_FILE_PATH = 'README.md'

const ECS_DEF_FILE_PATH = '/ecs/runtime/index.d.ts'
const GLOBAL_DEF_FILE_PATH = '/globals.d.ts'

const EDITOR_DEFINITION_MODALS = ['/lib.dom.d.ts', '/lib.es5.d.ts']

const STUDIO_DEFINITION_MODALS = [
  ...EDITOR_DEFINITION_MODALS, ECS_DEF_FILE_PATH, GLOBAL_DEF_FILE_PATH,
]

const ALL_DEFINITION_MODALS = STUDIO_DEFINITION_MODALS

// Files that should not be landed/published.
const IGNORED_LANDING_FILES = [CLIENT_FILE_PATH]
// Files that get a "3d model" icon.
const NORMAL_MODEL_FILES = ['glb', 'gltf']
// Files that get a "splat" icon.
const SPLAT_MODEL_FILES = ['spz', 'splat', 'ply']
// Files that get a "hologram person" icon.
const HOLOGRAM_MODEL_FILES = ['hcap', 'tvm']
// Model files that are not yet supported by the ModelPreview component.
const NO_PREVIEW_MODEL_FILES = ['tvm', 'splat', 'ply']
// Files that get an "audio" icon.
const AUDIO_FILES = ['m4a', 'mp3', 'wav', 'ogg', 'aac']
// Files that get a "css" icon.
const CSS_FILES = ['css', 'scss', 'sass']
// Files that get an "html" icon.
const HTML_FILES = ['html', 'vue']
// Files that get an "image" icon.
const IMAGE_FILES = ['jpg', 'jpeg', 'png', 'svg', 'ico', 'gif']
// Files that get an "image" icon but can't be rendered in an img tag.
const SPECIAL_IMAGE_FILES = ['hdr']
// Files that get a "JS" icon.
const RAW_JS_FILES = ['js', 'ts']
// Files that get a "JSON" icon.
const JSON_FILES = ['json']
// Files that get an "MD" icon.
const MD_FILES = ['md']
// Files that get a "React" icon.
const REACT_FILES = ['tsx', 'jsx']
// Files that get a "text" icon.
const TXT_FILES = ['txt']
// Files that get a "video" icon.
const VIDEO_FILES = ['mp4']
// Font files
const FONT_FILES = ['ttf', 'woff', 'woff2', 'otf', 'fnt', 'eot']
// Custom font files output from studio font conversion
const CUSTOM_FONT_FILES = ['font8']
// Files that we support conversion but not direct upload
const CONVERSION_FILES = ['fbx']

// FILE_KIND actually maps to icon in file-list-icon.tsx
const FILE_KIND = {
  hologram: HOLOGRAM_MODEL_FILES,
  model: NORMAL_MODEL_FILES,
  splat: SPLAT_MODEL_FILES,
  audio: AUDIO_FILES,
  css: CSS_FILES,
  html: HTML_FILES,
  image: [].concat(IMAGE_FILES, SPECIAL_IMAGE_FILES),
  js: RAW_JS_FILES,
  json: JSON_FILES,
  md: MD_FILES,
  react: REACT_FILES,
  txt: TXT_FILES,
  video: VIDEO_FILES,
  font: [].concat(FONT_FILES, CUSTOM_FONT_FILES),
}

const JS_FILES = [].concat(RAW_JS_FILES, REACT_FILES)
// NOTE(dat): Make sure to check your file against the SPECIAL_TEXT_FILES list
const TEXT_FILES = [].concat(CSS_FILES, HTML_FILES, JS_FILES, JSON_FILES, MD_FILES, TXT_FILES)
const MODEL_FILES = [...NORMAL_MODEL_FILES, ...SPLAT_MODEL_FILES, ...HOLOGRAM_MODEL_FILES]
const ASSET_FILES = [].concat(
  IMAGE_FILES,
  SPECIAL_IMAGE_FILES,
  VIDEO_FILES,
  AUDIO_FILES,
  MODEL_FILES,
  FONT_FILES,
  SPLAT_MODEL_FILES
)
const LINTABLE_FILES = [].concat('css', 'scss', HTML_FILES, JS_FILES, JSON_FILES, MD_FILES)

const SPECIAL_TEXT_FILES = new Set(['LICENSE'])

// Files that cannot be uploaded as regular assets, they must be in a bundle
const BUNDLE_ONLY_FILES = new Set(['hcap', 'gltf'])

const STUDIO_FILES = [].concat(TEXT_FILES, ASSET_FILES)

const STUDIO_UPLOAD_ACCEPT = [].concat(STUDIO_FILES, CONVERSION_FILES)

const MAIN_FILES = {
  'head.html': '<!-- Optional HTML fragment to add to your 8th Wall app\'s <head> -->\n',
  'body.html': '<!-- Optional HTML fragment to add to your 8th Wall app\'s <body> -->\n',
  'app.js': `// app.js is the main entry point for your 8th Wall app.
const xrScene = \`
<a-scene xrweb xrextras-tap-recenter xrextras-almost-there xrextras-loading xrextras-runtime-error>
  <a-camera position="0 3 3"></a-camera>
  <a-box position="0 0.5 -1" material="color: #7611B6;" shadow></a-box>
  <a-box scale="100 2 100" position="0 -1 0" material="shader: shadow" shadow></a-box>
</a-scene>
\`

// Load AFrame and then add our scene to html.
XRExtras.AFrame.loadAFrameForXr()
  .then(() => document.body.insertAdjacentHTML('beforeend', xrScene))
`,
}

const MAIN_FILES_ORDER = {
  'head.html': 0,
  'app.js': 1,
  'body.html': 2,
}

const isFolderPath = (filePath: string) => {
  if (SPECIAL_TEXT_FILES.has(filePath)) {
    return false
  }

  const fileBasename = basename(filePath)
  return !!fileBasename && !fileBasename.includes('.')
}

const isMainPath = (filePath: string) => !!MAIN_FILES[filePath]

const isModuleMainPath = (filePath: string) => ['module.js', MANIFEST_FILE_PATH].includes(filePath)

const isAllowedExtensions = (filePath: string, extensions: string[]): boolean => (
  !extensions?.length || extensions.includes(fileExt(filePath))
)

const isAssetPath = (filePath: string) => !!(
  filePath && (filePath === ASSET_FOLDER || filePath.startsWith(ASSET_FOLDER_PREFIX))
)

const isBackendPath = (filePath: string) => !!(
  filePath && (filePath === BACKEND_FOLDER || filePath.startsWith(BACKEND_FOLDER_PREFIX)) &&
  filePath.endsWith(BACKEND_FILE_EXT)
)

const isDependencyPath = (filePath: string) => !!(
  filePath && (filePath === DEPENDENCY_FOLDER || filePath.startsWith(DEPENDENCY_FOLDER_PREFIX))
)

const isHiddenPath = (filePath: string) => !!(
  filePath && (filePath.startsWith('.'))
)

const isTextPath = (filePath: string, checkMainPath: (path: string) => boolean) => !(
  isAssetPath(filePath) || checkMainPath(filePath) || isBackendPath(filePath) ||
  isDependencyPath(filePath) || (!BuildIf.EXPERIMENTAL && filePath === CLIENT_FILE_PATH)
)

// TODO(christoph): Switch other logic to this function
const isLintablePath = (filePath: string) => (
  !isAssetPath(filePath) &&
  !isDependencyPath(filePath) &&
  filePath !== MANIFEST_FILE_PATH &&
  LINTABLE_FILES.includes(fileExt(filePath))
)

const isReactOrHtmlPath = (filePath: string) => {
  const ext = fileExt(filePath)
  return !isAssetPath(filePath) && (REACT_FILES.includes(ext) || HTML_FILES.includes(ext))
}

const validateFolderName = (name: string) => !!name.match(/^[a-zA-Z0-9\-_]+$/)

const validateFileName = (name: string) => !!name.match(/^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9]+$/)

const validateBackendFileName = (name: string) => {
  const basenameParts = basename(name).split('.')
  return dirname(name) === BACKEND_FOLDER && basenameParts.length === 3 &&
    !!(basenameParts[0]).match(/^[a-z0-9-]+$/) && basenameParts[0].length <= MAX_BACKEND_NAME_LENGTH
}

const validatePath = (path: string, validateLastComponent = true) => {
  let pathComponents = path.split('/')

  if (!validateLastComponent) {
    pathComponents = pathComponents.slice(0, -1)
  }

  if (pathComponents[0] === BACKEND_FOLDER) {
    return false
  }

  if (pathComponents.some(name => !validateFolderName(name))) {
    return false
  }

  return true
}

type ValidateFileOptions = Partial<{
  requireAssetContent: boolean
  content: string
  previousExtension: string
}>

const validateFile = (filePath: string, options?: ValidateFileOptions) => {
  const {requireAssetContent, content, previousExtension} = options || {}

  // If containing folders aren't valid, reject
  if (!validatePath(filePath, false)) {
    return false
  }

  // IF the filename is a preapproved special file, accept
  if (SPECIAL_TEXT_FILES.has(filePath)) {
    return true
  }

  // If the filename doesn't match the expected format, reject
  if (!validateFileName(basename(filePath))) {
    return false
  }

  const isAsset = isAssetPath(filePath)

  // Ensure contents are not empty before upload
  if (isAsset && requireAssetContent && !content) {
    return false
  }

  // Check extensions
  const ext = fileExt(filePath)

  // If the file already had the extension, allow it
  if (ext === previousExtension) {
    return true
  }

  if (isAsset) {
    // For assets, a file must be an known asset file type
    if (!ASSET_FILES.includes(ext)) {
      return false
    }

    // BUNDLE_ONLY_FILES aren't allowed to be standalone files
    if (BUNDLE_ONLY_FILES.has(ext)) {
      return false
    }
  } else if (!TEXT_FILES.includes(ext)) {
    return false
  }

  return true
}

const validateFileError = (filePath: string, options?: ValidateFileOptions) => {
  if (validateFile(filePath, options)) {
    return null
  }
  const extension = fileExt(filePath)
  if (!(ASSET_FILES.includes(extension) || TEXT_FILES.includes(extension))) {
    const listExtensions = fileTypes => fileTypes.map(ext => `'${ext}'`).join(', ')
    const supportedExtensions = [listExtensions(ASSET_FILES), listExtensions(TEXT_FILES)]
      .join(', ')
    // eslint-disable-next-line local-rules/hardcoded-copy
    const fileExtensionErrorMsg = `Unsupported file extension (${extension}).
        Please retry with one of the following file extensions ${supportedExtensions}.`
    return fileExtensionErrorMsg
  }
  // eslint-disable-next-line local-rules/hardcoded-copy
  return 'Invalid filename'
}

const sanitizeFilePath = (filePath: string) => {
  let sanitizedBaseName = basename(filePath)
  const directories = dirname(filePath)
  const ext = fileExt(filePath)
  if (ext) {
    sanitizedBaseName = sanitizedBaseName.replace(/\.[^/.]+$/, '')  // Remove extension.
  }

  sanitizedBaseName = sanitizedBaseName
    .replace(/\s+/g, '_')           // Replace spaces with underscore.
    .replace(/[^A-Z0-9_-]+/ig, '')  // Only allow alphanumeric, underscore, or dashes.

  return join(directories, joinExt(sanitizedBaseName, ext))
}

// Get the new path for a file that was dragged around the file tree.
const getDraggedFilePath = (filePath: string, folderPath: string = null) => {
  let folderDest = folderPath

  if (isAssetPath(filePath) && !folderDest) {
    // If the file is an asset, dragging to the "top level" should drag to the top level of the
    // assets folder instead.
    folderDest = ASSET_FOLDER
  }

  const name = basename(filePath)
  return folderDest ? join(folderDest, name) : name
}

// Change the name of a file while keeping it in the same enclosing folder.
const getRenamedFilePath = (newName: string, filePath: string) => {
  const pathComponents = filePath.split('/')
  pathComponents[pathComponents.length - 1] = newName
  return pathComponents.join('/')
}

const containsFolderEntry = (items: DataTransferItemList) => (
  items && Array.from(items).some(item => item.webkitGetAsEntry?.()?.isDirectory)
)

const hasBundleFile = (files: File[]) => files.some((file) => {
  const ext = fileExt(file.name)
  return ext === 'zip' || BUNDLE_ONLY_FILES.has(ext)
})

const generateDependencyFilePath = () => `${DEPENDENCY_FOLDER_PREFIX}${uuidv4()}.json`

const isLandablePath = (filePath: string) => (
  !IGNORED_LANDING_FILES.includes(filePath)
)

const isJsPath = (filePath: string) => JS_FILES.includes(fileExt(filePath))

export {
  ASSET_FOLDER_PREFIX,
  ASSET_FOLDER,
  BACKEND_FOLDER_PREFIX,
  BACKEND_FOLDER,
  BACKEND_FILE_EXT,
  README_FILE_PATH,
  DEPENDENCY_FOLDER_PREFIX,
  DEPENDENCY_FOLDER,
  MANIFEST_FILE_PATH,
  IGNORED_LANDING_FILES,
  AUDIO_FILES,
  CSS_FILES,
  CLIENT_FILE_PATH,
  HTML_FILES,
  IMAGE_FILES,
  SPECIAL_IMAGE_FILES,
  RAW_JS_FILES,
  JSON_FILES,
  MD_FILES,
  REACT_FILES,
  TXT_FILES,
  VIDEO_FILES,
  FONT_FILES,
  CUSTOM_FONT_FILES,
  FILE_KIND,
  JS_FILES,
  TEXT_FILES,
  MODEL_FILES,
  NORMAL_MODEL_FILES,
  SPLAT_MODEL_FILES,
  NO_PREVIEW_MODEL_FILES,
  ASSET_FILES,
  SPECIAL_TEXT_FILES,
  BUNDLE_ONLY_FILES,
  STUDIO_FILES,
  STUDIO_UPLOAD_ACCEPT,
  MAIN_FILES,
  MAIN_FILES_ORDER,
  LINTABLE_FILES,
  ECS_DEF_FILE_PATH,
  GLOBAL_DEF_FILE_PATH,
  EDITOR_DEFINITION_MODALS,
  STUDIO_DEFINITION_MODALS,
  ALL_DEFINITION_MODALS,
  isFolderPath,
  isMainPath,
  isHiddenPath,
  isModuleMainPath,
  isAssetPath,
  isBackendPath,
  isDependencyPath,
  isTextPath,
  validateFileName,
  validateBackendFileName,
  validatePath,
  validateFile,
  validateFileError,
  sanitizeFilePath,
  getDraggedFilePath,
  getRenamedFilePath,
  containsFolderEntry,
  hasBundleFile,
  generateDependencyFilePath,
  isLandablePath,
  isAllowedExtensions,
  isLintablePath,
  isReactOrHtmlPath,
  isJsPath,
}
