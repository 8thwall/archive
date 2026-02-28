import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import type {DispatchifiedActions} from '../common/types/actions'

const getApiKeysForAccount = (accountUuid: string) => async (dispatch) => {
  try {
    const res = await dispatch(authenticatedFetch(`/v1/api-keys/${accountUuid}`))
    dispatch({type: 'API_KEYS/LOAD_FOR_ACCOUNT', accountUuid, keys: res.keys})
  } catch (err) {
    dispatch({type: 'ERROR', MESSAGE: err.message})
  }
}

const rawActions = {
  getApiKeysForAccount,
}

export type ApiKeyActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)

export {
  rawActions,
}
