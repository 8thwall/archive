import * as React from 'react'
import {createUseStyles} from 'react-jss'

import {FolderStructure, enumerateRootItems} from '../folder-structure'
import {basename} from '../editor-common'
import icons from '../../apps/icons'
import FileListIcon from '../file-list-icon'
import UploadArea from '../../widgets/upload-area'
import {combine} from '../../common/styles'

const useStyles = createUseStyles({
  scrollbar: {
    overflowY: 'auto',
  },
})

interface IFileView {
  filePath: string
  structure: FolderStructure<{filePath: string}>
  onSelect(filePath: string): void
  activePath: string
}

const FileView: React.FunctionComponent<IFileView> =
  ({filePath, structure, onSelect, activePath}) => {
    const {children} = structure[filePath]
    const type = children ? 'folder' : 'file'
    const itemClass = `file-list-item ${type} ${activePath === filePath ? 'active' : ''}`
    return (
      <li className={itemClass}>
        <button
          className='style-reset file-bar'
          type='button'
          onClick={type === 'file' ? (() => onSelect(filePath)) : undefined}
        >
          {type === 'folder'
            ? <FileListIcon icon={icons.folder_expanded} />
            : <FileListIcon filename={filePath} />
          }
          <span className='file-name'>
            {basename(filePath)}
          </span>
        </button>
        {children &&
          <ul>
            {children.map(c => (
              <FileView
                key={c}
                filePath={c}
                structure={structure}
                onSelect={onSelect}
                activePath={activePath}
              />
            ))}
          </ul>
      }
      </li>
    )
  }

interface IAssetBundleFilesPane {
  files: FolderStructure<{filePath: string}>
  onSelect: (filePath: string) => void
  onUpload?: (filesPromise: Promise<{filePath: string, data: Blob}[]>) => void
  activePath: string
}

const AssetBundleFilesPane: React.FunctionComponent<IAssetBundleFilesPane> =
  ({files, onSelect, onUpload, activePath}) => {
    const classes = useStyles()

    const rootFiles = enumerateRootItems(files)
    const FileList = () => {
      const fileListClasses = ['file', 'file-list']
      if (!onUpload) fileListClasses.push('pane')  // to avoid the double borders

      return (
        <ul className={fileListClasses.join(' ')}>
          {rootFiles.map(file => (
            <FileView
              key={file}
              filePath={file}
              structure={files}
              onSelect={onSelect}
              activePath={activePath}
            />
          ))}
        </ul>
      )
    }

    if (onUpload) {
      return (
        <UploadArea
          id='asset-bundle-modal-upload'
          className={combine('pane', classes.scrollbar)}
          onUpload={onUpload}
        >
          <FileList />
        </UploadArea>
      )
    }

    return <FileList />
  }

export default AssetBundleFilesPane
