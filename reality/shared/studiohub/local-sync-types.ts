import type {UnixPath} from './unix-path'

type Project = {
  appKey: string
  location: string
  initialization: 'needs-initialization' | 'done'
}

type ProjectClientSide = Omit<Project, 'appKey'> & {
  validLocation: boolean
}

type LocalSyncFileChanged = {
  action: 'STUDIO_FILE_CHANGE'
  appKey: string
  path: UnixPath
  content: string
}

type LocalSyncFileDeleted = {
  action: 'STUDIO_FILE_DELETE'
  appKey: string
  path: UnixPath
}

type LocalSyncDirChanged = {
  action: 'STUDIO_DIR_CHANGE'
  appKey: string
  change: 'created' | 'deleted'
  path: UnixPath
}

type LocalSyncAssetChanged = {
  action: 'STUDIO_ASSET_CHANGE'
  appKey: string
  change: 'created' | 'modified' | 'deleted'
  path: UnixPath
}

type LocalSyncInvalidFile = {
  action: 'STUDIO_INVALID_FILE'
  appKey: string
  path: UnixPath
}

type LocalSyncConnectFileWatch = {
  action: 'LOCAL_CONNECT_FILE_WATCH'
  appKey: string
}

type LocalSyncCloseFileWatch = {
  action: 'LOCAL_CLOSE_FILE_WATCH'
  appKey: string
}

type LocalSyncMessage = LocalSyncFileChanged | LocalSyncFileDeleted | LocalSyncDirChanged
  | LocalSyncAssetChanged | LocalSyncInvalidFile
  | LocalSyncConnectFileWatch | LocalSyncCloseFileWatch

type InitializeResponse = {
  projectPath: string
  initialized: boolean
}

type FileSnapshotResponse = {
  timestampsByPath: {[path: UnixPath]: number}
  invalidPaths: UnixPath[]
}

type ListProjectsResponse = {
  projectByAppKey: {[appKey: string]: ProjectClientSide}
}

type NewProjectLocationResponse = {
  projectPath: string
}

export type {
  Project,
  ProjectClientSide,
  LocalSyncFileChanged,
  LocalSyncFileDeleted,
  LocalSyncDirChanged,
  LocalSyncAssetChanged,
  LocalSyncInvalidFile,
  LocalSyncMessage,
  InitializeResponse,
  FileSnapshotResponse,
  ListProjectsResponse,
  NewProjectLocationResponse,
  UnixPath,
}
