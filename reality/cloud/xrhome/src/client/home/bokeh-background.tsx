import React from 'react'
import {createUseStyles} from 'react-jss'

import {brandHighlight, cherry, mint, blueberry} from '../static/styles/settings'
import {createCustomUseStyles} from '../common/create-custom-use-styles'
import {hexColorWithAlpha} from '../../shared/colors'

const useStyles = createUseStyles({
  bokehContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    filter: 'blur(9rem)',
    opacity: '70%',
    top: 0,
    left: 0,
  },
})

interface IBokehStyles {
  color: string
  positionX: number
  positionY: number
  duration: number
  delay: number
  blurRadius: number
  boxShadow: number
  transformOriginX: number
  transformOriginY: number
}

const PARTICLE_SIZE = 120
const ANIMATION_DURATION = 30
const PARTICLE_AMOUNT = 20
const PARTICLE_COLORS: {color: string, frequency: number}[] = [
  {color: brandHighlight, frequency: 5},
  {color: mint, frequency: 3},
  {color: blueberry, frequency: 3},
  {color: hexColorWithAlpha(cherry, 0.7), frequency: 1},
]
const BIASED_ARRAY = PARTICLE_COLORS.map(pcolor => new Array(pcolor.frequency)
  .fill(pcolor.color)).flat()

const getRandomInt = (
  min: number, max: number
) => Math.floor(Math.random() * (max - min + 1)) + min

const getNegativeOrPositive = () => (Math.random() < 0.5 ? -1 : 1)

const useBokehStyles = createCustomUseStyles<IBokehStyles>()({
  '@keyframes move': {
    '100%': {
      transform: 'translate3d(0, 0, 1px) rotate(360deg)',
    },
  },
  'particle': {
    width: `${PARTICLE_SIZE * 3}px`,
    height: `${PARTICLE_SIZE * 3}px`,
    borderRadius: `${PARTICLE_SIZE / 2}vh`,
    backfaceVisbility: 'hidden',
    position: 'absolute',
    backgroundColor: props => props.color,
    top: (props: IBokehStyles) => `${props.positionX}%`,
    left: (props: IBokehStyles) => `${props.positionY}%`,
    animationName: '$move',
    animationDuration: (props: IBokehStyles) => `${props.duration}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    transformOrigin: (props: IBokehStyles) => `${props.transformOriginX}px ` +
      `${props.transformOriginY}px`,
  },
})

interface IBokehBackground {
  particleCount?: number
}

const BokehParticle = () => {
  const classes = useBokehStyles({
    color: BIASED_ARRAY[getRandomInt(0, BIASED_ARRAY.length)],
    positionX: getRandomInt(0, 100),
    positionY: getRandomInt(0, 100),
    duration: getRandomInt(Math.floor(ANIMATION_DURATION * 0.75), ANIMATION_DURATION),
    delay: getRandomInt(ANIMATION_DURATION * 0.75, ANIMATION_DURATION),
    blurRadius: (Math.random() + 0.5) * 0.5,
    boxShadow: Math.random() > 0.5 ? -1 : 1,
    transformOriginX: (Math.random() * getNegativeOrPositive()) * (PARTICLE_SIZE * 2),
    transformOriginY: (Math.random() * getNegativeOrPositive()) * (PARTICLE_SIZE * 2),
  })

  return (
    <div className={classes.particle} />
  )
}

const BokehBackground: React.FC<IBokehBackground> = React.memo(
  ({particleCount = PARTICLE_AMOUNT}) => {
    const classes = useStyles()
    const particles: string[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(`span${i}`)
    }

    return (
      <div className={classes.bokehContainer}>
        {particles.map(value => (
          <BokehParticle key={value} />
        ))}
      </div>
    )
  }
)

export {BokehBackground}
