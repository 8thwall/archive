import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import type {DispatchifiedActions} from '../common/types/actions'
import type {IModuleUser} from '../common/types/models'
import {updateModuleUserAction} from './action-types'
import {errorAction} from '../common/error-action'

const getModuleUser = (uuid: string) => async (dispatch): Promise<IModuleUser> => {
  try {
    const res = await dispatch(authenticatedFetch(`/v1/module-user/${uuid}`, {method: 'GET'}))
    dispatch(updateModuleUserAction(uuid, res))
    return res
  } catch (err) {
    dispatch(errorAction(err.message))
    throw err
  }
}

const updateModuleUser = (
  uuid: string,
  userSpecific: Partial<IModuleUser>
) => async (dispatch): Promise<IModuleUser> => {
  try {
    const res = await dispatch(authenticatedFetch(`/v1/module-user/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify({changes: userSpecific}),
    }))
    dispatch(updateModuleUserAction(uuid, res))
    return res
  } catch (err) {
    dispatch(errorAction(err.message))
    throw err
  }
}

const rawActions = {
  getModuleUser,
  updateModuleUser,
}

type ModuleUserActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)

export {
  rawActions,
}

export type {
  ModuleUserActions,
}
