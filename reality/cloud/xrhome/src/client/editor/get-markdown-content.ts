import {getMainPath} from '../../shared/asset-pointer'
import {ASSET_FOLDER_PREFIX} from '../common/editor-files'
import {getAssetUrl} from '../common/hosting-urls'
import type {IGitFile} from '../git/g8-dto'

const REGEXP_ASSET_MATCH = new RegExp(
  `!\\[([^[\\]]*)]\\((?:./)*/*(${ASSET_FOLDER_PREFIX}.*?)\\)`, 'g'
)

type FileData = Record<string, Pick<IGitFile, 'content'>>

const getMarkdownContent = (fileData: FileData, fileContent: string) => (
  fileContent.replace(
    REGEXP_ASSET_MATCH,
    (match, altText, filePath) => {
      const content = fileData[filePath]?.content
      const url = getAssetUrl(getMainPath(content))
      return `![${altText}](${url || ''})`
    }
  )
)

export {
  getMarkdownContent,
}
