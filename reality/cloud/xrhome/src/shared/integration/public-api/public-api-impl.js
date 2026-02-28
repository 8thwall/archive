const https = require('https')
const AWS = require('aws-sdk')

const {makePublicApiToken} = require('./public-api-token')
const {SecretsProvider} = require('../secrets-provider/secrets-provider-api')
const {INTERNAL_AUTH_SCOPE} = require('../../../server/secret-scopes')

// This corresponds to the Usage Plan IDs in AWS Console
const usagePlanIdForStage = (stage) => {
  switch (stage) {
    case 'test':
    case 'local':
    case 'dev':
      return 'mz28v5'
    case 'prod':
    case 'staging':
      return 'xygsew'
    default:
      throw new Error(`Unexpected stage: ${stage}`)
  }
}

const createPublicApi = (host, env) => {
  const apiGatewayClient = new AWS.APIGateway({region: 'us-west-2'})

  const fetch = async ({path, method, headers = {}, body}) => {
    const options = {
      host,
      path,
      method,
      headers,
      body,
    }

    if (options.body && typeof options.body === 'object' && !Buffer.isBuffer(options.body)) {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(options.body)
    }

    const {publicApiSigningSecret} = await SecretsProvider.use().getScope(INTERNAL_AUTH_SCOPE)

    options.headers['x-api-token'] = makePublicApiToken(publicApiSigningSecret, host, path, method)

    return new Promise((resolve, reject) => {
      https.request(options, (res) => {
        const result = {
          statusCode: res.statusCode,
          headers: res.headers,
          body: '',
        }

        res.on('data', (d) => {
          result.body += d
        })

        res.on('end', () => {
          if (result.body && result.headers['content-type'] === 'application/json') {
            try {
              result.body = JSON.parse(result.body)
            } catch (err) {
              reject(err)
              return
            }
          }
          resolve(result)
        })
      })
        .on('error', reject)
        .end(options.body || '')
    })
  }

  const createKey = async (name, tags = {}) => {
    const key = await apiGatewayClient.createApiKey({
      enabled: true,
      name: `public-api/${name}`,
      tags: {
        ...tags,
        DATA_REALM: env.dataRealm,
      },
    }).promise()

    await apiGatewayClient.createUsagePlanKey({
      keyId: key.id,
      keyType: 'API_KEY',
      usagePlanId: usagePlanIdForStage(env.deploymentStage),
    }).promise()

    return {id: key.id, secret: key.value}
  }

  const deleteKey = async (keyId) => {
    await apiGatewayClient.deleteApiKey({apiKey: keyId}).promise()
  }

  return {
    fetch,
    createKey,
    deleteKey,
  }
}

module.exports = {
  createPublicApi,
}
