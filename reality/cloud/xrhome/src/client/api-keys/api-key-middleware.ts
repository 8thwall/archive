import {rawActions as rawApiKeyActions} from './api-key-actions'
import {hasUserSession} from '../user/has-user-session'
import {isPlatformApiVisible} from '../../shared/account-utils'

const middleware = store => next => (action) => {
  next(action)
  const state = store.getState()
  if (!hasUserSession(state) || !action.type.startsWith('ACCOUNT')) {
    return
  }
  if (isPlatformApiVisible(state.accounts.allAccounts.find(e => e.uuid === action.uuid))) {
    store.dispatch(rawApiKeyActions.getApiKeysForAccount(action.uuid))
  }
}

export default middleware
