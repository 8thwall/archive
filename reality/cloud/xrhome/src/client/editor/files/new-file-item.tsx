import React from 'react'

import icons from '../../apps/icons'
import InlineTextInput from '../../common/inline-text-input'
import FileListIcon from '../file-list-icon'
import type {ItemType} from '../file-list'
import {useStudioMenuStyles} from '../../studio/ui/studio-menu-styles'
import {combine} from '../../common/styles'
import type {NewItem} from './file-actions-context'

interface INewFileItem {
  itemType: ItemType
  onSubmit: (newItem: NewItem) => void
  onCancel: () => void
  isStudio?: boolean
}

const NewFileItem: React.FC<INewFileItem> = ({itemType, onSubmit, onCancel, isStudio}) => {
  const classes = useStudioMenuStyles()
  const [name, setName] = React.useState('')

  return (
    <li className='file-list-item '>
      <div className='file-bar new-item'>
        <FileListIcon icon={itemType === 'folder' && icons.folder_empty} filename={name} />
        <InlineTextInput
          value={name}
          onChange={e => setName(e.target.value)}
          onCancel={onCancel}
          onSubmit={() => onSubmit({name, isFile: itemType !== 'folder'})}
          // eslint-disable-next-line local-rules/hardcoded-copy
          formClassName={combine('file-name edit', isStudio && classes.studioFont)}
          inputClassName='style-reset file-input'
        />
      </div>
    </li>
  )
}

export {NewFileItem}

export type {INewFileItem}
