import React from 'react'
import {Animate} from 'react-move'

import {FadeInContext} from './fade-in'

interface IAnimatedProgressProvider {
  valueStart: number,
  valueEnd: number,
  duration: number,
  easingFunction: any,
}

const AnimatedProgressProvider: React.FunctionComponent<IAnimatedProgressProvider> = ({
  valueStart = 0,
  valueEnd,
  duration,
  easingFunction,
  children,
}) => {
  const [isAnimated, setIsAnimated] = React.useState(false)
  const triggerAnimation = React.useContext(FadeInContext)

  React.useEffect(() => {
    if (triggerAnimation) {
      setIsAnimated(true)
    }
  }, [triggerAnimation])

  return (
    <Animate
      start={() => ({value: valueStart})}
      update={() => ({
        value: [isAnimated ? valueEnd : valueStart],
        timing: {
          duration,
          ease: easingFunction,
        },
      })}
    >
      {({value}) => children(value)}
    </Animate>
  )
}

export default AnimatedProgressProvider
