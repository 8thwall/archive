import React from 'react'
import {useTranslation} from 'react-i18next'

import type {ISplitFiles} from '../git/split-files-by-type'
import {FileListFile} from './files/file-list-file'
import {FileListFolder} from './files/file-list-folder'
import {useNewFileOptions} from './files/use-new-file-options'
import {NewFileItem} from './files/new-file-item'
import {OptionsDropdown} from './files/options-dropdown'
import type {IOptionItem} from './files/option-item'
import {Icon} from '../ui/components/icon'
import {EXPANSE_FILE_PATH} from '../studio/common/studio-files'
import type {NewItem} from './files/file-actions-context'
import {combine} from '../common/styles'
import {useStudioMenuStyles} from '../studio/ui/studio-menu-styles'

type ItemType = 'file' | 'component' | 'folder'

interface IFileList {
  title?: string
  subtitle?: string
  onFileSelect?: Function
  paths: ISplitFiles
  currentEditorFilePath: string
  onCreateAssetBundle?: (type?: string) => void
  onCreateItem?: (newItem: {name: string, isFile: boolean}) => void
  onCreateBackendConfig?: () => void
  disableNewFiles?: boolean
  additionalOptions?: IOptionItem[]
  productTourId?: string
  isStudio?: boolean
}

const STUDIO_HIDDEN_FILE_PATHS = [EXPANSE_FILE_PATH]

const FileList: React.FC<IFileList> = ({
  title, subtitle, onFileSelect, paths, currentEditorFilePath, onCreateAssetBundle,
  disableNewFiles, onCreateItem, additionalOptions = [], productTourId, onCreateBackendConfig,
  isStudio,
}) => {
  const {t} = useTranslation(['cloud-editor-pages'])

  const [adding, setAdding] = React.useState(false)
  const [itemType, setItemType] = React.useState<ItemType>(null)
  const classes = useStudioMenuStyles()

  const startNewItem = (newItem: ItemType) => {
    setItemType(newItem)
    setAdding(true)
  }

  const cancelNewItem = () => {
    setAdding(false)
  }

  const handleCreateItem = (newItem: NewItem) => {
    setAdding(false)
    onCreateItem(newItem)
  }

  const onCreateAssetBundleExists = !!onCreateAssetBundle
  const onCreateBackendConfigExists = !!onCreateBackendConfig

  const fileOptions = useNewFileOptions({
    startNewItem,
    supportsNewFile: !!onCreateItem && !disableNewFiles,
    supportsNewComponentFile: !!onCreateItem && isStudio && !disableNewFiles,
    supportsNewFolder: !!onCreateItem,
    supportsAssetBundle: onCreateAssetBundleExists,
  })

  return (
    <>
      {title &&
        <div className='file-list-bar'>
          <h4 className={combine('file-list-title', isStudio && classes.studioFont)}>
            {title}
            {subtitle && (
              <span className={combine('file-list-subtitle', isStudio && classes.studioFont)}>
                {subtitle}
              </span>
            )}
          </h4>

          <div className='right-actions'>
            <OptionsDropdown
              a8={
                onCreateAssetBundleExists
                  ? 'click;cloud-editor-asset-management;add-asset-button'
                  : undefined
            }
              options={[
                ...fileOptions,
                onCreateAssetBundleExists && {
                  type: 'menu',
                  content: t('file_list.option.new_asset_bundle'),
                  options: [
                    {
                      content: t('file_list.option.hcap_file'),
                      onClick: () => onCreateAssetBundle('hcap'),
                      a8: 'click;cloud-editor-asset-management;add-hcap-file-button',
                    },
                    {
                      content: t('file_list.option.gltf_file'),
                      onClick: () => onCreateAssetBundle('gltf'),
                      a8: 'click;cloud-editor-asset-management;add-gltf-file-button',
                    },
                    {
                      content: t('file_list.option.other'),
                      onClick: () => onCreateAssetBundle('other'),
                      a8: 'click;cloud-editor-asset-management;add-other-file-button',
                    },
                  ],
                },
                {
                  content: t('file_list.option.upload'),
                  onClick: onFileSelect,
                  a8: onCreateAssetBundleExists
                    ? 'click;cloud-editor-asset-management;upload-assets-button'
                    : undefined,
                },
                onCreateBackendConfigExists && {
                  content: t('file_list.option.new_backend_config'),
                  onClick: onCreateBackendConfig,
                  a8: 'click;cloud-editor-asset-management;new-backend-proxy-button',
                },
                ...additionalOptions,
              ]}
              icon={<Icon stroke='plus' color='gray4' block />}
            />
          </div>
        </div>
      }
      <ul className='file-list' id={productTourId}>
        {adding &&
          <NewFileItem
            itemType={itemType}
            onSubmit={handleCreateItem}
            onCancel={cancelNewItem}
            isStudio={isStudio}
          />
        }
        {paths.folderPaths.map(filePath => (
          <FileListFolder
            key={filePath}
            filePath={filePath}
            currentEditorFilePath={currentEditorFilePath}
            isStudio={isStudio}
          />
        ))}
        {paths.filePaths.map((filePath) => {
          if (isStudio && STUDIO_HIDDEN_FILE_PATHS.includes(filePath)) {
            return null
          }

          return (
            <FileListFile
              key={filePath}
              filePath={filePath}
              currentEditorFilePath={currentEditorFilePath}
              isStudio={isStudio}
            />
          )
        })}
      </ul>
    </>
  )
}

export type {
  ItemType,
}

export {
  FileList,
}
