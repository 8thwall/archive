import React from 'react'
import {useTranslation} from 'react-i18next'

import icons from '../../apps/icons'
import {DropTarget} from '../drop-target'
import {matchPath} from './paths'
import {useCollapsedStatus} from '../../git/hooks/use-collapsed-status'
import {useFolderChildren} from '../../git/hooks/use-folder-children'
import {useLayoutChangeEffect} from '../../hooks/use-change-effect'
import {basename} from '../editor-common'
import {FileActionsContext, NewItem} from './file-actions-context'
import {isAssetPath} from '../../common/editor-files'
import FileListIcon from '../file-list-icon'
import {OptionsDropdown} from './options-dropdown'
import {stopPropagation} from './stop-propagation'
import {NewFileItem} from './new-file-item'
import {FileListFile} from './file-list-file'
import {StatusIcon} from './status-icon'
import InlineTextInput from '../../common/inline-text-input'
import {useNewFileOptions} from './use-new-file-options'
import {useCurrentRepoId} from '../../git/repo-id-context'
import {ContextDropdown} from './context-dropdown'
import type {ItemType} from '../file-list'
import {combine} from '../../common/styles'
import {useStudioMenuStyles} from '../../studio/ui/studio-menu-styles'

interface IFileListFolder {
  filePath: string
  currentEditorFilePath: string
  isStudio?: boolean
}

const FileListFolder: React.FC<IFileListFolder> = ({filePath, currentEditorFilePath, isStudio}) => {
  const [clickPoint, setClickPoint] = React.useState<[number, number]>(null)
  const [expanded, setExpanded] = React.useState(matchPath(currentEditorFilePath, filePath))
  const [adding, setAdding] = React.useState(false)
  const [itemType, setItemType] = React.useState<ItemType>(null)
  const [renaming, setRenaming] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)
  const [newName, setNewName] = React.useState('')

  const classes = useStudioMenuStyles()

  const name = basename(filePath)

  const repoId = useCurrentRepoId()
  const {onDelete, onRename, onDrop, onCreate} = React.useContext(FileActionsContext)

  const {folderPaths, filePaths} = useFolderChildren(filePath)
  const isEmpty = !folderPaths.length && !filePaths.length

  const {status, dirty} = useCollapsedStatus(filePath, !isEmpty && !expanded)

  const {t} = useTranslation(['cloud-editor-pages'])

  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setClickPoint([event.clientX, event.clientY])
  }

  useLayoutChangeEffect(([, previousEditorFilePath]) => {
    const shouldExpand = !expanded &&
                         currentEditorFilePath !== previousEditorFilePath &&
                         matchPath(currentEditorFilePath, filePath)
    if (shouldExpand) {
      setExpanded(true)
    }
  }, [expanded, currentEditorFilePath, filePath] as const)

  const disableNewFiles = isAssetPath(filePath)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const handleHoverStart = () => {
    setDragging(true)
  }

  const handleHoverEnd = () => {
    setDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.persist()
    setDragging(false)
    if (isEmpty) {
      setExpanded(true)
    }
    onDrop(e, filePath)
  }

  const startNewItem = (newItemType: ItemType) => {
    setItemType(newItemType)
    setAdding(true)
  }

  const cancelNewItem = () => {
    setAdding(false)
  }

  const handleCreateItem = (newItem: NewItem) => {
    setAdding(false)
    setExpanded(true)
    onCreate(newItem, filePath)
  }

  const startRename = () => {
    setNewName(name)
    setRenaming(true)
  }

  const cancelRename = () => {
    setRenaming(false)
  }

  const handleRenameSubmit = () => {
    setRenaming(false)
    onRename(newName, filePath)
  }

  let folderIcon
  if (isEmpty) {
    folderIcon = icons.folder_empty
  } else if (expanded) {
    folderIcon = icons.folder_expanded
  } else {
    folderIcon = icons.folder_collapsed
  }

  const options = [
    ...useNewFileOptions({
      startNewItem,
      supportsNewFile: !disableNewFiles,
      supportsNewFolder: true,
      supportsNewComponentFile: false,
    }),
    {content: t('file_list.option.rename'), onClick: startRename},
    {content: t('file_list.option.delete'), onClick: () => onDelete(filePath)},
  ]

  return (
    <DropTarget
      as='li'
      className={`file-list-item folder${dragging ? ' active' : ''}`}
      onDrop={handleDrop}
      onHoverStart={handleHoverStart}
      onHoverStop={handleHoverEnd}
    >
      <button
        type='button'
        className='style-reset file-bar'
        onClick={stopPropagation(toggleExpanded)}
        draggable={!renaming}
        onDragStart={(e) => {
          e.dataTransfer.setData('filePath', filePath)
          e.dataTransfer.setData('repoId', repoId)
        }}
        onContextMenu={handleContextMenu}
      >
        <FileListIcon icon={folderIcon} />

        {renaming
          ? (
            <InlineTextInput
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onCancel={cancelRename}
              onSubmit={handleRenameSubmit}
              // eslint-disable-next-line local-rules/hardcoded-copy
              formClassName={combine('file-name edit', isStudio && classes.studioFont)}
              inputClassName='style-reset file-input'
            />
          )
          : (
            <span
              className={combine('file-name', isStudio && classes.studioFont)}
              title={name}
            >{name}
            </span>
          )
        }

        <span className='file-right-section'>
          <StatusIcon status={status} dirty={dirty} />
        </span>
        <OptionsDropdown options={options} />
        {clickPoint !== null &&
          <ContextDropdown
            options={options}
            onClose={() => setClickPoint(null)}
            clickPoint={clickPoint}
          />
        }
      </button>

      {(expanded || adding) &&
        <ul>
          {adding &&
            <NewFileItem
              itemType={itemType}
              onSubmit={handleCreateItem}
              onCancel={cancelNewItem}
              isStudio={isStudio}
            />
          }
          {folderPaths.map(subfolder => (
            <FileListFolder
              key={subfolder}
              filePath={subfolder}
              currentEditorFilePath={currentEditorFilePath}
              isStudio={isStudio}
            />
          ))}
          {filePaths.map(file => (
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            <FileListFile
              key={file}
              filePath={file}
              currentEditorFilePath={currentEditorFilePath}
              isStudio={isStudio}
            />
          ))}
        </ul>
      }
    </DropTarget>
  )
}

export {FileListFolder}

export type {IFileListFolder}
