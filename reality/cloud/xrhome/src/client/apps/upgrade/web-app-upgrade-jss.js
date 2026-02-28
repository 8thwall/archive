import {createUseStyles} from 'react-jss'

import {
  brandPurple, brandBlack, darkBackground5,
  gray2, gray4, mobileWidthBreakpoint,
  bodySanSerif,
} from '../../static/styles/settings'

const useStyles = createUseStyles({
  hoveringPlanContainer: {
    'padding': '2em 5em !important',
    'borderStyle': 'solid',
    'borderWidth': '1px',
    'borderColor': gray2,
    'borderRadius': '0',
    'minWidth': '360px',
    'background': '#FFFFFF',
    'margin': '1em 0 !important',
    '& h2': {
      fontFamily: bodySanSerif,
      color: darkBackground5,
      letterSpacing: '0.15px',
      marginTop: '0.25em !important',
      marginBottom: '0.25em !important',
      fontSize: '1.8em',
    },
    '& h3': {
      fontFamily: bodySanSerif,
      textTransform: 'uppercase',
      color: gray4,
      fontSize: '1em',
      fontWeight: '450',
      letterSpacing: '1.17px',
      margin: '0.25em 0 !important',
    },
    '& h4': {
      fontFamily: bodySanSerif,
      color: darkBackground5,
      fontSize: '1.2em',
      letterSpacing: '0.34px',
      margin: '0 !important',
    },
    [`@media screen and (max-width: ${mobileWidthBreakpoint})`]: {
      'padding': '1em 0 !important',
    },
  },
  paymentMethod: {
    'display': 'flex',
    'flexDirection': 'column',
    'alignItems': 'flex-start',
    'margin': '2em 0 1em',
    '& > *': {
      margin: '0',
      padding: '0',
    },
  },
  planCharge: {
    margin: '2em 0',
  },
  simpleActionButton: {
    margin: '0.5em 0',
    color: brandPurple,
    backgroundColor: 'transparent',
    borderWidth: '0',
    borderColor: 'transparent',
    cursor: 'pointer',
  },
  cancelButton: {
    margin: '0.5em 1em',
    [`@media screen and (max-width: ${mobileWidthBreakpoint})`]: {
      margin: '0.5em 0.5em',
    },
  },
  actionButton: {
    fontWeight: 'bold !important',
  },
  action: {
    marginTop: '2em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: '0 0 auto',
  },
  right: {
    flex: '0 0 auto',
    textAlign: 'right',
  },
  actionImg: {
    width: '1em',
  },
  upgradeForm: {
    'width': '100%',
    '& > label': {
      fontWeight: 'bold',
      display: 'inline-block',
    },
    '& > label:not(:first-child)': {
      marginTop: '2em',
    },
    [`@media screen and (max-width: ${mobileWidthBreakpoint})`]: {
      'padding': '0 0.5em !important',
    },
  },
  badgeLink: {
    'color': brandBlack,
  },
  freeTrialWarningTitle: {
    marginBottom: '0.5em !important',
  },
  freeTrialWarningText: {
    '& a': {
      color: brandBlack,
      textDecoration: 'underline',
    },
  },
  coloredMessage: {
    marginTop: '1em',
  },
  coloredMessageContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '1em',
  },
  linkOut: {
    color: brandBlack,
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  contractsPending: {
    display: 'flex',
    justifyContent: 'center',
    margin: '5em',
  },
})

export default useStyles
