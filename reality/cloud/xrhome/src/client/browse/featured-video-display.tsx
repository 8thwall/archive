import React from 'react'
import {createUseStyles} from 'react-jss'

import FeaturedContentBlock from './widgets/featured-content-block'

const YOUTUBE_PREFIX = 'youtu.be/'

const VIMEO_PREFIX = 'vimeo.com/'

const getEmbedSrc = (url: string) => {
  if (!url) {
    return null
  } else if (url.startsWith(YOUTUBE_PREFIX)) {
    const id = url.substr(YOUTUBE_PREFIX.length)
    // Including the "playlist" param is a fix for just loop not working in iframes
    // https://developers.google.com/youtube/player_parameters#loop
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&modestbranding=1&\
playlist=${id}&loop=1`
  } else if (url.startsWith(VIMEO_PREFIX)) {
    const id = url.substr(VIMEO_PREFIX.length)
    return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1`
  } else {
    return null
  }
}

const useStyles = createUseStyles({
  wrapper: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%',  // 16:9 aspect ratio
  },
  video: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
})

interface IFeaturedVideoDisplay {
  featuredVideoUrl: string
}

const FeaturedVideoDisplay: React.FC<IFeaturedVideoDisplay> = ({featuredVideoUrl}) => {
  const src = getEmbedSrc(featuredVideoUrl)
  const classes = useStyles()
  const isServer = typeof window === 'undefined'
  return (src &&
    <FeaturedContentBlock>
      {
        isServer
          ? (
            <div className={classes.wrapper}>
              <div className={classes.video} />
            </div>
          )
          : (
            <div className={classes.wrapper}>
              <iframe
                className={classes.video}
                src={src}
                width='160'
                height='90'
                title='Video Player'
                frameBorder='0'
                allow='autoplay; fullscreen; picture-in-picture'
                allowFullScreen
              />
            </div>
          )
      }
    </FeaturedContentBlock>
  )
}

export default FeaturedVideoDisplay
