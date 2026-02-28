import {batch} from 'react-redux'
import {join} from 'path'

import {dispatchify} from '../common'
import {LauncherAction} from './launcher-types'
import authenticatedFetch from '../common/authenticated-fetch'
import unauthenticatedFetch from '../common/unauthenticated-fetch'
import {SERVE_SEARCH_URL} from '../../shared/discovery-utils'
import {publicApiFetch} from '../common/public-api-fetch'
import type {AppHostingType} from '../common/types/db'

type SearchApps = Partial<{
  q: string
  tech: string[]
  tag: string[]
  type: AppHostingType
  community: string
}>

const getConsoleApp = (appUuid: string) => async (dispatch, getState) => {
  // Return early if app is already cached.
  if (getState().launcher.consoleApps.find(app => app.uuid === appUuid)) {
    return
  }

  batch(() => {
    dispatch({type: LauncherAction.Pending, pending: {getConsoleApp: true}})
    dispatch({type: LauncherAction.Error, error: {getConsoleApp: false}})
  })

  try {
    const app = await dispatch(publicApiFetch(`/repos-public/library/${appUuid}`), {
      method: 'GET',
    })
    dispatch({type: LauncherAction.GetConsoleApp, app})
  } catch (e) {
    dispatch({type: LauncherAction.Error, error: {getConsoleApp: true}})
  } finally {
    dispatch({type: LauncherAction.Pending, pending: {getConsoleApp: false}})
  }
}

const clearConsoleApps = () => (dispatch) => {
  dispatch({type: LauncherAction.ClearConsoleApps})
}

const getSearchApps = (
  {q, tech, tag, type, community}: SearchApps = {}, signal?: AbortSignal
) => async (dispatch) => {
  batch(() => {
    dispatch({type: LauncherAction.Pending, pending: {getSearchApps: true}})
    dispatch({type: LauncherAction.Error, error: {getSearchApps: false}})
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

  if (type) {
    searchParams.append('type', type)
  }

  if (community?.length) {
    searchParams.append('community', community)
  }

  try {
    const url = `${SERVE_SEARCH_URL}/library?${searchParams.toString()}`
    const {apps} = await dispatch(unauthenticatedFetch(url.toString(), {
      signal,
    }))
    dispatch({type: LauncherAction.GetSearchApps, apps})
    dispatch({type: LauncherAction.Pending, pending: {getSearchApps: false}})
  } catch (e) {
    // Do nothing if it's an AbortError as we are aborting the previous fetch intentionally
    if (e.name !== 'AbortError') {
      dispatch({type: LauncherAction.Error, error: {getSearchApps: true}})
      dispatch({type: LauncherAction.Pending, pending: {getSearchApps: false}})
    }
  }
}

const clearSearchApps = () => (dispatch) => {
  dispatch({type: LauncherAction.ClearSearchApps})
}

const fetchAppReadMe =
(appUuid, commitHash, branch, isPrivate = false) => async (dispatch, getState) => {
  batch(() => {
    dispatch({type: LauncherAction.Error, error: {getAppReadMe: false}})
    dispatch({type: LauncherAction.Pending, pending: {getAppReadMe: true}})
  })

  const cachedReadMe = getState().launcher.appReadMesByAppUuid[appUuid]
  if (cachedReadMe) {
    return
  }

  try {
    let readMe
    if (isPrivate) {
      const getPath = join('/v1/repos-private/get', appUuid, branch, 'README.md')
      readMe = await dispatch(authenticatedFetch(getPath, {method: 'GET'}))
    } else {
      const getPath = join('/repos-public/get', appUuid, commitHash, branch, 'README.md')
      readMe = await dispatch(publicApiFetch(getPath, {method: 'GET'}))
    }
    dispatch({type: LauncherAction.GetAppReadMe, appUuid, readMe})
    dispatch({type: LauncherAction.Pending, pending: {getAppReadMe: false}})
  } catch (e) {
    dispatch({type: LauncherAction.Error, error: {getAppReadMe: true}})
    dispatch({type: LauncherAction.Pending, pending: {getAppReadMe: false}})
  }
}

const clearReadMes = () => (dispatch) => {
  dispatch({type: LauncherAction.ClearAppReadMes})
}

const rawActions = {
  getConsoleApp,
  clearConsoleApps,
  getSearchApps,
  clearSearchApps,
  fetchAppReadMe,
  clearReadMes,
}

const actions = dispatchify(rawActions)

export {
  actions as default,
  rawActions,
}
