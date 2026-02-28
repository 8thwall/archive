import React from 'react'

import {combine} from '../common/styles'
import {createCustomUseStyles} from '../common/create-custom-use-styles'

type ThemeProps = {
  transitionDuration: number
  translateAmount: string
  transitionType: string
}

const useCustomStyles = createCustomUseStyles<ThemeProps>()({
  fadeIn: {
    transition: ({transitionDuration, transitionType}) => [
      ['opacity', `${transitionDuration}ms`, `${transitionType}`],
      ['transform', `${transitionDuration}ms`, `${transitionType}`],
    ],
    overflow: 'hidden',
    willChange: 'opacity, visibility',
  },
  shown: {
    transform: 'translateY(0)',
    visibility: 'none',
    opacity: '1',
  },
  hidden: {
    transform: ({translateAmount}) => `translateY(${translateAmount})`,
    visibility: 'hidden',
    opacity: '0',
  },
})

interface IFadeIn {
  delay?: number
  transitionDuration?: number
  translateAmount?: string
  transitionType?: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  children: any
  className?: string
  id?: string
}

const FadeIn: React.FunctionComponent<IFadeIn> = ({
  delay = 0,  // Delay time between fading in sibling elements.
  transitionDuration = 600,
  translateAmount = '10vh',
  transitionType = 'ease-in-out',
  className = '',
  id = '',
  children,
}) => {
  const [isVisible, setVisible] = React.useState(false)
  const [childIsVisible, setChildIsVisible] = React.useState(0)
  const domRef = React.useRef<HTMLDivElement>(null)
  const styles = useCustomStyles({
    transitionDuration, translateAmount, transitionType,
  })
  let interval

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      })
    })

    if (domRef.current) {
      observer.observe(domRef.current)
    }

    return () => (domRef.current ? observer.unobserve(domRef.current) : undefined)
  }, [])

  React.useEffect(() => {
    if (isVisible) {
      const count = React.Children.count(children)
      let i = 0
      interval = setInterval(() => {
        i++
        if (i > count) {
          clearInterval(interval)
        }

        setChildIsVisible(i)
      }, delay)
    }
    return () => {
      clearInterval(interval)
    }
  }, [isVisible])

  return (
    <>
      {React.Children.map(children, (child, i) => (
        <div
          ref={i === 0 ? domRef : null}  // Only attach ref to first child.
          className={combine(
            className,
            styles.fadeIn,
            childIsVisible > i ? styles.shown : styles.hidden
          )}
          id={id}
        >
          {child}
        </div>
      ))}
    </>
  )
}

export {FadeIn}
