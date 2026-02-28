import type {ModuleFileRequest} from '@nia/reality/shared/module/module-file-request'
import {resolveModuleBuild} from '@nia/reality/shared/module/resolve-module-build'

import {use as ddb} from './dynamodb'

const resolveModuleRequest = async (request: ModuleFileRequest) => {
  const build = await resolveModuleBuild(
    input => ddb().getItem({...input, TableName: 'studio-global'}),
    request.moduleId,
    request.target,
    'buildLocation'
  )
  if (build) {
    return build.buildLocation
  }
  return null
}

export {
  resolveModuleRequest,
}
