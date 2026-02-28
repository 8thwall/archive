import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {PrimaryButton} from '../../ui/components/primary-button'
import {LinkButton} from '../../ui/components/link-button'
import {gray1, gray4} from '../../static/styles/settings'
import {UserErrorMessage} from '../../home/user-error-message'
import {ACTIONS} from '../../user-niantic/user-niantic-errors'

const useStyles = createUseStyles({
  modalContainer: {
    display: 'flex',
    gap: '1.5em',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    margin: 0,
    maxWidth: '18.5em',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    textAlign: 'center',
    alignItems: 'center',
  },
  description: {
    margin: 0,
    fontSize: '1.125em',
  },
  warning: {
    borderTop: `1px solid ${gray1}`,
    paddingTop: '1em',
    color: gray4,
    lineHeight: '1.5em',
    textAlign: 'center',
  },
  buttonTray: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    alignItems: 'center',
  },
})

interface IMigrateExistingUsersEmailView {
  onConfirmConnectEmail: () => Promise<boolean>
  onConnectEmailSuccess: () => void
  onClickBack: () => void
}

const MigrateExistingUsersEmailView: React.FC<IMigrateExistingUsersEmailView> = ({
  onConfirmConnectEmail, onConnectEmailSuccess, onClickBack,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['migrate-existing-users', 'common'])

  const onSubmitEmail = async () => {
    const connected = await onConfirmConnectEmail()
    if (connected) {
      onConnectEmailSuccess()
    } else {
      // TODO(johnny): Show error message
    }
  }

  return (
    <div className={classes.modalContainer}>
      <div className={classes.textContainer}>
        <UserErrorMessage action={ACTIONS.MIGRATE} />
        <h2 className={classes.heading}>{
          t('migrate_existing_users_connect_email_view.heading')}
        </h2>
        <p className={classes.description}>
          {t('migrate_existing_users_connect_email_view.description')}
        </p>
      </div>
      <div className={classes.warning}>
        {t('migrate_existing_users_connect_email_view.warning_niantic')}
      </div>
      <div className={classes.buttonTray}>
        <PrimaryButton spacing='wide' onClick={onSubmitEmail}>
          {t('button.confirm', {ns: 'common'})}
        </PrimaryButton>
        <LinkButton onClick={onClickBack}>
          {t('button.back', {ns: 'common'})}
        </LinkButton>
      </div>
    </div>
  )
}

export {MigrateExistingUsersEmailView}
