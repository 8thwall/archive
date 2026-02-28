import {dispatchify} from 'c8/webapp/dispatchify'
import {DispatchifiedActions} from 'c8/webapp/dispatchify-types'

const setCurrentViewId = currentViewId => dispatch => (
  dispatch({type: 'VIEW/SET_CURRENT_VIEW_ID', currentViewId})
)

const setCurrentGroupName = groupName => dispatch => (
  dispatch({type: 'VIEW/SET_CURRENT_GROUP_NAME', groupName})
)

const setViews = viewNames => dispatch => (
  dispatch({type: 'VIEW/SET_VIEWS', viewNames})
)

const setViewGroups = viewGroups => dispatch => (
  dispatch({type: 'VIEW/SET_VIEW_GROUPS', viewGroups})
)

const rawActions = {
  setCurrentViewId,
  setCurrentGroupName,
  setViews,
  setViewGroups,
}

export type ViewActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
