import React from 'react'
import {createUseStyles} from 'react-jss'
import {
  autoUpdate, useFloating, shift, flip, FloatingPortal, useInteractions, useClick,
  useDismiss, useRole, offset,
} from '@floating-ui/react'

import {useTranslation} from 'react-i18next'

import {createBrowserUrl} from '../../shared/studiohub/create-browser-url'
import type {ProjectClientSide} from '../../shared/studiohub/local-sync-types'
import type {IApp} from '../common/types/models'
import {BLACK_50, WHITE_15, WHITE_20, WHITE_50} from './colors'
import {combine} from '../common/styles'
import {Icon} from '../ui/components/icon'
import {showProject} from '../studio/local-sync-api'
import {AppPathEnum, getPathForApp} from '../common/paths'
import {useEnclosedAccount} from '../accounts/enclosed-account-context'

const useStyles = createUseStyles({
  dropdownItem: {
    'padding': '0.5rem 1rem',
    'cursor': 'pointer',
    'userSelect': 'none',
    'WebkitUserSelect': 'none',
    'MozUserSelect': 'none',
    'msUserSelect': 'none',
    '&:hover': {
      'backgroundColor': WHITE_15,
    },
  },
  optionsButton: {
    'cursor': 'pointer',
    'width': '32px',
    'height': '32px',
    'borderRadius': '0.5rem',
    'background': WHITE_20,
    'box-shadow': '0 1px 2px 0 rgba(255, 255, 255, 0.25) inset',
    'backdrop-filter': 'blur(5px)',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    '&:hover': {
      'background': WHITE_50,
    },
  },
  dropdown: {
    background: BLACK_50,
    border: '1px solid',
    borderColor: WHITE_20,
    borderRadius: '0.5rem',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(10px)',
    fontFamily: 'Geist Mono',
    overflow: 'hidden',
    zIndex: 2,
  },
})

interface IMenuOption {
  label: string
  onClick: () => void
}

const MenuOption: React.FC<IMenuOption> = ({label, onClick}) => {
  const classes = useStyles()

  return (
    <div
      className={classes.dropdownItem}
      role='menuitem'
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        // eslint-disable-next-line local-rules/hardcoded-copy
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {label}
    </div>
  )
}

interface IProjectListItemOptions {
  app: IApp
  project: ProjectClientSide | undefined
  onDelete: () => void
  onMove: () => void
}

const ProjectListItemOptions: React.FC<IProjectListItemOptions> = ({
  app, project, onDelete, onMove,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['studio-desktop-pages'])
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const account = useEnclosedAccount()

  React.useEffect(() => {
    if (!buttonRef.current) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && isOpen) {
          setIsOpen(false)
        }
      }
    )

    observer.observe(buttonRef.current)
    return () => {
      observer.disconnect()
    }
  }, [isOpen])

  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
    whileElementsMounted: autoUpdate,
    middleware: [
      shift(),
      flip(),
      offset(5),
    ],
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, {role: 'menu'})

  const {getReferenceProps, getFloatingProps} = useInteractions([
    click,
    dismiss,
    role,
  ])

  return (
    <button
      type='button'
      className={combine('style-reset', classes.optionsButton)}
      ref={(el) => {
        refs.setReference(el)
        buttonRef.current = el
      }}
      aria-label={t('project_list_item.button.options')}
      aria-expanded={isOpen}
      aria-haspopup='menu'
      {...getReferenceProps()}
    >
      <Icon stroke='kebab' />
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={classes.dropdown}
            {...getFloatingProps()}
          >
            {project?.location && project.validLocation &&
              <MenuOption
                label={window.electron.os === 'mac'
                  ? t('project_list_item.menu.option.reveal_finder')
                  : t('project_list_item.menu.option.show_folder')}
                onClick={() => { showProject(app.appKey) }}
              />
            }
            {project?.location &&
              <MenuOption
                label={t('project_list_item.menu.option.remove_from_disk')}
                onClick={() => { onDelete() }}
              />
            }
            {project?.location && project.validLocation &&
              <MenuOption
                label={t('project_list_item.menu.option.change_disk_location')}
                onClick={onMove}
              />
            }
            <MenuOption
              label={t('project_list_item.menu.option.project_settings')}
              onClick={() => {
                window.open(createBrowserUrl(getPathForApp(account, app, AppPathEnum.settings)))
              }}
            />
          </div>
        </FloatingPortal>
      )}
    </button>
  )
}

export {
  ProjectListItemOptions,
}
