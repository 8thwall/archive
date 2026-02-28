// type DeploymentStage = 'local' | 'cd' | 'rc' | 'release'
type DeprecatedDeploymentStage = 'local' | 'dev' | 'staging' | 'prod'

type DataRealm = 'qa' | 'prod'
type DeprecatedDataRealm = DeprecatedDeploymentStage

// eslint-disable-next-line max-len
// TODO(kyle): Replace deprecated types: https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/browse/EWPT-411.
type Environment = {
  deploymentStage: DeprecatedDeploymentStage
  dataRealm: DeprecatedDataRealm
}

// eslint-disable-next-line max-len
// TODO(kyle): Remove deprecated types: https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/browse/EWPT-411.
const getDataRealmForDeploymentStage = (
  deploymentStage: DeprecatedDeploymentStage
): DataRealm => {
  switch (deploymentStage) {
    case 'prod':
    case 'staging':
      return 'prod'
    case 'dev':
    case 'local':
      return 'qa'
    default:
      throw new Error(`Invalid deployment stage: ${deploymentStage}`)
  }
}

const getDataRealmForEnvironment = (env: Environment) => (
  getDataRealmForDeploymentStage(env.deploymentStage)
)

export {
  Environment,
  DataRealm,
  DeprecatedDeploymentStage,
  DeprecatedDataRealm,
  getDataRealmForDeploymentStage,
  getDataRealmForEnvironment,
}
