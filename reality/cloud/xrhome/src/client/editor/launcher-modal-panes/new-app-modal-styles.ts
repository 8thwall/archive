import {
  gray1, gray2, gray4, gray5, brandWhite, brandBlack,
  blueberry, bodySanSerif,
  mobileViewOverride, tinyViewOverride, smallMonitorViewOverride,
} from '../../static/styles/settings'
import {createCustomUseStyles} from '../../common/create-custom-use-styles'

const useNewProjectModalStyles = createCustomUseStyles<{themeName: 'light' | 'dark'}>()({
  container: {
    padding: '1.7em 0.6em 0.6em 2.3em',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    position: 'relative',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: '4.6em',
    [mobileViewOverride]: {
      paddingRight: '3.6em',
    },
    [tinyViewOverride]: {
      paddingRight: '2.6em',
    },
  },
  headerBlurb: {
    marginBottom: '1em',
    display: 'flex',
    flexDirection: 'row',
    gap: '1em',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: '1',
    alignSelf: 'center',
  },
  techTypesContainer: {
    marginBottom: '1em',
    display: 'flex',
    flexDirection: 'row',
    gap: '0em 0.5em',
    height: '32px',
  },
  techType: {
    'display': 'flex',
    'justifyContent': 'center',
    'height': '100%',
    'width': '130px',
    'fontWeight': '600',
    'lineHeight': '32px',
    'borderRadius': '6px',
    'cursor': 'pointer',
    'color': gray4,

    '&:hover': {
      backgroundColor: ({themeName}) => (themeName === 'dark' ? gray5 : gray1),
      color: ({themeName}) => (themeName === 'dark' ? brandWhite : brandBlack),
    },
  },
  templateTabs: {
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'padding': '0.5rem 1rem',
    'width': 'auto',
    'height': 'auto',
    'fontWeight': '600',
    'lineHeight': '32px',
    'borderRadius': '6px',
    'cursor': 'pointer',
    'color': gray4,
    '&:hover': {
      backgroundColor: ({themeName}) => (themeName === 'dark' ? gray5 : gray1),
      color: ({themeName}) => (themeName === 'dark' ? brandWhite : brandBlack),
    },
  },
  activeTech: {
    backgroundColor: ({themeName}) => (themeName === 'dark' ? gray5 : gray1),
    color: ({themeName}) => (themeName === 'dark' ? brandWhite : brandBlack),
  },
  cardContainer: {
    'padding': '0.6em 4em 0 0',
    'overflowY': 'scroll',
    'flex': '1',
    'display': 'grid',
    'gap': '2em 0.75em',
    'gridTemplateColumns': 'repeat(auto-fill, minmax(239px, 1fr))',
    'gridAutoRows': 'minmax(min-content, max-content)',
    'paddingBottom': '1em',

    'scrollbarWidth': 'thin',
    'scrollbarColor': `${gray4} ${brandBlack}`,
    '&::-webkit-scrollbar': {
      width: '8px',
      marginRight: '0.5em',
    },
    '&::-webkit-scrollbar-thumb': {
      'background': gray4,
      'borderRadius': '4px',
      '&:hover': {
        background: gray4,
      },
    },
    '&::-webkit-scrollbar-track': {
      background: ({themeName}) => (themeName === 'dark' ? brandBlack : gray2),
      borderRadius: '4px',
    },
    [mobileViewOverride]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
      paddingRight: '3em',
    },
    [tinyViewOverride]: {
      paddingRight: '2em',
    },
  },
  noProject: {
    'display': 'flex',
    'flexDirection': 'column',
    'flex': '1',
    'alignItems': 'center',
    'gap': '1em',
    'paddingTop': '25%',
    '& p': {
      color: gray4,
    },
    '& img': {
      width: '300px',
      opacity: ({themeName}) => (themeName === 'dark' ? '50%' : '1'),
      [tinyViewOverride]: {
        width: '100%',
      },
    },
    [tinyViewOverride]: {
      paddingTop: '40%',
    },
  },
  loaderContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  loader: {
    '& > .spinner::before': {
      borderColor: ({themeName}) => (themeName === 'dark'
        ? 'rgba(255, 255, 255, 0.15) !important'
        : 'rgba(0, 0, 0, 0.1) !important'),
      borderTopColor: ({themeName}) => (themeName === 'dark'
        ? 'rgb(255, 255, 255) !important'
        : 'rgb(118, 118, 118) !important'),
    },
  },
  filterContainer: {
    marginBottom: '1em',
    display: 'flex',
    flexDirection: 'row',
    gap: '1.2em',
    [smallMonitorViewOverride]: {
      flexDirection: 'column',
    },
  },
  searchContainer: {
    'marginBottom': '1em',
    'display': 'flex',
    'flex': '1',
    'flexDirection': 'row',
    'height': '32px',
    'borderRadius': '4px',
    '&:focus-within': {
      border: `1px solid ${blueberry}`,
    },
    'backgroundColor': ({themeName}) => (themeName === 'dark' ? `${gray4}26` : brandWhite),
    'border': (({themeName}) => (themeName === 'dark'
      ? '1px solid transparent'
      : `1px solid ${gray2}`)),
    [smallMonitorViewOverride]: {
      flex: 'none',
    },
  },
  searchIcon: {
    margin: '0.5em 0.5em 0.5em 1em',
  },
  searchInput: {
    'width': '100%',
    'padding': '0',
    'border': '0',
    'outline': '0',
    'backgroundColor': 'transparent',
    'fontFamily': bodySanSerif,
    'color': (({themeName}) => (themeName === 'dark' ? brandWhite : brandBlack)),
    '&::selection': {
      color: (({themeName}) => (themeName === 'dark' ? brandWhite : brandBlack)),
    },
    '&::placeholder': {
      color: gray4,
    },
    '$:-ms-input-placeholder': {
      color: gray4,
    },
    '::-ms-input-placeholder': {
      color: gray4,
    },
    '&:focus::placeholder': {
      color: 'transparent',
    },
  },
  dropDownsContainer: {
    'display': 'flex',
    'flex': '2',
    'flexDirection': 'row',
    'minWidth': '0',
    'gap': '1.2em',
    '@media (max-width: 850px)': {
      flexDirection: 'column',
    },
  },
  dropDown: {
    height: '32px',
  },
})

export default useNewProjectModalStyles
