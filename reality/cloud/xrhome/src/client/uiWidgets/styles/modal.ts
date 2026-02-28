import {createUseStyles} from 'react-jss'

import * as settings from '../../static/styles/settings'

const useStyles = createUseStyles({
  modal: {
    padding: '2em',
  },
  headerBlock: {
    marginBottom: '2em',
  },
  header: {
    margin: 'auto',
    fontWeight: 'normal',
    fontSize: '2.1em',
    width: 'fit-content',
    color: settings.brandBlack,
  },
  subheader: {
    margin: 'auto',
    fontSize: '1.15em',
    fontWeight: 'normal',
    width: 'fit-content',
    color: settings.brandBlack,
  },
  content: null,
  smallText: {
    fontSize: '0.9em',
    color: settings.gray4,
    marginBottom: '0.5em',
  },
  mainText: {
    fontSize: '1.3em',
    lineHeight: '1.5em',
    textAlign: 'center',
    margin: '1em',
  },
  actions: {
    marginTop: '1em',
  },
  spacedActions: {
    marginTop: '1em',
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  centerActions: {
    'marginTop': '2em',
    'display': 'flex',
    'justifyContent': 'center',
    'flexWrap': 'wrap',
    '& > :not(:last-child)': {
      marginRight: '2em !important',
    },
  },
  bigIcon: {
    color: settings.gray3,
    fontSize: '2rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  wideButton: {
    maxWidth: '100%',
    width: '20em',
  },
})

export default useStyles
