import React from 'react'
import {createUseStyles} from 'react-jss'
import {
  autoUpdate,
  useFloating,
  shift,
  flip,
  FloatingPortal,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
} from '@floating-ui/react'

import {useTranslation} from 'react-i18next'

import {createBrowserUrl} from '../../shared/studiohub/create-browser-url'
import {mango} from '../static/styles/settings'
import {BLACK_50, WHITE_10, WHITE_15, WHITE_50} from './colors'
import {combine} from '../common/styles'
import useActions from '../common/use-actions'
import userActions from '../user/user-actions'
import {useCurrentUser} from '../user/use-current-user'
import {PreferencesModal} from './preferences-modal'

const useStyles = createUseStyles({
  notSelectable: {
    'userSelect': 'none',
    'WebkitUserSelect': 'none',
    'MozUserSelect': 'none',
    'msUserSelect': 'none',
  },
  profileIconButton: {
    'cursor': 'pointer',
    'padding': '0.25rem 0.5rem',
    'marginBottom': '1rem',
    'background': mango,
    'height': '32px',
    'width': '32px',
    'borderRadius': '8px',
    'borderColor': WHITE_50,
    'border': '1px solid',
    'textAlign': 'center',
    'textShadow': '0 0 2px #000',
    'fontSize': '16px',
    'color': '#FFF',
    'fontWeight': '700',
    'lineHeight': '24px',
    '&:hover': {
      'background': '#CC9F20',  // Mango with 20% black overlay
    },
  },
  dropdown: {
    background: BLACK_50,
    border: '1px solid',
    borderColor: WHITE_10,
    borderRadius: '0.5rem',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.75)',
    width: '16rem',
    backdropFilter: 'blur(10px)',
    fontFamily: 'Geist Mono',
    overflow: 'hidden',
    zIndex: 9999,
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.5rem 1rem',
  },
  dropdownItem: {
    'padding': '0.5rem 1rem',
    'cursor': 'pointer',
    '&:hover': {
      'backgroundColor': WHITE_15,
    },
  },
  userInfo: {
    color: WHITE_50,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  },
})

const ProfileIconButton: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['studio-desktop-pages'])
  const [isOpen, setIsOpen] = React.useState(false)
  const user = useCurrentUser()
  const {signOut} = useActions(userActions)
  const [preferencesOpen, setPreferencesOpen] = React.useState(false)

  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      shift(),
      flip(),
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

  const dropdownItems = [
    {
      id: 'profile',
      label: t('profile.button.profile'),
      action: () => { window.open(createBrowserUrl('/profile')) },
    },
    {
      id: 'preferences',
      label: t('profile.button.preferences'),
      action: () => {
        setPreferencesOpen(true)
      },
    },
    {
      id: 'logout',
      label: t('profile.button.log_out'),
      action: () => { signOut() },
    },
  ]

  if (!user.uuid) {
    return null
  }

  return (
    <>
      <button
        type='button'
        className={combine(classes.profileIconButton, classes.notSelectable)}
        ref={refs.setReference}
        aria-label={t('profile.button.profile_menu')}
        aria-expanded={isOpen}
        aria-haspopup='menu'
        {...getReferenceProps()}
      >
        {user.given_name[0].toLocaleUpperCase()}
      </button>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={classes.dropdown}
            {...getFloatingProps()}
          >
            <div className={combine(classes.profileInfo, classes.notSelectable)}>
              <span className={classes.userInfo}>
                {user.given_name} {user.family_name}
              </span>
              <span className={classes.userInfo}>
                {user.email}
              </span>
            </div>
            {dropdownItems.map(item => (
              <div
                key={item.id}
                className={combine(classes.dropdownItem, classes.notSelectable)}
                role='menuitem'
                tabIndex={0}
                onClick={() => {
                  item.action()
                  setIsOpen(false)
                }}
                onKeyDown={(e) => {
                  // eslint-disable-next-line local-rules/hardcoded-copy
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    item.action()
                    setIsOpen(false)
                  }
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </FloatingPortal>
      )}
      {preferencesOpen && <PreferencesModal onClose={() => setPreferencesOpen(false)} />}
    </>
  )
}

export {
  ProfileIconButton,
}
