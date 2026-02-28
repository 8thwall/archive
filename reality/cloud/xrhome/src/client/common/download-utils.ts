import type JSZip from 'jszip'
import type {TFunction} from 'react-i18next'

import type {ImageTargetDataCodeExport} from '../../shared/engine/image-targets'
import {
  parse as parseAsset, isBundle, BundleAssetPointer, SingleAssetPointer, isSingle,
  getSinglePath,
} from '@nia/reality/shared/asset-pointer'

import {getAssetUrl} from './hosting-urls'
import {isAssetPath} from './editor-files'
import type {IGit} from '../git/g8-dto'
import {makeRunQueue} from '@nia/reality/shared/run-queue'
import {resolveAll} from '../../shared/async'
import type {IImageTarget} from './types/models'

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const parseCsvLines = (data: object[]) => {
  if (data.length === 0) {
    return ''
  }
  const sortedKeys = Object.keys(data[0]).sort()
  const head = sortedKeys.map(v => `"${v}"`).join(',')
  const body = data.map(
    lineObject => sortedKeys.map(
      key => `"${lineObject[key]}"`
    ).join(',')
  ).join('\n')
  return `${head}\n${body}`
}

const downloadThunkCsv = async (dataThunk: () => Promise<object[]>, filename: string) => {
  const data = await dataThunk()
  const parsedData = parseCsvLines(data)
  const blob = new Blob([parsedData], {type: 'text/csv'})
  downloadBlob(blob, filename)
}

const retrieveAssetBlob = async (asset: SingleAssetPointer) => {
  const url = getAssetUrl(`/download${getSinglePath(asset)}`)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download asset blob from "${url}"`)
  }

  return response.blob()
}

const createAssetBundleZip = async (assetPointer: BundleAssetPointer) => {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  const filePromises = Object.entries(assetPointer.files).map(async ([filename, path]) => {
    const fileBlobData = await retrieveAssetBlob(parseAsset(path) as SingleAssetPointer)
    zip.file(filename, fileBlobData)
  })

  await Promise.all(filePromises)
  return zip.generateAsync({type: 'blob'})
}

const getDownloadableFile = async (filePath: string, fileContent: string) => {
  if (isAssetPath(filePath)) {
    const assetPointer = parseAsset(fileContent)
    if (isBundle(assetPointer)) {
      return createAssetBundleZip(assetPointer)
    } else if (isSingle(assetPointer)) {
      return retrieveAssetBlob(assetPointer)
    } else {
      throw new Error('Unexpected asset type to download')
    }
  }

  return new Blob([fileContent], {type: 'text/plain'})
}

const downloadEditorFile = async (filePath: string, fileContent: string, saveAsName: string) => {
  const fileBlob = await getDownloadableFile(filePath, fileContent)
  downloadBlob(fileBlob, fileBlob.type === 'application/zip' ? `${saveAsName}.zip` : saveAsName)
}

const zipAssetBundle = async (
  zip: JSZip,
  prefix: string,
  assetPointer: BundleAssetPointer
) => {
  const queue = makeRunQueue(10)
  const filePromises = Object.entries(assetPointer.files)
    .map(([filename, path]) => queue.next(async () => {
      const fileBlobData = await retrieveAssetBlob({type: 'single', path})
      zip.file(`${prefix}/${filename}`, fileBlobData)
    }))
  await resolveAll(filePromises)
}

const zipEditorFolder = async (
  {
    zip,
    filesByPath,
    filesFolderFilter,
    folderPrefixToAdd = '',
    onProgress = null,
  }: {
    zip: JSZip
    filesByPath: IGit['filesByPath']
    filesFolderFilter?: string
    folderPrefixToAdd?: string
    onProgress?: ((completed: number, total: number) => void) | null
  }
) => {
  const prefix = filesFolderFilter !== undefined ? `${filesFolderFilter}/` : ''

  const files = Object.entries(filesByPath).filter(([path, file]) => (
    !file.isDirectory && (filesFolderFilter === undefined || path.startsWith(prefix))
  ))

  const totalFiles = files.length
  let processedFiles = 0

  const runQueue = makeRunQueue(10)

  const filePromises = files.map(([path, file]) => runQueue.next(async () => {
    const savePath = `${folderPrefixToAdd}${path.substring(prefix.length)}`
    if (isAssetPath(path)) {
      const assetPointer = parseAsset(file.content)
      if (isBundle(assetPointer)) {
        await zipAssetBundle(zip, savePath, assetPointer)
        return
      } else if (isSingle(assetPointer)) {
        zip.file(savePath, await retrieveAssetBlob(assetPointer))
      } else {
        throw new Error('Unexpected asset type to download')
      }
    } else {
      zip.file(savePath, new Blob([file.content], {type: 'text/plain'}))
    }
    if (onProgress) {
      processedFiles++
      onProgress(processedFiles, totalFiles)
    }
  }))

  await resolveAll(filePromises)
}

/**
 * Downloads folder of files to a zip.
 * @param filesByPath - The files.
 * @param saveAsName - The name of the zip to download.
 * @param filesFolderFilter - The path to the folder to download. Only files in filesByPath which
 * are in this folder will be downloaded. If unset, all non-directory files will be downloaded.
 * @param folderPrefixToAdd - The prefix to add to the path of the files in the zip.
 */
const downloadEditorFolder = async (
  {
    filesByPath,
    saveAsName,
    filesFolderFilter,
    folderPrefixToAdd = '',
  }: {
    filesByPath: IGit['filesByPath']
    saveAsName: string
    filesFolderFilter?: string
    folderPrefixToAdd?: string
  }
) => {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  await zipEditorFolder({zip, filesByPath, filesFolderFilter, folderPrefixToAdd})

  const zipBlob = await zip.generateAsync({type: 'blob'})
  downloadBlob(zipBlob, `${saveAsName}.zip`)
}

/**
 * Downloads a zip bundle from a CDN URL and extracts its files into the provided zip
 * @param zip - The JSZip instance to add files to
 * @param bundleUrl - The URL of the zip bundle to download
 * @param prefix - The folder prefix to add to extracted files (e.g., 'external/runtime/')
 */
const downloadAndExtractBundle = async (
  zip: JSZip,
  bundleUrl: string,
  prefix: string
) => {
  const JsZip = (await import('jszip')).default

  const response = await fetch(bundleUrl)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch bundle from ${bundleUrl}: ${response.status} - ${response.statusText}`
    )
  }

  const bundleBlob = await response.blob()
  const bundleZip = await JsZip.loadAsync(bundleBlob)
  const bundleFiles = Object.keys(bundleZip.files).filter(
    fileName => !bundleZip.files[fileName].dir
  )

  const runQueue = makeRunQueue(10)

  const filePromises = bundleFiles.map(fileName => runQueue.next(async () => {
    const file = bundleZip.files[fileName]
    const content = await file.async('blob')
    zip.file(`${prefix}${fileName}`, content)
  }))

  await resolveAll(filePromises)
}

/**
 * Downloads a file from a URL and adds it to a zip
 * @param zip - The JSZip instance to add the file to
 * @param name - The name of the file
 * @param url - The URL of the file to download
 * @returns The name of the file in the zip, or an empty string if the URL is empty
*/
const downloadAndZip = async (
  zip: JSZip,
  name: string | ((type: string) => string),
  url: string
): Promise<string> => {
  if (!url) {
    // This is expected for some inputs (e.g. image target source images) which are missing the url.
    return ''
  }
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error downloading ${url}: ${response.status} - ${response.statusText}`)
  }
  const blob = await response.blob()
  const fileName = typeof name === 'function' ? name(blob.type) : name
  zip.file(fileName, blob)
  return fileName
}

const downloadAndZipImage = async (
  zip: JSZip,
  name: string,
  url: string
): Promise<string> => downloadAndZip(zip, type => `${name}.${type.split('/')[1]}`, url)

/**
 * Downloads all image targets for an app and zips them.
 * @param zip The JSZip instance to add the image targets to.
 * @param appUuid The UUID of the app to download the image targets for.
 * @param fetchAllImageTargetsForApp A function to fetch all image targets for an app.
 * @param t The translation function.
 * @param setProgressState A function to set the progress state.
 * @returns Any warnings or errors that occurred.
 */
const downloadAndZipAllImageTargetsForApp = async (
  zip: JSZip,
  appUuid: string,
  fetchAllImageTargetsForApp: (appUuid: string) => Promise<IImageTarget[]>,
  t: TFunction,
  setProgressState: (progressState: {stage: 'targets', current: number, total: number}) => void
): Promise<string[]> => {
  const warnings: string[] = []

  try {
    const imageTargets = await fetchAllImageTargetsForApp(appUuid)
    const targetCount = imageTargets.length
    const queue = makeRunQueue(10)
    let completed = 0
    setProgressState({stage: 'targets', current: 0, total: targetCount})

    await resolveAll(imageTargets.map(target => queue.next(async () => {
      try {
        const downloadPromises = [
          downloadAndZipImage(zip, `image-targets/${target.name}_target`,
            target.imageSrc),
          downloadAndZipImage(zip, `image-targets/${target.name}_original`,
            target.originalImageSrc),
          downloadAndZipImage(zip, `image-targets/${target.name}_thumbnail`,
            target.thumbnailImageSrc),
          downloadAndZipImage(zip, `image-targets/${target.name}_geometry`,
            target.geometryTextureImageSrc),
        ]
        const downloadResults = await Promise.all(downloadPromises)
        const imageTargetFileName = downloadResults[0]
        if (!imageTargetFileName) {
          throw new Error(`Failed to download image target for ${target.name}`)
        }

        let metadata: unknown
        if (target.userMetadata) {
          if (target.userMetadataIsJson) {
            metadata = JSON.parse(target.userMetadata)
          } else {
            metadata = target.userMetadata
          }
        }
        if (target.type === 'UNSPECIFIED' || target.type === 'SCAN') {
          throw new Error(`Unsupported image target type ${target.type} for ${target.name}`)
        }
        const imageTargetData: ImageTargetDataCodeExport = {
          imagePath: imageTargetFileName,
          metadata,
          moveable: target.moveable,
          name: target.name,
          physicalWidthInMeters: target.physicalWidthInMeters,
          type: target.type,
          properties: JSON.parse(target.metadata),
          userMetadataIsJson: target.userMetadataIsJson,
          loadAutomatically: target.loadAutomatically,
          // TODO(paris): The DB defines target as having createdAt and updatedAt, but in
          // practice they are created and updated. Investigate why.
          // @ts-expect-error: target is not of type ImageTargetDataCodeExport
          created: target.created,
          // @ts-expect-error: target is not of type ImageTargetDataCodeExport
          updated: target.updated,
        }
        zip.file(
          `image-targets/${target.name}.json`,
          JSON.stringify(imageTargetData, null, 2)
        )
      } catch (error) {
        // eslint-disable-next-line local-rules/hardcoded-copy
        warnings.push(`Error parsing metadata for ${target.name}: ${error.message}`)
      }
      completed++
      setProgressState({stage: 'targets', current: completed, total: targetCount})
    })))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    warnings.push(t('export_flow_code.feature.image_targets'))
  }
  return warnings
}

export {
  downloadBlob,
  downloadThunkCsv,
  downloadEditorFile,
  zipEditorFolder,
  downloadEditorFolder,
  createAssetBundleZip,
  retrieveAssetBlob,
  downloadAndExtractBundle,
  downloadAndZip,
  downloadAndZipImage,
  downloadAndZipAllImageTargetsForApp,
}
