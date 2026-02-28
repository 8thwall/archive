import {useSelector} from '../hooks'

import type {IPublicModule} from '../common/types/models'

const usePublicModules = (): IPublicModule[] => useSelector(s => (
  s.modules.publicUuids.map(id => s.modules.publicEntities[id])
))

export {usePublicModules}
