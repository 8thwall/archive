import type {Writable} from 'ts-essentials'

import {dispatchify, onError} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import {derivedImageTarget} from './image-targets'
import gitActions from '../git/git-actions'
import {fs} from '../worker/client'
import type {
  IAppTag, IFeaturedAppImage, IApp, IImageTarget, IUserAppSpecific,
} from '../common/types/models'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import type {CropAreaPixels, CropArea} from '../common/image-cropper'

import {rawActions as imageTargetActions} from '../image-targets/actions'
import {
  ADD_IMAGE_TARGETS_FOR_APP,
  UPDATE_IMAGE_TARGET,
} from '../image-targets/types'
import unauthenticatedFetch from '../common/unauthenticated-fetch'
import {getFeaturedDescriptionUrl} from '../../shared/featured-app-description'
import {appHasRepo} from '../../shared/app-utils'
import {errorAction} from '../common/error-action'
import {getVideoUrlHandle, isValidVideoUrl} from '../../shared/featured-video'
import {wrapDeprecatedActions} from '../common/wrapped-deprecated-actions'

const {deleteImageTargetForApp} = imageTargetActions

const syncApp = uuid => async (dispatch) => {
  try {
    const app = await dispatch(authenticatedFetch(`/v1/apps/get/${uuid}`))
    dispatch({type: 'APPS_UPDATE', app})
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const getApps = () => (dispatch, getState) => {
  if (!getState().accounts.selectedAccount) {
    return Promise.resolve()
  }

  dispatch({type: 'APPS_LOADING', loading: true})
  dispatch({type: 'APPS_CLEAR'})
  return dispatch(authenticatedFetch(`/v1/apps/${getState().accounts.selectedAccount}`))
    .then(({apps, devMode}) => {
      dispatch({type: 'APPS_SET', apps})
      dispatch({type: 'APPS_DEV', version: devMode})
      dispatch({type: 'APPS_LOADING', loading: false})
    })
    .catch((err) => {
      dispatch({type: 'APPS_LOADING', loading: false})
      return dispatch({type: 'ERROR', msg: err.message})
    })
}

// Update app with no confirmation
const bareUpdateApp = app => dispatch => dispatch(authenticatedFetch('/v1/apps/update', {method: 'PUT', body: JSON.stringify(app)}))
  .then(app => dispatch({type: 'APPS_UPDATE', app}))
  .catch(err => dispatch({type: 'ERROR', msg: err.message}))

const renameApp = app => dispatch => dispatch(authenticatedFetch('/v1/apps/rename', {method: 'PATCH', body: JSON.stringify(app)}))
  .then(app => dispatch({type: 'APPS_UPDATE', app}))
  .catch((err) => {
    dispatch({type: 'ERROR', msg: err.message})
    throw err
  })

type NewAppFields = 'appTitle' | 'appName' | 'appDescription' | 'coverImageId' |
'isWeb' | 'isCamera' | 'isPublic' | 'commercialStatus' |
'buildSettingsSplashScreen' | 'isCommercial' | 'hostingType'

type NewAppData = Partial<Writable<Pick<IApp, NewAppFields>>>

const newApp = (params?: NewAppData): AsyncThunk<IApp | null> => async (dispatch, getState) => {
  try {
    const app: IApp = await dispatch(authenticatedFetch('/v1/apps/new', {
      method: 'POST',
      body: JSON.stringify({
        ...params,
        AccountUuid: getState().accounts.selectedAccount,
      }),
    }))
    dispatch({type: 'APPS_UPDATE', app})
    dispatch({type: 'ACKNOWLEDGE_ERROR'})
    window.dataLayer.push({event: 'appKeyCreatedWeb'})
    return app
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
    return null
  }
}

const newScaniverseGsbApp = (accountUuid: string) => async (dispatch) => {
  try {
    const app = await dispatch(authenticatedFetch(`/v1/apps/internal/${accountUuid}/newInternal`, {
      method: 'POST',
    }))
    dispatch({type: 'APPS_UPDATE', app})
    dispatch({type: 'ACKNOWLEDGE_ERROR'})
    return app
  } catch (err) {
    return dispatch({type: 'ERROR', msg: err.message})
  }
}

const newKey = app => dispatch => dispatch(authenticatedFetch('/v1/apps/update', {
  method: 'PUT',
  body: JSON.stringify({
    ...app, status: 'DELETED',
  }),
}))
  .then((app) => {
    if (app.status !== 'DELETED') {
      throw new Error(`Must DELETE application before assigning a new key to ${app.appName}`)
    }
    dispatch({type: 'APPS_UPDATE', app})
    return dispatch(newApp(app))
  })
  .catch(err => dispatch({type: 'ERROR', msg: err.message}))

const getFormData = (name: string, file: Blob, filename: string, params?: Record<string, any>) => {
  const fd = new FormData()
  if (filename) {
    fd.append('name', filename)
  }
  fd.append(name, file)

  if (params) {
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        fd.append(key, String(params[key]))
      }
    })
  }
  return fd
}

const getQueryParams = (params: Record<string, any>) => {
  const stringParams: Record<string, string> = {}
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined) {
      stringParams[key] = String(params[key])
    }
  })
  return new URLSearchParams(stringParams).toString()
}

const uploadApp = (uuid, file, filename, debounce) => (dispatch) => {
  const thunk = dispatch => dispatch(authenticatedFetch(`/v1/apps/upload/${uuid}`, {
    method: 'PUT',
    body: getFormData('zip', file, filename),
    json: false,
  }))
    .then((app) => {
      dispatch({type: 'APPS_UPDATE', app})
      dispatch({type: 'APP_UPLOADING', uploading: false})
    })
    .catch(err => dispatch({type: 'ERROR', msg: err.message}))

  if (debounce) {
    thunk.debounce = debounce
  } else {
    dispatch({type: 'APP_UPLOADING', uploading: true})
  }
  dispatch(thunk)
}

// TODO(christoph): Add topRadius/bottomRadius for conical
type TargetGeometry = {
  originalWidth: number
  originalHeight: number
  isRotated: boolean
  topRadius?: number
  bottomRadius?: number
}

const uploadImageTarget = (
  appUuid: string, file: Blob, filename: string, type: IImageTarget['type'],
  crop: CropAreaPixels | null, geometry: TargetGeometry
) => (dispatch) => {
  const queryParams = getQueryParams({name: filename, type, ...crop})
  const formData = getFormData('image', file, filename, {type, ...geometry})

  return dispatch(authenticatedFetch(`/v1/image-targets/${appUuid}?${queryParams}`, {
    method: 'POST',
    body: formData,
    json: false,
  }))
    .then((imageTarget) => {
      if (imageTarget) {
        dispatch({
          type: ADD_IMAGE_TARGETS_FOR_APP,
          appUuid,
          imageTargets: [derivedImageTarget(imageTarget)],
        })
        window.dataLayer.push({event: 'imageTargetUploaded'})
      }
      return imageTarget
    })
    .catch(err => dispatch({type: 'ERROR', msg: err.message}))
}

const updateImageTarget = imageTarget => (dispatch) => {
  if (!imageTarget.uuid) {
    throw new Error('You have to specify an id for the image target to update')
  }
  return dispatch(authenticatedFetch(`/v1/image-targets/${imageTarget.uuid}`, {
    method: 'PUT',
    body: JSON.stringify(imageTarget),
  }))
    .then(it => dispatch({type: UPDATE_IMAGE_TARGET, imageTarget: derivedImageTarget(it)}))
}
const deleteImageTarget = (
  appUuid: string, uuid: string
) => async (dispatch) => {
  await dispatch(authenticatedFetch(`/v1/image-targets/${appUuid}/${uuid}`, {
    method: 'DELETE',
  }))
  dispatch(deleteImageTargetForApp(appUuid, uuid))
}

// Targets stored in the dev database can't be read by apps prod.
const BASE_PREVIEWIT_URL = BuildIf.ALL_QA
  ? 'https://console-8w.dev.8thwall.app/previewit/?'
  : 'https://8w.8thwall.app/previewit/?'

const testImageTarget = (AppUuid: string, uuid: string) => async (dispatch) => {
  try {
    const res = await dispatch(authenticatedFetch(`/v1/image-targets/test/${AppUuid}/${uuid}`, {
      method: 'POST',
    }))
    const url = res.url || `${BASE_PREVIEWIT_URL}j=${res.token || res.j}`  // TODO(pawel) Clean up.
    dispatch({type: 'IMAGE_TARGET_PREVIEW', url})
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const testImageTargetClear = () => dispatch => dispatch({type: 'IMAGE_TARGET_PREVIEW'})

const getDataRecorderUrl = (accountUuid: string): AsyncThunk<string | null> => async (dispatch) => {
  try {
    const res = await dispatch(authenticatedFetch(
      `/v1/datarecorder/upload-url/${accountUuid}`
    )) as {shortLink: string}
    return `https://8th.io/${res.shortLink}`
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
    return null
  }
}

const updateApp = app => (dispatch) => {
  if (!app.status) {
    return dispatch(bareUpdateApp(app))
  }
  if (app.status === 'ENABLED' ||
      confirm('Prior versions of this application will no longer work and may crash.\n\nYou can always re-enable later.')) {
    return dispatch(bareUpdateApp(app))
  }
}

const deleteAppImmediate = (app: IApp): AsyncThunk<void> => async (
  dispatch, getState
) => {
  const deletedApp = await dispatch(authenticatedFetch(`/v1/apps/${app.uuid}`, {method: 'DELETE'}))
  const account = getState().accounts.allAccounts.find(a => a.uuid === app.AccountUuid)
  const repoDir = `${account.shortName}.${app.appName}`
  if (appHasRepo(app)) {
    await fs.deleteRepo(repoDir)
  }
  dispatch({type: 'APPS_UPDATE', app: deletedApp})
}

/**
 * DEPRECATED: Build a custom prompt in your UI, and use `deleteAppImmediate` instead.
 * We should not prompt for user input within a Redux action.
 */
const deleteApp = (app: IApp): AsyncThunk<boolean> => async (dispatch) => {
  // eslint-disable-next-line no-alert
  const didCancel = prompt(`Deleting an Application is irreversible.  Prior versions of the \
application will no longer work and may crash.  You might want to disable the app instead.

Are you sure you want to delete application '${app.appName}'?

Type 'DELETE' to confirm.`) !== 'DELETE'

  if (!didCancel) {
    try {
      await dispatch(deleteAppImmediate(app))
    } catch (err) {
      dispatch(errorAction(err.message))
    }
  }
  return didCancel
}

const getAppUserSpecific = (appUuid: string) => (dispatch): Promise<IUserAppSpecific> => (
  dispatch(authenticatedFetch(`/v1/apps/${appUuid}/userSpecific`, {
    method: 'GET',
  }))
    .then((userSpecific) => {
      dispatch({type: 'USER_APP_SPECIFICS_UPDATE', appUuid, userSpecific})
      return userSpecific
    })
    .catch(err => dispatch({type: 'ERROR', msg: err.message}))
)

const getAppXrSessionToken = (appUuid: string) => (dispatch): Promise<string> => (
  dispatch(authenticatedFetch(`/v1/apps/${appUuid}/xrSessionToken`, {
    method: 'GET',
  }))
    .then(({xrSessionToken}) => {
      dispatch({type: 'APP_SET_XRSESSIONTOKEN', appUuid, xrSessionToken})
      return xrSessionToken
    })
    .catch(err => dispatch({type: 'ERROR', msg: err.message}))
)

const updateAppUserSpecific = (
  appUuid: string,
  userSpecific: Partial<IUserAppSpecific>
) => (dispatch): Promise<IUserAppSpecific> => (
  dispatch(authenticatedFetch(`/v1/apps/${appUuid}/userSpecific`, {
    method: 'PUT',
    body: JSON.stringify({userSpecific}),
  }))
    .then((userSpecific) => {
      dispatch({type: 'USER_APP_SPECIFICS_UPDATE', appUuid, userSpecific})
      return userSpecific
    })
    .catch(err => dispatch({type: 'ERROR', msg: err.message}))
)

const getRecentApps = () => dispatch => dispatch(authenticatedFetch('/v1/apps/recent'))
  .then(({apps}) => apps.filter(app => app.hostingType !== 'INTERNAL'))

const getSpecifiedTags = () => async (dispatch) => {
  try {
    return await dispatch(authenticatedFetch('/v1/apps/specifiedTags'))
  } catch (err) {
    return dispatch({type: 'ERROR', msg: err.message})
  }
}

const updateAppAccessDate = appUuid => dispatch => dispatch(authenticatedFetch(`/v1/apps/updateAccess/${appUuid}`, {
  method: 'PUT',
})).then(() => {
  // preemptively update the access date locally so we don't have to have another round trip
  dispatch({type: 'USER_APP_ACCESS_DATE_UPDATE', appUuid})
}).catch(err => dispatch({type: 'ERROR', msg: err.message}))

const updateAppMetadata = (appUuid, {appTitle, appDescription, file, crop, buildSettingsSplashScreen}, deployment) => (dispatch) => {
  let queryParams = ''
  if (crop) {
    queryParams = `?left=${crop.x}&top=${crop.y}&width=${crop.width}&height=${crop.height}`
  }
  const formData = new FormData()
  if (file) {
    formData.append('image', file)
  }
  formData.append('appTitle', appTitle)
  formData.append('appDescription', appDescription)
  formData.append('buildSettingsSplashScreen', buildSettingsSplashScreen)
  return dispatch(authenticatedFetch(`/v1/apps/metadata/${appUuid}${queryParams}`, {
    method: 'POST',
    body: formData,
    json: false,
  })).then((app) => {
    dispatch({type: 'APPS_UPDATE', app})
    if (deployment && (deployment.master || deployment.staging || deployment.production)) {
      return dispatch(gitActions.redeployBranches(appUuid))
    }
    return null
  }).catch((err) => {
    dispatch({type: 'ERROR', msg: err.message})
    throw new Error(err)
  })
}

interface IFeatureAppFormState {
  featuredDescription?: string
  featuredTags?: IAppTag[]
  featuredVideoUrl?: string
  featuredImages?: IFeaturedAppImage[]
  featuredPreviewDisabled?: boolean
  featuredAppCloneable?: boolean
}

const updateAppFeatureMetadata = (
  appUuid: string,
  appFormState: IFeatureAppFormState
) => async (dispatch) => {
  // Test the video URL again before sending
  if (appFormState.featuredVideoUrl) {
    if (!isValidVideoUrl(appFormState.featuredVideoUrl)) {
      dispatch({type: 'ERROR', msg: 'Provided video URL is not valid.'})
      return
    } else {
      appFormState.featuredVideoUrl = getVideoUrlHandle(appFormState.featuredVideoUrl)
    }
  }

  // Error handling done by caller.
  const updatedApp = await dispatch((authenticatedFetch(`/v1/apps/featureMetadata/${appUuid}`, {
    method: 'PATCH',
    body: JSON.stringify(appFormState),
  })))
  dispatch({type: 'APPS_UPDATE', app: updatedApp})
}

interface IFeatureAppFormStateRequired {
  publicFeatured: true  // Must be true if attempting to publish.
  featuredDescription: string
  featuredTags: IAppTag[]
  featuredVideoUrl: string
  featuredImages: IFeaturedAppImage[]
  featuredPreviewDisabled: boolean
  featuredAppCloneable: boolean
}

const publishFeaturedApp = (
  appUuid: string,
  appFormState: IFeatureAppFormStateRequired
) => async (dispatch) => {
  if (appFormState.featuredVideoUrl) {
    if (!isValidVideoUrl(appFormState.featuredVideoUrl)) {
      dispatch({type: 'ERROR', msg: 'Provided video URL is not valid.'})
      return
    } else {
      appFormState.featuredVideoUrl = getVideoUrlHandle(appFormState.featuredVideoUrl)
    }
  }

  // Error handling done by caller.
  const updatedApp = await dispatch(
    (authenticatedFetch(`/v1/apps/updatePublishFeatured/${appUuid}`, {
      method: 'PATCH',
      body: JSON.stringify(appFormState),
    }))
  )
  dispatch({type: 'APPS_UPDATE', app: updatedApp})
}

const unpublishFeaturedApp = (
  appUuid: string,
  publicFeatured: false  // Must be false if attemping to unpublish.
) => async (dispatch) => {
  try {
    const updatedApp = await dispatch(
      (authenticatedFetch(`/v1/apps/updatePublishFeatured/${appUuid}`, {
        method: 'PATCH',
        body: JSON.stringify({publicFeatured}),
      }))
    )
    return dispatch({type: 'APPS_UPDATE', app: updatedApp})
  } catch (err) {
    return dispatch({type: 'ERROR', msg: err.message})
  }
}

const uploadFeaturedImage = (
  appUuid: string,
  file: File,
  crop?: CropArea
) => (dispatch): {featuredAppImage: IFeaturedAppImage} => {
  let queryParams = ''
  if (crop) {
    queryParams = `?left=${crop.x}&top=${crop.y}&width=${crop.width}&height=${crop.height}`
  }
  const formData = new FormData()
  formData.append('image', file)
  return dispatch(authenticatedFetch(`/v1/apps/featuredImage/${appUuid}/${queryParams}`, {
    method: 'POST',
    body: formData,
    json: false,
  }))
}

// NOTE(wayne): Always call duplicateAppData() last for duplicating an app
// So the app in Redux store has the up-to-date data
// TODO(wayne): Figure out if we need a new endpoint for getting the latest data of an app
// And call it to update the Redux store accordingly after everything is done
const duplicateAppData = (srcAppUuid, destAppUuid) => dispatch => dispatch(authenticatedFetch(`/v1/apps/duplicate/${srcAppUuid}/${destAppUuid}`, {method: 'POST'}))
  .then((result) => {
    const {app, pwaInfo} = result
    if (app) {
      dispatch({type: 'APPS_UPDATE', app})
    }
    if (pwaInfo) {
      dispatch({type: 'PWA_INFO_SET', appUuid: destAppUuid, pwaInfo})
    }
  })
  .catch(() => dispatch({type: 'ERROR', msg: 'Couldn\'t duplicate app data.'}))

type DuplicateProjectArgs = {
  appUuid: string
  fromAppUuid: string
  fromProjectSpecifier?: string
  deployment?: string
}

const cloneIntoApp = ({
  appUuid, fromAppUuid, fromProjectSpecifier, deployment,
}: DuplicateProjectArgs): AsyncThunk<void> => async (dispatch) => {
  if (fromProjectSpecifier) {
    await dispatch(gitActions.initializeAppRepo(appUuid, {
      repoName: fromProjectSpecifier,
      deployment,
    }))
  }
  await dispatch(duplicateAppData(fromAppUuid, appUuid))
}

const updateAppType = (
  uuid: string,
  updates: {
    isCommercial: boolean
    buildSettingsSplashScreen?: string
    commercialStatus?: string
  }
) => async (dispatch) => {
  try {
    const {app} = await dispatch(authenticatedFetch(
      `/v1/apps/updateAppType/${uuid}`,
      {method: 'PATCH', body: JSON.stringify(updates)}
    ))
    dispatch({type: 'APPS_UPDATE', app})
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const loadFeaturedAppDescription = (appUuid: string) => async (dispatch, getState) => {
  const app: IApp = getState().apps.find(a => a.uuid === appUuid)
  if (!app) {
    const message = `Unable to locate app: ${appUuid}`
    dispatch({type: 'ERROR', msg: message})
    throw new Error(message)
  }

  if (!app.featuredDescriptionId) {
    return ''
  }

  try {
    return (await dispatch(
      unauthenticatedFetch(getFeaturedDescriptionUrl(app.featuredDescriptionId))
    )) as string
  } catch (err) {
    dispatch({type: 'ERROR', msg: `Unable to load description for app: ${appUuid}`})
    throw err
  }
}

type AddBackendSecretResponse = {secretId: string}

const addBackendSecret = (
  secretValue: string,
  appUuid: string
) => authenticatedFetch<AddBackendSecretResponse>(
  `/v1/backend-services/secret/${appUuid}`, {
    method: 'POST',
    body: JSON.stringify({secretValue}),
  }
)

const instantCloneApp = (
  app: NewAppData,
  accountUuid: string,
  fromAppUuid: string,
  fromProjectSpecifier: string
) => async (dispatch) => {
  dispatch({type: 'ACCOUNTS_SELECT', uuid: accountUuid})
  const newClonedApp = await dispatch(newApp(app))
  await dispatch(cloneIntoApp({
    appUuid: newClonedApp.uuid,
    fromAppUuid,
    fromProjectSpecifier,
    deployment: 'published',
  }))
}

// //////////////////////////////////////////////////////////

const rawActions = {
  syncApp,
  getApps,
  newApp,
  instantCloneApp,
  newScaniverseGsbApp,
  newKey,
  bareUpdateApp,
  updateApp,
  updateAppType,
  deleteAppImmediate,
  deleteApp,
  error: onError,
  uploadApp,
  renameApp,
  getAppUserSpecific,
  getAppXrSessionToken,
  updateAppUserSpecific,
  getRecentApps,
  getSpecifiedTags,
  updateAppAccessDate,
  updateAppMetadata,
  updateAppFeatureMetadata,
  publishFeaturedApp,
  unpublishFeaturedApp,
  uploadFeaturedImage,
  cloneIntoApp,
  addBackendSecret,
  // IMAGE TARGETS
  uploadImageTarget,
  updateImageTarget,
  deleteImageTarget,
  testImageTarget,
  testImageTargetClear,
  loadFeaturedAppDescription,
  // DATARECORDER
  getDataRecorderUrl,
  // GIT ACTIONS
  // TODO(christoph): Remove this after we confirm there are no deprecated usages
  ...wrapDeprecatedActions(gitActions, key => (
    `Deprecated use of GitActions.${key} through AppsActions`
  )),
}

 type AppsActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)

export {
  rawActions,
}

export type {
  NewAppData,
  AppsActions,
  TargetGeometry,
}
