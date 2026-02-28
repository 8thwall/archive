import {createUseStyles} from 'react-jss'

import {
  brandPurple,
  brandHighlight,
  brandBlack,
  gray2,
  gray3,
  gray4,
  tinyViewOverride,
  buttonBoxShadow,
  leftNavBackground,
  lightBackground2,
  cherry,
  blueberry,
  bodySanSerif,
} from '../static/styles/settings'

const LOGO_IMAGE_SIDE_LENGTH = '130px'

const useStyles = createUseStyles({
  topButtonContainer: {
    textAlign: 'right',
    margin: '1em 0',
  },
  learnMore: {
    color: blueberry,
    fontWeight: '700',
  },
  learnMoreIcon: {
    width: '12px',
    verticalAlign: 'middle',
  },
  errorMessage: {
    paddingLeft: '0',
    paddingRight: '0',
  },
  publicProfileContainer: {
    margin: '2em',
    marginBottom: '0',
    paddingBottom: '2em',
    borderBottom: `1px solid ${gray2}`,
  },
  sectionTitle: {
    'fontWeight': '700',
    'fontSize': '1.25em',
    'fontFamily': bodySanSerif,
    '& > i': {
      color: gray3,
    },
  },
  publicProfileUrl: {
    'display': 'flex',
    'flexDirection': 'row',
    [tinyViewOverride]: {
      'flexDirection': 'column',
      'alignItems': 'flex-start',
    },
    '& > *:not(:last-child)': {
      marginRight: '0.5em',
      marginLeft: '0',
    },
    '& > p': {
      'marginBottom': '0',
      'wordBreak': 'break-all',
      '& > i': {
        cursor: 'pointer',
        marginLeft: '0.25em',
      },
    },
  },
  copiedNotificationIcon: {
    color: gray4,
    fontSize: '0.8em',
    marginLeft: '0 !important',
    opacity: '1',
    overflow: 'hidden',
    verticalAlign: 'text-top',
  },
  pageInfoContainer: {
    'margin': '2em',
    'marginTop': '0',
    'paddingTop': '2em',
    '& > .form > *:not(:first-child)': {
      'marginTop': '1.5em',
    },
    '& label': {
      fontSize: '1.2em !important',
      fontWeight: '700 !important',
    },
    '& textarea': {
      minHeight: '6em !important',
      [tinyViewOverride]: {
        minHeight: '10em !important',
      },
    },
  },
  logoContainer: {
    'display': 'flex',
    'flexDirection': 'row !important',
    'margin': '2em 0 !important',
    '& > *:not(:last-child)': {
      marginRight: '2em',
      [tinyViewOverride]: {
        marginRight: 0,
        marginBottom: '1em',
      },
    },
    [tinyViewOverride]: {
      flexDirection: 'column !important',
    },
  },
  logo: {
    'width': LOGO_IMAGE_SIDE_LENGTH,
    'height': LOGO_IMAGE_SIDE_LENGTH,
    'borderRadius': '50%',
    'backgroundColor': leftNavBackground,
    '& > img': {
      width: 'inherit',
      height: 'inherit',
      objectFit: 'cover',
      borderRadius: 'inherit',
      border: `solid 1px ${brandBlack}`,
      boxShadow: '0 0 1px 1px $gray-3',
    },
  },
  logoImageOverlay: {
    'width': LOGO_IMAGE_SIDE_LENGTH,
    'height': LOGO_IMAGE_SIDE_LENGTH,
    'position': 'absolute',
    'top': '0',
    'left': '0',
    'bottom': '0',
    'right': '0',
    'borderRadius': '50%',
    '&.hovering': {
      background: lightBackground2,
      opacity: '0.5',
    },
  },
  logoField: {
    'display': 'flex',
    'flexDirection': 'column',
    'justifyContent': 'center',
    'alignItems': 'flex-start',
    '& > p': {
      marginBottom: '0.5em',
    },
  },
  generalError: {
    margin: '0 !important',
    padding: '0.5em',
    color: cherry,
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: cherry,
    backgroundColor: `${cherry}05`,
  },
  marginBottom: {
    marginBottom: '1em !important',
  },
  logoReplaceButton: {
    '&.ui.button': {
      margin: '0.5em 0',
      color: `${brandPurple} !important`,
      fontWeight: '600',
      borderColor: `${brandPurple} !important`,
    },
  },
  logoReplaceInput: {
    display: 'none',
  },
  logoImageFileName: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 0.5em',
    color: gray3,
  },
  bioGroup: {
    'position': 'relative',
    'marginTop': '1.5em !important',
    '& > p': {
      position: 'absolute',
      right: '0',
      bottom: '0',
      margin: '0.4em',
      color: '#222426',
      opacity: '0.5',
      fontSize: '0.8em',
    },
  },
  requiredField: {
    '& > div.ui.input > input, & > textarea': {
      'borderColor': `${cherry} !important`,
      'backgroundColor': `${cherry}05 !important`,  // 2%
      '&::placeholder': {  // Chrome, Firefox, Opera, Safari 10.1+
        color: `${cherry} !important`,
        outline: 'none !important',
        opacity: '1',  // Firefox
      },

      '&::-ms-input-placeholder': {  // Microsoft Edge
        color: `${cherry} !important`,
        outline: 'none !important',
      },
    },
  },
  addressWarningMessage: {
    color: lightBackground2,
  },
  socialLinkField: {
    'display': 'flex',
    'alignItems': 'stretch',
  },
  socialLinkImage: {
    'display': 'flex',
    'border': `1px solid ${gray2}`,
    'borderRight': 'none',
    'borderRadius': '4px 0 0 4px',
    'padding': '0 0.9em 0 1em',
    'color': gray2,
    '& > img': {
      width: '14px',
    },
  },
  socialLinkInput: {
    'border': `1px solid ${gray2} !important`,
    'borderRadius': '0 4px 4px 0 !important',
    '&:focus': {
      borderColor: `${blueberry} !important`,
    },
  },
  socialLinksGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
  },
  socialLinksSection: {
    marginTop: '1.5em !important',
  },
  socialLinksLabel: {
    fontSize: '1.2em',
    fontWeight: '700',
    marginBottom: 'calc(2rem / 7) !important',
  },
  generalErrorMessage: {
    color: cherry,
  },
  saveButton: {
    'margin': '1em 0 !important',
    '& > .button': {
      boxShadow: `${buttonBoxShadow} !important`,
    },
  },
  cancelButton: {
    margin: '1em !important',
    backgroundColor: 'transparent !important',
    color: `${brandHighlight} !important`,
  },
  deactivateButton: {
    padding: '0 2em !important',
    paddingBottom: '2em !important',
    backgroundColor: 'transparent !important',
    textDecoration: 'underline !important',
  },
  requiredAsterisk: {
    '& > label::after': {
      color: cherry,
      content: '"*"',
      marginLeft: '0.2em',
    },
  },
})

export default useStyles
