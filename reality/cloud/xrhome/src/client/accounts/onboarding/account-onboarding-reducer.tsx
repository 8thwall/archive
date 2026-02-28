import {
  type AccountOnboardingActionType,
  type AccountOnboardingReducerFunction,
  SET_CURRENT_STEP,
  AccountOnboardingContextState,
  SetCurrentStepAction,
  RegisterNavigationAction,
  REGISTER_NAVIGATION,
  UNREGISTER_NAVIGATION,
  UPDATE_NAVIGATION,
  UpdateNavigationAction,
  ResetAccountAction,
  RESET_ACCOUNT,
  SET_ERROR,
  CLEAR_ERROR,
  SetErrorAction,
} from './account-onboarding-types'

const setCurrentStep = (
  state: AccountOnboardingContextState,
  action: SetCurrentStepAction
): AccountOnboardingContextState => ({
  ...state,
  formState: {
    ...state.formState,
    currentStepIndex: action.stepIndex,
  },
})

const registerNavigation = (
  state: AccountOnboardingContextState,
  action: RegisterNavigationAction
): AccountOnboardingContextState => ({
  ...state,
  navigation: {
    ...state.navigation,
    onNextClick: action.navigation.onNextClick,
    nextButtonDisabled: action.navigation.nextButtonDisabled,
    nextButtonLoading: action.navigation.nextButtonLoading,
    onBackClick: action.navigation.onBackClick,
    backButtonDisabled: action.navigation.backButtonDisabled,
    progressBarHidden: action.navigation.progressBarHidden,
  },
})

const unregisterNavigation = (
  state: AccountOnboardingContextState
): AccountOnboardingContextState => ({
  ...state,
  navigation: {
    onNextClick: undefined,
    nextButtonDisabled: false,
    nextButtonLoading: false,
    onBackClick: undefined,
    backButtonDisabled: false,
    progressBarHidden: false,
  },
})

const updateNavigation = (
  state: AccountOnboardingContextState,
  action: UpdateNavigationAction
): AccountOnboardingContextState => ({
  ...state,
  navigation: {
    ...state.navigation,
    ...action.navigation,
  },
})

const resetAccount = (
  state: AccountOnboardingContextState,
  action: ResetAccountAction
): AccountOnboardingContextState => ({
  ...action.initialState,
})

const setError = (
  state: AccountOnboardingContextState,
  action: SetErrorAction
): AccountOnboardingContextState => ({
  ...state,
  error: action.error,
})

const clearError = (
  state: AccountOnboardingContextState
): AccountOnboardingContextState => ({
  ...state,
  error: '',
})

const actions: Record<AccountOnboardingActionType, AccountOnboardingReducerFunction> = {
  [SET_CURRENT_STEP]: setCurrentStep as AccountOnboardingReducerFunction,
  [REGISTER_NAVIGATION]: registerNavigation as AccountOnboardingReducerFunction,
  [UNREGISTER_NAVIGATION]: unregisterNavigation,
  [UPDATE_NAVIGATION]: updateNavigation as AccountOnboardingReducerFunction,
  [RESET_ACCOUNT]: resetAccount as AccountOnboardingReducerFunction,
  [SET_ERROR]: setError as AccountOnboardingReducerFunction,
  [CLEAR_ERROR]: clearError as AccountOnboardingReducerFunction,
}

const AccountOnboardingReducer: AccountOnboardingReducerFunction = (state, action) => {
  const handler = actions[action.type]
  if (!handler) {
    throw new Error(`Unexpected action type: ${action.type}`)
  }
  return handler(state, action)
}

export {
  AccountOnboardingReducer,
}
