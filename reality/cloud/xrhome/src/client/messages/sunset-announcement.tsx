import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {brandPurple, purpleish} from '../static/styles/settings'
import {IconButton} from '../ui/components/icon-button'
import LinkOut from '../uiWidgets/link-out'

const useStyles = createUseStyles({
  banner: {
    backgroundColor: purpleish,
    borderBottom: `2px solid ${brandPurple}`,
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    color: brandPurple,
  },
  content: {
    flex: 1,
    textAlign: 'center',
  },
  link: {
    textDecoration: 'underline',
    fontWeight: 600,
  },
})

const ANNOUNCEMENT_DISMISSED = 'sunset-announcement-dismissed'

const SunsetAnnouncement: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['common'])
  const [isVisible, setIsVisible] = React.useState(() => {
    // NOTE(kyle): This is necessary because sessionStorage is not available during SSR.
    if (typeof window === 'undefined') {
      return true
    }
    return sessionStorage.getItem(ANNOUNCEMENT_DISMISSED) !== 'true'
  })

  if (!isVisible) {
    return null
  }

  return (
    <div className={classes.banner}>
      <div className={classes.content}>
        <Trans
          ns='common'
          i18nKey='sunset.message_with_link'
          components={{
            1: <LinkOut className={classes.link} url='https://8th.io/update' />,
          }}
        />
      </div>
      <IconButton
        text={t('sunset.dismiss')}
        stroke='cancelLarge'
        onClick={() => {
          sessionStorage.setItem(ANNOUNCEMENT_DISMISSED, 'true')
          setIsVisible(false)
        }}
      />
    </div>
  )
}

export {
  SunsetAnnouncement,
}
