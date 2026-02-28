import {createUseStyles} from 'react-jss'

import {
  centeredSectionMargin, centeredSectionMaxWidth,
  mobileViewOverride, tinyViewOverride, gray5,
  csBlack,
} from '../static/styles/settings'

const usePageStyles = createUseStyles({
  sectionProfile: {
    width: `calc(100% - ${centeredSectionMargin})`,
    maxWidth: centeredSectionMaxWidth,
    margin: '0 auto',
    [mobileViewOverride]: {
      maxWidth: '100%',
    },
  },
  pageProfile: {
    '& .page-content': {
      width: `calc(100% - ${centeredSectionMargin})`,
      maxWidth: centeredSectionMaxWidth,
      margin: '0 auto',
      [mobileViewOverride]: {
        maxWidth: '100%',
      },
    },
    '& header > div:first-child > span': {
      marginLeft: 0,
    },
  },
  createContainer: {
    '& > .segment': {
      borderRadius: '6px',
      padding: '1.8em',
      boxShadow: 'none',
      filter: `drop-shadow(0 0 4px ${gray5}26)`,
      zIndex: '5',
      [tinyViewOverride]: {
        padding: '1.2em',
      },
    },
  },
  appLoadingScreen: {
    'backgroundColor': csBlack,
    'overflow': 'hidden',
    '& .page-content': {
      'display': 'flex',
    },
  },
})

export default usePageStyles
