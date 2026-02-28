import {
  blueberry, brandWhite, gray2,
  gray3, mobileViewOverride, tinyViewOverride,
} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'

const useLibraryStyles = createThemedStyles(theme => ({
  page: {
    '& > .page-content': {
      paddingTop: '0',
      marginBottom: '80px',
      [tinyViewOverride]: {
        marginBottom: '24px',
      },
    },
  },
  content: {
    'fontSize': '14px',
    'height': '100%',
    'padding': '3em 10em',
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '1.6em',
    'fontFamily': theme.bodyFontFamily,
    'lineHeight': '1.571em',
    'fontWeight': '400',
    'color': theme.fgMain,

    [mobileViewOverride]: {
      padding: '3em 1.7em',
    },
    [tinyViewOverride]: {
      padding: '1.7em',
    },
  },
  header: {
    display: 'flex',
    gap: '0.5em',
  },
  headerTitle: {
    fontFamily: theme.headingFontFamily,
    fontSize: '24px',
    fontWeight: '900',
    lineHeight: '1.5em',
    marginTop: 0,
  },
  imgWrapper: {
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: brandWhite,
    border: `solid 1px ${gray3}`,
    borderRadius: '2em',
  },
  headerBlurb: {
    fontFamily: theme.subHeadingFontFamily,
    maxWidth: '750px',
    marginBottom: 0,
    textAlign: 'center',
  },
  inputsContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    [mobileViewOverride]: {
      'flexDirection': 'column',
      'justifyContent': 'flex-start',
      'gap': '1em',
    },
  },
  searchContainer: {
    'display': 'flex',
    'flexDirection': 'row',
    'height': '2.71em',
    'width': '38%',
    'borderRadius': '4px',
    'border': `1px solid ${gray2}`,
    'alignItems': 'center',
    '&:focus-within': {
      border: `1px solid ${blueberry}`,
    },
    [mobileViewOverride]: {
      width: '100%',
    },
  },
  searchIcon: {
    margin: '0.6em 0.6em 0.7em 0.9em',
  },
  searchInput: {
    'width': '100%',
    'padding': '0',
    'border': '0',
    'outline': '0',
    'backgroundColor': 'transparent',
    'color': theme.fgMain,
    'fontFamily': theme.bodyFontFamily,
    'margin-right': '0.5em',
    '&::placeholder': {
      color: theme.fgMuted,
    },
    '$:-ms-input-placeholder': {
      color: theme.fgMuted,
    },
    '::-ms-input-placeholder': {
      color: theme.fgMuted,
    },
    '&:focus::placeholder': {
      color: 'transparent',
    },
  },
  dropDownsContainer: {
    display: 'flex',
    gap: '1em',
    width: '38%',
    [mobileViewOverride]: {
      width: '100%',
    },
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  dropDown: {
    height: '38px',
  },
  cardContainer: {
    'marginTop': '1em',
    'display': 'grid',
    'gap': '2.7em 1.3em',
    'gridTemplateColumns': 'repeat(auto-fill, minmax(294px, 1fr))',
    'gridAutoRows': 'minmax(min-content, max-content)',
    'paddingBottom': '1em',
    [mobileViewOverride]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(239px, 1fr))',
    },
  },
  loader: {
    'align-self': 'center',
    'margin-right': '1rem !important',
  },
  noProject: {
    'display': 'flex',
    'flexDirection': 'column',
    'flex': '1',
    'alignItems': 'center',
    'gap': '1em',
    'justifyContent': 'center',
    '& p': {
      color: theme.fgMuted,
    },
    '& img': {
      width: '300px',
      opacity: '1',
      [tinyViewOverride]: {
        width: '100%',
      },
    },
    [tinyViewOverride]: {
      padding: '20%',
    },
  },
  codeSearchToggle: {
    'alignContent': 'center',
    'flexShrink': 0,
    'marginRight': '0.5em',
    '& span': {
      color: theme.fgMuted,
    },
    '& > label div': {
      gap: '0.3rem',
    },
  },
  resultsCount: {
    marginTop: '-0.75em',
    marginBottom: '-1.75em',
    fontSize: '14px',
    color: theme.fgMuted,
  },
  codeSearchResultsContainer: {
    marginTop: '1em',
    gap: '2em',
    display: 'flex',
    flexDirection: 'column',
  },
}))

export {
  useLibraryStyles,
}
