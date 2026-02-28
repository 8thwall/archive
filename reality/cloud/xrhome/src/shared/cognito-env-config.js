const {getConfig} = require('./cognito-config')

const cognitoConfigForEnv = (env) => {
  const realm = env && env.dataRealm
  switch (realm) {
    case 'local':
    case 'dev':
      return getConfig(false)
    case 'prod':
    case 'staging':
      return getConfig(true)
    default:
      throw new Error(`Unexpected data realm: ${realm}`)
  }
}

module.exports = {
  cognitoConfigForEnv,
}
