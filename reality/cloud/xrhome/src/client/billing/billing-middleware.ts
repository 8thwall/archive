import actions from './billing-actions'
import {hasUserSession} from '../user/has-user-session'
import {shouldLoadLightship} from '../lightship/common/lightship-settings'

const middleware = shouldLoadLightship()
  ? null
  : store => next => (action) => {
    next(action)
    if (!hasUserSession(store.getState())) {
      return
    }
    if (action.type.indexOf('ACCOUNT') === 0 && store.getState().accounts.allAccounts.length) {
      actions(store.dispatch).getBilling()
    }
  }

export default middleware
