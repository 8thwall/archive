const cognitoConfig = require('./cognito-config').getConfig()
const rawConfig = require('./aws-base-config')

module.exports = {
  ...cognitoConfig,
  ...rawConfig,
}
