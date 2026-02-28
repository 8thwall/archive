import {createUseStyles} from 'react-jss'

import {tinyViewOverride} from '../../static/styles/settings'

const usePayoutStyles = createUseStyles({
  bottom: {
    'display': 'flex',
    'gap': '0.5em',
    'marginTop': '1.5em',
    '& > .ui.button': {
      fontWeight: '600',
    },
    [tinyViewOverride]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  stripe: {
    marginLeft: 'auto',
    [tinyViewOverride]: {
      marginLeft: '0',
      marginTop: '1.5em',
    },
  },
})

export default usePayoutStyles
