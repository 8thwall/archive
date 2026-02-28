import type {DeepReadonly} from 'ts-essentials'

import type {IPublicModule} from '../client/common/types/models'

const isModuleRepoVisible = (module: DeepReadonly<IPublicModule>) => (
  module.repoVisibility === 'PUBLIC'
)

export {
  isModuleRepoVisible,
}
