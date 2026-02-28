import {batch} from 'react-redux'

import {dispatchify} from '../common'
import {ProjectLibraryAction} from './project-library-types'
import unauthenticatedFetch from '../common/unauthenticated-fetch'
import {SERVE_SEARCH_URL} from '../../shared/discovery-utils'
import type {AppHostingType} from '../common/types/db'

type SearchApps = Partial<{
  q: string
  tech: string[]
  tag: string[]
  type: AppHostingType
  community: string
}>

const getSearchAppsOld = (
  {q, tech, tag, type, community}: SearchApps = {}, signal?: AbortSignal
) => async (dispatch) => {
  batch(() => {
    dispatch({type: ProjectLibraryAction.Pending, pending: {getSearchApps: true}})
    dispatch({type: ProjectLibraryAction.Error, error: {getSearchApps: false}})
  })

  const searchParams = new URLSearchParams()
  if (q) {
    searchParams.append('q', q)
  }

  if (tech?.length) {
    searchParams.append('tech', tech.join(','))
  }

  if (tag?.length) {
    searchParams.append('tag', tag.join(','))
  }

  if (type?.length) {
    searchParams.append('type', type)
  }

  if (community?.length) {
    searchParams.append('community', community)
  }

  try {
    const url = `${SERVE_SEARCH_URL}/projects?${searchParams.toString()}`
    const {apps} = await dispatch(unauthenticatedFetch(url.toString(), {
      signal,
    }))
    dispatch({type: ProjectLibraryAction.GetSearchApps, apps})
    dispatch({type: ProjectLibraryAction.Pending, pending: {getSearchApps: false}})
  } catch (e) {
    // Do nothing if it's an AbortError as we are aborting the previous fetch intentionally
    if (e.name !== 'AbortError') {
      dispatch({type: ProjectLibraryAction.Error, error: {getSearchApps: true}})
      dispatch({type: ProjectLibraryAction.Pending, pending: {getSearchApps: false}})
    }
  }
}

const getSearchApps = (
  searchParams: URLSearchParams, signal?: AbortSignal
) => async (dispatch) => {
  batch(() => {
    dispatch({type: ProjectLibraryAction.Pending, pending: {getSearchApps: true}})
    dispatch({type: ProjectLibraryAction.Error, error: {getSearchApps: false}})
  })

  try {
    const url = `${SERVE_SEARCH_URL}/projects?${searchParams.toString()}`
    const {apps} = await dispatch(unauthenticatedFetch(url.toString(), {
      signal,
    }))
    dispatch({type: ProjectLibraryAction.GetSearchApps, apps})
    dispatch({type: ProjectLibraryAction.Pending, pending: {getSearchApps: false}})
  } catch (e) {
    // Do nothing if it's an AbortError as we are aborting the previous fetch intentionally
    if (e.name !== 'AbortError') {
      dispatch({type: ProjectLibraryAction.Error, error: {getSearchApps: true}})
      dispatch({type: ProjectLibraryAction.Pending, pending: {getSearchApps: false}})
    }
  }
}

const clearSearchApps = () => (dispatch) => {
  dispatch({type: ProjectLibraryAction.ClearSearchApps})
}

const rawActions = {
  getSearchAppsOld,
  getSearchApps,
  clearSearchApps,
}

const actions = dispatchify(rawActions)

export {
  actions as default,
  rawActions,
}
