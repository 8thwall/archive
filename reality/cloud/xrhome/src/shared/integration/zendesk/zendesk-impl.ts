import zendesk, {ClientOptions} from 'node-zendesk'

import {SecretsProvider} from '../secrets-provider/secrets-provider-api'
import {LIGHTSHIP_SCOPE, THIRD_PARTY_SCOPE} from '../../../server/secret-scopes'
import {IZendesk, IZendeskClient, ZendeskClientType} from './zendesk-api'

const createZendesk = (options: ClientOptions): IZendeskClient => {
  const client = zendesk.createClient(options)

  /**
   * The node-zendesk library tries to intelligently destructure the response
   * objects of Zendesk API requests. For example, the Zendesk Requests API returns
   * `{ request: {id: 1234, ...} }`, the equivalent node-zendesk API will instead return
   * `{id: 1234, ...}.
   * https://github.com/blakmatrix/node-zendesk/issues/331
   *
   * To work around this, we will be removing all `jsonAPINames` properties for the
   * APIs in this library's client. This will ensure we receive the exact response
   * objects provided by Zendesk's API, and as defined in the @types/node-zendesk typing.
   * https://github.com/blakmatrix/node-zendesk/blob/7812774ede/lib/client/client.js#L316
   */
  Object.values(client).forEach((value) => {
    if (typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'jsonAPINames')) {
      delete value.jsonAPINames
    }
  })

  /**
   * NOTE: All of the node-zendesk APIs are built using the assumption that the `this` object
   * will always reference an object that has a common set of methods (e.g. "request").
   *
   * The IZendesk interface offers a subset of the APIs offered by node-zendesk, so we can't
   * return the full client object node-zendesk provides. Given node-zendesk's assumption of
   * the `this` object, we must make sure the functions we execute are bound to the original client
   * object.
   *
   * See the following links for more information:
   *   1. https://github.com/blakmatrix/node-zendesk/issues/216
   *   2. https://github.com/blakmatrix/node-zendesk/blob/master/lib/client/requests.js#L35
   *   3. https://github.com/blakmatrix/node-zendesk/blob/master/lib/client/requests.js#L70
   */
  return {
    createTicket: client.tickets.create.bind(client.tickets),
    updateTicket: client.tickets.update.bind(client.tickets),
    createRequest: client.requests.create.bind(client.requests),
    uploadAttachment: client.attachments.upload.bind(client.attachments),
  }
}

const create8wZendesk = async (): Promise<IZendeskClient> => {
  const {zendeskAPIKey} = await SecretsProvider.use().getScope(THIRD_PARTY_SCOPE)
  return createZendesk({
    username: 'tony@<REMOVED_BEFORE_OPEN_SOURCING>.com',
    token: zendeskAPIKey,
    remoteUri: 'https://<REMOVED_BEFORE_OPEN_SOURCING>.zendesk.com/api/v2',
  })
}

const createLightshipZendesk = async (): Promise<IZendeskClient> => {
  const {zendeskAPIKey} = await SecretsProvider.use().getScope(LIGHTSHIP_SCOPE)
  return createZendesk({
    username: 'lightship_zendesk@<REMOVED_BEFORE_OPEN_SOURCING>.com',
    token: zendeskAPIKey,
    remoteUri: 'https://<REMOVED_BEFORE_OPEN_SOURCING>.zendesk.com/api/v2',
  })
}

const createQaZendesk = async (): Promise<IZendeskClient> => {
  const {zendeskAPIKey} = await SecretsProvider.use().getScope(THIRD_PARTY_SCOPE)
  return createZendesk({
    username: '8w-zendesk-dev@<REMOVED_BEFORE_OPEN_SOURCING>.com',
    token: zendeskAPIKey,
    remoteUri: 'https://<REMOVED_BEFORE_OPEN_SOURCING>.zendesk.com/api/v2',
  })
}

const createProdClient = async (type: ZendeskClientType) => {
  switch (type) {
    case ZendeskClientType.EIGHTH_WALL:
      return create8wZendesk()
    case ZendeskClientType.LIGHTSHIP:
      return createLightshipZendesk()
    default:
      throw Error(`Unexpected Zendesk Client Type: ${type}`)
  }
}

const createQaClient = async (type: ZendeskClientType) => {
  switch (type) {
    case ZendeskClientType.EIGHTH_WALL:
    case ZendeskClientType.LIGHTSHIP:
      return createQaZendesk()
    default:
      throw Error(`Unexpected Zendesk Client Type: ${type}`)
  }
}

const createZendeskApi = (): IZendesk => {
  const clients = {} as Record<ZendeskClientType, IZendeskClient>

  const getClient = async (type: ZendeskClientType) => {
    if (!clients[type]) {
      clients[type] = await (BuildIf.ALL_QA ? createQaClient(type) : createProdClient(type))
    }
    return clients[type]
  }

  return {
    getClient,
  }
}

export {
  createZendeskApi,
}
