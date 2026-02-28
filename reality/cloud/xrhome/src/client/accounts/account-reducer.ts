import type {DeepReadonly} from 'ts-essentials'

import type {AccountWithApps} from '../common/types/models'

type AccountState = DeepReadonly<{
  allAccounts: Array<AccountWithApps>
  accountLoaded: boolean
  selectedAccount: string
  activatingAccount: string
}>

const initialState = {
  allAccounts: [],
  accountLoaded: false,
  selectedAccount: '',
  activatingAccount: '',
} as AccountState

const Reducer = (state = initialState, action): AccountState => {
  switch (action.type) {
    case 'USER_LOGOUT':
      return {...initialState}

    case 'ACCOUNTS_SET_ALL':
      return {
        ...state,
        allAccounts: action.accounts,
        accountLoaded: true,
      }

    case 'ACCOUNTS_SET_ONE': {
      const {uuid} = action.account
      const newOrUpdatedAccount = {
        ...state.allAccounts.find(a => a.uuid === uuid),
        ...action.account,
      }
      return {
        ...state,
        allAccounts: [
          ...state.allAccounts.filter(a => a.uuid !== uuid),
          newOrUpdatedAccount,
        ],
        selectedAccount: uuid,
      }
    }

    case 'UPDATE_ACCOUNT':
      if (state.allAccounts.findIndex(a => a.uuid === action.account.uuid) === -1) {
        return {
          ...state,
          allAccounts: [
            ...state.allAccounts,
            action.account,
          ],
        }
      } else {
        return {
          ...state,
          allAccounts: [
            ...state.allAccounts.map(
              a => (a.uuid === action.account.uuid ? {...a, ...action.account} : a)
            ),
          ],
        }
      }

    case 'ACCOUNTS_SELECT':
      return {
        ...state,
        selectedAccount: action.uuid,
      }

    case 'ACCOUNTS_DELETED_ONE':
      return {
        ...state,
        allAccounts: state.allAccounts.filter(a => a.uuid !== action.uuid),
      }

    case 'SET_ACTIVATING_ACCOUNT':
      return {
        ...state,
        activatingAccount: action.uuid,
      }

    case 'CLEAR_ACTIVATING_ACCOUNT':
      return {
        ...state,
        activatingAccount: '',
      }
    case 'APPS_UPDATE': {
      const accountToUpdate = state.allAccounts.find(acct => acct.uuid === action.app.AccountUuid)
      const appToUpdate = accountToUpdate?.Apps?.find(app => app.uuid === action.app.uuid)
      // Note(Julie): Only update if app was created or deleted
      const shouldUpdate = !appToUpdate || action.app.status === 'DELETED'
      if (!accountToUpdate || !shouldUpdate) {
        return state
      } else {
        const newOrUpdatedApp = {
          ...appToUpdate,
          ...action.app,
        }
        const updatedApps = [
          ...(accountToUpdate.Apps?.filter(a => a.uuid !== action.app.uuid) || []),
          newOrUpdatedApp,
        ]
        const updatedAccount = {
          ...accountToUpdate,
          Apps: updatedApps,
        }
        return {
          ...state,
          allAccounts: [
            ...state.allAccounts.filter(a => a.uuid !== action.app.AccountUuid),
            updatedAccount,
          ],
        }
      }
    }

    default:
      return state
  }
}

export default Reducer

export type {AccountState}
