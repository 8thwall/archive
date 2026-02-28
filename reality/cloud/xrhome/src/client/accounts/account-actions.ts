import {batch} from 'react-redux'
import localForage from 'localforage'

import {dispatchify, onError} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import type {IAccount, IUserAccount} from '../common/types/models'
import {hasUserSession} from '../user/has-user-session'
import type {CompleteOnboardingRequestBody} from './onboarding/account-onboarding-types'

export type AccountStatus = 'UNKNOWN' | 'ENABLED' | 'DISABLED' | 'DELETED' | 'ACTIVATING'

const getAccounts = () => async (dispatch, getState) => {
  // Wrapper that will fail silently if localForage.getItem throws.
  const getMostRecentlyUsed = (): Promise<{user: string, workspace: string}> => localForage
    .getItem<{user: string, workspace: string}>('mru-workspace')
    .catch(() => undefined)
  try {
    const [mostRecentlyUsed, {accounts, versions}] = await Promise.all([
      getMostRecentlyUsed(),
      dispatch(authenticatedFetch('/v1/accounts')),
    ])
    if (accounts.length) {
      dispatch({type: 'ACCOUNTS_SET_ALL', accounts})

      // Set the default expanded workspace in the sidebar.
      if (mostRecentlyUsed?.user === getState().user.uuid) {
        dispatch({type: 'SIDEBAR/EXPAND_ACCOUNT', accountUuid: mostRecentlyUsed.workspace})
      } else {
        const firstAccount = accounts.reduce((best, account) => (
          account.name.localeCompare(best?.name) < 0 ? account : best
        ), accounts[0] as IAccount)
        dispatch({type: 'SIDEBAR/EXPAND_ACCOUNT', accountUuid: firstAccount.uuid})
      }
    }
    dispatch({type: 'VERSIONS', versions})
    return accounts
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
  return null
}

const loadAppsForAccount = uuid => (dispatch) => {
  dispatch({type: 'APPS_LOADING', loading: true})
  dispatch({type: 'APPS_CLEAR'})
  dispatch({type: 'ACCOUNTS_SELECT', uuid})
  dispatch({type: 'ACKNOWLEDGE_ERROR'})
}

const validateAccountName = (defaultName: string, accounts: readonly IAccount[]): string => {
  const existingAccounts = accounts
    .filter(a => a.name.includes(defaultName)).length
  if (existingAccounts) {
    return `${defaultName} ${existingAccounts + 1}`
  }
  return defaultName
}

const lightshipCreateWorkspace = (name: string): AsyncThunk<IAccount> => async (
  dispatch,
  getState
) => {
  if (!name) {
    throw new Error('name not set')
  }
  const newAccount = {name: validateAccountName(name, getState().accounts.allAccounts)}

  try {
    const {account, role} = await dispatch(
      authenticatedFetch<{account: IAccount, role: IUserAccount}>(
        '/v1/lightship/workspace/', {method: 'POST', body: JSON.stringify(newAccount)}
      )
    )

    const createdAccount = {Apps: [], Users: [role], ...account}
    dispatch({type: 'ACCOUNTS_SET_ONE', account: createdAccount})
    return account
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
    throw err
  }
}

const addAccount = ({accountType}) => (dispatch, getState) => {
  if (!accountType) {
    throw new Error('AccountType not set')
  }

  /* eslint-disable local-rules/hardcoded-copy */
  const name = {
    WebCamera: 'AR Camera',
    WebDeveloper: 'Basic',
    UnityDeveloper: 'XR Developer',
  }[accountType] || 'New Workspace'
  /* eslint-enable local-rules/hardcoded-copy */

  const newAccount = {
    accountType,
    name: validateAccountName(name, getState().accounts.allAccounts),
  }

  return dispatch(authenticatedFetch(
    '/v1/accounts/', {method: 'POST', body: JSON.stringify(newAccount)}
  ))
    .then(({account, role}) => {
      account.Users = [role]
      dispatch({type: 'ACCOUNTS_SET_ONE', account: {Apps: [], ...account}})
      return account
    })
    .catch(err => dispatch({type: 'ERROR', msg: err.message}))
}

const checkIfAccountNameExists = (account, accounts) => {
  if (account.name) {
    account.name = account.name.trim()
  }

  // NOTE(pawel)
  // given: user A and user B are members of the same workspace
  // given: user A is a member of workspace named `foo` and user B is not
  // the following allows user B to set the shared workspace name to `foo`
  // user A is now a member of two workspaces named `foo`
  // why it matters: this code seems to want to prevent this from being the case
  // proposed fix: ¯\_(ツ)_/¯
  return account.name &&
    accounts.find(({uuid, name}) => name === account.name && uuid !== account.uuid)
}

const updateAccount = account => (dispatch, getState) => {
  // Do not use this for updating attribute "publicFeatured"
  // Use updateAccountPublicFeatured() below instead
  if ('publicFeatured' in account) {
    return dispatch({type: 'ERROR', msg: 'Invalid parameter: "publicFeatured".'})
  }

  if (checkIfAccountNameExists(account, getState().accounts.allAccounts)) {
    return dispatch({type: 'ERROR', msg: `Workspace named "${account.name}" already exists.`})
  }

  return dispatch(
    authenticatedFetch('/v1/accounts/', {method: 'PUT', body: JSON.stringify(account)})
  )
    .then((account) => {
      dispatch({type: 'ACKNOWLEDGE_ERROR'})
      dispatch({type: 'ACCOUNTS_SET_ONE', account})
      return account
    })
    .catch(err => dispatch({type: 'ERROR', msg: err.message}))
}

const isAccountShortnameAvailable = (
  accountUuid: string, shortname: string, signal?: AbortSignal, getSuggestion?: boolean
) => async (dispatch): Promise<{available: boolean, suggestion?: string}> => {
  try {
    const response = await dispatch(
      authenticatedFetch('/v1/accounts/shortname-check', {
        method: 'POST',
        body: JSON.stringify({accountUuid, shortname, getSuggestion}),
        signal,
      })
    )

    return {available: response.available as boolean, suggestion: response.suggestion as string}
  } catch (e) {
    if (e.name !== 'AbortError') {
      // eslint-disable-next-line no-console
      console.error(e)
      throw e
    }
    return {available: false}
  }
}

const completeOnboarding = (
  body: CompleteOnboardingRequestBody
): AsyncThunk<IAccount> => async (dispatch) => {
  try {
    const response = await dispatch(
      authenticatedFetch('/v1/accounts', {method: 'PUT', body: JSON.stringify(body)})
    )
    dispatch({type: 'UPDATE_ACCOUNT', account: response})
    return response as IAccount
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return null
  }
}

const updateAccountPublicFeatured = ({uuid, publicFeatured}) => async (dispatch) => {
  if (!uuid || typeof publicFeatured !== 'boolean') {
    return dispatch({
      type: 'ERROR',
      msg: 'Invalid parameters. Must provide an account "uuid" and boolean "publicFeatured".',
    })
  }

  try {
    const account = await dispatch(
      authenticatedFetch(`/v1/accounts/${uuid}/updatePublicFeatured`, {
        method: 'PUT', body: JSON.stringify({uuid, publicFeatured}),
      })
    )
    batch(() => {
      dispatch({type: 'ACKNOWLEDGE_ERROR'})
      dispatch({type: 'ACCOUNTS_SET_ONE', account})
      const msg = account.publicFeatured
        ? 'You have successfully activated your Public Profile!'
        : 'Your Public Profile has been deactivated.'
      dispatch({type: 'SUCCESS', msg})
    })
    return account
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }

  return null
}

const updateAccountMetadata = (account, iconFile, crop) => async (dispatch, getState) => {
  if (!account?.uuid) {
    return dispatch({type: 'ERROR', msg: 'Invalid parameter: Must provide an account "uuid".'})
  }

  // Do not use this for updating attribute "publicFeatured"
  // Use updateAccountPublicFeatured() above instead
  if ('publicFeatured' in account) {
    return dispatch({type: 'ERROR', msg: 'Invalid parameter: "publicFeatured".'})
  }

  if (checkIfAccountNameExists(account, getState().accounts.allAccounts)) {
    return dispatch({type: 'ERROR', msg: `Workspace named "${account.name}" already exists.`})
  }

  let queryParams = ''
  if (crop) {
    queryParams = `?left=${crop.x}&top=${crop.y}&width=${crop.width}&height=${crop.height}`
  }
  const formData = new FormData()
  if (iconFile) {
    formData.append('image', iconFile)
  }

  Object.keys(account).forEach(key => formData.append(key, account[key]))

  try {
    const newAccount = await dispatch(
      authenticatedFetch(`/v1/accounts/metadata/${account.uuid}${queryParams}`, {
        method: 'PATCH',
        body: formData,
        json: false,
      })
    )
    batch(() => {
      dispatch({type: 'ACKNOWLEDGE_ERROR'})
      dispatch({type: 'ACCOUNTS_SET_ONE', account: newAccount})
    })
    return newAccount
  } catch (err) {
    switch (err.status) {
      case 403:
        return dispatch({
          type: 'ERROR',
          msg: 'You do not have the necessary permissions to make changes to this page.' +
            ' Please contact your Workspace Owner or Admin to make changes to this page.',
        })
      default:
        dispatch({type: 'ERROR', msg: err.message})
    }
  }

  return null
}

const lightshipDeleteWorkspace = (uuid: string): AsyncThunk => async (dispatch) => {
  try {
    await dispatch(
      authenticatedFetch(`/v1/lightship/workspace/${uuid}`, {method: 'DELETE'})
    )
    dispatch({type: 'ACCOUNTS_DELETED_ONE', uuid})
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const deleteAccount = uuid => dispatch => dispatch(authenticatedFetch(`/v1/accounts/${uuid}`,
  {method: 'DELETE'}))
  .then(account => dispatch({type: 'ACCOUNTS_DELETED_ONE', uuid}))
  .catch(err => dispatch({type: 'ERROR', msg: err.message}))

const checkAccountTypeReferral = () => (dispatch) => {
  if (BuildIf.UI_TEST) {
    (global as any).location = (global as any).location_test
  }
  if (location.search) {
    const pair = location.search.slice(1).split('&')
      .map(kv => kv.split('='))
      .find(a => a[0] === 'type')

    if (pair) {
      const accountType = {
        camera: 'WebCamera',
        web: 'WebDeveloper',
        starter: 'WebStarter',
        plus: 'WebPlus',
        agency: 'WebDeveloper',
        pro: 'WebDeveloper',
        unity: 'UnityDeveloper',
      }[pair[1]]
      dispatch({type: 'ACCOUNT_NEW_TYPE', accountType})
      if (pair[1] === 'business') {
        dispatch({type: 'ACCOUNT_NEW_PLAN_TYPE', accountPlanType: 'WebBusiness'})
      } else if (pair[1] === 'agency') {
        dispatch({type: 'ACCOUNT_NEW_PLAN_TYPE', accountPlanType: 'WebAgency'})
      } else if (pair[1] === 'plus') {
        dispatch({type: 'ACCOUNT_NEW_PLAN_TYPE', accountPlanType: 'WebPlus'})
      } else if (pair[1] === 'starter') {
        dispatch({type: 'ACCOUNT_NEW_PLAN_TYPE', accountPlanType: 'WebStarter'})
      }
    }
  }
}

const submitCancelPlanFeedback =
(accountUuid, feedbackName, feedbackDetail, setupCall, crmData = {}) => (dispatch) => {
  if (!accountUuid) {
    dispatch({type: 'ERROR', msg: 'You need to provide an account to cancel'})
  }
  return dispatch(authenticatedFetch(`/v1/accounts/${accountUuid}/cancelPlanFeedback`, {
    method: 'POST',
    body: JSON.stringify({
      feedbackName,
      feedbackDetail,
      setupCall,
      ...crmData,
    }),
  })).catch(err => dispatch({type: 'ERROR', msg: err.message}))
}

const setActivatingAccount = (accountUuid: string) => dispatch => (
  dispatch({type: 'SET_ACTIVATING_ACCOUNT', uuid: accountUuid})
)

const clearActivatingAccount = () => dispatch => (
  dispatch({type: 'CLEAR_ACTIVATING_ACCOUNT'})
)

const initialize = () => (dispatch, getState) => {
  dispatch(checkAccountTypeReferral())
  if (!hasUserSession(getState())) {
    return null
  }
  return dispatch(getAccounts()).then((accounts) => {
    if (!accounts?.length && getState().user.confirmed) {
      // User has no accounts so generate a new one for them
      if (getState().team.invitation) {
        return dispatch({type: 'ACCOUNT_INVITED'})
      } else {
        const accountType = getState().common.newAccountType || 'WebDeveloper'
        dispatch({type: 'ACCOUNT_NEW_TYPE', accountType: null})
        return dispatch(addAccount({accountType}))
      }
    }
    return accounts
  })
}

export const rawActions = {
  getAccounts,
  loadAppsForAccount,
  addAccount,
  lightshipCreateWorkspace,
  updateAccount,
  updateAccountPublicFeatured,
  updateAccountMetadata,
  lightshipDeleteWorkspace,
  deleteAccount,
  error: onError,
  checkAccountTypeReferral,
  submitCancelPlanFeedback,
  setActivatingAccount,
  clearActivatingAccount,
  initialize,
  isAccountShortnameAvailable,
  completeOnboarding,
}
export type AccountActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
