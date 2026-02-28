import {createUseStyles} from 'react-jss'

import {
  mobileViewOverride, tinyViewOverride,
} from '../../static/styles/settings'

const useSignUpStyles = createUseStyles({
  page: {
    '& .page-content.centered': {
      maxWidth: '80em',
      marginTop: '3em',
      position: 'relative',
      [mobileViewOverride]: {
        margin: '2em',
        width: 'auto',
      },
    },
    [mobileViewOverride]: {
      'backgroundSize': 'cover',
      'backgroundPosition': '20em 20em',
    },
    [tinyViewOverride]: {
      'backgroundPosition': '-5em 20em',
    },
  },
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    [mobileViewOverride]: {
      justifyContent: 'space-around',
    },
    [tinyViewOverride]: {
      height: 'unset',
    },
  },
  links: {
    [mobileViewOverride]: {
      fontSize: '1.1em',
    },
  },
})

export default useSignUpStyles
