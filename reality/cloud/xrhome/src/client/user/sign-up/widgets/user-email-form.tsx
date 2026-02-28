import React, {useState} from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import Recaptcha, {useRecaptcha} from '../../recaptcha'
import {useRegisterFormInputs} from '../register-form/use-register-form-inputs'
import SpaceBelow from '../../../ui/layout/space-below'
import {PrimaryButton} from '../../../ui/components/primary-button'
import {NianticIdRegisterForm} from '../register-form/niantic-id-register-form'
import useActions from '../../../common/use-actions'
import userNianticActions from '../../../user-niantic/user-niantic-actions'
import {COGNITO_AUTH_PROVIDER_ID} from '../../../../shared/users/users-niantic-constants'
import {UserErrorMessage} from '../../../home/user-error-message'
import {ACTIONS} from '../../../user-niantic/user-niantic-errors'
import {useUserPending} from '../../use-current-user'
import {ToSAndNewsletterCheckbox} from '../tos-and-newsletter-checkbox'
import {TOS_CURRENT_VERSION} from '../../../../shared/tos'
import userActions from '../../user-actions'
import {useSetupNewsletterContact} from '../use-setup-newsletter-contact'

const useStyles = createUseStyles({
  container: {
    width: '100%',
  },
  continueSignupCta: {
    '& button[type=submit]': {
      width: '100%',
    },
  },
})

const UserEmailForm: React.FC = () => {
  const {t} = useTranslation(['sign-up-pages', 'common'])
  const classes = useStyles()
  const [rcVal, rcOnPass] = useRecaptcha()
  const {signup} = useActions(userNianticActions)
  const {agreeToS} = useActions(userActions)
  const {setupNewsletterContact} = useSetupNewsletterContact()
  // TODO(Brandon): Create State for users that already have an account.
  const signupPending = useUserPending('signup')
  const [newsLetterChecked, setNewsletterChecked] = useState(false)
  const [tosChecked, setToSChecked] = useState(false)
  const {
    firstNameInput, lastNameInput, emailInput, passwordInput, passwordRetypeInput,
  } = useRegisterFormInputs()

  const disableContinueButton = !rcVal || signupPending || !tosChecked

  const onSubmit = async (e) => {
    e.preventDefault()

    const allInputs = [
      firstNameInput, lastNameInput, emailInput, passwordInput, passwordRetypeInput,
    ]

    if (!allInputs.every(i => i.isValid)) {
      allInputs.forEach(i => i.forceValidate())
      return
    }

    if (!tosChecked) {
      return
    }

    await signup({
      authProviderId: COGNITO_AUTH_PROVIDER_ID,
      email: emailInput.value,
      givenName: firstNameInput.value,
      familyName: lastNameInput.value,
      password: passwordInput.value,
    })

    // TODO(Brandon): Merge agreeToS action into signup action
    await agreeToS(TOS_CURRENT_VERSION)

    if (newsLetterChecked) {
      await setupNewsletterContact({
        email: emailInput.value,
        given_name: firstNameInput.value,
        family_name: lastNameInput.value,
      })
    }
  }

  return (
    <div className={classes.container}>
      <SpaceBelow>
        <UserErrorMessage action={ACTIONS.SIGNUP} />
      </SpaceBelow>
      <form onSubmit={onSubmit}>
        <NianticIdRegisterForm
          firstNameInput={firstNameInput}
          lastNameInput={lastNameInput}
          emailInput={emailInput}
          passwordInput={passwordInput}
          passwordRetypeInput={passwordRetypeInput}
        />
        <SpaceBelow>
          <ToSAndNewsletterCheckbox
            tosCheck={tosChecked}
            setToSCheck={() => setToSChecked(!tosChecked)}
            newsletterCheck={newsLetterChecked}
            setNewsletterCheck={() => setNewsletterChecked(!newsLetterChecked)}
          />
        </SpaceBelow>
        <SpaceBelow>
          <Recaptcha onPass={rcOnPass} />
        </SpaceBelow>
        <div className={classes.continueSignupCta}>
          <PrimaryButton
            disabled={disableContinueButton}
            type='submit'
            loading={signupPending}
            spacing='wide'
            a8='click;sign-up-funnel;step-1-start-click-cta'
          >
            {t('button.continue', {ns: 'common'})}
          </PrimaryButton>
          {/* TODO(Brandon): Render a redirect for users that already have an account. */}
        </div>
      </form>
    </div>
  )
}

export {UserEmailForm}
