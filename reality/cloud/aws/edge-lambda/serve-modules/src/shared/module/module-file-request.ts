import {ModuleTarget, parseModuleTarget, getModuleTargetParts} from './module-target'

// The load request corresponds with a load for a specific file from a specific module, with
// a specific targeted version

type ModuleFileRequest = {
  moduleId: string
  target: ModuleTarget
  file: string
  slug?: string
}

const PREFIX = '/modules/v1/'

const parseRequestUri = (uri: string, querystring = ''): ModuleFileRequest => {
  if (!uri.startsWith(PREFIX)) {
    return null
  }

  const parts = uri.split('/')

  const [/* leading slash */, /* modules */ , /* v1 */ , moduleId, ...remainder] = parts

  const parsedTarget = parseModuleTarget(remainder)
  if (!parsedTarget) {
    return null
  }
  const {target, remainder: fileParts} = parsedTarget

  if (!fileParts || fileParts.length === 0 || fileParts.some(s => s.length === 0)) {
    return null
  }

  const res: ModuleFileRequest = {moduleId, target, file: fileParts.join('/')}

  const queryParams = new URLSearchParams(querystring)

  if (queryParams.has('s')) {
    res.slug = queryParams.get('s')
  }

  return res
}
const makeRequestUri = (request: ModuleFileRequest) => {
  const parts = [
    '/modules',
    'v1',
    request.moduleId,
    ...getModuleTargetParts(request.target),
    request.file,
  ]

  const path = parts.join('/')

  return request.slug ? `${path}?${new URLSearchParams({s: request.slug})}` : path
}
export {
  ModuleFileRequest,
  parseRequestUri,
  makeRequestUri,
}
