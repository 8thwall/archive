import type {RequestInit} from '../common/public-api-fetch'
import type {
  InitializeResponse, FileSnapshotResponse,
  ListProjectsResponse,
  NewProjectLocationResponse,
} from '../../shared/studiohub/local-sync-types'
import {isAssetPath} from '../common/editor-files'
import {basename} from '../editor/editor-common'

const API = Build8.PLATFORM_TARGET === 'desktop' ? 'file-sync://' : 'https://0.0.0.0:9033'
const APP_UUID = 'studiohub'

// eslint-disable-next-line arrow-parens
const fetchJson = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`fetch error status code: ${response.status}, ${response.statusText}`)
  }
  return response.json()
}

const initializeLocal = (appKey: string, appName?: string | undefined) => {
  const params = new URLSearchParams({
    appKey,
    appUuid: APP_UUID,
  })
  if (appName) {
    params.append('appName', appName)
  }
  return fetchJson<InitializeResponse>(`${API}/project/init-local?${params}`, {method: 'POST'})
}

const setProjectInitialized = (appKey: string) => {
  const params = new URLSearchParams({
    appKey,
    appUuid: APP_UUID,
  })
  return fetchJson<{}>(`${API}/project/init-local?${params}`, {method: 'PATCH'})
}

const watchLocal = (appKey: string) => {
  const params = new URLSearchParams({
    appKey,
    appUuid: APP_UUID,
  })
  return fetchJson<{}>(`${API}/project/watch-local?${params}`, {
    method: 'POST',
    body: JSON.stringify({appUuid: APP_UUID, appKey}),
  })
}

const stopWatchLocal = (appKey: string) => {
  const params = new URLSearchParams({
    appKey,
    appUuid: APP_UUID,
  })
  return fetchJson<{}>(`${API}/project/watch-local?${params}`, {
    method: 'DELETE',
    body: JSON.stringify({appUuid: APP_UUID, appKey}),
  })
}

const pushFile = async (
  appKey: string, path: string, content: RequestInit['body']
) => {
  const params = new URLSearchParams({
    appKey,
    path,
    appUuid: APP_UUID,
  })

  return fetchJson<{}>(`${API}/file?${params}`, {
    method: 'POST',
    body: content,
  })
}

const makeLocalAssetUrl = (appKey: string, path: string, version: string | undefined) => (
  `${API}/file/direct/${appKey}/${APP_UUID}/${version || 0}/${path}`
)

const makeLocalFileUrl = (appKey: string, path: string, version: string | undefined) => {
  const params = new URLSearchParams({
    appKey,
    path,
    appUuid: APP_UUID,
  })
  if (version) {
    params.append('v', version)
  }
  return `${API}/file?${params}`
}

const pullSrcFile = async (appKey: string, path: string): Promise<string> => {
  if (isAssetPath(path) && basename(path) !== '.main') {
    throw new Error('Cannot pull asset files using pullSrcFile')
  }

  const res = await fetch(makeLocalFileUrl(appKey, path, undefined))

  if (!res.ok) {
    throw new Error(`fetch error status code: ${res.status}, ${res.statusText}`)
  }

  return res.text()
}

const pullAssetFile = async (appKey: string, path: string): Promise<Blob> => {
  if (!isAssetPath(path)) {
    throw new Error('Cannot pull non-assets files using pullAssetFile')
  }

  const res = await fetch(makeLocalFileUrl(appKey, path, undefined))

  if (!res.ok) {
    throw new Error(`fetch error status code: ${res.status}, ${res.statusText}`)
  }

  return res.blob()
}

const deleteLocalFile = (appKey: string, path: string) => {
  const params = new URLSearchParams({
    appKey,
    path,
    appUuid: APP_UUID,
  })
  return fetchJson<{}>(`${API}/file?${params}`, {method: 'DELETE'})
}

const getFileStateSnapshot = (appKey: string) => {
  const params = new URLSearchParams({
    appKey,
    appUuid: APP_UUID,
  })
  return fetchJson<FileSnapshotResponse>(`${API}/file/snapshot?${params}`)
}

const getFileMetadata = () => {
  // TODO
}

interface ProjectStatusResponse {
  buildUrl: string
  buildRemoteUrl: string
}

const getProjectStatus = (appKey: string) => {
  const params = new URLSearchParams({
    appKey,
    appUuid: APP_UUID,
  })
  return fetchJson<ProjectStatusResponse>(`${API}/project/project-status?${params}`)
}

const getFileHash = async (appKey: string, path: string): Promise<string> => {
  const params = new URLSearchParams({
    appKey,
    path,
    appUuid: APP_UUID,
  })

  const res = await fetch(`${API}/file/hash/sha256?${params}`)
  if (!res.ok) {
    throw new Error(`fetch error status code: ${res.status}, ${res.statusText}`)
  }
  const data = await res.json()
  if (typeof data.hash !== 'string') {
    throw new Error('Invalid response from file hash endpoint')
  }
  return data.hash
}

const showFile = (appKey: string, path: string) => {
  const params = new URLSearchParams({
    appKey,
    path,
    appUuid: APP_UUID,
  })
  return fetchJson<{}>(`${API}/file/show?${params}`, {method: 'POST'})
}

const openFile = (appKey: string, path: string) => {
  const params = new URLSearchParams({
    appKey,
    path,
    appUuid: APP_UUID,
  })
  return fetchJson<{}>(`${API}/file/open?${params}`, {method: 'POST'})
}

const listProjects = () => fetchJson<ListProjectsResponse>(
  `${API}/project/list`, {method: 'GET'}
)

const showProject = (appKey: string) => {
  const params = new URLSearchParams({
    appKey,
    appUuid: APP_UUID,
  })

  return fetchJson<{}>(`${API}/project/reveal-in-finder?${params}`, {method: 'POST'})
}

const openProject = (appKey: string) => {
  const params = new URLSearchParams({
    appKey,
    appUuid: APP_UUID,
  })

  return fetchJson<{}>(`${API}/project/open?${params}`, {method: 'POST'})
}

const deleteProject = (appKey: string) => {
  const params = new URLSearchParams({
    appKey,
    appUuid: APP_UUID,
  })

  return fetchJson<{}>(
    `${API}/project/delete?${params}`, {method: 'DELETE'}
  )
}
const listFileDirectory = (appKey: string, path: string) => {
  const params = new URLSearchParams({
    appKey,
    path,
    appUuid: APP_UUID,
  })
  return fetchJson<{contents: string[]}>(`${API}/file/directory?${params}`)
}

const moveProject = (appKey: string, newLocation?: string) => {
  const params = new URLSearchParams({
    appKey,
    appUuid: APP_UUID,
  })

  if (newLocation) {
    params.append('newLocation', newLocation)
  }

  return fetchJson<{}>(
    `${API}/project/move?${params}`, {method: 'PATCH'}
  )
}

const pickNewProjectLocation = (appKey: string) => {
  const params = new URLSearchParams({
    appKey,
    appUuid: APP_UUID,
  })

  return fetchJson<NewProjectLocationResponse>(
    `${API}/project/pick-new-location?${params}`, {method: 'PATCH'}
  )
}

export {
  initializeLocal,
  setProjectInitialized,
  watchLocal,
  stopWatchLocal,
  getFileStateSnapshot,
  pushFile,
  pullSrcFile,
  pullAssetFile,
  getFileHash,
  deleteLocalFile,
  getFileMetadata,
  getProjectStatus,
  makeLocalFileUrl,
  showFile,
  openFile,
  listProjects,
  showProject,
  openProject,
  deleteProject,
  makeLocalAssetUrl,
  moveProject,
  pickNewProjectLocation,
  listFileDirectory,
}
