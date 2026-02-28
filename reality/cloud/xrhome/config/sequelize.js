const getApplicationName = (executableName, deploymentStage) => {
  let applicationName
  if (executableName && deploymentStage) {
    applicationName = `${executableName}_${deploymentStage}`
    try {
      if (Build8.VERSION_ID) {
        applicationName += `_${Build8.VERSION_ID}`
      }
    } catch (e) {
      // continue regardless of error
    }
  }
  return applicationName
}

const sanitizeDbSecret = dbSecret => ({
  username: dbSecret.username,
  password: dbSecret.password,
  database: dbSecret.dbname,
  host: dbSecret.host,
  dialect: dbSecret.engine,
})

const getSequelizeOptionsForEnv = ({connectionType, executableName, deploymentStage}) => {
  switch (connectionType) {
    case 'test':
    case 'test-local-pg':
      return {
        logging: false,
      }
    case 'production':
      return {
        dialectOptions: {
          application_name: getApplicationName(executableName, deploymentStage),
        },
        logging: false,
      }
    case 'production-tunnel':
      return {
        dialectOptions: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    case 'development':
    case 'local':
    case 'dev':
      return {
        dialectOptions: {
          ssl: {
            rejectUnauthorized: true,
            // eslint-disable-next-line global-require, import/extensions,import/no-unresolved
            ca: [Buffer.from(require('../certs/rds/global-bundle.pem.js'))],
          },
          application_name: getApplicationName(executableName, deploymentStage),
        },
        logging: false,
      }
    default:
      throw new Error('Found unknown connection type when constructing sequelize options.')
  }
}
module.exports = {getSequelizeOptionsForEnv, sanitizeDbSecret}
