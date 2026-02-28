import React from 'react'
import {useTranslation} from 'react-i18next'
import {SortableElement} from 'react-sortable-hoc'

import {Dropdown} from 'semantic-ui-react'

import {createThemedStyles} from '../../ui/theme'
import {DragHandle} from './drag-handle'
import type {DerivedGroup} from './derive-config-grouping'
import {DeleteButton} from './delete-button'

const useStyles = createThemedStyles(theme => ({
  inputGroupContainer: {
    'border': `1px solid ${theme.subtleBorder}`,
    'borderRadius': '0.5rem',
    'margin': '1rem 0',
    'padding': '0.25rem 0.5rem',
    '&:focus-within': {
      'border': `1px solid ${theme.sfcBorderFocus}`,
    },
  },
  deleteButton: {
    position: 'absolute',
    right: '0.1rem',
    top: '1.1rem',
  },
  inputGroupSummary: {
    'position': 'relative',
    'padding': '1rem',
    'cursor': 'pointer',
    'color': theme.fgMuted,
    'fontSize': '16px',
  },
  inputGroupContents: {
    padding: '1rem',
  },
  moveButton: {
    'position': 'absolute',
    'right': '3.3rem',
    'top': '1.2rem',
    'pointerEvents': 'all',
    'height': '16px',
    'borderRadius': '3px',
    'color': theme.fgMuted,
    '&:hover': {
      color: theme.fgMain,
    },
    '&:focus': {
      'boxShadow': theme.toolbarBtnFocusShadow,
      '&:not(:focus-visible)': {
        boxShadow: 'none',
      },
    },
  },
}))

interface IBuilder {
  name: string
  onDelete: () => void
  onMove: (fieldName: string, newGroupId: string) => void
  otherGroups: DerivedGroup[]
  children?: React.ReactNode
}

const Builder: React.FC<IBuilder> = ({name, onDelete, onMove, otherGroups, children}) => {
  const classes = useStyles()
  const {t} = useTranslation(['common'])

  return (
    <div>
      <details className={classes.inputGroupContainer} open>
        <summary className={classes.inputGroupSummary}>
          {name}
          <DragHandle />
          {otherGroups.length !== 0 &&
            <div className={classes.moveButton}>
              <Dropdown
                icon={(
                  <svg
                    width='16px'
                    height='16px'
                    viewBox='0 0 16 16'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                      // eslint-disable-next-line max-len
                      d='M13.7143 0H2.28571C1.02321 0 0 1.02357 0 2.28571V13.7143C0 14.9764 1.02321 16 2.28571 16H13.7143C14.9768 16 16 14.9764 16 13.7143V2.28571C16 1.02357 14.975 0 13.7143 0ZM12.2857 10C12.2857 10.6318 11.7746 11.1429 11.1429 11.1429C10.5111 11.1429 10 10.6318 10 10V7.61786L5.66429 11.9536C5.44286 12.175 5.15 12.2857 4.85714 12.2857C4.56429 12.2857 4.27214 12.1741 4.04929 11.9509C3.60286 11.5045 3.60286 10.7813 4.04929 10.3348L8.38571 6H6C5.36821 6 4.85714 5.48893 4.85714 4.85714C4.85714 4.22536 5.36821 3.71429 6 3.71429H11.1429C11.7746 3.71429 12.2857 4.22536 12.2857 4.85714V10Z'
                    />
                  </svg>
                )}
                direction='left'
                onClick={e => e.preventDefault()}
              >
                <Dropdown.Menu>
                  {otherGroups.map(group => (
                    <Dropdown.Item
                      key={group.groupId}
                      onClick={() => onMove(name, group.isDefault ? null : group.groupId)}
                    > {group.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          }
          <DeleteButton
            aria-label={t('button.delete')}
            className={classes.deleteButton}
            onClick={onDelete}
          />
        </summary>
        <div className={classes.inputGroupContents}>
          {children}
        </div>
      </details>
    </div>
  )
}

const SortableBuilder = SortableElement(Builder)

export {
  Builder,
  SortableBuilder,
}
