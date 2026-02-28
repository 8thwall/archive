import * as React from 'react'
import {Modal, Dimmer} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'
import {useDispatch} from 'react-redux'

import {LinkButton} from '../ui/components/link-button'
import {gray4} from '../static/styles/settings'
import {Loader} from '../ui/components/loader'
import {TertiaryButton} from '../ui/components/tertiary-button'
import Icons from '../apps/icons'
import type {LoginProvider} from '../../shared/users/users-niantic-types'
import {useCurrentUser} from './use-current-user'
import {useSelector} from '../hooks'
import useActions from '../common/use-actions'
import userNianticActions from '../user-niantic/user-niantic-actions'
import {StaticBanner} from '../ui/components/banner'
import {acknowledgeError} from '../user-niantic/user-niantic-action-types'
import {ACTIONS} from '../user-niantic/user-niantic-errors'

const useStyles = createUseStyles({
  modal: {
    overflow: 'hidden',
  },
  modalContainer: {
    padding: '3em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '1.5em',
  },
  warningIcon: {
    height: '3em',
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1em',
  },
  modalHeading: {
    margin: 0,
    padding: 0,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: '1.5em',
  },
  graphic: {
    maxWidth: '10em',
  },
  email: {
    'color': gray4,
    'fontSize': '1.125em',
    'border': 'none',
    'textAlign': 'center',
    'marginBottom': '1.5em',
    'outline': 'none',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    textAlign: 'left',
    lineHeight: '1.75em',
    marginTop: '1em',
    marginBottom: '2.5em',
  },
  buttonTray: {
    display: 'flex',
    gap: '1em',
    justifyContent: 'center',
  },
})

interface IDisconnectEmailModal {
  providerToDisconnect: LoginProvider
  handleClose: () => void
}

const DisconnectEmailModal: React.FC<IDisconnectEmailModal> = ({
  providerToDisconnect, handleClose,
}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const {t} = useTranslation(['user-profile-page', 'common'])
  const loading = useSelector(state => state.userNiantic.pending.disconnectLogin)
  const errorKey = useSelector(state => state.userNiantic.error?.['disconnect-login'])

  const closable = !loading
  const {logins} = useCurrentUser().loggedInUser
  const loginAccount = logins?.find(login => login.provider === providerToDisconnect)
  const {disconnectLogin} = useActions(userNianticActions)

  const submitForm = async () => {
    dispatch(acknowledgeError(ACTIONS.DISCONNECT_LOGIN))
    const success = await disconnectLogin(providerToDisconnect)
    if (success) {
      handleClose()
    }
  }

  const onClose = () => {
    dispatch(acknowledgeError(ACTIONS.DISCONNECT_LOGIN))
    handleClose()
  }

  return (
    <Modal
      open={!!providerToDisconnect}
      onClose={closable ? onClose : undefined}
      closeOnDimmerClick={closable}
      size='tiny'
      className={classes.modal}
    >
      <div className={classes.modalContainer}>
        <img
          alt={t('disconnect_email_modal.alt.icon')}
          src={Icons.warningBlack}
          className={classes.warningIcon}
        />
        <div className={classes.modalHeader}>
          <h2 className={classes.modalHeading}>
            {t(`disconnect_email_modal.heading_${providerToDisconnect}`,
              {email: loginAccount?.email})}
          </h2>
          <div className={classes.description}>
            {t('disconnect_email_modal.description')}
          </div>
        </div>
        <div className={classes.buttonTray}>
          <LinkButton
            onClick={onClose}
          >
            {t('button.cancel', {ns: 'common'})}
          </LinkButton>
          <TertiaryButton
            onClick={submitForm}
          >
            {t('connected_account_settings.button.disconnect')}
          </TertiaryButton>
        </div>
        {errorKey && <StaticBanner type='danger'>{t(errorKey)}</StaticBanner>}
      </div>
      <Dimmer active={loading} inverted>
        <Loader />
      </Dimmer>
    </Modal>
  )
}

export {DisconnectEmailModal}
