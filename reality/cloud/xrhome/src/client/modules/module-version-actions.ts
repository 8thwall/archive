import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import type {DispatchifiedActions} from '../common/types/actions'
import type {ModuleTarget, ModuleVersionTarget} from '../../shared/module/module-target'
import {errorAction} from '../common/error-action'
import {
  newVersionModuleAction, patchVersionModuleAction, updateVersionModuleAction,
} from './action-types'
import type {VersionInfo, VersionPatchBody} from '../../shared/module/module-target-api'
import {publicApiFetch} from '../common/public-api-fetch'

const pathForVersionApi = (moduleUuid: string) => `/v1/module-deployment/${moduleUuid}/version`
const pathForPublicVersionApi = (moduleUuid: string) => `/public-modules/deployments/${moduleUuid}`

const fetchModuleVersions = (moduleUuid: string) => async (dispatch) => {
  try {
    const res = await dispatch(
      authenticatedFetch(pathForVersionApi(moduleUuid))
    )
    dispatch(updateVersionModuleAction(moduleUuid, res.versions, res.preVersions))
  } catch (err) {
    dispatch(errorAction(err.message))
  }
}

const fetchPublicModuleVersions = (moduleUuid: string) => async (dispatch) => {
  try {
    const res = await dispatch(publicApiFetch(pathForPublicVersionApi(moduleUuid)))
    dispatch(updateVersionModuleAction(moduleUuid, res.versions, res.preVersions))
  } catch (err) {
    dispatch(errorAction(err.message))
  }
}

const patchModuleVersion = (
  moduleId: string, target: ModuleVersionTarget, patchBody: VersionPatchBody
) => (
  async (dispatch) => {
    try {
      const res = await dispatch(authenticatedFetch(`/v1/module-deployment/${moduleId}/version`, {
        method: 'PATCH',
        body: JSON.stringify({patch: {...patchBody}, target}),
      }))

      dispatch(patchVersionModuleAction(moduleId, res))
    } catch (err) {
      dispatch(errorAction(err.message))
    }
  }
)

const deployModuleVersion = (
  moduleUuid: string,
  versionMessage: string,
  versionDescription: string,
  version: ModuleVersionTarget,
  target: ModuleTarget
) => async (dispatch) => {
  try {
    const res = await dispatch(authenticatedFetch<VersionInfo>(pathForVersionApi(moduleUuid), {
      method: 'POST',
      body: JSON.stringify({
        versionMessage,
        versionDescription,
        target,
        version,
      }),
    }))

    dispatch(newVersionModuleAction(moduleUuid, res))
  } catch (err) {
    dispatch(errorAction(err.message))
  }
}
const rawActions = {
  fetchModuleVersions,
  fetchPublicModuleVersions,
  deployModuleVersion,
  patchModuleVersion,
}

type ModuleVersionActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)

export {
  rawActions,
}

export type {
  ModuleVersionActions,
}
