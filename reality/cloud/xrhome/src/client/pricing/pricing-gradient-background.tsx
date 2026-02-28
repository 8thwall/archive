import React from 'react'

import {createThemedStyles} from '../ui/theme'
import {brand8Purple} from '../ui/colors'
import {blueberry, mobileViewOverride, moonlight} from '../static/styles/settings'
import {hexColorWithAlpha} from '../../shared/colors'

const useStyles = createThemedStyles(() => ({
  pricingGradientBackground: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    zIndex: -1,
    filter: 'blur(100px)',
  },
  purpleEllipse: {
    top: '50%',
    left: 0,
    transform: 'translateY(-50%)',
    position: 'absolute',
    zIndex: -2,
    [mobileViewOverride]: {
      top: 0,
      transform: 'translateY(50%)',
    },
  },
  whiteEllipse: {
    width: '296px',
    height: '299px',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -3,
    borderRadius: '50%',
    background: moonlight,
    content: '""',
    [mobileViewOverride]: {
      left: '50%',
      transform: 'translateX(-50%)',
    },
  },
  blueEllipse: {
    width: '343px',
    height: '346px',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: -2,
    borderRadius: '50%',
    background: hexColorWithAlpha(blueberry, 0.35),
    content: '""',
    display: 'none',
    [mobileViewOverride]: {
      display: 'block',
    },
  },
}))

const PricingGradientBackground: React.FC = () => {
  const classes = useStyles()
  return (
    <div className={classes.pricingGradientBackground}>
      <div className={classes.purpleEllipse}>
        {/* eslint-disable-next-line max-len */}
        <svg xmlns='http://www.w3.org/2000/svg' width='203' height='206' viewBox='0 0 203 206' fill='none'>
          <ellipse cx='101.418' cy='103.07' rx='101.418' ry='102.296' fill={brand8Purple} />
        </svg>
      </div>
      <div className={classes.whiteEllipse} />
      <div className={classes.blueEllipse} />
    </div>
  )
}

export {PricingGradientBackground}
