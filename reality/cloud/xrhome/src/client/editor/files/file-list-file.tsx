import React from 'react'
import {useTranslation} from 'react-i18next'

import {getAssetDownloadUrl} from '../../common/hosting-urls'
import {
  isAssetPath, isLintablePath, isBackendPath, BACKEND_FILE_EXT,
} from '../../common/editor-files'
import {useFileContent} from '../../git/hooks/use-file-content'
import {FileActionsContext} from './file-actions-context'
import {basename} from '../editor-common'
import {useChangesetStatus} from '../../git/hooks/use-changeset-status'
import {stopPropagation} from './stop-propagation'
import FileListIcon from '../file-list-icon'
import InlineTextInput from '../../common/inline-text-input'
import {StatusIcon} from './status-icon'
import {OptionsDropdown} from './options-dropdown'
import {useCurrentRepoId} from '../../git/repo-id-context'
import {ContextDropdown} from './context-dropdown'
import {extractBackendFilename} from '../backend-config/backend-config-files'
import {combine} from '../../common/styles'
import {useStudioMenuStyles} from '../../studio/ui/studio-menu-styles'

interface IFileListFile {
  filePath: string
  currentEditorFilePath: string
  isStudio?: boolean
}

const FileListFile: React.FC<IFileListFile> = ({filePath, currentEditorFilePath, isStudio}) => {
  const classes = useStudioMenuStyles()
  const [clickPoint, setClickPoint] = React.useState<[number, number]>(null)

  const [renaming, setRenaming] = React.useState(false)
  const [newName, setNewName] = React.useState('')

  const content = useFileContent(filePath)
  const {status, dirty} = useChangesetStatus(filePath)
  const {t} = useTranslation(['cloud-editor-pages'])

  const repoId = useCurrentRepoId()
  const {
    onSelect, onDelete, onRevert, onFormat, onRename, onDiff, isProtectedFile,
  } = React.useContext(FileActionsContext)

  const isBackend = isBackendPath(filePath)

  const fileBasename = basename(filePath)

  const name = isBackend ? extractBackendFilename(filePath) : fileBasename

  const active = filePath === currentEditorFilePath

  const assetContent = isAssetPath(filePath) && content
  const downloadPath = getAssetDownloadUrl(filePath, content)

  const allowFormat = isLintablePath(name)
  const allowDeleteRename = !isProtectedFile(filePath)

  // A file that has been reverted has status UNMODIFIED (0) and dirty bit true.
  // Reverted files have no diff.
  const allowRevertDiff = status > 0

  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setClickPoint([event.clientX, event.clientY])
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
    const newFileName = isBackend ? `${newName}${BACKEND_FILE_EXT}` : newName
    onRename(newFileName, filePath)
  }

  const options = [
    {
      content: t('file_list.option.abandon_changes'),
      onClick: allowRevertDiff && (() => onRevert(filePath)),
    },
    {
      content: t('file_list.option.view_diff'),
      onClick: allowRevertDiff && (() => onDiff(filePath)),
    },
    {
      content: t('file_list.option.rename'),
      onClick: allowDeleteRename && startRename,
    },
    {
      content: t('file_list.option.format_file'),
      onClick: allowFormat && (() => onFormat(filePath)),
    },
    {
      content: t('file_list.option.delete'),
      onClick: allowDeleteRename && (() => onDelete(filePath)),
    },
    {content: t('file_list.option.download'), downloadPath},
  ]

  return (
    <li className={`file-list-item file ${active ? 'active' : ''}`}>
      <button
        draggable={!renaming && allowDeleteRename}
        type='button'
        className='style-reset file-bar'
        onClick={renaming ? undefined : stopPropagation(() => onSelect(filePath))}
        onDragStart={(e) => {
          e.dataTransfer.setData('filePath', filePath)
          e.dataTransfer.setData('repoId', repoId)
        }}
        onContextMenu={handleContextMenu}
      >
        <FileListIcon
          filename={renaming ? newName : fileBasename}
          assetContent={assetContent}
        />
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
        <OptionsDropdown
          options={options}
        />
        {clickPoint !== null &&
          <ContextDropdown
            options={options}
            onClose={() => setClickPoint(null)}
            clickPoint={clickPoint}
          />
        }
      </button>
    </li>
  )
}

export {FileListFile}

export type {IFileListFile}
