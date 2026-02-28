import type {DeepReadonly} from 'ts-essentials'

import type {GitAction, RepoState} from './git-redux-types'
import {INITIAL_REPO_STATE} from './repo-state'

type GitReduxState = DeepReadonly<{
  byRepoId: Record<string, RepoState>
}>

const EMPTY_GIT_REDUX_STATE: GitReduxState = {
  byRepoId: {},
}

// Gets the current git state for the scope or returns an empty state.
const repoStateForRepoId = (
  state: GitReduxState,
  repoId: string
): RepoState => (
  (repoId && state.byRepoId[repoId]) ||
  INITIAL_REPO_STATE
)

let didLogMissing = false

const updateRepoState = (
  state: GitReduxState,
  repoId: string,
  update: Partial<RepoState>
): GitReduxState => {
  if (!repoId) {
    if (!didLogMissing) {
      didLogMissing = true
      // eslint-disable-next-line no-console
      console.error('Missing repo ID for state update:', update)
    }
    return state
  }
  const repoState = repoStateForRepoId(state, repoId)
  const repoStateWithUpdate = {...repoState, ...update}
  const byRepoIdWithUpdate = {...state.byRepoId, [repoId]: repoStateWithUpdate}

  return {...state, byRepoId: byRepoIdWithUpdate}
}

const Reducer = (
  state: GitReduxState = EMPTY_GIT_REDUX_STATE,
  action: GitAction
): GitReduxState => {
  const {type, repoId} = action

  switch (type) {
    // Clear all git state for the scope.
    case 'GIT_CLEAR': {
      const initialState = {...INITIAL_REPO_STATE}
      // For scoped git, the repo remains the same, so we don't have to update it.
      // This is because a lot of core logic depends on us mapping from repo Id to repo,
      // and we know this will not change.
      delete initialState.repo
      return updateRepoState(state, repoId, initialState)
    }

    // Update subfields of action.git within the state. This allows for updating multiple fields
    // simultaneously. Only subfields that are part of initialState will be updated.
    case 'GIT_UPDATE': {
      const updatedState = {...action.git}
      Object.keys(updatedState).forEach(
        (k) => { if (!(k in INITIAL_REPO_STATE)) { delete updatedState[k] } }
      )
      return updateRepoState(state, repoId, updatedState)
    }

    // Set the git repo information. If the repo differs from the current repo, all other git info
    // will be set to the initial state.
    case 'GIT_REPO': {
      const scopeState = repoStateForRepoId(state, repoId)

      // If we are in the middle of loading a repo, don't re-set the loading progress.
      const progress = {...scopeState.progress}
      if (scopeState.progress.load === 'START') {
        progress.load = 'START'
      }
      return updateRepoState(state, repoId, {...scopeState, repo: action.repo, progress})
    }

    case 'GIT_CHANGESETS': {
      return updateRepoState(state, repoId, {changesets: action.changesets})
    }

    case 'GIT_DEPLOYMENT': {
      const scopedState = repoStateForRepoId(state, repoId)
      return updateRepoState(state, repoId, {
        deployment: {...scopedState.deployment, ...action.deployment},
      })
    }

    case 'GIT_PROGRESS': {
      const updatedProgress = {...action.progress}
      Object.keys(updatedProgress).forEach(
        (k) => { if (!(k in INITIAL_REPO_STATE.progress)) { delete updatedProgress[k] } }
      )
      return updateRepoState(state, repoId, {
        progress: {
          ...repoStateForRepoId(state, repoId).progress,
          ...updatedProgress,
        },
      })
    }

    case 'GIT_DIFF': {
      return updateRepoState(state, repoId, {
        diff: action.diff,
      })
    }

    case 'GIT_ERROR': {
      return updateRepoState(state, repoId, {msg: action.msg})
    }

    case 'GIT_ERROR_CLEAR': {
      return updateRepoState(state, repoId, {msg: ''})
    }

    default:
      return state
  }
}

export default Reducer

// NOTE(pawel) These are exported so that the top level reducer can be typed.
export type {
  GitReduxState,
  GitAction,
}
