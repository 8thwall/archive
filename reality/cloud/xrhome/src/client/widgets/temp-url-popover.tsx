import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {combine} from '../common/styles'
import {brandPurple, gray4} from '../static/styles/settings'
import {BasicQrCode} from './basic-qr-code'
import {Loader} from '../ui/components/loader'
import {Icon} from '../ui/components/icon'

const useStyles = createUseStyles({
  'popover': {
    'position': 'absolute',
    'display': 'flex',
    'left': '50%',
    'top': '100%',
    'transform': 'translate(calc(-50%), 0.5em)',
    'borderRadius': '0.5em',
    'zIndex': '88888',
    'filter': 'drop-shadow(0 2px 5px #0004)',
    'cursor': 'initial',
    'backgroundColor': 'white',
    'padding': '0.75em 0.75em 0.5em',
    'minWidth': '9rem',
    'minHeight': '10.5rem',
    'userSelect': 'none',
    'flexDirection': 'column',
    'justifyContent': 'space-between',
    'lineHeight': '1',
    '&:before': {
      // Caret
      position: 'absolute',
      content: '\'\'',
      left: '50%',
      bottom: '100%',
      zIndex: '-1',
      width: '1.5em',
      height: '1.5em',
      transform: 'scaleY(0.6) translateX(-50%)',
      border: '0.75em solid transparent',
      borderBottomColor: 'white',
      boxSizing: 'border-box',
      pointerEvents: 'none',
      transformOrigin: '100% 100%',
    },
  },
  'fading': {
    pointerEvents: 'none',
    transition: '0.2s opacity',
    opacity: 0,
  },
  'qrImg': {
    width: '100%',
    backgroundColor: 'white',
  },
  '@keyframes spinCenter': {
    '0%': {transform: 'translate(-50%, -50%) rotate(0deg)'},
    '100%': {transform: 'translate(-50%, -50%) rotate(360deg)'},
  },
  'openTabLink': {
    color: brandPurple,
    fontWeight: 'bold',
  },
  'openTabIcon': {
    position: 'relative',
    top: '-0.125em',
    width: '1em',
    height: '1em',
    verticalAlign: 'middle',
  },
  'launchMessageText': {
    color: gray4,
    fontSize: '0.75em',
  },
})

interface ITempUrlPopover {
  shortLink: string
  fading?: boolean
}

const TempUrlPopover: React.FC<ITempUrlPopover> = ({shortLink, fading}) => {
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation()
  }

  return (
    <span className={combine(classes.popover, fading && classes.fading)}>
      {shortLink
        ? (
          <>
            <BasicQrCode
              className={classes.qrImg}
              code={shortLink}
              margin={1}
              alt={`QR Code to 8th.io/${shortLink}`}
            />
            <a
              href={`https://8th.io/${shortLink}`}
              onClick={handleLinkClick}
              target='_blank'
              className={classes.openTabLink}
              rel='noreferrer'
            >
              or open tab <Icon stroke='external' />

            </a>
            <div>
              <hr />
              <span className={classes.launchMessageText}>
                {t('featured_app_page.launch.launch_qr_warning')}
              </span>
            </div>
          </>
        )
        : <Loader inline />}
    </span>
  )
}

export default TempUrlPopover
