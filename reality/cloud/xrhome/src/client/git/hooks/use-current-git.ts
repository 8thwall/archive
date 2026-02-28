import type {DeepReadonly} from 'ts-essentials'

import {useSelector} from '../../hooks'
import type {IG8Client, IGit} from '../g8-dto'
import {getActiveClient} from '../git-checks'
import type {RepoState} from '../git-redux-types'
import {useCurrentRepoId} from '../repo-id-context'
import {getRepoState} from '../repo-state'

type GitSelector<T> = (git: DeepReadonly<IGit>) => T

function useScopedGit(repoId: string): RepoState
// eslint-disable-next-line no-redeclare
function useScopedGit<T>(repoId: string, selector: GitSelector<T>): T
// eslint-disable-next-line no-redeclare
function useScopedGit<T>(repoId: string, selector?: GitSelector<T>) {
  return useSelector((s) => {
    if (!repoId) {
      return null
    }
    const git = getRepoState(s, repoId)
    if (selector) {
      return selector(git)
    } else {
      return git
    }
  })
}

function useCurrentGit(): RepoState
// eslint-disable-next-line no-redeclare
function useCurrentGit<T>(selector: GitSelector<T>): T
// eslint-disable-next-line no-redeclare
function useCurrentGit<T>(selector?: GitSelector<T>) {
  const repoId = useCurrentRepoId()
  return useSelector((s) => {
    const git = getRepoState(s, repoId)
    if (selector) {
      return selector(git)
    } else {
      return git
    }
  })
}

const useGitClients = (): DeepReadonly<IG8Client[]> => useCurrentGit(git => git.clients)
const useGitRemoteClients = (): DeepReadonly<IG8Client[]> => useCurrentGit(git => git.remoteClients)
const useGitActiveClient = (): DeepReadonly<IG8Client> => useCurrentGit(getActiveClient)

const useScopedGitActiveClient = (repoId: string) => useScopedGit(repoId, getActiveClient)

const useGitNeedsSync = () => useCurrentGit((git) => {
  const client = getActiveClient(git)
  const {logs} = git
  return (
    client && logs && logs.findIndex(l => l.id === client.forkId) !== 0
  )
})

const useGitHasConflicts = () => useCurrentGit(git => (
  git.conflicts.some(c => c.status === 1)
))

const useGitRepo = () => useCurrentGit(git => git.repo)
const useGitProgress = () => useCurrentGit(git => git.progress)
const useGitLoaded = () => useCurrentGit(git => git.progress.load === 'DONE')
const useGitLoadProgress = () => useCurrentGit(git => git.progress.load || 'UNSPECIFIED')
const useGitConflicts = () => useCurrentGit(git => git.conflicts)
const useGitDiff = () => useCurrentGit(git => git.diff)
const useGitChangesets = () => useCurrentGit(git => git.changesets)

const useGitFile = (filePath: string) => useCurrentGit(git => git.filesByPath[filePath])
const useScopedGitFile = (repoId: string, path: string) => (
  useScopedGit(repoId, g => g.filesByPath[path])
)

const useGitFileContent = (filePath: string) => (
  useCurrentGit(git => git.filesByPath[filePath]?.content)
)

export {
  useScopedGit,
  useCurrentGit,
  useGitActiveClient,
  useGitNeedsSync,
  useGitClients,
  useGitRemoteClients,
  useGitHasConflicts,
  useGitRepo,
  useGitProgress,
  useGitLoadProgress,
  useGitLoaded,
  useGitConflicts,
  useGitDiff,
  useGitChangesets,
  useGitFile,
  useGitFileContent,
  useScopedGitFile,
  useScopedGitActiveClient,
}
