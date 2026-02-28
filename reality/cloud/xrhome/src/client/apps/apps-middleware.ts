import actions from './apps-actions'
import {hasUserSession} from '../user/has-user-session'

const middleware = store => next => (action) => {
  next(action)
  if (!hasUserSession(store.getState())) {
    return
  }
  if (action.type.indexOf('ACCOUNT') === 0) {
    actions(store.dispatch).getApps()
  }
}

export default middleware
