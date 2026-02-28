import React from 'react'

import {createThemedStyles} from '../../ui/theme'
import {Icon, IconStroke} from '../../ui/components/icon'
import {hexColorWithAlpha} from '../../../shared/colors'
import {combine} from '../../common/styles'
import {mobileViewOverride} from '../../static/styles/settings'

const useStyles = createThemedStyles(theme => ({
  button: {
    'position': 'relative',
    'padding': '0.5em',
    'borderRadius': '7px',
    'display': 'flex',
    'alignItems': 'center',
    'cursor': 'pointer',
    'margin': '0 0.625em',
    '&:hover': {
      background: hexColorWithAlpha(theme.bgMain, 0.5),
      boxShadow: theme.secondaryBtnBoxShadow,
    },
    '& svg': {
      color: theme.fgMain,
    },
    '&:hover $tooltip': {
      display: 'flex',
    },
    [mobileViewOverride]: {
      gap: '1em',
      padding: '0.625em',
    },
  },
  tooltip: {
    'display': 'none',
    'alignItems': 'center',
    'gap': '0.25em',
    'color': theme.bgMain,
    'whiteSpace': 'nowrap',
    'fontFamily': theme.subHeadingFontFamily,
    'boxShadow': '2px 2px 4px rgba(0, 0, 0, 0.2)',
    'position': 'absolute',
    'left': '140%',
    'top': '10%',
    'background': hexColorWithAlpha(theme.fgMain, 0.5),
    'padding': '0.25em 0.75em',
    'borderRadius': '6px',
    'backdropFilter': 'blur(25px)',
    '&:before': {
      position: 'absolute',
      right: '100%',
      top: '60%',
      content: '""',
      height: '0px',
      width: '0px',
      marginTop: '-10px',
      borderTop: '7px solid transparent',
      borderBottom: '7px solid transparent',
      borderRight: `8px solid ${hexColorWithAlpha(theme.fgMain, 0.5)}`,
    },
    '& svg': {
      color: theme.bgMain,
    },
    [mobileViewOverride]: {
      'display': 'flex',
      'background': 'none',
      'padding': '0',
      'border': 'none',
      'backdropFilter': 'none',
      'position': 'static',
      'color': theme.fgMain,
      'boxShadow': 'none',
      '&:before': {
        display: 'none',
      },
      '& svg': {
        color: theme.fgMain,
      },
    },
  },
  external: {
    padding: '0.25em 0.5em 0.25em 0.75em',
    [mobileViewOverride]: {
      padding: 0,
    },
  },
  disabled: {
    'color': theme.fgMuted,
    '& svg': {
      color: theme.fgMuted,
    },
    '&:hover': {
      background: 'none',
      boxShadow: 'none',
    },
  },
  disabledToolTip: {
    [mobileViewOverride]: {
      'color': theme.fgMuted,
      '& svg': {
        color: theme.fgMuted,
      },
    },
  },
}))

interface ISidebarNavButton {
  text: string
  iconStroke?: IconStroke
  isExternal?: boolean
  disabled?: boolean
}

const SidebarNavButton: React.FC<ISidebarNavButton> = ({
  text, iconStroke, isExternal, disabled = false,
}) => {
  const classes = useStyles()

  return (
    <div className={combine(classes.button, disabled && classes.disabled)}>
      <Icon stroke={iconStroke} />
      <div className={combine(
        classes.tooltip, isExternal && classes.external, disabled && classes.disabledToolTip
      )}
      >
        {text}
        {isExternal && <Icon stroke='arrowUpRight' />}
      </div>
    </div>
  )
}

export {SidebarNavButton}
