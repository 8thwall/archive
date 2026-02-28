import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'
import {Redirect, useLocation} from 'react-router-dom'

import ErrorMessage from '../../home/error-message'
import SpaceBelow from '../../ui/layout/space-below'
import {PrimaryButton} from '../../ui/components/primary-button'
import {RegisterForm} from '../sign-up/widgets/register-form'
import {useRegisterFormInputs} from '../sign-up/register-form/use-register-form-inputs'
import {TOS_CURRENT_VERSION, TermsVersion} from '../../../shared/tos'
import Recaptcha, {useRecaptcha} from '../recaptcha'
import {getPathForLoginPage} from '../../common/paths'
import type {Invitation} from '../../team/types'
import {useUserHasSession, useUserPending} from '../use-current-user'
import userNianticActions from '../../user-niantic/user-niantic-actions'
import useActions from '../../common/use-actions'
import {COGNITO_AUTH_PROVIDER_ID} from '../../../shared/users/users-niantic-constants'
import type {SignUpUserNianticRequest} from '../../../shared/users/users-niantic-types'

const useStyles = createUseStyles({
  form: {
    width: '100%',
  },
  joinWorkspaceBtn: {
    '& button[type=submit]': {
      width: '100%',
    },
  },
  loginRedirect: {
    textAlign: 'center',
  },
})

interface IJoinPageForm {
  invitation: Invitation
  agreeToS: (version: TermsVersion) => void
  wasInvited: (invitation: Invitation) => void
}

const JoinPageForm: React.FC<IJoinPageForm> = ({invitation, agreeToS, wasInvited}) => {
  const {t} = useTranslation(['sign-up-pages'])
  const classes = useStyles()
  const location = useLocation()
  const isLoggedIn = useUserHasSession()
  const [rcVal, rcOnPass] = useRecaptcha()
  const {
    firstNameInput, lastNameInput, passwordInput, passwordRetypeInput, emailInput,
  } = useRegisterFormInputs()
  const {signupInvitedUser} = useActions(userNianticActions)
  const signupPending = useUserPending('signup')
  const [tos, setTos] = React.useState(false)
  const [newsletter, setNewsletter] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  const formDisabled = (!rcVal || !tos || signupPending || submitting)

  const inviteCode = new URLSearchParams(location.search).get('invite')

  if (isLoggedIn && !submitted && !submitting) {
    return <Redirect to={`${getPathForLoginPage()}?invite=${inviteCode}`} />
  }

  const onSubmit = async (e) => {
    setSubmitting(true)
    e.preventDefault()

    const allInputs = [
      firstNameInput, lastNameInput, passwordInput, passwordRetypeInput, emailInput,
    ]

    if (!allInputs.every(i => i.isValid)) {
      allInputs.forEach(i => i.forceValidate())
      return
    }

    const userInfo: SignUpUserNianticRequest = {
      authProviderId: COGNITO_AUTH_PROVIDER_ID,
      givenName: firstNameInput.value,
      familyName: lastNameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    }
    try {
      await signupInvitedUser(userInfo, async () => {
        if (tos) {
          await agreeToS(TOS_CURRENT_VERSION)
        }

        await wasInvited(invitation)
      })

      setSubmitted(true)
    } catch {
      // Note(Brandon): let error fall through since error handling is done by the actions.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <ErrorMessage />
      <form onSubmit={onSubmit} className={classes.form}>
        <RegisterForm
          firstNameInput={firstNameInput}
          lastNameInput={lastNameInput}
          emailInput={emailInput}
          passwordInput={passwordInput}
          passwordRetypeInput={passwordRetypeInput}
          showTOSandNewsletter
          showPasswordRequirements={false}
          newsletterCheck={newsletter}
          setNewsletterCheck={() => setNewsletter(!newsletter)}
          tosCheck={tos}
          setToSCheck={() => setTos(!tos)}
        />
        <SpaceBelow>
          <Recaptcha onPass={rcOnPass} />
        </SpaceBelow>
        <div className={classes.joinWorkspaceBtn}>
          <PrimaryButton
            onClick={onSubmit}
            disabled={formDisabled}
            type='submit'
            loading={signupPending}
            spacing='normal'
            a8='click;sign-up-funnel;step-1-invited-team-start-cta'
          >{t('join_page.button.join_workspace')}
          </PrimaryButton>
        </div>
      </form>
    </>

  )
}

export {
  JoinPageForm,
}
