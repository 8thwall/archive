import {createUseStyles} from 'react-jss'

import {
  brandPurple, brandWhite, gray3, gray5, mobileViewOverride,
} from '../../static/styles/settings'

const logo = {
  padding: '1.5rem',
}

const getStartedButton = {
  '&, &.ui.button': {
    'backgroundColor': 'transparent',
    'color': brandPurple,
    'lineHeight': '1.4285em',
    'fontSize': '16px',
    'fontWeight': '700',
    'borderRadius': '0.5em',
    'border': `solid 1px ${brandPurple}`,
    'padding': '0.3em 1.5em !important',
    'transition': 'all .2s',
    '&:hover': {
      backgroundColor: brandPurple,
      color: brandWhite,
    },
  },
}

const getStartedButtonWhite = {
  'color': brandWhite,
  'border': `solid 1px ${brandWhite}`,
  '&:hover': {
    backgroundColor: brandWhite,
    color: brandPurple,
  },
}

const hideOnMobileDisplay = {
  [mobileViewOverride]: {
    display: 'none !important',
  },
}

const siteNav = {
  'width': '100%',
  'height': '100%',
  'display': 'flex',
  'alignItems': 'center',
  'flexWrap': 'nowrap',
  'margin': 0,
  'fontWeight': '700',
  'fontSize': '16px',
  '& a:hover': {
    color: gray3,
  },
  '& .loginLink': {
    color: brandPurple,
  },
  '& .ui.dropdown .menu > .item': {
    color: gray5,
  },
}

const left = {
  'display': 'flex',
  'alignItems': 'center',
  'flexWrap': 'nowrap',
  '& a': {
    'display': 'flex',
    'alignItems': 'center',
    'height': '50px',
    [mobileViewOverride]: {
      '& img': {
        'height': '2.5em',
      },
    },
  },
}

const right = {
  'flex': '0 1 80%',
  'display': 'flex',
  'flexDirection': 'row',
  'flexWrap': 'nowrap',
  'alignItems': 'center',
  'justifyContent': 'flex-end',
  [mobileViewOverride]: {
    flex: '0 0 auto',
  },
  '& .ui.dropdown.profile-dropdown.small-screen > .menu': {
    right: '-1.5em !important',
  },
}

const pageHeader = theme => ({
  'padding': '2.15rem 2.4rem 2.15rem 3.45rem',
  'position': theme.headerPosition,
  'width': theme.headerWidth,
  'display': 'flex',
  'flexDirection': 'row',
  'justifyContent': 'space-between',
  'transition': 'padding 400ms ease-out, background-color 500ms ease-out',
  'fontSize': '16px',
  'zIndex': '100',
  [mobileViewOverride]: {
    padding: '2.5rem 2rem',
  },
})

const hamburgerButton = {
  display: 'none !important',
  // TODO (Tri): rewrite this selector when sidebar scss get refactor
  [mobileViewOverride]: {
    '.with-sidebar &': {
      display: 'block !important',
      marginLeft: '1.5em',
    },
  },
}

export default createUseStyles(theme => ({
  logo,
  siteNav,
  left,
  right,
  pageHeader: pageHeader(theme),
  hamburgerButton,
  getStartedButton,
  getStartedButtonWhite,
  hideOnMobileDisplay,
}))
