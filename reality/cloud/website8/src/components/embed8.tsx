import React, {FC, useEffect, useCallback, useRef, useState} from 'react'

import Button8 from './button8'
import Embed8Popover from './embed8-popover'
import {combine} from '../styles/classname-utils'
import tryInArIcon from '../../img/try-in-ar-icon.svg'

const isBrowser = typeof window !== 'undefined'

const deviceIsCompatible = isBrowser && (
  navigator.userAgent.match(/Android/i) ||
  navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
  navigator.userAgent.match(/Pacific/) || // Oculus Go
  navigator.userAgent.match(/Quest/) // Oculus Quest
)

let otherCollapse: any = null

const get8thIoLink = (appSlug: string) => `https://8th.io/${appSlug}`

interface IEmbed8 {
  className?: string
  appSlug: string
  hideIcon?: boolean
  a8?: string
}

const Embed8: FC<IEmbed8> = ({className = '', appSlug, hideIcon = false, children, a8 = ''}) => {
  const [isExpanded, setExpand] = useState(false)
  const [isFading, setFading] = useState(false)
  const linkRef = useRef<any>()
  const timeoutRef = useRef<any>()

  const collapseFast = useCallback(() => {
    clearTimeout(timeoutRef.current)
    setExpand(false)
    setFading(false)
  }, [])

  const expands = () => {
    if (otherCollapse) {
      otherCollapse()
      otherCollapse = null
    }

    otherCollapse = collapseFast

    clearTimeout(timeoutRef.current)
    setExpand(true)
    setFading(false)
  }

  const collapse = () => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      collapseFast()
    }, 300)
    setFading(true)
  }

  const clickOutEvent = (e) => {
    if (linkRef?.current?.contains(e.target)) {
      return
    }
    collapse()
  }

  const clickButton = (e) => {
    e.preventDefault()

    if (deviceIsCompatible) {
      window.open(get8thIoLink(appSlug), '_blank', 'noopener,noreferrer')
    } else if (isExpanded) {
      collapse()
    } else {
      expands()
    }
  }

  useEffect(() => {
    if (!isBrowser) {
      return undefined
    }

    window.addEventListener('mousedown', clickOutEvent)
    return () => {
      clearTimeout(timeoutRef.current)
      window.removeEventListener('mousedown', clickOutEvent)
      if (otherCollapse === collapseFast) {
        otherCollapse = null
      }
    }
  }, [])


  return (
    <Button8
      className={combine('position-relative', className)}
      type='button'
      onClick={clickButton}
      ref={linkRef}
      a8={a8}
    >
      {!hideIcon && <img className='mr-2' src={tryInArIcon} alt='Try in AR' />}
      {children}
      {isExpanded && <Embed8Popover fading={isFading} appSlug={appSlug} />}
    </Button8>
  )
}

export default Embed8
