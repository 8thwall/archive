import type {Expanse} from '@ecs/shared/scene-graph'
import {stringToBytes} from '@ecs/shared/data'

import {dispatchify} from '../../common'
import authenticatedFetch from '../../common/authenticated-fetch'
import type {AsyncThunk, DispatchifiedActions} from '../../common/types/actions'

const getUploadUrl = (repoId: string) => (dispatch, getState) => {
  const params = new URLSearchParams({selectedAccountUuid: getState().accounts.selectedAccount})
  return dispatch(
    authenticatedFetch(`/v1/history-storage/upload/${repoId}?${params.toString()}`, {
      method: 'GET',
    })
  )
}

const uploadHistory = (
  repoId: string, data: Uint8Array
): AsyncThunk<string> => async (dispatch) => {
  const {uploadUrl, versionId} = await dispatch(getUploadUrl(repoId))
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    body: data,
    headers: {
      'Content-Type': 'application/octet-stream',
      // eslint-disable-next-line local-rules/hardcoded-copy
      'Cache-Control': 'max-age=86400',
    },
  })
  if (!uploadRes.ok) {
    throw new Error(`${uploadRes.statusText}`)
  }
  return versionId
}

const getDownloadUrl = (repoId: string, versionId: string) => (dispatch, getState) => {
  const params = new URLSearchParams({selectedAccountUuid: getState().accounts.selectedAccount})

  return dispatch(
    authenticatedFetch(`/v1/history-storage/download/${repoId}/${versionId}?${params}`, {
      method: 'GET',
    })
  )
}

const downloadHistory = (
  repoId: string, versionId: string
): AsyncThunk<Uint8Array | undefined> => async (dispatch) => {
  const {downloadUrl} = await dispatch(getDownloadUrl(repoId, versionId))
  const downloadRes = await fetch(downloadUrl)
  if (!downloadRes.ok) {
    throw new Error(`${downloadRes.statusText}`)
  }
  return new Uint8Array(await downloadRes.arrayBuffer())
}

const loadHistoryFromExpanse = (
  repoId: string, expanse: Expanse
): AsyncThunk<{historyVersion?: string, file: Uint8Array} | null> => async (dispatch) => {
  const {historyVersion, history} = expanse
  if (historyVersion) {
    return {historyVersion, file: await dispatch(downloadHistory(repoId, historyVersion))}
  } else if (history) {
    return {file: stringToBytes(history)}
  } else {
    return null
  }
}

const rawActions = {
  uploadHistory,
  downloadHistory,
}

type AutomergeStorageActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)

export {
  AutomergeStorageActions,
  rawActions,
  uploadHistory,
  downloadHistory,
  loadHistoryFromExpanse,
}
