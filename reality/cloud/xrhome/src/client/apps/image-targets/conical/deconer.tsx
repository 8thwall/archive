import React from 'react'
import {createUseStyles} from 'react-jss'

import {gray3} from '../../../static/styles/settings'

const useStyles = createUseStyles({
  container: {
    'display': 'flex',
    'flexDirection': 'column',
    '& svg': {
      borderRadius: '0.5em',
      border: `3px solid ${gray3}`,
    },
  },
})

interface IArcVisualizer {
  topRadius: number
  bottomRadius: number
  img: string
  width: number
  height: number
  hideBottomArc?: boolean
}

const ArcVisualizer: React.FC<IArcVisualizer> = ({
  topRadius, bottomRadius, img, width, height, hideBottomArc = false,
}) => {
  const cx: number = width / 2
  // If a cone, the center of the circle is below the image and rLarge is touching the top of the
  // image.  If a fez, the center of the circle is above the image and the rLarge is touching the
  // bottom of the image.
  const cy: number = topRadius >= 0 ? topRadius : height + topRadius

  // the radius value must be positive
  const rLarge: number = Math.abs(topRadius)
  const rSmall: number = bottomRadius
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox={`0 0 ${width} ${height}`}>
        <g fill='#61DAFB'>
          <image href={img} />
          <circle cx={cx} cy={cy} r={rLarge} stroke='red' fill='none' strokeWidth='5' />
          {!hideBottomArc && <circle cx={cx} cy={cy} r={rSmall} stroke='blue' fill='none' strokeWidth='5' />}
        </g>
      </svg>
    </div>
  )
}

export {
  ArcVisualizer,
}
