import {hexColorWithAlpha} from '../../../shared/colors'
import {brandWhite, mobileViewOverride} from '../../static/styles/settings'
import {createThemedStyles} from '../../ui/theme'

const useHeaderStyles = createThemedStyles(theme => ({
  header: {
    'position': 'sticky',
    'top': 0,
    'zIndex': 10,
    [mobileViewOverride]: {
      'position': 'fixed',
      'backdropFilter': 'none',
      'background': 'none',
      '&::before': {
        display: 'none',
      },
    },
    '&::before': {
      'position': 'absolute',
      'content': '""',
      'width': '100%',
      'height': '100%',
      'backdropFilter': 'blur(25px)',
      'background': hexColorWithAlpha(theme.bgMain, 0.2),
      'zIndex': '-1',
    },
  },
  hideLinks: {
    [mobileViewOverride]: {
      'position': 'sticky',
      '& $linksGroup': {
        display: 'none',
      },
      '& $headerContainer': {
        position: 'static',
        height: 'unset',
      },
    },
  },
  headerContainer: {
    width: '100%',
    maxWidth: '1700px',
    display: 'flex',
    padding: '1em 1.25em',
    margin: '0 auto',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    [mobileViewOverride]: {
      background: hexColorWithAlpha(theme.bgMain, 0.2),
      position: 'fixed',
      width: '100%',
      height: '100vh',
      flexDirection: 'column',
      alignItems: 'stretch',
      padding: 0,
      zIndex: '-1',
    },
  },
  loggedInHeaderContainer: {
    [mobileViewOverride]: {
      'height': 'unset',
      'justifyContent': 'flex-start',
      '&::before': {
        content: '""',
        height: '100%',
        width: '100%',
        background: hexColorWithAlpha(theme.bgMain, 0.2),
        backdropFilter: 'blur(25px)',
        position: 'absolute',
        zIndex: '-1',
      },
    },
  },
  showSideNav: {
    [mobileViewOverride]: {
      height: '100vh',
    },
  },
  logoButtonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [mobileViewOverride]: {
      padding: '1em 1.25em',
      backdropFilter: 'blur(25px)',
      background: hexColorWithAlpha(theme.bgMain, 0.2),
    },
  },
  workspaceSelectionGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1em',
    [mobileViewOverride]: {
      'padding': '1em 1.25em 0',
      '& div:last-child': {
        flex: 1,
      },
    },
  },
  linksGroup: {
    display: 'flex',
    [mobileViewOverride]: {
      'overflowY': 'scroll',
      'scrollbarWidth': 'none',
      'height': '100%',
      'flexDirection': 'column',
      'justifyContent': 'space-between',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        backdropFilter: 'blur(50px)',
        background: hexColorWithAlpha(theme.bgMain, 0.1),
        border: `1px solid ${hexColorWithAlpha(theme.fgMain, 0.1)}`,
        boxShadow: `5px 5px 20px 2px ${hexColorWithAlpha(theme.bgMain, 0.2)}`,
        zIndex: '-1',
      },
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
  loggedInLinksGroup: {
    [mobileViewOverride]: {
      justifyContent: 'flex-start',
    },
  },
  button: {
    maxWidth: '12em',
    flex: 1,
    [mobileViewOverride]: {
      maxWidth: 'unset',
    },
  },
  buttonGroup: {
    display: 'flex',
    gap: '1em',
    minWidth: '22em',
    justifyContent: 'flex-end',
    [mobileViewOverride]: {
      padding: '0.75em',
    },
  },
  publicMobileButtonGroup: {
    [mobileViewOverride]: {
      flexDirection: 'column',
      paddingTop: 0,
    },
  },
  loggedInButtonGroup: {
    [mobileViewOverride]: {
      padding: '0.75em 1.25em 1em 1.25em',
    },
  },
  hamburgerButton: {
    display: 'none',
    [mobileViewOverride]: {
      display: 'block',
    },
  },
  logoSquare: {
    background: brandWhite,
    height: '40px',
    width: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.55), 0 1px 2px 0 rgba(255, 255, 255, 0.25) inset',
  },
}))

export {useHeaderStyles}
