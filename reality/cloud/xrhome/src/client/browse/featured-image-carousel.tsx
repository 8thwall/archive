import React, {useState} from 'react'
import Carousel, {consts} from 'react-elastic-carousel'
import {createUseStyles} from 'react-jss'
import type {DeepReadonly} from 'ts-essentials'

import {combine} from '../common/styles'
import type {IFeaturedAppImage} from '../common/types/models'
import {
  gray2, gray3, gray4, mobileViewOverride, smallMonitorViewOverride, tinyViewOverride,
} from '../static/styles/settings'
import {
  getFeaturedAppImageUrl, FEATURED_APP_IMAGE_DIMENSIONS, sortFeaturedImagesByCreated,
} from '../../shared/featured-app-image'
import FeaturedContentBlock from './widgets/featured-content-block'
import {useSelector} from '../hooks'
import {Icon} from '../ui/components/icon'

const inBrowser = typeof window !== 'undefined'
const useStyles = createUseStyles({
  'placeholder': {
    'width': 'calc(100% - 8rem)',
    'overflow': 'hidden',
    'display': 'flex',
    'maxWidth': '70rem',
    'margin': '0 auto',
  },
  'placeholderContainer': {
    '&:not(:first-child)': {
      'marginLeft': '1rem',
    },
    '&:not(:last-child)': {
      'marginRight': '1rem',
    },
    'flex': '0 0 calc(70rem / 3.5) !important',
    [mobileViewOverride]: {
      flex: '0 0 calc((100vw - 8rem) / 2.3) !important',
    },
    [tinyViewOverride]: {
      flex: '0 0 calc((100vw - 8rem) / 1.2) !important',
    },
  },
  'carousel': {
    'width': 'calc(100% - 8rem)',
    'maxWidth': '80rem',
    'margin': '0 auto',
    '& .rec-slider-container': {
      'margin': 0,
      'borderRadius': '0.5rem',
      [tinyViewOverride]: {
        borderRadius: 0,
      },
    },
  },
  'carouselSmall': {
    'display': 'flex',
    'flexDirection': 'row',
    'paddingTop': '0',
    'paddingBottom': '0',
    'paddingLeft': '1rem',
    'overflowX': 'scroll',
    'scrollbarWidth': 'none',
    'msOverflowStyle': 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    [tinyViewOverride]: {
      paddingTop: '0',
      paddingBottom: '0',
    },
    '&:after': {
      content: '""',
      paddingRight: '1.5rem',
    },
  },
  'itemSpacer': {
    margin: '1rem',
    width: '100%',
  },
  'imageContainer': {
    'width': '100%',
    'paddingTop': '177.78%',
    'position': 'relative',
    'borderRadius': '0.5rem',
    'overflow': 'hidden',
    [smallMonitorViewOverride]: {
      width: '20rem',
    },
  },
  'img': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  'arrowButton': {
    'minWidth': '4rem',
    'height': '100%',
    'background': 'transparent',
    'padding': 0,
    'color': gray4,
    'border': 'none',
    'outline': 'none',
    'cursor': 'pointer',
    'textAlign': 'center',
    'fontSize': '2rem',
    'zIndex': 1,
    '&[disabled]': {
      visibility: 'hidden',
    },
    '&:hover': {
      color: gray3,
    },
    '&:focus': {
      'boxShadow': `0 0 0 2px ${gray4}`,
      '&:not(:focus-visible)': {
        boxShadow: 'none',
      },
    },
  },
  'visuallyHidden': {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'no-wrap',
    width: '1px',
  },
  'split': {
    display: 'flex',
    justifyContent: 'center',
  },
  'splitColumn': {
    'flex': '1 0 0',
    'maxWidth': '20rem',
    'minWidth': 0,
    '& + &': {
      marginLeft: '1rem',
    },
  },
  'animate': {
    animation: '$loadBreathe 1s ease-in-out infinite alternate both',
    backgroundColor: gray2,
  },
  '@keyframes loadBreathe': {
    from: {
      background: '#D5D7E4',
    },
    to: {
      background: '#B5B8D0',
    },
  },
})

export interface IFeaturedCarouselImage {
  objectId: string
}

const FeaturedCarouselImage: React.FC<IFeaturedCarouselImage> = ({objectId}) => {
  const classes = useStyles()
  const [loadComplete, setLoadComplete] = useState(false)
  return (
    <div className={classes.imageContainer}>
      <img
        draggable={false}
        src={getFeaturedAppImageUrl(objectId, {dimensions: FEATURED_APP_IMAGE_DIMENSIONS.MEDIUM})}
        alt='Featured screenshot'
        className={
          !loadComplete
            ? combine(classes.img, classes.animate)
            : classes.img
        }
        onLoad={() => setLoadComplete(true)}
      />
    </div>
  )
}

interface IFeaturedImageCarousel {
  featuredImages: DeepReadonly<IFeaturedAppImage[]>
}

const FeaturedImageCarousel: React.FC<IFeaturedImageCarousel> = ({featuredImages}) => {
  const classes = useStyles()

  const isTinyScreen = useSelector(state => state.common.isTinyScreen)
  const isSmallScreen = useSelector(state => state.common.isSmallScreen)

  if (!featuredImages?.length) {
    return null
  }

  const imagesToDisplay = sortFeaturedImagesByCreated(featuredImages)
  const carouselImages = imagesToDisplay.map(data => (
    <div key={data.uuid} className={classes.itemSpacer}>
      <FeaturedCarouselImage objectId={data.objectId} />
    </div>
  ))

  if ((!isTinyScreen && imagesToDisplay.length <= 2) ||
    (isTinyScreen && imagesToDisplay.length < 2)) {
    return (
      <div className='section centered'>
        <FeaturedContentBlock>
          <div className={classes.split}>
            {imagesToDisplay.map(data => (
              <div key={data.uuid} className={classes.splitColumn}>
                <FeaturedCarouselImage objectId={data.objectId} />
              </div>
            ))}
          </div>
        </FeaturedContentBlock>
      </div>
    )
  }

  if (!inBrowser) {
    return (
      <div className={classes.placeholder}>
        {imagesToDisplay.map(data => (
          <div key={data.uuid} className={classes.placeholderContainer}>
            <FeaturedCarouselImage objectId={data.objectId} />
          </div>
        ))}
      </div>
    )
  }

  const breakPoints = [
    {width: 600, itemsToShow: 2.5},
    {width: 700, itemsToShow: 2.8},
    {width: 750, itemsToShow: 3},
    {width: 850, itemsToShow: 3.2},
    {width: 990, itemsToShow: 3.5},
  ]

  return (
    <FeaturedContentBlock>
      {isSmallScreen
        ? (
          <div className={classes.carouselSmall}>
            {carouselImages}
          </div>)
        : (
          <Carousel
            className={classes.carousel}
            isRTL={false}
            renderArrow={({type, onClick, isEdge}) => (
              <button
                onClick={onClick}
                type='button'
                className={classes.arrowButton}
                disabled={isEdge}
              >
                <span className={classes.visuallyHidden}>
                  {type === 'PREV' ? 'Previous' : 'Next'}
                </span>
                <Icon inline stroke={type === consts.PREV ? 'chevronLeft' : 'chevronRight'} />
              </button>

            )}
            pagination={false}
            showEmptySlots
            showArrows
            breakPoints={breakPoints}
            itemsToScroll={1}
            outerSpacing={isTinyScreen ? 32 : 0}
          >
            {carouselImages}
          </Carousel>)}
    </FeaturedContentBlock>
  )
}

export default FeaturedImageCarousel
