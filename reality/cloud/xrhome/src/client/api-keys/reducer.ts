import type {IApiKey} from '../common/types/models'

export interface ApiKeyState {
  entities: Record<string, IApiKey>
  byAccountUuid: Record<string, string[]>
}

const initialState: ApiKeyState = {entities: {}, byAccountUuid: {}}

const handlers: Record<string, (state: ApiKeyState, action) => ApiKeyState> = {
  'USER_LOGOUT': () => initialState,
  'API_KEYS/LOAD_FOR_ACCOUNT': (state: ApiKeyState, action) => {
    const newEntities = {...state.entities}
    action.keys.forEach((key) => {
      newEntities[key.uuid] = key
    })
    return {
      entities: newEntities,
      byAccountUuid: {
        ...state.byAccountUuid,
        [action.accountUuid]: action.keys.map(e => e.uuid),
      },
    }
  },
}

const Reducer = (state = {...initialState}, action) => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }
  return state
}

export default Reducer
