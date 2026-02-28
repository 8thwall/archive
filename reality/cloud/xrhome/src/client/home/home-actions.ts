import {batch} from 'react-redux'

import {dispatchify} from '../common'
import unauthenticatedFetch from '../common/unauthenticated-fetch'
import {HomeActionType, ServeDocumentsRequestBody} from '../../shared/home-types'
import {SERVE_SEARCH_URL} from '../../shared/discovery-utils'

const acknowledgeError = () => dispatch => dispatch({type: 'ACKNOWLEDGE_ERROR'})

const acknowledgeMessage = () => dispatch => dispatch({type: 'ACKNOWLEDGE_MESSAGE'})

const acknowledgeSuccess = () => dispatch => dispatch({type: 'ACKNOWLEDGE_SUCCESS'})

const setPreload = (value: boolean) => dispatch => dispatch({
  type: HomeActionType.PRELOAD, preload: value,
})

const fetchApps = (keyword: string, body: ServeDocumentsRequestBody) => async (dispatch) => {
  batch(() => {
    dispatch({type: HomeActionType.SEARCH_PENDING, searchPending: {[keyword]: true}})
    dispatch({type: HomeActionType.SEARCH_ERROR, searchError: {[keyword]: false}})
  })

  try {
    const serveDocumentsUrl = `${SERVE_SEARCH_URL}/top-featured`
    const request = {
      method: 'POST',
      body: JSON.stringify(body),
    }
    const {results = [], from = 0} =
      await dispatch(unauthenticatedFetch(serveDocumentsUrl, request))
    dispatch({type: HomeActionType.SEARCH, keyword, searchResults: results})
    return from
  } catch (e) {
    dispatch({type: HomeActionType.SEARCH, keyword, searchResults: []})
    dispatch({type: HomeActionType.SEARCH_ERROR, searchError: {[keyword]: true}})
  } finally {
    dispatch({type: HomeActionType.SEARCH_PENDING, searchPending: {[keyword]: false}})
  }

  return null
}

const clearApps = () => (dispatch) => {
  dispatch({type: HomeActionType.SEARCH_CLEAR})
}

export const rawActions = {
  acknowledgeError,
  acknowledgeMessage,
  acknowledgeSuccess,
  fetchApps,
  clearApps,
  setPreload,
}

export default dispatchify(rawActions)
