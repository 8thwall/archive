import * as React from 'react'
import {createUseStyles} from 'react-jss'

const useStyles = createUseStyles({
  metadata: {
    display: 'flex',
  },
  left: {
    flex: '1 0 0',
    textAlign: 'left',
  },
  right: {
    flex: '1 0 0',
    textAlign: 'right',
  },
})

interface IImageMetadata {
  name: string
  width: number
  height: number
}

const ImageMetadata: React.FunctionComponent<IImageMetadata> = ({
  name, width, height,
}) => {
  const classes = useStyles()
  return (
    <div className={classes.metadata}>
      <div className={classes.left}>{width} x {height}</div>
      <div className={classes.right}>{name}</div>
    </div>
  )
}

export default ImageMetadata
