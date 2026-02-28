import * as React from 'react'
import {createUseStyles} from 'react-jss'

import {brandBlack} from '../static/styles/settings'
import {AspectRatio} from '../ui/layout/aspect-ratio'

interface AspectImageProps {
  width?: number
  height?: number
  alt?: string
  src: string
}

const useStyles = createUseStyles({
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    objectFit: 'cover',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: brandBlack,
  },
})

const FixedAspectImage: React.FunctionComponent<AspectImageProps> = ({
  width = 16,
  height = 9,
  alt = '',
  src,
}) => {
  const styles = useStyles()

  return (
    <AspectRatio ratio={width / height}>
      <img className={styles.image} src={src} alt={alt} />
    </AspectRatio>
  )
}

export {FixedAspectImage}
