import {useRouteMatch} from 'react-router-dom'
import {matchPath} from 'react-router'

import {useSelector} from '../hooks'
import {ModuleMatch, getRouteModule} from './paths'
import type {IModule} from './types/models'

const useCurrentModule = (): IModule => {
  const routeMatch = useRouteMatch<ModuleMatch['params']>()
  const pathname = useSelector(state => state.router?.location?.pathname || '')
  const match = routeMatch || matchPath(pathname, {path: '/:account/module/:moduleName?'})
  return useSelector(state => getRouteModule(state, match))
}

export {
  useCurrentModule,
}
