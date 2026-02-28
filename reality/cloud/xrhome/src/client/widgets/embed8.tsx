import React, {FC, useEffect, useCallback, useRef, useState} from 'react'
import {createUseStyles} from 'react-jss'

import icons from '../apps/icons'
import {combine} from '../common/styles'

const iconColorSrc = {
  purple: icons.projectTryOutPurple,
  gray: icons.projectTryOut,
  light: icons.projectTryOutWhite,
  dark: icons.projectTryOutPurple,
}

const isBrowser = typeof window !== 'undefined'
const {device, deviceImg} = isBrowser
  // eslint-disable-next-line
  ? require('@8thwall/embed8')
  : {
    device: null,
    deviceImg: null,
  }

const deviceIsCompatible = isBrowser && device.deviceIsCompatible()

let otherCollapse = null

const useStyles = createUseStyles({
  iconNative: {
    'margin': '0 0.3em 0 -0.3em',
    'transform': 'scale(0.7)',
  },
})

interface IEmbed8Popover {
  fading: boolean
  shortLink: string
}

const Embed8Popover: FC<IEmbed8Popover> = ({fading, shortLink}) => (
  <div className={`embed8-pop-over ${fading ? 'embed8-fade' : ''}`}>
    {shortLink &&
      <>
        <div className='embed8-pop-over-left'>
          <p>
            Visit URL<br />
            <b><span className='embed8-address'>{`8th.io/${shortLink}`}</span></b><br />
            on a phone or tablet
          </p>
          <img src={deviceImg} alt='a mobile device' />
        </div>

        <div className='embed8-divider'>or</div>

        <div className='embed8-pop-over-right'>
          <ol>
            <li>Open Camera</li>
            <li>Scan Code</li>
          </ol>
          <img
            className='embed8-qr'
            src={`https://8th.io/qr/${shortLink}?v=2&margin=2`}
            alt='QR Code for device scanning to visit the AR experience'
          />
        </div>
      </>}
  </div>
)

interface IEmbed8 {
  expandFirst?: boolean
  shortLinkProvider?(): any
  shortLink?: string
  linkIconAlt?: string
  hideIcon?: boolean
  iconColor?: string
  iconVertical?: any
  style?: any
  darkTheme?: boolean
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderPopover?: (props: IEmbed8Popover) => any
  a8?: string
  children?: React.ReactNode
  className?: string
}

const Embed8: FC<IEmbed8> = ({
  expandFirst = false, shortLinkProvider, shortLink, linkIconAlt, hideIcon, iconColor, iconVertical,
  style, darkTheme, children, renderPopover, a8, className,
}) => {
  const [isExpanded, setExpand] = useState(expandFirst)
  const [isFading, setFading] = useState(false)
  const [short, setShort] = useState('')

  const anchorRef = useRef<HTMLAnchorElement>()
  const buttonRef = useRef<HTMLButtonElement>()
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const classes = useStyles()

  const collapseFast = useCallback(() => {
    clearTimeout(timeoutRef.current)
    setExpand(false)
    setFading(false)
    setShort('')
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

  const clickOutEvent = (e: MouseEvent) => {
    if (
      (e.target instanceof Node && anchorRef.current?.contains(e.target)) ||
      (e.target instanceof Node && buttonRef.current?.contains(e.target))
    ) {
      return
    }
    collapse()
  }

  const clickButton = async (e: React.MouseEvent) => {
    if (e.target instanceof Element && e.target.classList.contains('embed8-address')) {
      return
    }
    e.preventDefault()

    if (deviceIsCompatible) {
      const value = await shortLinkProvider()
      window.location.href = `https://8th.io/${value}`
    } else {
      if (isExpanded) {
        collapse()
      } else {
        expands()
      }
      const value = await shortLinkProvider()
      setShort(value)
    }
  }

  const clickLink = (e: React.MouseEvent) => {
    if (e.target instanceof Element && e.target.classList.contains('embed8-address')) {
      return
    }
    e.preventDefault()

    if (isExpanded) {
      collapse()
    } else {
      expands()
    }
  }

  useEffect(() => {
    if (!isBrowser) {
      return null
    }
    window.addEventListener('mousedown', clickOutEvent)
    if (expandFirst) {
      expands()
    }
    return () => {
      clearTimeout(timeoutRef.current)
      window.removeEventListener('mousedown', clickOutEvent)
      if (otherCollapse === collapseFast) {
        otherCollapse = null
      }
    }
  }, [])

  const defaultIconSrc = darkTheme ? iconColorSrc.purple : iconColorSrc.light
  const linkIcon = (
    <img
      className={combine(classes.iconNative, 'embed8-link-icon')}
      src={iconColor ? iconColorSrc[iconColor] : defaultIconSrc}
      alt={linkIconAlt || 'AR Experience'}
    />
  )
  const visibleShortLink = shortLink || short
  const popOver = renderPopover
    ? renderPopover({fading: isFading, shortLink: visibleShortLink})
    : (
      <Embed8Popover
        fading={isFading}
        shortLink={shortLink || short}
      />
    )
  const contents = (
    <>{!hideIcon && iconVertical && linkIcon}{' '}
      {children}{' '}{!hideIcon && !iconVertical && linkIcon}
      {isExpanded && popOver}
    </>
  )
  if (shortLink) {
    return (
      <a
        className={combine('embed8-link', className)}
        onClick={deviceIsCompatible ? undefined : clickLink}
        href={`https://8th.io/${shortLink}`}
        style={style}
        data-dark-theme={darkTheme || undefined}
        data-icon-vertical={iconVertical || undefined}
        ref={anchorRef}
        a8={a8}
      >
        {contents}
      </a>
    )
  }
  return (
    <button
      className={combine('embed8-link embed8-button', className)}
      type='button'
      style={style}
      onClick={clickButton}
      data-dark-theme={darkTheme}
      data-icon-vertical={iconVertical}
      a8={a8}
      ref={buttonRef}
    >
      {contents}
    </button>
  )
}

export default Embed8
