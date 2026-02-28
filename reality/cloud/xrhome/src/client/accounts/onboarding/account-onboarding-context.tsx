import React, {useReducer, DependencyList, useLayoutEffect, useEffect} from 'react'
import {type Dispatch, createContext, type Reducer} from 'react'
import type {DeepReadonly} from 'ts-essentials'
import {useHistory} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {UAParser} from 'ua-parser-js'

import {AccountOnboardingReducer} from './account-onboarding-reducer'
import {
  OnboardingStep,
  type AccountOnboardingAction,
  type AccountOnboardingContextState,
  SET_CURRENT_STEP,
  REGISTER_NAVIGATION,
  UNREGISTER_NAVIGATION,
  UPDATE_NAVIGATION,
  NavigationState,
  RESET_ACCOUNT,
  SET_ERROR,
  CLEAR_ERROR,
} from './account-onboarding-types'
import type {IAccount} from '../../common/types/models'
import {useSelector} from '../../hooks'
import {getPathForMyProjectsPage} from '../../common/paths'
import type {UserAccountRole} from '../../common/types/db'
import {useUserAccountRole} from '../../hooks/use-user-account-role'
import {isOnboardingRequired} from '../../../shared/account-utils'
import useActions from '../../common/use-actions'
import crmActions from '../../crm/crm-actions'
import {useCurrentUser} from '../../user/use-current-user'
import accountActions from '../account-actions'
import type {AccountWithApps} from '../../common/types/models'

const generateFormSteps = (
  account: DeepReadonly<AccountWithApps>,
  role: UserAccountRole
): OnboardingStep[] => {
  const requiresOwner = isOnboardingRequired(account)
  const parser = new UAParser(navigator.userAgent)
  const parserName = parser.getOS().name

  // eslint-disable-next-line local-rules/hardcoded-copy
  const showDownloadStep = parserName === 'Mac OS' || parserName === 'Windows'

  if (requiresOwner && role !== 'OWNER') {
    return [OnboardingStep.InsufficientPermissions]
  }

  if (!requiresOwner && account.Apps.length < 1) {
    return [OnboardingStep.CreateFirstApp]
  }

  if (showDownloadStep) {
    return [
      OnboardingStep.CreateWorkspace,
      OnboardingStep.InstallDesktopApp,
      OnboardingStep.CreateFirstApp,
    ]
  } else {
    return [
      OnboardingStep.CreateWorkspace,
      OnboardingStep.CreateFirstApp,
    ]
  }
}

const generateInitialState = (
  account: DeepReadonly<AccountWithApps>,
  role: UserAccountRole
): AccountOnboardingContextState => ({
  accountUuid: account.uuid,
  formState: {
    steps: generateFormSteps(account, role),
    currentStepIndex: 0,
  },
  navigation: {
    onNextClick: undefined,
    nextButtonDisabled: false,
    nextButtonLoading: false,
    onBackClick: undefined,
    backButtonDisabled: false,
    progressBarHidden: true,
  },
  error: '',
})

type AccountOnboardingContextValue = [
  DeepReadonly<AccountOnboardingContextState>,
  Dispatch<AccountOnboardingAction>
]
const AccountOnboardingContext = createContext<AccountOnboardingContextValue | null>(null)

const AccountOnboardingStateProvider = ({
  children,
  account,
}: {children: React.ReactNode, account: AccountWithApps}) => {
  const role = useUserAccountRole(account)
  const reduxDispatch = useDispatch()
  const {setActivatingAccount} = useActions(accountActions)
  const contextValue = useReducer<Reducer<AccountOnboardingContextState, AccountOnboardingAction>>(
    AccountOnboardingReducer,
    generateInitialState(account, role)
  )
  // Reset the initial state when the account uuid changes. This occurs when a user creates a new
  // workspace via the insufficient permissions step.
  useEffect(() => {
    const [state, contextDispatch] = contextValue
    if (state.accountUuid !== account.uuid) {
      contextDispatch(
        {type: RESET_ACCOUNT, initialState: generateInitialState(account, role)}
      )
    }
  }, [account.uuid, role])

  useEffect(() => {
    // Enforce that the current activating account stays around until the onboarding is done.
    if (account.uuid) {
      reduxDispatch({type: 'ACCOUNTS_SELECT', uuid: account.uuid})
      setActivatingAccount(account.uuid)
    }
  }, [account.uuid])

  return (
    <AccountOnboardingContext.Provider value={contextValue}>
      {children}
    </AccountOnboardingContext.Provider>
  )
}

const useOnboardingContext = (): AccountOnboardingContextValue => {
  const ctx = React.useContext(AccountOnboardingContext)
  if (!ctx) {
    throw new Error('Accessing AccountOnboardingContext outside of provider')
  }
  return ctx
}

const useCurrentFormStep = (): OnboardingStep => {
  const [state] = useOnboardingContext()
  return state.formState.steps[state.formState.currentStepIndex]
}

/**
 * Registers navigation state for the current form step.
 * The dependencies array is used to re-register the state when the dependencies change.
 * For example, if the onNextClick function depends on a value that changes, you can pass that
 * value.
 *
 * e.g.
 *   const MyFormStep = () => {
 *     const [num, setNum] = useState(0)
 *     const onNextClick = async () => {
 *       console.log(num)
 *     }
 *
 *     useRegisterFormNavigation({onNextClick}, [num])
 *   }
 */
const useRegisterFormNavigation = (
  navigation: Partial<NavigationState>,
  deps: DependencyList = []
) => {
  const userCrmId = useCurrentUser(user => user.loggedInUser?.crmId)
  const hasCrmId = !!userCrmId
  const {updateCurrentUserCrm} = useActions(crmActions)
  const [state, dispatch] = useOnboardingContext()
  const history = useHistory()
  const account = useSelector(
    reduxState => reduxState.accounts.allAccounts.find(a => a.uuid === state.accountUuid)
  )
  const role = useUserAccountRole(account)
  const {clearActivatingAccount} = useActions(accountActions)

  const registerNavigation = () => {
    const handleNextClick = async () => {
      dispatch({type: CLEAR_ERROR})
      try {
        if (navigation.onNextClick) {
          dispatch({
            type: UPDATE_NAVIGATION,
            navigation: {
              nextButtonLoading: true,
              nextButtonDisabled: true,
              backButtonDisabled: true,
            },
          })
          await navigation.onNextClick()
        }
        if (state.formState.currentStepIndex < state.formState.steps.length - 1) {
          // There are more steps. Continue to the next one
          dispatch({type: SET_CURRENT_STEP, stepIndex: state.formState.currentStepIndex + 1})
        } else {
          // This is the final step. Finish the onboarding process.
          if (hasCrmId) {
            const hubspotStage = role === 'OWNER' ? 'COMPLETE' : 'INVITED_COMPLETE'
            await updateCurrentUserCrm(null, null, null, hubspotStage, account.uuid)
          }

          clearActivatingAccount()
          history.push(getPathForMyProjectsPage())
        }
      } catch (err) {
        dispatch({type: SET_ERROR, error: err.message})
      } finally {
        dispatch({
          type: UPDATE_NAVIGATION,
          navigation: {
            nextButtonLoading: false,
            nextButtonDisabled: false,
            backButtonDisabled: false,
            progressBarHidden: false,
          },
        })
      }
    }

    const handleBackClick = () => {
      dispatch({type: CLEAR_ERROR})
      navigation.onBackClick?.()
      dispatch({type: SET_CURRENT_STEP, stepIndex: state.formState.currentStepIndex - 1})
    }

    dispatch({
      type: REGISTER_NAVIGATION,
      navigation: {
        ...navigation,
        onNextClick: navigation.onNextClick ? handleNextClick : undefined,
        onBackClick: navigation.onBackClick ? handleBackClick : undefined,
      },
    })
  }

  useLayoutEffect(() => {
    registerNavigation()
    return () => {
      dispatch({type: UNREGISTER_NAVIGATION})
    }
  }, deps)
}

const useFormNavigation = () => {
  const [state] = useOnboardingContext()

  return {
    ...state.navigation,
    isFirstStep: state.formState.currentStepIndex === 0,
    isFinalStep: state.formState.currentStepIndex === state.formState.steps.length - 1,
    progress: (state.formState.currentStepIndex + 1) / state.formState.steps.length,
  }
}

const useOnboardingAccount = (): DeepReadonly<IAccount> => {
  const [state] = useOnboardingContext()
  const account = useSelector(
    reduxState => reduxState.accounts.allAccounts.find(a => a.uuid === state.accountUuid)
  )
  return account
}

const useGetOnboardingError = (): string => {
  const [state] = useOnboardingContext()
  return state.error
}

export {
  AccountOnboardingContext,
  useCurrentFormStep,
  useOnboardingAccount,
  useFormNavigation,
  useRegisterFormNavigation,
  useGetOnboardingError,
  AccountOnboardingStateProvider,
}
