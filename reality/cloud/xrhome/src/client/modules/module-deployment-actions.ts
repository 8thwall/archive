import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import {errorAction} from '../common/error-action'
import {updateChannelModuleAction, updateHistoryModuleAction} from './action-types'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import type {ModuleHistoryResponse} from '../../shared/module/module-target-api'

const pathForChannelApi = (moduleUuid: string, channelName: string) => (
  `/v1/module-deployment/${moduleUuid}/channel/${channelName}`
)

const fetchModuleChannel = (moduleUuid: string, channelName: string) => async (dispatch) => {
  try {
    return await dispatch(authenticatedFetch(pathForChannelApi(moduleUuid, channelName)))
  } catch (err) {
    if (err.status === 404) {
      return null
    } else {
      throw err
    }
  }
}

const fetchModuleChannels = (moduleUuid: string) => async (dispatch) => {
  try {
    const [beta, release] = await Promise.all([
      dispatch(fetchModuleChannel(moduleUuid, 'beta')),
      dispatch(fetchModuleChannel(moduleUuid, 'release')),
    ])

    dispatch(updateChannelModuleAction(moduleUuid, 'beta', beta || {none: true}))
    dispatch(updateChannelModuleAction(moduleUuid, 'release', release || {none: true}))
  } catch (err) {
    dispatch(errorAction(err.message))
  }
}

const pathForHistoryApi = (moduleUuid: string) => (
  `/v1/module-deployment/${moduleUuid}/history`
)

const fetchModuleHistory = (moduleUuid: string): AsyncThunk => async (dispatch) => {
  try {
    const res = await dispatch(
      authenticatedFetch<ModuleHistoryResponse>(pathForHistoryApi(moduleUuid))
    )

    dispatch(updateHistoryModuleAction(moduleUuid, res.history))
  } catch (err) {
    dispatch(errorAction(err.message))
  }
}

const deployModuleChannel = (moduleUuid: string, channelName: string, masterCommit: string) => (
  async (dispatch) => {
    try {
      const res = await dispatch(authenticatedFetch(pathForChannelApi(moduleUuid, channelName), {
        method: 'POST',
        body: JSON.stringify({
          target: {
            type: 'commit',
            branch: 'master',
            commit: masterCommit,
          },
        }),
      }))

      dispatch(updateChannelModuleAction(moduleUuid, channelName, res))
    } catch (err) {
      dispatch(errorAction(err.message))
    }
  }
)

const rawActions = {
  fetchModuleChannels,
  deployModuleChannel,
  fetchModuleHistory,
}

type ModuleActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)

export {
  rawActions,
}

export type {
  ModuleActions,
}
