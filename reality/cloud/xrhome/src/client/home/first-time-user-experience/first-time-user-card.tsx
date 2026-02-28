import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {
  brandBlack, brandHighlight, brandWhite, gray3, gray5, tinyViewOverride,
} from '../../static/styles/settings'
import {combine} from '../../common/styles'

const useStyles = createUseStyles({
  cardContainer: {
    'display': 'flex',
    'alignItems': 'stretch',
    'gap': '1rem',
    'background': brandBlack,
    'border': `1px solid ${gray5}`,
    'padding': '1.25rem',
    'borderRadius': '0.5rem',
    'color': brandWhite,
    'transition': 'all 0.3s',
    'cursor': 'pointer',
    '&:hover': {
      background: gray5,
      border: `1px solid ${brandHighlight}`,
    },
    '&:hover $startButton': {
      opacity: 1,
    },
    '&:hover $textContainer': {
      marginTop: '0',
    },
    '&:hover $hoverVideo': {
      opacity: 1,
    },
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  appImageContainer: {
    position: 'relative',
    aspectRatio: '9/6',
    width: '12em',
    [tinyViewOverride]: {
      width: '14em',
    },
  },
  appImage: {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
    position: 'absolute',
  },
  hoverVideo: {
    transition: 'all 0.3s',
    opacity: 0,
  },
  fixedTextContainer: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    [tinyViewOverride]: {
      alignItems: 'flex-start',
    },
  },
  textContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '0.5rem',
    marginTop: '1.5rem',
    transition: 'all 0.3s',
    [tinyViewOverride]: {
      userSelect: 'none',
      marginTop: '0',
      position: 'static',
      height: '100%',
    },
  },
  innerTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  title: {
    fontWeight: 700,
    fontSize: '1.25rem',
    [tinyViewOverride]: {
      fontSize: '1em',
    },
  },
  description: {
    color: gray3,
    lineHeight: '1.5em',
  },
  startButton: {
    opacity: 0,
    transition: 'opacity 0.3s',
    border: `1px solid ${brandWhite}`,
    padding: '0.5rem 1.5rem',
    borderRadius: '0.5rem',
    [tinyViewOverride]: {
      opacity: 1,
    },
  },
})

interface IFirstTimeUserCard {
  app: any
  onClick: () => void
}

const FirstTimeUserCard: React.FC<IFirstTimeUserCard> = ({
  app, onClick,
}) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()

  return (
    <button
      type='button'
      className={combine('style-reset', classes.cardContainer)}
      onClick={onClick}
    >
      <div className={classes.appImageContainer}>
        <img
          className={classes.appImage}
          src={app.image}
          alt={app.appTitle || app.appName}
        />
        <video
          className={combine(classes.appImage, classes.hoverVideo)}
          autoPlay
          loop
          muted
          playsInline
          draggable={false}
          src={app.video}
        />
      </div>
      <div className={classes.fixedTextContainer}>
        <div className={classes.textContainer}>
          <div className={classes.innerTextContainer}>
            <div className={classes.title}>{t(app.title)}</div>
            <div className={classes.description}>{t(app.description)}</div>
          </div>
          <div className={classes.startButton}>
            {t('account_dashboard_page.first_time_user_modal.button.start_here')}
          </div>
        </div>
      </div>
    </button>
  )
}

export {
  FirstTimeUserCard,
}
