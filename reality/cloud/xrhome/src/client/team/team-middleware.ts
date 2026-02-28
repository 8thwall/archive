import actions from './team-actions'
import {hasUserSession} from '../user/has-user-session'
import {shouldLoadLightship} from '../lightship/common/lightship-settings'

const middleware = store => next => (action) => {
  next(action)
  if (!hasUserSession(store.getState())) {
    return
  }
  if (action.type.indexOf('ACCOUNT') === 0) {
    if (shouldLoadLightship()) {
      actions(store.dispatch).lightshipGetRoles().then(() => {
        // Until we have a list of errors, perform invitation after getRoles
        const {team, user} = store.getState()
        if (team.invitation && user.confirmed) {
          actions(store.dispatch).lightshipWasInvited(team.invitation)
        }
      })
    } else {
      actions(store.dispatch).getRoles().then(() => {
        // Until we have a list of errors, perform invitation after getRoles
        const {team, user} = store.getState()
        if (team.invitation && user.confirmed) {
          actions(store.dispatch).wasInvited(team.invitation)
        }
      })
    }
  }
}

export default middleware
