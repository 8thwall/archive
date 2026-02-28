import type {UserAccountRole} from '../../../common/types/db'
import {OnboardingStep} from '../account-onboarding-types'

const getInvitedHubSpotStage = (step: OnboardingStep): string | null => {
  if (step !== OnboardingStep.UserRole) {
    return null
  }

  return 'INVITED_NONE'
}

const getOwnerHubSpotStage = (step: OnboardingStep): string | null => {
  switch (step) {
    case OnboardingStep.Industry:
      return 'NONE'
    case OnboardingStep.UserRole:
      return 'INDUSTRY'
    case OnboardingStep.Welcome:
      return 'JOB_FUNCTION'
    case OnboardingStep.ClaimUrl:
      return 'PROFILE'
    case OnboardingStep.CreateWorkspace:
      return 'CREATE_WORKSPACE'
    case OnboardingStep.InstallDesktopApp:
      return 'INSTALL_DESKTOP_APP'
    default:
      return null
  }
}

const getHubspotStage = (step: OnboardingStep, role: UserAccountRole): string | null => {
  if (step === OnboardingStep.InsufficientPermissions) {
    return null
  }

  return role === 'OWNER' ? getOwnerHubSpotStage(step) : getInvitedHubSpotStage(step)
}

export {
  getHubspotStage,
}
