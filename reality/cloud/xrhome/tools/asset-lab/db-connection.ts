import {GetSecretValueCommand, SecretsManagerClient} from '@aws-sdk/client-secrets-manager'

import dbConfigForEnv from '../../config/db'
import {Db} from '../../src/shared/integration/db/db-api'
import {createDb} from '../../src/shared/integration/db/db-impl'

const SecretsManager = new SecretsManagerClient({region: 'us-west-2'})

const getSecret = async (secretName: string) => {
  const res = await SecretsManager.send(new GetSecretValueCommand({
    SecretId: secretName,
  }))

  return JSON.parse(res.SecretString)
}

const connectDb = async (dbSecretName: string) => {
  const dbSecret = await getSecret(dbSecretName)
  process.env.DB_USERNAME = dbSecret.username
  process.env.DB_PASSWORD = dbSecret.password
  process.env.DB_NAME = dbSecret.dbname
  process.env.HOSTNAME = dbSecret.host

  const dbEnv = dbSecretName.startsWith('/Prod') ? 'production' : 'development'

  Db.register(createDb({
    ...dbConfigForEnv(dbEnv),
    ...(dbSecretName.startsWith('/Prod') ? {port: 5454} : {}),
  }))

  return () => Db.use().sequelize.close()
}

export {
  connectDb,
}
