const PERMITTED_REPO_TYPES = ['app', 'module']

const AVAILABLE_PARTITIONS = [
  'cc.11',
  'cc.12',
  'cc.13',
  'cc.14',
  'cc.15',
]
const getAvailablePartitionId = (devStage: boolean) => {
  if (devStage) {
    return 'cc.sandbox'
  }
  return AVAILABLE_PARTITIONS[Math.floor(AVAILABLE_PARTITIONS.length * Math.random())]
}

type LegacyAppRepoId = {
  store: 'cc'
  partition: '0'
  type: 'app'
  isLegacyFormat: true
  workspace: string
  appName: string
}

type RepoId = {
  store: string
  partition: string
  type: 'module' | 'app'
  isLegacyFormat?: undefined | false
  id: string
}

type RepoIdType = LegacyAppRepoId | RepoId

const parseRepoId = (repoId: string): RepoIdType => {
  const parts = repoId.split('.')
  if (parts.length === 2) {
    return {
      store: 'cc',
      partition: '0',
      type: 'app',
      isLegacyFormat: true,
      workspace: parts[0],
      appName: parts[1],
    }
  }

  if (parts.length !== 4 || parts[0] !== 'cc' || !PERMITTED_REPO_TYPES.includes(parts[2])) {
    throw new Error(`Unexpected repoId format: ${repoId}`)
  }

  const [store, partition, type, id] = parts
  return {store, partition, type, id} as RepoId
}

// NOTE(christoph): When we delete repos, for the first 60 days, we preserve it with a new name
// which makes the repository name not a valid repoId. To decode a deleted repository name,
// we can strip out the prefix and parse the remainder.
const stripDeletedPrefix = (repoId: string) => repoId.replace(/^deleted-\d+-/, '')

const isModuleRepoId = (repoId: string) => repoId.includes('.module.')

export {
  getAvailablePartitionId,
  parseRepoId,
  stripDeletedPrefix,
  isModuleRepoId,
}
