import React from 'react'
import * as jsonwebtoken from 'jsonwebtoken'
import {format} from 'date-fns'
import {useDispatch} from 'react-redux'
import {
  FloatingPortal, useFloating, offset, shift,
  useClick, useDismiss, useRole, useInteractions,
  Placement,
  flip,
} from '@floating-ui/react'

import useActions from '../../common/use-actions'
import {createThemedStyles} from '../../ui/theme'
import {useCurrentUser, useUserHasSession} from '../../user/use-current-user'
import userSessionActions from '../../user/user-session-actions'
import {hexColorWithAlpha} from '../../../shared/colors'
import {combine} from '../../common/styles'
import {mango} from '../../static/styles/settings'

const getDebugJwtMessage = (jwt: string) => {
  const decoded = jsonwebtoken.decode(jwt)
  if (typeof decoded === 'string') {
    return '<invalid>'
  }
  // eslint-disable-next-line local-rules/hardcoded-copy
  return `jwt expires on ${format(decoded.exp * 1000, 'MM/dd/yy h:m:s')}`
}

const useStyles = createThemedStyles(theme => ({
  menuContainer: {
    position: 'absolute',
    color: theme.fgMain,
    background: hexColorWithAlpha(theme.bgMain, 0.5),
    border: `1px dashed ${mango}`,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(20px)',
    zIndex: 10,
  },
  userInfoContainer: {
    padding: '0.5em',
    color: theme.fgMuted,
  },
  button: {
    'padding': '0.5em',
    'cursor': 'pointer',
    'color': theme.fgMain,
    '&:hover': {
      color: theme.fgMain,
      background: theme.bgMuted,
    },
  },
  devSection: {
    display: 'flex',
    flexDirection: 'column',
    borderTop: `1px dashed ${mango}`,
  },
  brandToggleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
    padding: '0 0.5em 0.5em',
  },
}))

interface IDevDropdownMenu {
  trigger: React.ReactNode
  placement?: Placement
}

const DevDropdownMenu: React.FC<IDevDropdownMenu> = ({trigger, placement = 'bottom-start'}) => {
  const classes = useStyles()
  const {jwt} = useCurrentUser()
  const isLoggedIn = useUserHasSession()
  const dispatch = useDispatch()

  const [popupOpen, setPopupOpen] = React.useState(false)
  const {refs, floatingStyles, context} = useFloating({
    open: popupOpen,
    onOpenChange: setPopupOpen,
    placement,
    middleware: [
      offset({
        crossAxis: 14,
        mainAxis: 7,
      }),
      shift(),
      flip(),
    ],
  })
  const {refreshJwt} = useActions(userSessionActions)
  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const {getReferenceProps, getFloatingProps} = useInteractions([
    click,
    dismiss,
    role,
  ])

  const clearToS = () => {
    dispatch({type: 'SHOW_TOS', showToS: true})
  }

  if (!isLoggedIn) {
    return null
  }

  const UserMenu = (
    <div
      ref={refs.setFloating}
      className={classes.menuContainer}
      style={{...floatingStyles}}
      {...getFloatingProps()}
    >
      <div className={classes.userInfoContainer}>
        {/* eslint-disable local-rules/hardcoded-copy */}
        These are insider dev options.
        {/* eslint-enable local-rules/hardcoded-copy */}
      </div>
      {/* eslint-disable local-rules/hardcoded-copy */}
      {BuildIf.LOCAL_DEV &&
        <div className={classes.devSection}>
          {/* eslint-disable local-rules/hardcoded-copy */}
          <button
            type='button'
            className={combine('style-reset', classes.button)}
            onClick={clearToS}
          >
            Show TOS
          </button>
          {jwt &&
            <>
              <div>
                {getDebugJwtMessage(jwt)}
              </div>
              <button
                type='button'
                className={combine('style-reset', classes.button)}
                onClick={() => refreshJwt()}
              >
                Refresh Jwt
              </button>
            </>
          }
          {/* eslint-enable local-rules/hardcoded-copy */}
        </div>
      }
    </div>
  )

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {trigger}
      </div>
      <FloatingPortal>
        {popupOpen && UserMenu}
      </FloatingPortal>
    </>
  )
}

export {DevDropdownMenu}
