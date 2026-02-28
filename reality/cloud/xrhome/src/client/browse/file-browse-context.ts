import * as React from 'react'

type FileBrowseBranch = 'master' | 'default' | 'published' | ''

interface IFileBrowseContext {
  appOrModuleUuid: string
  rootName: string
  commitHash: string
  path: string  // starts with /
  isPrivate?: boolean
  branch: string
  pathSegment?: string
  routePrefix?: string
  onNavigationChange?: (branch: string, path: string) => void
  repoId?: string
  isModule?: boolean
}

const FileBrowseContext = React.createContext<Partial<IFileBrowseContext>>({
  isPrivate: false,
  branch: '',
})

export default FileBrowseContext

export type {
  FileBrowseBranch,
}
