import {
  PartnersAction,
  PartnersMessage,
  PartnersReduxState,
  PartnersReducerFunction,

  // Actions.
  GetPartnersAction,

  // Action types.
  GET_PARTNERS,
} from './partners-types'

const initialState = {
  premierPartners: [],
  partners: [],
}

const getPartners = (
  state: PartnersReduxState,
  action: GetPartnersAction
): PartnersReduxState => {
  const {premierPartners, partners} = action
  return {
    ...state,
    premierPartners,
    partners,
  }
}

const actions: Record<PartnersMessage, PartnersReducerFunction> = {
  [GET_PARTNERS]: getPartners,
}

const Reducer = (state = {...initialState}, action: PartnersAction): PartnersReduxState => {
  const handler = actions[action.type]
  if (!handler) {
    return state
  }
  return handler(state, action)
}

export default Reducer
