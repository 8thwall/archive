import {errorAction} from '../common/error-action'
import {dispatchify} from '../common/index'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import unauthenticatedFetch from '../common/unauthenticated-fetch'

const getChannelName = (): AsyncThunk<string> => async (dispatch) => {
  try {
    const res = await dispatch(unauthenticatedFetch('/link/channel', {method: 'GET'}))
    return res.name
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error getting channel name', err)
    // eslint-disable-next-line local-rules/hardcoded-copy
    dispatch(errorAction('Error getting channel name'))
    throw err
  }
}

const rawActions = {
  getChannelName,
}

type HmdLinkActions = DispatchifiedActions<typeof rawActions>

const actions = dispatchify(rawActions)

export {
  rawActions,
  HmdLinkActions,
  actions as default,
}
