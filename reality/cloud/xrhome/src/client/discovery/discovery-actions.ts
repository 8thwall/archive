import {batch} from 'react-redux'

import {dispatchify} from '../common'
import type {DispatchifiedActions} from '../common/types/actions'
import {DiscoveryActionType, ServeDocumentsRequestBody} from '../../shared/discovery-types'
import unauthenticatedFetch from '../common/unauthenticated-fetch'
import {SERVE_SEARCH_URL} from '../../shared/discovery-utils'

const fetchApps = (body: ServeDocumentsRequestBody) => async (dispatch) => {
  batch(() => {
    dispatch({type: DiscoveryActionType.PENDING, pending: {search: true}})
    dispatch({type: DiscoveryActionType.ERROR, error: {search: false}})
  })

  try {
    const serveDocumentsUrl = `${SERVE_SEARCH_URL}/featured`
    const request = {
      method: 'POST',
      body: JSON.stringify(body),
    }
    const {results = [], from = 0} =
      await dispatch(unauthenticatedFetch(serveDocumentsUrl, request))
    dispatch({type: DiscoveryActionType.SEARCH, searchResults: results})
    return from
  } catch (e) {
    dispatch({type: DiscoveryActionType.ERROR, error: {search: true}})
  } finally {
    dispatch({type: DiscoveryActionType.PENDING, pending: {search: false}})
  }

  return null
}

const setPreload = (value: Boolean, from: Number = 0) => (dispatch) => {
  dispatch({type: DiscoveryActionType.PRELOAD, preload: value, from})
}

const clearApps = () => (dispatch) => {
  dispatch({type: DiscoveryActionType.CLEAR})
}

const rawActions = {
  fetchApps,
  clearApps,
  setPreload,
}

export type DiscoveryActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
