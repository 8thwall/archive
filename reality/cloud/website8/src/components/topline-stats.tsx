import React from 'react'
import {easeQuadInOut} from 'd3-ease'
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import AnimatedProgressProvider from './animated-progress-provider'
import {combine} from '../styles/classname-utils'
import {brandHighlight, brandPop} from '../styles/brand-colors'

const useStyles = createUseStyles({
  heading: {
    whiteSpace: 'pre-line',
    margin: '1rem',
  },
  footer: {
    whiteSpace: 'pre-line',
    maxWidth: '250px',
  },
  svg: {
    height: 100,
  },
  radialChart: {
    maxWidth: '11rem',
  },
})

export interface IStat {
  title?: string,
  footer?: JSX.Element,
  valueStart: number,
  valueEnd: string,
  counterClockwise?: boolean,
  isTextStatic?: boolean,
  staticPrefix?: string,
  staticSuffix?: string,
  numDecimalPlaces?: number,
  isStatTime?: boolean,
  trailColor?: string,
  roundUp?: boolean,
}

interface ITopLineStat {
  className?: string,
  stat: IStat,
  index: number,
  animationDuration?: number,
  animationDelay?: number,
  textColor?: string,
}

const uidGen = (prefix: string) => (
  `${prefix}-${Date.now().toString(36)}__${Math.random().toString(36).substr(2)}`
)

const ToplineStat: React.FunctionComponent<ITopLineStat> = ({
  className = '',
  stat,
  index,
  animationDelay = 500,
  animationDuration = 2000,
  textColor = 'white',
}) => {
  const {
    title = '',
    valueStart,
    valueEnd,
    counterClockwise = false,
    isTextStatic = false,
    staticPrefix = '',
    staticSuffix = '',
    numDecimalPlaces = 0,
    isStatTime = false,
    footer = '',
    trailColor = '#d6d6d6',
    roundUp = false,
  } = stat
  const {t} = useTranslation(['case-study-pages'])
  const classes = useStyles()
  const uid = uidGen('svg')

  return (
    <div className={className}>
      <AnimatedProgressProvider
        valueStart={valueStart}
        valueEnd={isTextStatic ? 1 : t(valueEnd)}
        duration={animationDuration + (animationDelay * index)}
        easingFunction={easeQuadInOut}
      >
        {(value) => {
          const roundedValue = roundUp ? Math.ceil(value) : Math.round(value * (10 ** numDecimalPlaces)) / (10 ** numDecimalPlaces)
          let textValue
          // TODO:(kyle) refactor how time animates when minutes change e.g. 0:59 -> 1:00
          if (isStatTime && roundedValue < 10) {
            textValue = `0${roundedValue}`
          } else {
            textValue = roundedValue
          }
          const gradientTransform = `rotate(${roundedValue})`
          return (
            <>
              <svg style={{height: 0}}>
                <defs>
                  <linearGradient id={uid} r='5' gradientTransform={gradientTransform}>
                    <stop offset='0%' stopColor={brandPop} />
                    <stop offset='100%' stopColor={brandHighlight} />
                  </linearGradient>
                </defs>
              </svg>
              <CircularProgressbar
                className={classes.radialChart}
                value={value}
                minValue={valueStart}
                maxValue={isTextStatic ? 1 : t(valueEnd)}
                counterClockwise={counterClockwise}
                text={isTextStatic
                  ? `${staticPrefix}${t(valueEnd)}${t(staticSuffix)}`
                  : `${staticPrefix}${textValue}${t(staticSuffix)}`
                }
                strokeWidth={12}
                styles={buildStyles({
                  pathTransition: 'none',
                  pathColor: `url(#${uid})`,
                  textColor: `${textColor}`,
                  textSize: '1rem',
                  trailColor: `${trailColor}`,
                })}
              />
            </>
          )
        }}
      </AnimatedProgressProvider>
      <h3 className={combine('font8-black', classes.heading)}>{t(title)}</h3>
      <p className={combine('text8-lg text-white noto-sans-jp mb-0', classes.footer)}>
        {footer}
      </p>
    </div>
  )
}

export default ToplineStat
