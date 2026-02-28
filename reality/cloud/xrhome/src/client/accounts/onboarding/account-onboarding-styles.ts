import {hexColorWithAlpha} from '../../../shared/colors'
import {brandHighlight, mobileViewOverride, tinyViewOverride} from '../../static/styles/settings'
import {createThemedStyles} from '../../ui/theme'

const useOnboardingStyles = createThemedStyles(theme => ({
  page: {
    'height': '100%',
    'width': '100%',
    'overflowX': 'hidden',
    'overflowY': 'scroll',
    'scrollBehavior': 'smooth',
    'backgroundRepeat': 'no-repeat',
    'color': theme.fgMain,
    '& .page-content': {
      'display': 'flex !important',
      [mobileViewOverride]: {
        padding: '0 1em',
      },
    },
    'fontFamily': 'Geist, sans-serif',
  },
  formWrapper: {
    color: theme.fgMain,
    zIndex: 4,
    backgroundColor: hexColorWithAlpha(theme.modalBg, 0.2),
    padding: '1em',
    borderRadius: '2em',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.subtleBorder}`,
    filter: `drop-shadow(0 0 3em ${brandHighlight})`,
    maxWidth: '45em',
    overflow: 'hidden',
  },
  formContent: {
    backgroundColor: theme.modalBg,
    border: `1px solid ${theme.subtleBorder}`,
    padding: '3em 2em',
    borderRadius: '1.5em',
    display: 'flex',
    gap: '1.5em',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  dimmer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 10,
    background: hexColorWithAlpha(theme.modalBg, 0.4),
    margin: '-1em',
  },
  heading: {
    fontFamily: 'Mozilla Headline, sans-serif',
    fontSize: '2.25em',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: '1em',
    [mobileViewOverride]: {
      fontSize: '2em',
    },
  },
  subheading: {
    fontFamily: 'Geist Mono, monospace',
    textAlign: 'center',
    fontSize: '1em',
    maxWidth: '30em',
    [mobileViewOverride]: {
      fontSize: '1.125em',
    },
  },
  inputContainer: {
    'fontFamily': 'Geist Mono, monospace',
    'boxSizing': 'border-box',
    'boxShadow': `0 0 0 1px ${theme.sfcBorderDefault} inset`,
    'borderRadius': '0.25rem',
    'display': 'flex',
    '& div': {
      flexBasis: '100%',
    },
    [mobileViewOverride]: {
      fontSize: '16px',
    },
  },
  urlPrefix: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: '0 0.75em',
    borderRight: `1px solid ${theme.subtleBorder}`,
    color: theme.sfcDisabledColor,
  },
  fieldRow: {
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    height: '7em',
    width: 'auto',
    [tinyViewOverride]: {
      height: '5em',
    },
  },
}))

export {useOnboardingStyles}
