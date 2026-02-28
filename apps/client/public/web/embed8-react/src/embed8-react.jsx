import React from 'react'
import {device, iconVariants, deviceImg} from '@8thwall/embed8'

const deviceIsCompatible = device.deviceIsCompatible()

let otherCollapse = null

const Embed8Popover = ({fading, shortLink}) => (
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

export default class Embed8 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expand: false,
      fading: false,
      short: '',
    }
    this.popOverRef = React.createRef()
    this.linkRef = React.createRef()
    this.fadeTimeout = null

    this.collapseFast = this.collapseFast.bind(this)
  }

  componentDidMount() {
    if (this.props.expandFirst) {
      this.expand()
    }
  }

  componentWillUnmount() {
    clearTimeout(this.fadeTimeout)
    window.removeEventListener('click', this.clickOutEvent)
    if (otherCollapse === this.collapseFast) {
      otherCollapse = null
    }
  }

  expand = () => {
    if (otherCollapse) {
      otherCollapse()
      otherCollapse = null
    }

    otherCollapse = this.collapseFast

    clearTimeout(this.fadeTimeout)
    window.addEventListener('click', this.clickOutEvent)

    this.setState({
      expand: true,
      fading: false,
    })
  }

  collapse = () => {
    clearTimeout(this.fadeTimeout)
    this.fadeTimeout = setTimeout(() => {
      this.collapseFast()
    }, 300)

    window.removeEventListener('click', this.clickOutEvent)

    this.setState({
      expand: true,
      fading: true,
    })
  }

  collapseFast = () => {
    clearTimeout(this.fadeTimeout)
    window.removeEventListener('click', this.clickOutEvent)
    this.setState({
      expand: false,
      fading: false,
      short: '',
    })
  }

  clickOutEvent = (e) => {
    if (this.linkRef.current && this.linkRef.current.contains(e.target)) {
      return
    }

    this.collapse()
  }

  clickLink = (e) => {
    if (e.target.classList.contains('embed8-address')) {
      return
    }
    e.preventDefault()

    if (this.state.expand) {
      this.collapse()
    } else {
      this.expand()
    }
  }

  clickButton = (e) => {
    if (e.target.classList.contains('embed8-address')) {
      return
    }
    e.preventDefault()

    if (deviceIsCompatible) {
      this.props.shortLinkProvider().then((value) => {
        window.location.href = `https://8th.io/${value}`
      })
    } else {
      this.props.shortLinkProvider().then((value) => {
        this.setState({short: value})
      })

      if (this.state.expand) {
        this.collapse()
      } else {
        this.expand()
      }
    }
  }

  render() {
    const {expand, fading} = this.state
    const {
      shortLink, linkIconAlt, hideIcon, iconColor, iconVertical, style, darkTheme, children,
    } = this.props
    const iconFinalColor = iconColor || (darkTheme ? 'light' : 'purple')
    const iconSrc = iconVariants[iconFinalColor] || iconVariants.purple
    const linkIcon =
      <img className='embed8-link-icon' src={iconSrc} alt={linkIconAlt || 'AR Experience'} />

    const contents = (
      <>{!hideIcon && iconVertical && linkIcon}{' '}
        {children}{' '}{!hideIcon && !iconVertical && linkIcon}
        {expand && <Embed8Popover
          fading={fading}
          shortLink={shortLink || this.state.short}
        />}
      </>
    )
    if (shortLink) {
      return (
        <a
          className='embed8-link'
          onClick={deviceIsCompatible ? undefined : this.clickLink}
          href={`https://8th.io/${shortLink}`}
          style={style}
          data-dark-theme={darkTheme}
          data-icon-vertical={iconVertical}
          ref={this.linkRef}
        >
          {contents}
        </a>
      )
    }
    return (
      <button
        className='embed8-link embed8-button'
        type='button'
        style={style}
        onClick={this.clickButton}
        data-dark-theme={darkTheme}
        data-icon-vertical={iconVertical}
        ref={this.linkRef}
      >
        {contents}
      </button>
    )
  }
}
