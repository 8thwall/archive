import React from 'react'
import {useLocation} from 'react-router-dom'

import {combine} from '../common/styles'

interface IFluidCardContent {
  scrollOnHash?: string
  className?: string
  children?: React.ReactNode
}

const FluidCardContent: React.FC<IFluidCardContent> = ({scrollOnHash, className, children}) => {
  const ref = React.useRef<HTMLDivElement>()

  const location = useLocation()

  React.useEffect(() => {
    const el = ref.current
    if (el && scrollOnHash && location.hash.slice(1) === scrollOnHash) {
      el.scrollIntoView({behavior: 'smooth'})
      el.classList.add('attention-grabber')
      el.querySelector('input')?.focus()
    }
  }, [])

  return (
    <div className={combine('ui segment', className)} ref={ref}>
      {children}
    </div>
  )
}

const FluidCardContainer: React.FC<React.PropsWithChildren> = ({children}) => (
  <div className='fluid-card-container'>{children}</div>
)

export {
  FluidCardContent,
  FluidCardContainer,
}
