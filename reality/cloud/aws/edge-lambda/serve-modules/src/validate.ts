import type {ModuleFileRequest} from '@nia/reality/shared/module/module-file-request'
import {keyForSlug, ModuleSlugData} from '@nia/reality/shared/module/module-slug'

import {use as ddb} from './dynamodb'
import {AttributesForRaw, fromAttributes} from '@nia/reality/shared/typed-attributes'

const validateRequest = async ({moduleId, target, slug}: ModuleFileRequest) => {
  if (!moduleId || !target || !slug) {
    return false
  }

  const res = await ddb().getItem({
    TableName: 'studio-global',
    Key: keyForSlug(moduleId, target, slug),
  })

  if (!res || !res.Item) {
    return false
  }

  const data = fromAttributes(res.Item as AttributesForRaw<ModuleSlugData>)

  return ['ACTIVE', 'DEPRECATED'].includes(data.status)
}

export {
  validateRequest,
}
