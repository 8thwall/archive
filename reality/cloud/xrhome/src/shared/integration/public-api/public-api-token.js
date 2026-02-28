const jwt = require('jsonwebtoken')

const makePublicApiToken = (signingSecret, host, path, method) => {
  // NOTE(pawel) The authorizer lambda's request.requestContext.path does not include the query
  // string parameters and it's not great to "rebuild" the query string from the
  // request.queryStringParameters so for signing purposes we strip off the search parameters.
  // Query parameters do not grant a greater scope of privilege than the path.
  const questionLocation = path.indexOf('?')
  const signingPath = questionLocation === -1 ? path : path.substring(0, questionLocation)
  return jwt.sign({
    isXrhome: true,
    method,
    host,
    path: signingPath,
  }, signingSecret, {
    expiresIn: 10,
    audience: '8w_public_api',
    issuer: 'xrhome',
  })
}

module.exports = {
  makePublicApiToken,
}
