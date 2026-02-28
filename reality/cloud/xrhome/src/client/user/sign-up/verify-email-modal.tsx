import React from 'react'
import {Modal} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {VerifyEmail} from './verify-email'
import largeBlackEmailSentIcon from './icon-sent-email-large-black.svg'
import withTranslationLoaded from '../../i18n/with-translations-loaded'
import {mobileViewOverride} from '../../static/styles/settings'
import type {VerifyEmailRequest} from '../../../shared/users/users-niantic-types'

// TODO(Brandon): Fix resend form interaction. More context in JIRA Ticket
// https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/browse/EWPT-1574
const useStyles = createUseStyles({
  verifyEmailModal: {
    padding: '3em',
    maxWidth: '35em',
    [mobileViewOverride]: {
      padding: '3em 1.5em',
    },
  },
  verifyEmailContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3em',
    [mobileViewOverride]: {
      gap: '2em',
    },
  },
  headingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    alignItems: 'center',
  },
  heading: {
    margin: 0,
  },
})

interface IVerifyEmailModal {
  email: string
  onVerifyEmailSuccess?: () => void
  onCloseClick?: () => void
  verificationBehavior: VerifyEmailRequest['verificationBehavior']
  disableEditEmail?: boolean
}

const VerifyEmailModal: React.FC<IVerifyEmailModal> = (
  {email, onVerifyEmailSuccess, onCloseClick, verificationBehavior, disableEditEmail}
) => {
  const {t} = useTranslation(['email-verification'])

  const classes = useStyles()
  return (
    <Modal open size='tiny' onClose={onCloseClick} className={classes.verifyEmailModal}>
      <div className={classes.verifyEmailContainer}>
        <div className={classes.headingContainer}>
          <img src={largeBlackEmailSentIcon} alt={t('email_verification.icon.alt_text')} />
          <h1 className={classes.heading}>{t('email_verification.heading')}</h1>
        </div>
        <VerifyEmail
          email={email}
          onVerifyEmailSuccess={onVerifyEmailSuccess}
          verificationBehavior={verificationBehavior}
          disableEditEmail={disableEditEmail}
        />
      </div>
    </Modal>
  )
}

const TranslatedVerifyEmailModal = withTranslationLoaded(VerifyEmailModal)

export {
  TranslatedVerifyEmailModal as VerifyEmailModal,
}
