import React from 'react'
import {useTranslation} from 'react-i18next'

import {FloatingPanelIconButton} from '../ui/components/floating-panel-icon-button'
import {useNewFileOptions} from './hooks/use-new-file-options'
import {SelectMenu} from './ui/select-menu'
import {MenuOptions} from './ui/option-menu'
import {useStudioMenuStyles} from './ui/studio-menu-styles'

type ItemType = 'file' | 'component' | 'folder'

interface IFileBrowserCornerButton {
  onFileSelect?: Function
  onCreateAssetBundle?: (type?: string) => void
  onCreateItem?: (newItem: {name: string, isFile: boolean}) => void
  onCreateNewModule?: () => void
  disableNewFiles?: boolean
  setExternalAdding: (adding: boolean, isAssetPath?: boolean) => void
  setExternalItemType: (itemType: ItemType) => void
  isFileSection?: boolean
}

const FileBrowserCornerButton: React.FC<IFileBrowserCornerButton> = ({
  onFileSelect, onCreateAssetBundle, onCreateNewModule, disableNewFiles, onCreateItem,
  setExternalAdding, setExternalItemType, isFileSection,
}) => {
  const {t} = useTranslation(['cloud-editor-pages', 'cloud-studio-pages'])

  const menuStyles = useStudioMenuStyles()

  const startNewItem = (newItem: ItemType, isAssetPath?: boolean) => {
    setExternalItemType(newItem)
    setExternalAdding(true, isAssetPath)
  }

  const onCreateAssetBundleExists = !!onCreateAssetBundle

  const fileOptions = useNewFileOptions({
    startNewItem,
    supportsNewFile: !!onCreateItem && !disableNewFiles,
    supportsNewComponentFile: !!onCreateItem && !disableNewFiles,
    supportsNewFolder: false,
    supportsAssetBundle: onCreateAssetBundleExists,
  })

  const options = [
    {
      content: t('file_list.option.upload'),
      onClick: onFileSelect,
      a8: onCreateAssetBundleExists
        ? 'click;cloud-editor-asset-management;upload-assets-button'
        : undefined,
    },
    ...fileOptions,
    {
      type: 'menu',
      content: t('file_list.option.new_folder'),
      options: [
        {
          content: t('file_list.option.new_file_folder'),
          onClick: () => startNewItem('folder'),
        },
        {
          content: t('file_list.option.new_asset_folder'),
          onClick: () => startNewItem('folder', true),
        },
      ],
    },
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
  ]

  return (
    <>
      {isFileSection &&
        <SelectMenu
          id='file-browser-corner-dropdown'
          trigger={(
            <FloatingPanelIconButton
              a8='click;studio;file-browser-corner-menu-button'
              text={t('file_browser_corner_dropdown.label', {ns: 'cloud-studio-pages'})}
              stroke='plus'
            />
          )}
          menuWrapperClassName={menuStyles.studioMenu}
          placement='right-start'
          margin={16}
          minTriggerWidth
          returnFocus={false}
        >
          {collapse => (
            <MenuOptions
              collapse={collapse}
              options={options}
              returnFocus={false}
            />
          )}
        </SelectMenu>
      }
      {!isFileSection &&
        <FloatingPanelIconButton
          text={t('file_browser.modules_list.button.new_module', {ns: 'cloud-studio-pages'})}
          stroke='plus'
          onClick={onCreateNewModule}
        />
      }
    </>
  )
}

export {
  FileBrowserCornerButton,
}
