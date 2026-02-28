import React from 'react'
import {useTranslation} from 'react-i18next'
import {SortableElement} from 'react-sortable-hoc'

import {createThemedStyles} from '../../ui/theme'
import {DragHandle} from './drag-handle'
import InlineTextInput from '../../common/inline-text-input'
import {Keys} from '../../studio/common/keys'

const useStyles = createThemedStyles(theme => ({
  groupHeading: {
    borderBottom: `1px solid ${theme.subtleBorder}`,
    fontSize: '12px',
    fontWeight: '400',
    color: theme.fgMain,
    padding: '0.5rem 1rem',
    position: 'relative',
  },
  groupSection: {
    border: `1px solid ${theme.subtleBorder}`,
    borderRadius: '0.2rem',
    background: theme.mainEditorPane,
    margin: '1rem 0',
  },
  groupContents: {
    padding: '1rem',
  },
  deleteButton: {
    position: 'absolute',
    right: '0',
    cursor: 'pointer',
    border: 0,
    background: 'transparent',
    color: theme.fgMain,
    marginRight: '0.6rem',
  },
  editButton: {
    color: theme.fgMain,
    cursor: 'pointer',
    border: 0,
    background: 'transparent',
    width: 'fit-content',
    maxWidth: '20rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  },
  editForm: {
    top: '0.42rem',
    left: '2rem',
    position: 'absolute',
  },
  editInput: {
    'background': theme.sfcBackgroundDefault,
    'border': 0,
    'outline': 'none',
    'color': theme.fgMain,
    'boxSizing': 'border-box',
    'borderRadius': '0.25rem',
    'height': '24px',
    'width': '250px',
    'fontSize': '12px',
    'paddingLeft': '0.5rem',
    'boxShadow': `0 0 0 1px ${theme.sfcBorderDefault} inset`,
    '&:focus-within': {
      'boxShadow': `0 0 0 1px ${theme.sfcBorderFocus} inset`,
    },
  },
}))

interface IBuilderGroup {
  name: string
  onRename: (newName: string) => void
  canDelete: boolean
  isDefault?: boolean
  onDelete: () => void
  children?: React.ReactNode
}

const BuilderGroup: React.FC<IBuilderGroup> = (
  {name, onRename, canDelete, isDefault, onDelete, children}
) => {
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])
  const [renaming, setRenaming] = React.useState(false)
  const [newName, setNewName] = React.useState('')

  const startRename = () => {
    setNewName(name)
    setRenaming(true)
  }

  const cancelRename = () => {
    setRenaming(false)
  }

  const handleRenameSubmit = () => {
    setRenaming(false)
    if (newName !== name && newName.trim() !== '') {
      onRename(newName)
    }
  }

  return (
    <details className={classes.groupSection} open>
      <summary
        className={classes.groupHeading}
        onKeyUp={(e) => {
          // NOTE(johnny): Prevents opening details when editing the group name.
          if (e.key === Keys.SPACE && (e.target !== e.currentTarget)) { e.preventDefault() }
        }}
      >
        {renaming
          ? <InlineTextInput
              value={newName}
              aria-label={t('module_config.builder_group.edit_group_name')}
              onChange={e => setNewName(e.target.value)}
              onCancel={cancelRename}
              onSubmit={handleRenameSubmit}
              formClassName={classes.editForm}
              inputClassName={classes.editInput}
          />
          : (
            <button
              type='button'
              onClick={startRename}
              className={classes.editButton}
            >
              {name}
            </button>
          )
        }
        {!isDefault &&
          <DragHandle />
        }
        {canDelete &&
          <button
            type='button'
            className={classes.deleteButton}
            onClick={onDelete}
          >
            <span>{t('module_config.builder_group.delete_group')}</span>
          </button>
            }
      </summary>
      <div className={classes.groupContents}>
        {children}
      </div>
    </details>
  )
}

const SortableBuilderGroup = SortableElement(BuilderGroup)

export {
  BuilderGroup,
  SortableBuilderGroup,
}
