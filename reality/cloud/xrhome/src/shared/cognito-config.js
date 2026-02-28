const USE_PROD = require('./use-prod')

// These config values are hardcoded although their resources are managed
// via CloudFormation because we don't want to delete our cognito user
// pools and lose our users.
const prodCognito = {
  UserPoolId: 'us-west-2_<REMOVED_BEFORE_OPEN_SOURCING>',
  ClientId: '<REMOVED_BEFORE_OPEN_SOURCING>',
}

const testCognito = {
  UserPoolId: 'us-west-2_<REMOVED_BEFORE_OPEN_SOURCING>',
  ClientId: '<REMOVED_BEFORE_OPEN_SOURCING>',
}

const getConfig = (isProd = USE_PROD) => (
  isProd ? prodCognito : testCognito
)

module.exports = {
  getConfig,
}
