import type {ICrossAccountPermission} from '../common/types/models'

import {
  DELETE_PERMISSION_TYPE, HANDLE_PERMISSION_ERROR_TYPE, HANDLE_PERMISSION_PENDING_TYPE,
  LIST_PERMISSIONS_TYPE, CREATE_PERMISSION_TYPE,
  CrossAccountPermissionErrorState, CrossAccountPermissionsPendingState,
  CrossAccountPermissionsActions, DeletePermissionAction, HandlePermissionErrorAction,
  HandlePermissionPendingAction, ListPermissionsAction, CreatePermissionAction,
} from './action-types'

interface CrossAccountPermissionsState {
  entities: Record<string, ICrossAccountPermission>
  byFromAccountShortname: Record<string, string[]>
  byAppUuid: Record<string, string[]>
  pending: Partial<Record<CrossAccountPermissionsPendingState, boolean>>
  error: Partial<Record<CrossAccountPermissionErrorState, boolean | string>>
}

const initialState: CrossAccountPermissionsState = {
  entities: {},
  byFromAccountShortname: {},
  byAppUuid: {},
  pending: {},
  error: {},
}

const handleCreatePermissionAction = (
  state: CrossAccountPermissionsState, action: CreatePermissionAction
) => {
  const {permission} = action
  const newEntities = {...state.entities}
  newEntities[permission.uuid] = permission

  const newByFromAccountShortname = {
    ...state.byFromAccountShortname,
  }
  const existingByShortname = newByFromAccountShortname[permission.FromAccount.shortName] || []
  newByFromAccountShortname[permission.FromAccount.shortName] = [
    ...existingByShortname,
    permission.uuid,
  ]

  const newByAppUuid = {
    ...state.byAppUuid,
  }
  if (permission.AppUuid) {
    const existingByAppUuid = newByAppUuid[permission.AppUuid] || []
    newByAppUuid[permission.AppUuid] = [...existingByAppUuid, permission.uuid]
  }

  return {
    ...state,
    entities: newEntities,
    byFromAccountShortname: newByFromAccountShortname,
    byAppUuid: newByAppUuid,
  }
}

const handleListPermissionsAction = (
  state: CrossAccountPermissionsState,
  action: ListPermissionsAction
): CrossAccountPermissionsState => {
  const newEntities = {...action.permissions}
  const newByShortname = Object.values(action.permissions).reduce((prev, permission) => {
    const {FromAccount} = permission
    if (prev[FromAccount.shortName]) {
      prev[FromAccount.shortName].push(permission.uuid)
    } else {
      prev[FromAccount.shortName] = [permission.uuid]
    }
    return prev
  }, {})
  const newByAppUuid = Object.values(action.permissions).reduce((prev, permission) => {
    const {AppUuid} = permission
    if (AppUuid && prev[AppUuid]) {
      prev[AppUuid].push(permission.uuid)
    } else if (AppUuid) {
      prev[AppUuid] = [permission.uuid]
    }
    return prev
  }, {})
  return {
    ...state,
    entities: newEntities,
    byFromAccountShortname: newByShortname,
    byAppUuid: newByAppUuid,
  }
}

const handleDeletePermissionAction = (
  state: CrossAccountPermissionsState,
  action: DeletePermissionAction
) => {
  const {permission} = action
  const {FromAccount, AppUuid, uuid} = permission
  const newEntities = {...state.entities}
  delete newEntities[uuid]

  const newByShortname = {...state.byFromAccountShortname}
  const existingByShortnameUuids = newByShortname[FromAccount.shortName] || []
  if (existingByShortnameUuids.length) {
    const uuidIndexToDeleteFromByFromShortname = existingByShortnameUuids.indexOf(uuid)
    existingByShortnameUuids.splice(uuidIndexToDeleteFromByFromShortname, 1)
  }

  const newByAppUuid = {...state.byAppUuid}
  const existingByAppUuids = newByAppUuid[AppUuid] || []
  if (existingByAppUuids.length) {
    const uuidToDeleteFromByAppUuid = existingByAppUuids.indexOf(uuid)
    existingByAppUuids.splice(uuidToDeleteFromByAppUuid, 1)
  }

  return {
    ...state,
    entities: newEntities,
    byFromAccountShortname: newByShortname,
    byAppUuid: newByAppUuid,

  }
}

const handlers:
Record<string, (state: CrossAccountPermissionsState, action: CrossAccountPermissionsActions)
=> CrossAccountPermissionsState> = {
  [HANDLE_PERMISSION_ERROR_TYPE]:
      (state: CrossAccountPermissionsState, action: HandlePermissionErrorAction) => ({
        ...state,
        error: {...state.error, ...action.error},
      }),
  [HANDLE_PERMISSION_PENDING_TYPE]:
      (state: CrossAccountPermissionsState, action: HandlePermissionPendingAction) => ({
        ...state,
        pending: {...state.pending, ...action.pending},
      }),
  [LIST_PERMISSIONS_TYPE]: handleListPermissionsAction,
  [DELETE_PERMISSION_TYPE]: handleDeletePermissionAction,
  [CREATE_PERMISSION_TYPE]: handleCreatePermissionAction,
}

const reducer = (state = {...initialState}, action: CrossAccountPermissionsActions) => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }
  return state
}

export {
  reducer,
}

export type {
  CrossAccountPermissionsState,
}
