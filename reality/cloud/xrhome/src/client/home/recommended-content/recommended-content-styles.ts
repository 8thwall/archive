import {mobileViewOverride, tinyViewOverride} from '../../static/styles/settings'
import {createThemedStyles} from '../../ui/theme'

const useRecommendedContentStyles = createThemedStyles(theme => ({
  contentContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'repeat(auto-fill, 90px)',
    gap: '2rem',
    columnGap: '3.5rem',
    [mobileViewOverride]: {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'repeat(auto-fill, 60px)',
      rowGap: '1rem',
    },
    [tinyViewOverride]: {
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto',
      gap: '2rem',
    },
    marginTop: '2rem',
    marginBottom: '1.5rem',
  },
  viewAllLink: {
    marginLeft: 'auto',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '1.25rem',
    color: theme.linkBtnFg,
    float: 'right',
  },
}))

export {
  useRecommendedContentStyles,
}
