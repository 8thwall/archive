import path from 'path'

import proxy from 'express-http-proxy'

import {parseRepoId} from '../../repo-id'
import {StudioApi} from '../studio-api/studio-api'

const xrhomePathToGatewayPath = (req) => {
  const {res: {locals}} = req
  const repoId = locals.currentRepoId

  const {store, partition} = parseRepoId(repoId)

  // The subpath is the part of the path after "".git", such as "/info/refs"
  const subPath = req.params['0']

  // The remainder is the part of the path after the subPath, such as "/?service=git-upload-pack"
  const remainder = req.url

  const resolvedGitPath = path.join(
    StudioApi.use().getPrefix(), 'git', store, partition, repoId, subPath, remainder
  )

  locals.resolvedGitPath = resolvedGitPath
  return resolvedGitPath
}

const proxyOptions = {
  parseReqBody: false,
  proxyReqPathResolver: req => req.res.locals.resolvedGitPath,
  proxyReqOptDecorator: (opts, req) => {
    // Headers are case insensitive
    const reqHeaderKeys = Object.keys(req.headers).map(k => k.toLowerCase())
    const reqHeaderValues = Object.values(req.headers)
    const headers = [
      'accept', 'cache-control', 'content-length', 'content-type', 'pragma', 'x-amz-content-sha256']
    opts.headers = headers.reduce((o, v) => {
      const lowerV = v.toLowerCase()
      const reqHeader = reqHeaderKeys.findIndex(k => k === lowerV)
      if (reqHeader >= 0) {
        o[v] = reqHeaderValues[reqHeader]
      }
      return o
    }, {})
    opts.path = xrhomePathToGatewayPath(req)
    delete opts.port
    delete opts.params
    return StudioApi.use().signOpts(opts)
  },
}

const createCodeCommitProxy = () => proxy(`https://${StudioApi.use().getUrl()}`, proxyOptions)

export {
  createCodeCommitProxy,
}
