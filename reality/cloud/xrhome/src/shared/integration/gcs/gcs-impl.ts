import {Storage} from '@google-cloud/storage'

import {SecretsProvider} from '../secrets-provider/secrets-provider-api'
import type {GcsConfig} from './gcs-api'
import {LIGHTSHIP_SCOPE} from '../../../server/secret-scopes'

const createGcs = () => {
  const getFile = async (fileName: string, config: GcsConfig) => {
    const secrets = await SecretsProvider.use().getScope(LIGHTSHIP_SCOPE)

    const serviceAcc = JSON.parse(secrets[config.secret])

    const storage = new Storage({
      credentials: {client_email: serviceAcc.client_email, private_key: serviceAcc.private_key},
      projectId: serviceAcc.project_id,
    })

    const bucket = storage.bucket(config.bucket)
    const path = `${config.root}/${fileName}`

    return bucket.file(path)
  }

  const getSignedUrl = async (fileName: string, config: GcsConfig) => {
    const file = await getFile(fileName, config)
    const fileExists = (await file.exists())[0]

    if (!fileExists) {
      throw Error('File did not exist')
    }

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 5000,
    })

    return url
  }

  return {
    getSignedUrl,
  }
}

export {
  createGcs,
}
