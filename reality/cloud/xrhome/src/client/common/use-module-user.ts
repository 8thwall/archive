import {useSelector} from '../hooks'
import type {IModuleUser} from './types/models'
import {useCurrentModule} from './use-current-module'

const useModuleUser = (): IModuleUser => {
  const module = useCurrentModule()
  return useSelector(state => state.modules.moduleUsers[module.uuid])
}

export {
  useModuleUser,
}
