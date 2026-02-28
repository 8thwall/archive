import actions from './contract-actions'
import {getSelectedAccount} from '../accounts/account-select'
import {hasUserSession} from '../user/has-user-session'
import {shouldLoadLightship} from '../lightship/common/lightship-settings'

const middleware = shouldLoadLightship()
  ? null
  : store => next => (action) => {
    next(action)
    if (!hasUserSession(store.getState())) {
      return
    }
    if (action.type.indexOf('ACCOUNT') === 0 && getSelectedAccount(store.getState())) {
      actions(store.dispatch).getAllContractsForAcc()
    }
  }

export default middleware
