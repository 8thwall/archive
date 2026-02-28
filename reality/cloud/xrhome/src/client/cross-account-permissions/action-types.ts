import type {ICrossAccountPermission} from '../common/types/models'

const LIST_PERMISSIONS_TYPE = 'PERMISSIONS/LIST'
const DELETE_PERMISSION_TYPE = 'PERMISSION/DELETE'
const HANDLE_PERMISSION_PENDING_TYPE = 'PERMISSION/PENDING'
const HANDLE_PERMISSION_ERROR_TYPE = 'PERMISSION/ERROR'
const CREATE_PERMISSION_TYPE = 'PERMISSION/CREATE'

type CrossAccountPermissionsActionType = typeof DELETE_PERMISSION_TYPE |
  typeof HANDLE_PERMISSION_PENDING_TYPE | typeof HANDLE_PERMISSION_ERROR_TYPE |
  typeof LIST_PERMISSIONS_TYPE | typeof CREATE_PERMISSION_TYPE

interface ListPermissionsAction {
  type: typeof LIST_PERMISSIONS_TYPE
  permissions: Record<string, ICrossAccountPermission>
}
interface DeletePermissionAction {
  type: typeof DELETE_PERMISSION_TYPE
  permission: ICrossAccountPermission
}

type CrossAccountPermissionErrorState =
  'removePermission' | 'listPermissions' | 'createPermission' | 'acceptPermission'
type CrossAccountPermissionsPendingState = CrossAccountPermissionErrorState

interface HandlePermissionPendingAction {
  type: typeof HANDLE_PERMISSION_PENDING_TYPE
  pending: Partial<Record<CrossAccountPermissionsPendingState, boolean>>
}

interface HandlePermissionErrorAction {
  type: typeof HANDLE_PERMISSION_ERROR_TYPE
  error: Partial<Record<CrossAccountPermissionErrorState, boolean | string>>
}
interface CreatePermissionAction {
  type: typeof CREATE_PERMISSION_TYPE
  permission: ICrossAccountPermission
}

type CrossAccountPermissionsActions = DeletePermissionAction | HandlePermissionPendingAction |
  HandlePermissionErrorAction | ListPermissionsAction | CreatePermissionAction

const listPermissionsAction = (permissions: Record<string, ICrossAccountPermission>):
ListPermissionsAction => ({
  type: LIST_PERMISSIONS_TYPE,
  permissions,
})

const deletePermissionAction = (permission: ICrossAccountPermission): DeletePermissionAction => ({
  type: DELETE_PERMISSION_TYPE,
  permission,
})

const handlePermissionPendingAction =
  (pending: Partial<Record<CrossAccountPermissionsPendingState, boolean>>) => ({
    type: HANDLE_PERMISSION_PENDING_TYPE,
    pending,
  })

const handlePermissionErrorAction =
  (error: Partial<Record<CrossAccountPermissionErrorState, boolean | string>>) => ({
    type: HANDLE_PERMISSION_ERROR_TYPE,
    error,
  })

const createPermissionAction = (permission: ICrossAccountPermission): CreatePermissionAction => ({
  type: CREATE_PERMISSION_TYPE,
  permission,
})

export {
  LIST_PERMISSIONS_TYPE,
  CREATE_PERMISSION_TYPE,
  DELETE_PERMISSION_TYPE,
  HANDLE_PERMISSION_PENDING_TYPE,
  HANDLE_PERMISSION_ERROR_TYPE,
  listPermissionsAction,
  deletePermissionAction,
  handlePermissionPendingAction,
  handlePermissionErrorAction,
  createPermissionAction,
}

export type {
  CrossAccountPermissionErrorState,
  CrossAccountPermissionsPendingState,
  CrossAccountPermissionsActionType,
  ListPermissionsAction,
  DeletePermissionAction,
  HandlePermissionPendingAction,
  HandlePermissionErrorAction,
  CreatePermissionAction,
  CrossAccountPermissionsActions,
}
