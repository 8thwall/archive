import {useScopedGit} from './use-current-git'

const useGitDeployments = (repoId: string) => (
  useScopedGit(repoId, git => git.deployment)
)

const useHasProductionDeployment = (repoId: string) => (
  !!useScopedGit(repoId, git => git.deployment.production)
)

const useHasNonDevDeployment = (repoId: string) => (
  !!useScopedGit(repoId, git => git.deployment.production || git.deployment.staging)
)

export {
  useGitDeployments,
  useHasNonDevDeployment,
  useHasProductionDeployment,
}
