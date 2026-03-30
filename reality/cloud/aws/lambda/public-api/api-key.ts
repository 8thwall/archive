import {Op} from 'sequelize'

import * as models from './models'

const isPrivilegedRequest = request => (
  request.requestContext.authorizer.isPrivileged === 'true' ||
  request.requestContext.authorizer.access === 'all'
)

const apiKeyFromRequest = request => (
  request.requestContext.identity.apiKey
)

const includeOrEmpty = include => (include ? [include] : [])

const makeApiKeyInclude = (apiKey, extend) => ({
  model: models.use().ApiKey,
  required: true,
  attributes: ['uuid'],
  where: {
    secretKey: apiKey,
    fullAccountAccess: true,
    status: 'ENABLED',
  },
  ...extend,
})

const makeAccountInclude = extend => ({
  model: models.use().Account,
  required: true,
  attributes: ['uuid'],
  ...extend,
})

const makeAppInclude = extend => ({
  model: models.use().App,
  where: {status: {[Op.not]: 'DELETED'}},
  required: true,
  attributes: ['uuid'],
  ...extend,
})

const makeImageTargetInclude = extend => ({
  model: models.use().ImageTarget,
  where: {status: {[Op.not]: 'DELETED'}},
  required: false,
  ...extend,
})

/**
 * Finds an ImageTarget via the specified query. The request is the request object supplied
 * to the lambda by the runtime. It is used for the api key as well as for other context info
 * such as whether or not this is a privileged request (e.g. xrhome). Privileged requests by default
 * do not include additional models unless specified. Non-privileged requests require a valid
 * api key connected to the account/app/image-target. All options can be extended except for
 * include, which will be ignored.
 *
 * @param where The query for the ImageTarget
 * @param request The request object the lambda receives
 * @param extendImageTargetQuery Additional options for the ImageTarget query
 * @param extendAppInclude Additional options for the App query
 * @param extendAccountInclude Additional options for the Account query
 * @param extendApiKeyInclude Additional options for the ApiKey query
 * @returns {Promise<Model> | Promise<Model | null>}
 */
const getImageTargetForRequest = (where, request, {
  extendImageTargetQuery,
  extendAppInclude,
  extendAccountInclude,
  extendApiKeyInclude,
}: any = {}) => {
  const {ImageTarget} = models.use()

  const apiKey = apiKeyFromRequest(request)
  const privileged = isPrivilegedRequest(request)

  let apiKeyInclude
  let accountInclude
  let appInclude

  if (!privileged || extendApiKeyInclude) {
    apiKeyInclude = makeApiKeyInclude(apiKey, extendApiKeyInclude)
  }

  if (apiKeyInclude || extendAccountInclude) {
    accountInclude = makeAccountInclude({
      ...extendAccountInclude,
      include: includeOrEmpty(apiKeyInclude),
    })
  }

  if (accountInclude || extendAppInclude) {
    appInclude = makeAppInclude({
      ...extendAppInclude,
      include: includeOrEmpty(appInclude),
    })
  }

  return ImageTarget.findOne({
    where: {
      status: {[Op.not]: 'DELETED'},
      ...where,
    },
    ...extendImageTargetQuery,
    include: includeOrEmpty(appInclude),
  })
}

/**
 * Finds an App via the specified query. The request is the request object supplied
 * to the lambda by the runtime. It is used for the api key as well as for other context info
 * such as whether or not this is a privileged request (e.g. xrhome). Privileged requests by default
 * do not include additional models unless specified. Non-privileged requests require a valid
 * api key connected to the account/app/image-target. All options can be extended except for
 * include, which will be ignored. Be default ImageTargets are not included but when
 * includeImageTargets is set to true, a list of all ImageTargets is returned. To select
 * only some attributes use extendImageTargetInclude.
 *
 * @param where The query for the ImageTarget
 * @param request The request object the lambda receives
 * @param extendAppQuery Additional options for the App query
 * @param includeImageTargets If true, will include full ImageTargets in App query
 * @param extendImageTargetInclude Additional options for the ImageTarget query
 * @param extendAccountInclude Additional options for the Account query
 * @param extendApiKeyInclude Additional options for the ApiKey query
 * @returns {Promise<Model> | Promise<Model | null>}
 */
const getAppForRequest = (where, request, {
  extendAppQuery,
  extendImageTargetInclude,
  extendAccountInclude,
  extendApiKeyInclude,
}: any = {}) => {
  const {App} = models.use()

  const apiKey = apiKeyFromRequest(request)
  const privileged = isPrivilegedRequest(request)

  let apiKeyInclude
  let accountInclude
  let imageTargetInclude

  if (!privileged || extendApiKeyInclude) {
    apiKeyInclude = makeApiKeyInclude(apiKey, extendApiKeyInclude)
  }

  if (apiKeyInclude || extendAccountInclude) {
    accountInclude = makeAccountInclude({
      ...extendAccountInclude,
      include: includeOrEmpty(apiKeyInclude),
    })
  }

  if (extendImageTargetInclude) {
    imageTargetInclude = makeImageTargetInclude(extendImageTargetInclude)
  }

  return App.findOne({
    where: {
      status: {[Op.not]: 'DELETED'},
      ...where,
    },
    ...extendAppQuery,
    include: [
      ...includeOrEmpty(accountInclude),
      ...includeOrEmpty(imageTargetInclude),
    ],
  })
}

export {
  isPrivilegedRequest,
  getImageTargetForRequest,
  getAppForRequest,
}
