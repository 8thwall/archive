import JSZip from 'jszip'
import {getType} from 'mime'

import {fileExt, basename} from './editor-common'

type FileData = {filePath: string, data: Blob}
type FileAccessor = {filePath: string, data?: Blob, getData(): Promise<Blob>}

// If the user selected a single zip, transform it into its contents
export const unzipFiles = async (files: FileData[]) => {
  if (files.length !== 1 || fileExt(files[0].filePath) !== 'zip') {
    return files
  } else {
    const zip = new JSZip()
    await zip.loadAsync(files[0].data)

    const filePaths = Object.keys(zip.files).filter(path => !zip.files[path].dir)

    return filePaths.map(filePath => ({
      filePath,
      getData: async () => {
        const blob: Blob = await zip.files[filePath].async('blob')
        if (blob.type) {
          return blob
        }
        return new Blob([blob], {type: getType(filePath) || 'application/octet-stream'})
      },
    }))
  }
}

// Ignore files that shouldn't be selected
export const ignoreSystemFiles = (files: FileAccessor[]) => (
  files.filter(({filePath}) => (
    !filePath.startsWith('__MACOSX') &&
    basename(filePath) !== '.DS_Store'
  ))
)

// If the user selected a zip or a directory, it could cause all the files to be enclosed in the
// same folder. If this is the case, strip that folder from the path of all the files.
export const stripFirstFolder = (files: FileAccessor[]) => {
  if (files.length === 0) {
    return files
  }

  const firstFolderMatch = files[0].filePath.match(/^([^/]+\/)/)

  if (!firstFolderMatch) {
    return files
  }

  const firstFolderWithSlash = firstFolderMatch[1]

  if (files.every(({filePath}) => filePath.startsWith(firstFolderWithSlash))) {
    return files.map(({filePath, ...rest}) => ({
      filePath: filePath.substring(firstFolderWithSlash.length),
      ...rest,
    }))
  } else {
    return files
  }
}
