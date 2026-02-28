import type {DeepReadonly as RO} from 'ts-essentials'

import type {
  IDeployment, IDiffInfo, IG8Changeset, IG8GitProgress, IGit, IRepo,
} from './g8-dto'

type RepoState = RO<IGit & {
  msg: string
}>

type ActionBase = {appUuid?: string, repoId?: string}  // TODO(christoph): Make repoId required

type GitClearAction = ActionBase & {type: 'GIT_CLEAR'}
type GitUpdateAction = ActionBase & {type: 'GIT_UPDATE', git: Partial<IGit>, context: string}
type GitRepoAction = ActionBase & {type: 'GIT_REPO', repo: IRepo}
type GitDeploymentAction = ActionBase & {
  type: 'GIT_DEPLOYMENT'
  deployment: RO<Partial<IDeployment>>
}
type GitProgressAction = ActionBase & {type: 'GIT_PROGRESS', progress: Partial<RO<IG8GitProgress>>}
type GitDiffAction = ActionBase & {type: 'GIT_DIFF', diff: RO<IDiffInfo>}
type GitErrorAction = ActionBase & {type: 'GIT_ERROR', msg: string}
type GitErrorClearAction = ActionBase & {type: 'GIT_ERROR_CLEAR'}
type GitChangesetsAction = ActionBase & {
  type: 'GIT_CHANGESETS'
  changesets: RO<Record<string, IG8Changeset>>
}

type GitAction = GitClearAction | GitUpdateAction | GitRepoAction | GitChangesetsAction |
                 GitDeploymentAction |GitProgressAction |GitDiffAction |
                 GitErrorAction | GitErrorClearAction

export type {
  RepoState,
  GitAction,
  GitClearAction,
  GitUpdateAction,
  GitRepoAction,
  GitChangesetsAction,
  GitDeploymentAction,
  GitProgressAction,
  GitDiffAction,
  GitErrorAction,
  GitErrorClearAction,
}
