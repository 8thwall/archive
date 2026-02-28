import {join} from 'path'

import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import unauthenticatedFetch from '../common/unauthenticated-fetch'
import {normalizeApp, normalizeAccount, generateIndexUpdates} from '../../shared/normalizer'
import type {DispatchifiedActions} from '../common/types/actions'
import {addressWithPlaceId, ADDRESS_TYPES} from '../common/google-maps'
import {getFeaturedDescriptionUrl} from '../../shared/featured-app-description'
import {getKey} from './file-browsing'
import {publicApiFetch} from '../common/public-api-fetch'

const MESSAGE_404 = 'Not Found'

const fetchPreviewShortLink = appUuid => async dispatch => (await dispatch(
  publicApiFetch(`/temp-url-api/browse/${appUuid}`)
)).shortLink

const listRepoPath = (
  appOrModuleUuid, commitHash, branch, path, isPrivate = false, isModule = false
) => (dispatch) => {
  if (!appOrModuleUuid) {
    return Promise.reject()
  }

  let listPromise
  if (isModule) {
    if (isPrivate) {
      return Promise.reject()
    }
    const listPath = join(
      '/repos-public/modules/list', appOrModuleUuid, commitHash, branch, path
    )
    listPromise = dispatch(publicApiFetch(listPath, {method: 'GET'}))
  } else if (isPrivate) {
    const listPath = join('/v1/repos-private/list', appOrModuleUuid, branch, path, '/')
    listPromise = dispatch(authenticatedFetch(listPath, {method: 'GET'}))
  } else {
    const listPath = join('/repos-public/list', appOrModuleUuid, commitHash, branch, path, '/')
    listPromise = dispatch(publicApiFetch(listPath, {method: 'GET'}))
  }

  return listPromise
    .then((contentList) => {
      dispatch({
        type: 'BROWSE_UPDATE_PATH_INDEX', path: getKey(appOrModuleUuid, branch, path), contentList,
      })
    }).catch((err) => {
      if (err.message !== MESSAGE_404) {
        dispatch({type: 'ERROR', msg: err.message})
      }
    })
}

const getRepoFile = (
  appOrModuleUuid, commitHash, branch, path, isPrivate = false, isModule = false
) => (dispatch) => {
  if (!appOrModuleUuid) {
    return Promise.reject()
  }

  let getPromise
  if (isModule) {
    if (isPrivate) {
      return Promise.reject()
    }

    const getPath = join(
      '/repos-public/modules/get', appOrModuleUuid, commitHash, branch, path
    )
    getPromise = dispatch(publicApiFetch(getPath, {method: 'GET'}))
  } else if (isPrivate) {
    const getPath = join('/v1/repos-private/get', appOrModuleUuid, branch, path)
    getPromise = dispatch(authenticatedFetch(getPath, {method: 'GET'}))
  } else {
    const getPath = join('/repos-public/get', appOrModuleUuid, commitHash, branch, path)
    getPromise = dispatch(publicApiFetch(getPath, {method: 'GET'}))
  }

  return getPromise
    .then((fileContent) => {
      dispatch({
        type: 'BROWSE_UPDATE_FILE_CONTENT',
        path: getKey(appOrModuleUuid, branch, path),
        fileContent,
      })
    }).catch((err) => {
      if (err.message !== MESSAGE_404) {
        dispatch({type: 'ERROR', msg: err.message})
      } else {
        dispatch({
          type: 'BROWSE_UPDATE_FILE_CONTENT',
          path: getKey(appOrModuleUuid, branch, path),
          fileContent: null,
        })
      }
    })
}

const getPublicAccountApp = (accountShortName, appShortName) => (dispatch) => {
  if (!appShortName || !accountShortName) {
    return Promise.reject()
  }

  return dispatch(publicApiFetch(
    `/repos-public/${accountShortName}/${appShortName}`, {method: 'GET'}
  ))
    .then((appData) => {
      const normalizedData = normalizeApp(appData)
      const indexUpdates = generateIndexUpdates(normalizedData)
      dispatch({type: 'BROWSE_UPDATE_NORMALIZED_ENTITIES', normalizedData, indexUpdates})
      return appData
    }).catch((err) => {
      if (err.message !== MESSAGE_404) {
        dispatch({type: 'ERROR', msg: err.message})
      }
      return null
    })
}

const getPublicAccount = accountShortName => (dispatch) => {
  if (!accountShortName) {
    return Promise.reject()
  }

  return dispatch(publicApiFetch(`/repos-public/${accountShortName}`, {method: 'GET'}))
    .then((accountData) => {
      const normalizedData = normalizeAccount(accountData)
      const indexUpdates = generateIndexUpdates(normalizedData)
      dispatch({type: 'BROWSE_UPDATE_NORMALIZED_ENTITIES', normalizedData, indexUpdates})
      return accountData
    }).catch((err) => {
      if (err.message !== MESSAGE_404) {
        dispatch({type: 'ERROR', msg: err.message})
      }
      return null
    })
}

const getAccountAddress = account => async (dispatch) => {
  try {
    const address = await addressWithPlaceId(account.googleMapsPlaceId, ADDRESS_TYPES)
    dispatch({type: 'BROWSE_UPDATE_ADDRESS', accountUuid: account.uuid, address})
  } catch (e) {
    /* eslint-disable no-console */
    console.error(
      `Fail to get address with place_id: ${account.googleMapsPlaceId} ${e}`
    )
    /* eslint-enable no-console */
  }
}

const loadFeaturedAppDescription = (descriptionId: string) => async (dispatch) => {
  if (!descriptionId) {
    return ''
  }

  try {
    const featuredDescriptionUrl = getFeaturedDescriptionUrl(descriptionId)
    const description = await dispatch(unauthenticatedFetch(featuredDescriptionUrl))
    dispatch({type: 'BROWSE/SET_FEATURE_APP_DESCRIPTION', descriptionId, description})
    return description
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    dispatch({type: 'ERROR', msg: err.message})
    return ''
  }
}

const rawActions = {
  listRepoPath,
  getRepoFile,
  getPublicAccountApp,
  getPublicAccount,
  getAccountAddress,
  fetchPreviewShortLink,
  loadFeaturedAppDescription,
}

export type PublicBrowseActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
