import React from 'react'
import {css} from '@emotion/react'

const FadeInContext = React.createContext(true)

interface IFadeIn {
  delay?: number
  transitionDuration?: number
  translateAmount?: string
  transitionType?: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  children: any
  className?: string
  style?: any
  id?: string
}

const FadeIn: React.FunctionComponent<IFadeIn> = ({
  delay = 0, // Delay time between fading in sibling elements.
  transitionDuration = 600,
  translateAmount = '10vh',
  transitionType = 'ease-in-out',
  className = '',
  style = null,
  id = '',
  children,
}) => {
  const [isVisible, setVisible] = React.useState(false)
  const [childIsVisible, setChildIsVisible] = React.useState(0)
  const domRef = React.useRef<HTMLDivElement>(null!)
  const contextValue = React.useMemo(() => isVisible, [isVisible])
  let interval

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      })
    })
    observer.observe(domRef.current)
    return () => {
      if (typeof domRef.current === 'Element') {
        observer.unobserve(domRef.current)
      }
    }
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
    <FadeInContext.Provider value={contextValue}>
      {React.Children.map(children, (child, i) => (
        <div
          ref={i === 0 ? domRef : null} // Only attach ref to first child.
          className={className}
          id={id}
          style={style}
          css={css`
          transition: opacity ${transitionDuration}ms ${transitionType}, transform ${transitionDuration}ms ${transitionType};
          transform: translateY(${childIsVisible > i ? 0 : translateAmount});
          visibility: ${childIsVisible > i ? 'none' : 'hidden'};
          overflow: hidden;
          opacity: ${childIsVisible > i ? 1 : 0};
          will-change: opacity, visibility;
        `}
        >
          {child}
        </div>
      ))}
    </FadeInContext.Provider>
  )
}

export {
  FadeIn,
  FadeInContext,
}
