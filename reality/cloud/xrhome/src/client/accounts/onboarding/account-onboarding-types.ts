import type {DeepReadonly} from 'ts-essentials'

enum OnboardingStep {
  Welcome,
  Industry,
  UserRole,
  ClaimUrl,
  InsufficientPermissions,
  InstallDesktopApp,
  CreateWorkspace,
  CreateFirstApp,
}

type OnboardingFormState = {
  currentStepIndex: number
  steps: OnboardingStep[]
}

type NavigationState = {
  onNextClick?: () => Promise<void>
  nextButtonDisabled: boolean
  nextButtonLoading: boolean

  onBackClick?: () => void
  backButtonDisabled: boolean

  progressBarHidden: boolean
}

const SET_CURRENT_STEP = 'ONBOARDING/SET_CURRENT_STEP' as const
const REGISTER_NAVIGATION = 'ONBOARDING/REGISTER_NAVIGATION' as const
const UNREGISTER_NAVIGATION = 'ONBOARDING/UNREGISTER_NAVIGATION' as const
const UPDATE_NAVIGATION = 'ONBOARDING/UPDATE_NAVIGATION' as const
const RESET_ACCOUNT = 'ONBOARDING/RESET_ACCOUNT' as const
const SET_ERROR = 'ONBOARDING/SET_ERROR' as const
const CLEAR_ERROR = 'ONBOARDING/CLEAR_ERROR' as const

// TODO(alvinp): Add action for setting state for each step.
type AccountOnboardingActionType = typeof SET_CURRENT_STEP
  | typeof REGISTER_NAVIGATION
  | typeof UNREGISTER_NAVIGATION
  | typeof UPDATE_NAVIGATION
  | typeof RESET_ACCOUNT
  | typeof SET_ERROR
  | typeof CLEAR_ERROR

interface SetCurrentStepAction {
  type: typeof SET_CURRENT_STEP
  stepIndex: number
}

interface RegisterNavigationAction {
  type: typeof REGISTER_NAVIGATION
  navigation: Partial<NavigationState>
}

interface UnregisterNavigationAction {
  type: typeof UNREGISTER_NAVIGATION
}

interface UpdateNavigationAction {
  type: typeof UPDATE_NAVIGATION
  navigation: Partial<Pick<NavigationState,
    'nextButtonDisabled' | 'nextButtonLoading' | 'backButtonDisabled' | 'progressBarHidden'
  >>
}

interface ResetAccountAction {
  type: typeof RESET_ACCOUNT
  initialState: AccountOnboardingContextState
}

interface SetErrorAction {
  type: typeof SET_ERROR
  error: string
}

interface ClearErrorAction {
  type: typeof CLEAR_ERROR
}

type AccountOnboardingAction = SetCurrentStepAction | RegisterNavigationAction |
  UnregisterNavigationAction | UpdateNavigationAction | ResetAccountAction | SetErrorAction |
  ClearErrorAction

type AccountOnboardingContextState = DeepReadonly<{
  accountUuid: string
  formState: OnboardingFormState
  navigation: NavigationState
  error: string
}>

type AccountOnboardingReducerFunction = (
  state: AccountOnboardingContextState,
  action: AccountOnboardingAction
) => AccountOnboardingContextState

type CompleteOnboardingRequestBody = {
  uuid: string
  status?: 'ENABLED'
  publicFeatured?: boolean
  shortName?: string
}

const FORM_STEP_TO_A8_CATEGORY: Record<OnboardingStep, string> = {
  [OnboardingStep.Welcome]: 'profile',
  [OnboardingStep.Industry]: 'industry',
  [OnboardingStep.UserRole]: 'user-role',
  [OnboardingStep.ClaimUrl]: 'claim-url',
  [OnboardingStep.InsufficientPermissions]: 'non-owner',
  [OnboardingStep.CreateWorkspace]: 'create-workspace',
  [OnboardingStep.InstallDesktopApp]: 'install-desktop-app',
  [OnboardingStep.CreateFirstApp]: 'create-first-app',
}

/* eslint-disable local-rules/hardcoded-copy */
const FORM_STEP_TO_E8_NAME: Record<OnboardingStep, string> = {
  [OnboardingStep.Welcome]: 'Onboarding - Profile Step Visit',
  [OnboardingStep.Industry]: 'Onboarding - Industry Step Visit',
  [OnboardingStep.UserRole]: 'Onboarding - User Role Step Visit',
  [OnboardingStep.ClaimUrl]: 'Onboarding - Claim URL Step Visit',
  [OnboardingStep.InsufficientPermissions]: 'Onboarding - Non-Owner Step Visit',
  [OnboardingStep.CreateWorkspace]: 'Onboarding - Workspace Step Visit',
  [OnboardingStep.InstallDesktopApp]: 'Onboarding - Install App Step Visit',
  [OnboardingStep.CreateFirstApp]: 'Onboarding - Create First App Step Visit',
}
/* eslint-enable local-rules/hardcoded-copy */

export {
  OnboardingStep,
  SET_CURRENT_STEP,
  REGISTER_NAVIGATION,
  UNREGISTER_NAVIGATION,
  UPDATE_NAVIGATION,
  RESET_ACCOUNT,
  SET_ERROR,
  CLEAR_ERROR,
  FORM_STEP_TO_E8_NAME,
  FORM_STEP_TO_A8_CATEGORY,
}

export type {
  OnboardingFormState,
  AccountOnboardingAction,
  AccountOnboardingActionType,
  AccountOnboardingContextState,
  AccountOnboardingReducerFunction,
  SetCurrentStepAction,
  RegisterNavigationAction,
  UnregisterNavigationAction,
  UpdateNavigationAction,
  ResetAccountAction,
  SetErrorAction,
  ClearErrorAction,
  NavigationState,
  CompleteOnboardingRequestBody,
}
