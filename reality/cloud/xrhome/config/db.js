const {getSequelizeOptionsForEnv} = require('./sequelize')

// NOTE(christoph): By specifying dialect: postgres, we are causing an implicit require('pg'), and
// with dialect: sqlite, we are causing an implicit require('sqlite3').

const dbConfigForEnv = (env) => {
  switch (env) {
    case 'test':
      return {
        'username': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'password': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'database': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'dialect': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'storage': ':memory:',
      }
    case 'test-local-pg':
      // This is used by stripe-event-handler tests
      return {
        'username': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'password': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'database': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'host': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'dialect': '<REMOVED_BEFORE_OPEN_SOURCING>',
      }
    case 'dev':
    case 'production':
      return {
        'username': process.env.DB_USERNAME,
        'password': process.env.DB_PASSWORD,
        'database': process.env.DB_NAME,
        'host': process.env.DB_HOSTNAME,
        'dialect': '<REMOVED_BEFORE_OPEN_SOURCING>',
      }
    // See Production Tunnelling in README.md
    case 'production-tunnel': {
      if (!process.env.DB_PASSWORD) {
        throw new Error('DB_PASSWORD must be set')
      }
      return {
        'username': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'password': process.env.DB_PASSWORD,
        'database': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'port': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'host': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'dialect': '<REMOVED_BEFORE_OPEN_SOURCING>',
      }
    }
    case 'development':
    case 'local':
    default:
      return {
        'username': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'password': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'database': '<REMOVED_BEFORE_OPEN_SOURCING>',
        'host': 'xrhome-pgsql-dev.<REMOVED_BEFORE_OPEN_SOURCING>.us-west-2.rds.amazonaws.com',
        'dialect': '<REMOVED_BEFORE_OPEN_SOURCING>',
      }
  }
}

// eslint-disable-next-line consistent-return
module.exports = (envOrCallback) => {
  const env = typeof envOrCallback === 'string' ? envOrCallback : process.env.DATA_REALM || 'local'
  // If env isn't a string, it's either falsy, or a callback function, so we
  // have to pick the env ourselves
  const sequelizeOptions = {
    ...dbConfigForEnv(env),
    ...getSequelizeOptionsForEnv({
      connectionType: env,
      executableName: process.env.EXECUTABLE_NAME,
      deploymentStage: process.env.DEPLOYMENT_STAGE,
    }),
  }
  if (typeof envOrCallback === 'function') {
    envOrCallback(null, sequelizeOptions)
  } else {
    return sequelizeOptions
  }
}
