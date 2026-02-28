import React from 'react'
import {createUseStyles} from 'react-jss'

interface IEmbedVideoComponent {
  video: string
  type: 'vimeo' | 'youtube'
}

const useStyles = createUseStyles({
  embedVideo: {
    marginBottom: '1.5rem',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '338px',
  },
  outer: {
    position: 'relative',
    paddingTop: '56.25% !important',  // 16:9 aspect ratio
    overflow: 'hidden',
  },
  inner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
})

const EmbedVideoComponent: React.FC<IEmbedVideoComponent> = ({video, type}) => {
  let src
  switch (type) {
    case 'vimeo':
      src = `https://player.vimeo.com/video/${video}?autoplay=0`
      break
    case 'youtube':
      src = `https://www.youtube.com/embed/${video}?autoplay=0`
      break
    default:
  }
  const classes = useStyles()
  return (
    <div className={classes.embedVideo}>
      <div className={classes.outer}>
        <iframe
          className={classes.inner}
          src={src}
          width='160'
          height='90'
          title='video player'
          frameBorder='0'
          allow='autoplay; fullscreen; picture-in-picture'
          allowFullScreen
        />
      </div>
    </div>
  )
}

export {EmbedVideoComponent}
