import React, {useEffect} from 'react'
import {createUseStyles} from 'react-jss'

import {OnboardingStep, FORM_STEP_TO_E8_NAME} from './account-onboarding-types'
import {
  useCurrentFormStep,
  useOnboardingAccount,
  useGetOnboardingError,
} from './account-onboarding-context'
import {cherryLight, fontSize, mobileViewOverride} from '../../static/styles/settings'
import e8 from '../../common/e8'
import {useUserAccountRole} from '../../hooks/use-user-account-role'
import {getHubspotStage} from './hubspot/onboarding-stage-to-hubspot'
import useActions from '../../common/use-actions'
import crmActions from '../../crm/crm-actions'
import {useCurrentUser} from '../../user/use-current-user'
import {
  AccountOnboardingInsufficientPermissions,
} from './steps/account-onboarding-insufficient-permissions'
import {AccountOnboardingCreateWorkspace} from './steps/account-onboarding-create-workspace'
import {AccountOnboardingFirstApp} from './steps/account-onboarding-first-app'
import {AccountOnboardingDesktopApp} from './steps/account-onboarding-desktop-app'

const useStyles = createUseStyles({
  form: {
    zIndex: 4,
    width: '100%',
    fontSize: `${fontSize}`,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [mobileViewOverride]: {
      paddingBottom: '1em',
      margin: '2em 0',
    },
  },
  errorContainer: {
    height: '5em',
    [mobileViewOverride]: {
      height: '2.5em',
    },
    width: '100%',
  },
  error: {
    color: cherryLight,
    textAlign: 'center',
  },
})

const AccountOnboardingForm = () => {
  const account = useOnboardingAccount()
  const role = useUserAccountRole(account)
  const userCrmId = useCurrentUser(user => user.loggedInUser?.crmId)
  const hasCrmId = !!userCrmId
  const classes = useStyles()
  const currentStep = useCurrentFormStep()
  const onboardingErrorMessage = useGetOnboardingError()
  const {updateCurrentUserCrm} = useActions(crmActions)

  const renderCurrentFormStep = () => {
    switch (currentStep) {
      case OnboardingStep.CreateWorkspace:
        return <AccountOnboardingCreateWorkspace />
      case OnboardingStep.CreateFirstApp:
        return <AccountOnboardingFirstApp />
      case OnboardingStep.InsufficientPermissions:
        return <AccountOnboardingInsufficientPermissions />
      case OnboardingStep.InstallDesktopApp:
        return <AccountOnboardingDesktopApp />
      default:
        throw new Error(`Unknown step: ${currentStep}`)
    }
  }

  useEffect(() => {
    e8.sendEvent(FORM_STEP_TO_E8_NAME[currentStep])
  }, [currentStep])

  useEffect(() => {
    const hubspotStage = getHubspotStage(currentStep, role)

    if (hubspotStage && hasCrmId) {
      updateCurrentUserCrm(null, null, null, hubspotStage, account.uuid)
    }
  }, [currentStep, hasCrmId])

  return (
    <div className={classes.form}>
      {renderCurrentFormStep()}
      {onboardingErrorMessage &&
        <div className={classes.errorContainer}>
          <p className={classes.error}>{onboardingErrorMessage}</p>
        </div>
      }
    </div>
  )
}

export {
  AccountOnboardingForm,
}
