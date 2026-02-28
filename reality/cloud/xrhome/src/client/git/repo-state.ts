import type {RootState} from '../reducer'
import type {IRepo} from './g8-dto'
import type {RepoState} from './git-redux-types'

const INITIAL_REPO_STATE: RepoState = {
  repo: null,
  files: [],
  filesByPath: {},
  filePaths: [],
  childrenByPath: {},
  topLevelPaths: [],
  logs: [],
  changesets: {},
  clients: [],
  remoteClients: [],
  deployment: {
    master: null,
    staging: null,
    production: null,
  },
  merges: null,
  mergeId: null,
  inspectResult: [],
  // consult IG8GitProgress in g8-dto.ts
  progress: {
    client: 'UNSPECIFIED',
    land: 'UNSPECIFIED',
    load: 'UNSPECIFIED',
    save: 'UNSPECIFIED',
    sync: 'UNSPECIFIED',
    diff: 'UNSPECIFIED',
  },
  diff: {
    diffList: [],
    blobContents: {},
  },
  conflicts: [],
  appUuid: null,
  msg: '',
}

type OuterState = Pick<RootState, 'git'>

const getRepoState = (provider: OuterState | (() => OuterState), repo: string | IRepo = null) => {
  const state = typeof provider === 'function' ? provider() : provider
  const gitState = state.git
  const repoId = typeof repo === 'string' ? repo : repo?.repoId

  return gitState?.byRepoId[repoId] || INITIAL_REPO_STATE
}

export {
  getRepoState,
  INITIAL_REPO_STATE,
}
