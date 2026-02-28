import {dispatchify} from '../common'
import type {DispatchifiedActions} from '../common/types/actions'

// TODO(dat): Listen for @@router/LOCATION_CHANGE so we can go pop back to the checkpoint
//            instead of push back to the checkpoint
const pushCheckpoint = path => dispatch => dispatch({type: 'NAVIGATION_PUSH', path})
const popCheckpoint = () => (dispatch, getState) => {
  const topPath = getState().navigations.pathStack.slice(-1)[0]
  dispatch({type: 'NAVIGATION_POP'})
  return topPath
}

const rawActions = {
  pushCheckpoint,
  popCheckpoint,
}

export type NavigationActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
