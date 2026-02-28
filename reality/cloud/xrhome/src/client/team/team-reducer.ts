import actions from './team-actions'
import type {TeamState} from './types'

const initialState: TeamState = {
  roles: [],
  invitation: null,
  invitationError: '',
  pending: {},
}

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LOGOUT':
      return {...initialState}

    case 'ROLES_SET':
      return {...state, roles: action.roles || []}

    case 'ROLES_INVITED':
      return {...state, invitation: action.invitation}

    case 'ROLES_INVITED_ERR':
      return {...state, invitationError: action.err.message}

    case 'ROLES_PENDING':
      return {...state, pending: {...state.pending, ...action.pending}}

    default:
      return state
  }
}

Reducer.initialize = dispatch => actions(dispatch).checkInvitation()

export default Reducer
