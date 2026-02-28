import React from 'react'
import {createUseStyles} from 'react-jss'

import type {ShareLink} from './hmd-link-types'
import {COVER_IMAGE_PREVIEW_SIZES} from '../../shared/app-constants'
import {deriveAppCoverImageUrl, getDisplayNameForApp} from '../../shared/app-utils'
import {
  bodySanSerif,
  brandWhite,
  cardBorderRadius, cardImageRatio, cardShadowBlur, cardShadowColor, cardShadowSpread, gray2, gray3,
} from '../static/styles/settings'
import {combine} from '../common/styles'
import LinkOut from '../uiWidgets/link-out'

const BOX_SHADOW = `0 4px ${cardShadowBlur} ${cardShadowSpread} ${cardShadowColor}`

const useStyles = createUseStyles({
  hmdLinkCard: {
    'gap': '0.5rem',
    'display': 'grid',
    'gridTemplate': '"a b" auto "c c" auto "d e" auto / 1fr 1fr',
    'minWidth': '0',
    '&:hover $card': {
      top: '-4px',
    },
    '&:hover': {
      transform: 'scale(1.01)',
      transition: 'transform 0.15s ease-in-out',
      cursor: 'pointer',
    },
  },
  imgContainer: {
    'position': 'relative',
    'gridArea': 'c',
    'borderRadius': cardBorderRadius,

    // When the image hasn't been load, the bottom left corner is the color-picked color
    // on our brand light background
    'background': 'linear-gradient(45deg, #212122, transparent)',

    // This makes sure the card has the same aspect ratio as our image
    'height': '0',
    'paddingTop': cardImageRatio,

    'transition': '0.15s top',
    'top': '0',
    'boxShadow': BOX_SHADOW,
  },
  bottomText: {
    color: gray3,
    fontFamily: bodySanSerif,
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 'normal',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  rightAlignText: {
    textAlign: 'right',
  },
  title: {
    gridArea: 'a',
    color: brandWhite,
    fontFamily: bodySanSerif,
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: '20px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  workspace: {
    gridArea: 'b',
    color: gray2,
    fontFamily: bodySanSerif,
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '20px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  coverImage: {
    display: 'block',
    position: 'absolute',
    top: '0',
    width: '100%',
    borderRadius: cardBorderRadius,
  },
  shortname: {
    gridArea: 'd',
  },
  client: {
    gridArea: 'e',
  },
})

const HmdLinkCard: React.FC<ShareLink> = (props) => {
  const classes = useStyles()

  const {link, app, account, clientName} = props

  return (
    <div className={classes.hmdLinkCard}>
      <div className={classes.title}>
        {app.appTitle}
      </div>
      <div className={combine(classes.workspace, classes.rightAlignText)}>
        {account.name}
      </div>
      <div className={classes.imgContainer}>
        <LinkOut url={link}>
          <img
            className={classes.coverImage}
            draggable={false}
            src={deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[600])}
            alt={getDisplayNameForApp(app)}
          />
        </LinkOut>
      </div>
      <div className={combine(classes.shortname, classes.bottomText)}>
        {app.appName}
      </div>
      <div className={combine(classes.client, classes.rightAlignText, classes.bottomText)}>
        {clientName}
      </div>
    </div>
  )
}

export {HmdLinkCard}
