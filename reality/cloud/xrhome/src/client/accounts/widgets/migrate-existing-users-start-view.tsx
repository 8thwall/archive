import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import nianticIdGraphic from '../../static/niantic_id_migrate.png'
import {PrimaryButton} from '../../ui/components/primary-button'
import {usePreloadAppleScript} from '../../identity/apple/use-load-apple-api-script'

const useStyles = createUseStyles({
  modalContainer: {
    display: 'flex',
    gap: '1.5em',
    flexDirection: 'column',
    alignItems: 'center',
  },
  graphic: {
    width: '100%',
  },
  heading: {
    margin: 0,
    textAlign: 'center',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
  },
  description: {
    margin: 0,
    fontSize: '1.125em',
  },
  bullets: {
    fontSize: '1.125em',
    paddingInlineStart: '1em',
    lineHeight: '1.5em',
    margin: 0,
    width: '100%',
  },
  buttonTray: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    alignItems: 'center',
  },
})

interface IMigrateExistingUsersStartView {
  onNextStep: () => void
}

const MigrateExistingUsersStartView: React.FC<IMigrateExistingUsersStartView> = ({
  onNextStep,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['migrate-existing-users', 'common'])
  // NOTE(johnny): This is needed for Apple auth to work on app pages.
  usePreloadAppleScript()

  return (
    <div className={classes.modalContainer}>
      <img
        className={classes.graphic}
        src={nianticIdGraphic}
        alt={t('migrate_existing_users_start_view.alt.graphic')}
      />
      <div className={classes.textContainer}>
        <h2 className={classes.heading}>{t('migrate_existing_users_start_view.heading')}</h2>
        <p className={classes.description}>{t('migrate_existing_users_start_view.description')}</p>
        <ul className={classes.bullets}>
          <li>{t('migrate_existing_users_start_view.bullet.unified_identity')}</li>
          <li>{t('migrate_existing_users_start_view.bullet.ease_of_use')}</li>
          <li>{t('migrate_existing_users_start_view.bullet.quick_update')}</li>
        </ul>
      </div>
      <div className={classes.buttonTray}>
        <PrimaryButton spacing='wide' onClick={onNextStep}>
          {t('migrate_existing_users_start_view.button.continue')}
        </PrimaryButton>
        <a href='https://8th.io/NianticIDInfo'>
          {t('button.learn_more', {ns: 'common'})}
        </a>
      </div>
    </div>
  )
}

export {
  MigrateExistingUsersStartView,
}
