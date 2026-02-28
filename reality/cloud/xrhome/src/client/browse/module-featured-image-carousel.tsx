import React, {useState, useRef, useCallback} from 'react'
import type {DeepReadonly} from 'ts-essentials'

import {sortFeaturedImagesByCreated} from '../../shared/featured-app-image'

import type {IFeaturedAppImage} from '../common/types/models'
import {gray4} from '../static/styles/settings'
import {combine} from '../common/styles'
import {
  MODULE_FEATURED_IMAGE_DIMENSIONS, getModuleFeaturedImageUrl,
} from '../../shared/module-featured-image'
import {createThemedStyles} from '../ui/theme'
import {Icon} from '../ui/components/icon'

const useStyles = createThemedStyles(theme => ({
  'imageCarousel': {
    'top': 0,
    'left': 0,
    'bottom': 0,
    'right': 0,
    'display': 'flex',
    'position': 'absolute',
    'gap': '1em',
    'alignItems': 'center',
    'overflowX': 'auto',
    'scrollSnapType': 'x mandatory',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  'imageCarouselItem': {
    'scrollSnapAlign': 'start',
    'height': '100%',
  },
  'image': {
    display: 'block',
    height: '100%',
    borderRadius: '0.5rem',
  },
  'imageCarouselContainer': {
    paddingTop: '52.5%',
    minWidth: '15rem',
    height: 0,
    width: '100%',
    position: 'relative',
  },
  'arrowButton': {
    'height': '100%',
    'padding': '0.25rem',
    'background': 'transparent',
    'color': theme.carouselArrowActive,
    'border': 'none',
    'outline': 'none',
    'textAlign': 'center',
    'fontSize': '2rem',
    'zIndex': 1,
    'cursor': 'pointer',
    '&[disabled]': {
      cursor: 'not-allowed',
      color: theme.carouselArrowDisabled,
    },
    '&:hover': {
      '&:not([disabled])': {
        'color': theme.carouselArrowHover,
      },
    },
    '&:focus': {
      'boxShadow': `0 0 0 2px ${gray4}`,
      '&:not(:focus-visible)': {
        boxShadow: 'none',
      },
    },
  },
  'leftArrow': {
    marginLeft: '-2rem',
  },
  'moduleCarouselContainer': {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  'moduleCarouselContainerItem': {
    flex: '1 0 0',
  },
}))

interface IModuleFeaturedImageCarousel {
  featuredImages: DeepReadonly<IFeaturedAppImage[]>
  coverImageSrc?: string
}

const ModuleFeaturedImageCarousel: React.FC<IModuleFeaturedImageCarousel> = ({
  featuredImages, coverImageSrc,
}) => {
  const classes = useStyles()

  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const imagesToDisplay = sortFeaturedImagesByCreated(featuredImages)

  const showArrows = imagesToDisplay.length > 0

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (container) {
      const {scrollLeft, scrollWidth, clientWidth} = container
      setCanScrollLeft(scrollLeft > 0)

      const scrollRight = Math.floor(scrollWidth - clientWidth - scrollLeft)
      setCanScrollRight(scrollRight > 0)
    }
  }, [])

  const handleArrowClick = (direction: 'left' | 'right') => {
    const container = containerRef.current
    if (container) {
      const {scrollLeft, clientWidth} = container
      const newScrollLeft =
            direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      container.scrollTo({left: newScrollLeft, behavior: 'smooth'})
      handleScroll()
    }
  }

  return (
    <div className={classes.moduleCarouselContainer}>
      {showArrows &&
        <button
          type='button'
          className={combine(classes.arrowButton, classes.leftArrow)}
          onClick={() => handleArrowClick('left')}
          disabled={!canScrollLeft}
        >
          <Icon stroke='chevronLeft' />
        </button>}
      <div className={classes.moduleCarouselContainerItem}>
        <div className={classes.imageCarouselContainer}>
          <div className={classes.imageCarousel} onScroll={handleScroll} ref={containerRef}>
            {coverImageSrc &&
              <div className={classes.imageCarouselItem}>
                <img
                  src={coverImageSrc}
                  alt='Cover'
                  className={classes.image}
                />
              </div>
            }
            {imagesToDisplay.map(item => (
              <div
                key={item.objectId}
                className={classes.imageCarouselItem}
              >
                <img
                  src={getModuleFeaturedImageUrl(
                    item.objectId, {dimensions: MODULE_FEATURED_IMAGE_DIMENSIONS.MEDIUM}
                  )}
                  alt='Featured Screenshot'
                  className={classes.image}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {showArrows &&
        <button
          type='button'
          className={classes.arrowButton}
          onClick={() => handleArrowClick('right')}
          disabled={!canScrollRight}
        >
          <Icon stroke='chevronRight' />
        </button>}
    </div>
  )
}
export default ModuleFeaturedImageCarousel
