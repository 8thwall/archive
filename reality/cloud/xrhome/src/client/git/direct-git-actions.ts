import type {DeepReadonly as RO} from 'ts-essentials'

import type {
  GitChangesetsAction, GitClearAction, GitDeploymentAction, GitDiffAction,
  GitErrorAction, GitErrorClearAction, GitProgressAction, GitRepoAction,
  GitUpdateAction,
} from './git-redux-types'

import type {
  IDeployment, IDiffInfo, IG8Changeset, IG8GitProgress, IGit, IRepo,
} from './g8-dto'

const gitUpdateAction = (
  repoId: string, context: string, git: Partial<IGit>
): GitUpdateAction => ({
  type: 'GIT_UPDATE', repoId, context, git,
})

const gitRepoAction = (repoId: string, repo: RO<IRepo>): GitRepoAction => ({
  type: 'GIT_REPO' as const, repoId, repo,
})

const gitChangesetsAction = (
  repoId: string, changesets: RO<Record<string, IG8Changeset>>
): GitChangesetsAction => ({
  type: 'GIT_CHANGESETS' as const, repoId, changesets,
})

const gitDeploymentAction = (
  repoId: string, deployment: RO<Partial<IDeployment>>
): GitDeploymentAction => ({
  type: 'GIT_DEPLOYMENT' as const, repoId, deployment,
})

const gitProgressAction = (
  repoId: string, progress: Partial<RO<IG8GitProgress>>
): GitProgressAction => ({
  type: 'GIT_PROGRESS' as const, repoId, progress,
})

const gitDiffAction = (
  repoId: string, diff: RO<IDiffInfo>
): GitDiffAction => ({
  type: 'GIT_DIFF' as const, repoId, diff,
})

const gitErrorAction = (
  repoId: string, msg: string
): GitErrorAction => ({
  type: 'GIT_ERROR' as const, repoId, msg,
})

const gitErrorClearAction = (
  repoId: string
): GitErrorClearAction => ({
  type: 'GIT_ERROR_CLEAR' as const, repoId,
})

const gitClearAction = (repoId: string): GitClearAction => ({
  type: 'GIT_CLEAR', repoId,
})

export {
  gitClearAction,
  gitUpdateAction,
  gitRepoAction,
  gitChangesetsAction,
  gitDeploymentAction,
  gitProgressAction,
  gitDiffAction,
  gitErrorAction,
  gitErrorClearAction,
}
