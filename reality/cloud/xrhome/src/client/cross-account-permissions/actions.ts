import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import type {DispatchifiedActions} from '../common/types/actions'
import {
  deletePermissionAction, listPermissionsAction, handlePermissionPendingAction,
  handlePermissionErrorAction, createPermissionAction,
} from './action-types'
import type {ICrossAccountPermission, IApp} from '../common/types/models'
import {hasUserSession} from '../user/has-user-session'

const createPermissionsInvite = (app: IApp, shortName: string) => async (dispatch) => {
  dispatch(handlePermissionPendingAction({createPermission: true}))
  dispatch(handlePermissionErrorAction({createPermission: false}))
  try {
    const {crossAccountPermission} =
      await dispatch(authenticatedFetch('/v1/cross-account-permissions/create-app-invite',
        {
          method: 'POST',
          body: JSON.stringify({AppUuid: app.uuid, shortName}),
        }))
    dispatch(createPermissionAction(crossAccountPermission))
  } catch (e) {
    dispatch(handlePermissionErrorAction({createPermission: e.message}))
  } finally {
    dispatch(handlePermissionPendingAction({createPermission: false}))
  }
}

const getListOfPermissionsByUser = () => async (dispatch) => {
  dispatch(handlePermissionPendingAction({listPermissions: true}))
  dispatch(handlePermissionErrorAction({listPermissions: false}))
  try {
    const permissions = await dispatch(authenticatedFetch('/v1/cross-account-permissions/'))
    dispatch(listPermissionsAction(permissions))
  } catch (e) {
    dispatch(handlePermissionErrorAction({listPermissions: e.message}))
  } finally {
    dispatch(handlePermissionPendingAction({listPermissions: false}))
  }
}

const removePermission = (permission: ICrossAccountPermission) => async (dispatch) => {
  dispatch(handlePermissionErrorAction({removePermission: false}))
  dispatch(handlePermissionPendingAction({removePermission: true}))

  try {
    await dispatch(
      authenticatedFetch(`/v1/cross-account-permissions/${permission.uuid}`, {method: 'DELETE'})
    )
    dispatch(deletePermissionAction(permission))
  } catch (e) {
    dispatch(handlePermissionErrorAction({removePermission: true}))
    throw new Error(e)
  } finally {
    dispatch(handlePermissionPendingAction({removePermission: false}))
  }
}

const initialize = () => async (dispatch, getState) => {
  if (!hasUserSession(getState())) {
    return
  }
  await dispatch(getListOfPermissionsByUser())
}

const rawActions = {
  getListOfPermissionsByUser,
  createPermissionsInvite,
  removePermission,
  initialize,
}

type CrossAccountPermissionsActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)

export {
  rawActions,
}

export type {
  CrossAccountPermissionsActions,
}
