import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {LinkButton} from '../../ui/components/link-button'
import {getPathForProfilePage} from '../../common/paths'
import {brandPurple, brandPurpleDark, brandWhite} from '../../static/styles/settings'
import highFive from '../../static/highfive.svg'

const useStyles = createUseStyles({
  modalContainer: {
    display: 'flex',
    gap: '1.5em',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    maxWidth: '18.5em',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  description: {
    marginBottom: 0,
    fontSize: '1.125em',
  },
  buttonTray: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    alignItems: 'center',
  },
  profileBtn: {
    'background': brandPurple,
    'color': brandWhite,
    'borderRadius': '0.5em',
    'padding': '1em 2em',
    '&:hover': {
      color: brandWhite,
      background: brandPurpleDark,
    },
  },
})

interface IMigrateExistingUsersCompleteView {
  onClose: () => void
}

const MigrateExistingUsersCompleteView: React.FC<IMigrateExistingUsersCompleteView> = ({
  onClose,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['migrate-existing-users', 'common'])

  return (
    <div className={classes.modalContainer}>
      <img
        alt={t('migrate_existing_users_complete_view.alt')}
        src={highFive}
      />
      <div className={classes.textContainer}>
        <h2 className={classes.heading}>{t('migrate_existing_users_complete_view.heading')}</h2>
        <p className={classes.description}>{t('migrate_existing_users_complete_view.thanks')}</p>
        <p className={classes.description}>
          {t('migrate_existing_users_complete_view.view_update')}
        </p>
      </div>
      <div className={classes.buttonTray}>
        <a
          className={classes.profileBtn}
          href={getPathForProfilePage()}
        >{t('migrate_existing_users_complete_view.button.go_to_profile')}
        </a>
        <LinkButton onClick={onClose}>
          {t('button.close', {ns: 'common'})}
        </LinkButton>
      </div>
    </div>
  )
}

export {MigrateExistingUsersCompleteView}
