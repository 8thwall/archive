import React from 'react'
import Carousel, {consts} from 'react-elastic-carousel'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {APPS_PATH_PREFIX} from '../../shared/discovery-constants'
import IndustryCard from './industry-card'
import type {Keyword} from '../../shared/discovery-types'
import {useSelector} from '../hooks'
import {tinyViewOverride} from '../static/styles/settings'
import {bool, combine} from '../common/styles'
import usePageStyles from '../styles/page-styles'
import {Icon} from '../ui/components/icon'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  exploreContainer: {
    'marginTop': '2.5rem',
    'marginBottom': '3rem',
    [tinyViewOverride]: {
      'marginBottom': '2.5rem',
    },
  },
  exploreHeader: {
    'flexBasis': '320px',
    'borderTop': `1px solid ${theme.mainDivider}`,
  },
  exploreHeaderAnchor: {
    'display': 'inline-block',
    'marginTop': '1rem',
    'fontFamily': theme.bodyFontFamily,
    'fontWeight': 700,
    'fontSize': '1.25em',
    'color': theme.fgMain,
  },
  industryCarousel: {
    'width': 'calc(100% - 5rem)',
    'margin': '0 auto',
    'maxWidth': '80rem',
    '& .rec-slider-container': {
      'margin': 0,
    },
  },
  industryCarouselSmall: {
    'display': 'flex',
    'flexDirection': 'row',
    'gap': '2em',
    'paddingTop': '2.5rem',
    'paddingBottom': '2.5rem',
    'paddingLeft': '2rem',
    'overflowX': 'scroll',
    'scrollbarWidth': 'none',
    'msOverflowStyle': 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '&:after': {
      content: '""',
      paddingRight: '1rem',
    },
    [tinyViewOverride]: {
      paddingTop: '2rem',
      paddingBottom: '2rem',
    },
  },
  visuallyHidden: {
    'clip': 'rect(0 0 0 0)',
    'clipPath': 'inset(50%)',
    'height': '1px',
    'overflow': 'hidden',
    'position': 'absolute',
    'whiteSpace': 'no-wrap',
    'width': '1px',
  },
  arrowButton: {
    'background': 'transparent',
    'border': 'none',
    'outline': 'none',
    'cursor': 'pointer',
    'color': theme.fgMain,
    'fontSize': '2rem',
    'minWidth': '4rem',

    '&[disabled]': {
      visibility: 'hidden',
    },
    '&:hover': {
      color: theme.fgMuted,
    },
  },
}))

interface IIndustryCarousel {
  showExploreMore?: boolean
  keywords: readonly Keyword[]
  pageName: string
}

const IndustryCarousel = ({showExploreMore = false, keywords, pageName}: IIndustryCarousel) => {
  const styles = useStyles()
  const pageStyles = usePageStyles()
  const {t} = useTranslation(['public-featured-pages'])
  const isSmallScreen = useSelector(state => state.common.isSmallScreen)
  const renderArrow = ({type, onClick, isEdge}) => (
    <button
      type='button'
      onClick={onClick}
      disabled={isEdge}
      className={styles.arrowButton}
    >
      <span className={styles.visuallyHidden}>{type === 'PREV' ? 'Previous' : 'Next'}</span>
      <Icon inline stroke={type === consts.PREV ? 'chevronLeft' : 'chevronRight'} />
    </button>
  )

  const industryCards = keywords.filter(keyword => keyword.carouselPriority)
    .sort((a, b) => (a.carouselPriority < b.carouselPriority ? -1 : 1))
    .map(keyword => (
      <IndustryCard pathPrefix={APPS_PATH_PREFIX} keyword={keyword} key={keyword.name} />
    ))

  return (
    <div className={bool(showExploreMore, styles.exploreContainer)}>
      {showExploreMore &&
        <div className={combine(styles.exploreHeader, pageStyles.sectionProfile)}>
          <Link
            to='/discover'
            className={styles.exploreHeaderAnchor}
            a8={`click;${pageName};click-discovery-hub-anchor-above-industry-carousel`}
          >{t('industry_carousel.cta.explore_more')}
          </Link>
        </div>
      }
      {isSmallScreen
        ? (
          <div className={styles.industryCarouselSmall}>
            {industryCards}
          </div>
        )
        : (
          <Carousel
            isRTL={false}
            className={styles.industryCarousel}
            renderArrow={renderArrow}
            pagination={false}
            itemsToShow={3.5}
            itemsToScroll={1}
            outerSpacing={isSmallScreen ? 30 : 0}
            itemPadding={[12, 12]}
            showArrows
          >
            {industryCards}
          </Carousel>
        )}
    </div>
  )
}

export default IndustryCarousel
