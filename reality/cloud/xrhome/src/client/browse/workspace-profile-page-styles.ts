import {
  mobileViewOverride, tinyViewOverride,
} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'

const useProfilePageStyles = createThemedStyles(theme => ({
  showCase: {
    '& > .page-content': {
      paddingTop: '2em',  // padding from the header
    },
  },
  blurb: {
    display: 'flex',
    [mobileViewOverride]: {
      justifyContent: 'center',
    },
    [tinyViewOverride]: {
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      justifyContent: 'center',
    },
  },
  logo: {
    '& img': {
      width: '130px',
      height: '130px',
      objectFit: 'cover',
      borderRadius: '50%',
      marginRight: '1em',
      boxShadow: `0 0 1px 1px ${theme.sfcBorderDefault}`,
    },
    [tinyViewOverride]: {
      marginBottom: '1em',
    },
  },
  workspaceInfo: {
    'marginLeft': '2.5em',
    'display': 'flex',
    'flexDirection': 'column',
    'alignItems': 'stretch',
    [tinyViewOverride]: {
      marginLeft: 0,
    },
    '& > *': {
      [tinyViewOverride]: {
        'justifyContent': 'center',
      },
    },
    '& p': {
      color: theme.fgMuted,
    },
  },
  workspaceName: {
    'fontFamily': theme.headingFontFamily,
    'fontWeight': '900',
    'height': 'auto',
    'display': 'flex',
    'flexDirection': 'row',
    'flexWrap': 'nowrap',
    'alignItems': 'center',
    '& > img': {
      position: 'inherit',
      margin: '0 0.3em',
    },
  },
  locationLink: {
    'lineHeight': '2em',
    'display': 'flex',
    'flexDirection': 'row',
    'flexWrap': 'wrap',
    'alignItems': 'center',
    'gap': '1em',
    'color': theme.fgMuted,
  },
  bio: {
    'color': theme.fgMain,
    'maxWidth': '64ch',
  },
  linkOutsView: {
    'margin': '0.5em 0',
    'display': 'flex',
    'alignItems': 'center',
    '& a': {
      marginRight: '0.5em',
    },
    // TODO(pawel) Clean up alignment.
    '& i': {
      'display': 'flex',
      'alignItems': 'center',
      'fontSize': '1.5em',
      'color': theme.fgMain,
      '&:hover': {
        color: theme.fgMuted,
      },
    },
  },
  separator: {
    borderLeft: `2px solid ${theme.sfcBorderDefault}`,
    height: '80%',
    minHeight: '1.5em !important',
    marginRight: '.75em',
    marginLeft: '.75em',
  },
  socialIcon: {
    position: 'relative',
    top: '0.0625em',
  },
}))

export default useProfilePageStyles
