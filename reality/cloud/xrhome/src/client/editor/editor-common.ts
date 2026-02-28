const fileExt =
  filename => (
    (filename && filename.includes('.'))
      ? filename.split('.').slice(-1)[0].toLowerCase()
      : ''
  )
const joinExt = (fileName, ext) => (ext ? `${fileName}.${ext}` : fileName)
const basename = filePath => filePath.split('/').slice(filePath.endsWith('/') ? -2 : -1)[0]
const dirname = (filePath: string): string => filePath.split('/').slice(0, -1).join('/')

// NOTE(pawel) when updating this mode, the corresponding file to keep in sync is
// //src/third_party/react-ace/mode-merge8.js

const fileNameToEditorMode = filename => ({
  css: 'css',
  html: 'html',
  js: 'javascript',
  json: 'json',
  jsx: 'jsx8',
  md: 'markdown',
  scss: 'scss',
  ts: 'typescript8',
  tsx: 'tsx8',
  txt: 'text',
  vue: 'html',
}[fileExt(filename)] || 'text')

const fileExtToMonacoLanguage = (ext: string) => ({
  js: 'javascript',
  ts: 'typescript',
  jsx: 'javascript',
  tsx: 'typescript',
  md: 'markdown',
}[ext] || 'text')

const fileNameToMonacoLanguage = (filename: string) => fileExtToMonacoLanguage(fileExt(filename))

// If we have defined an merge-friendly override, use it
const editorModeToMergeEditorMode = mode => ({
  javascript: 'javascript-merge',
  text: 'text-merge',
})[mode] || mode

const TEMPLATE_GROUP_SORT_ORDER = {
  'a-frame': -3,
  'three.js': -2,
  'babylon.js': -1,
}

const getPrecedence = a => (TEMPLATE_GROUP_SORT_ORDER[a.toLowerCase()] || 0)

const sortTemplateGroups = (a, b) => getPrecedence(a) - getPrecedence(b)

export {
  fileExt,
  joinExt,
  basename,
  dirname,
  fileNameToEditorMode,
  editorModeToMergeEditorMode,
  fileExtToMonacoLanguage,
  fileNameToMonacoLanguage,
  sortTemplateGroups,
  fileNameToEditorMode as default,
}
