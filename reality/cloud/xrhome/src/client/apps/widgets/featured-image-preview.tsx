import React, {useState} from 'react'
import {createUseStyles} from 'react-jss'
import {Button} from 'semantic-ui-react'

import {MAX_APP_FEATURED_IMAGE_COUNT} from '../../../shared/app-constants'
import {sortFeaturedImagesByCreated} from '../../../shared/featured-app-image'
import type {IFeaturedAppImage} from '../../common/types/models'
import {brandBlack, eggshell, gray2, gray4} from '../../static/styles/settings'
import {combine} from '../../common/styles'

const useStyles = createUseStyles({
  'container': {
    margin: '0 auto',
    textAlign: 'center',
  },
  'imageWrapper': {
    'position': 'relative',
    'display': 'inline-block',
    'margin': '1rem 0.5rem 0 0.5rem',
    'width': '9em',
    'height': '16em',
    'borderRadius': '0.25rem',
    'overflow': 'hidden',
    '&:empty': {
      border: `1px solid ${gray4}6E`,  // 43% opacity. TODO(christoph): Prefer brand color.
      backgroundColor: `${eggshell}6E`,  // 43% opacity. TODO(christoph): Prefer brand color.
    },
  },
  'image': {
    width: '100%',
    height: '100%',
    position: 'absolute',
    objectFit: 'cover',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
  'deleteButton': {
    position: 'absolute',
    right: '0.5rem',
    bottom: '0.5rem',
    backgroundColor: brandBlack,
  },
  // On devices that support hover, when the thumbnail isn't hovered, and the button isn't focused,
  // hide the button
  '@media (hover: hover)': {
    'imageWrapper': {
      '&:not(:hover) $deleteButton:not(:focus)': {
        opacity: 0,
      },
    },
  },
})

interface IFeaturedImageCarousel {
  featuredImages: readonly IFeaturedAppImage[]
  onDelete: (featuredImage: IFeaturedAppImage) => void
  makeImageUrl: (id: string) => string
  maxImageCount?: number
}

const FeaturedImagePreview: React.FC<IFeaturedImageCarousel> = ({
  featuredImages, onDelete, makeImageUrl, maxImageCount = MAX_APP_FEATURED_IMAGE_COUNT,
}) => {
  const classes = useStyles()

  const imagesToDisplay = sortFeaturedImagesByCreated(featuredImages)
  const emptyCount = Math.max(0, maxImageCount - featuredImages.length)

  const [imgLoaded, setImgLoaded] = useState<Record<string, boolean>>({})

  return (
    <div className={classes.container}>

      {imagesToDisplay.map(image => (
        <div
          className={
            !imgLoaded[image.uuid]
              ? combine(classes.imageWrapper, classes.animate)
              : classes.imageWrapper
          }
          key={image.uuid}
        >
          <img
            className={classes.image}
            onLoad={() => setImgLoaded({...imgLoaded, [image.uuid]: true})}
            src={makeImageUrl(image.objectId)}
            alt='Featured Project Screenshot'
          />

          <Button
            className={classes.deleteButton}
            color='black'
            icon='trash'
            onClick={() => onDelete(image)}
          />
        </div>
      ))}
      {Array.from({length: emptyCount}).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className={classes.imageWrapper} key={i} />
      ))}
    </div>
  )
}

export default FeaturedImagePreview
