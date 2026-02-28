import {useRouteMatch} from 'react-router-dom'
import {matchPath} from 'react-router'

import {useSelector} from '../hooks'
import {getRouteApp} from './paths'
import {useEnclosedApp} from '../apps/enclosed-app-context'
import type {IApp} from './types/models'

const useCurrentRouteApp = (): IApp | null => {
  let routeMatch = null
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    routeMatch = useRouteMatch()
  } catch (e) {
    if (!(e instanceof TypeError)) {
      throw e
    }
  }
  const pathname = useSelector(state => state.router?.location?.pathname || '')
  const match = matchPath(pathname, {path: '/:account/:routeAppName?'})
  return useSelector(state => getRouteApp(state, routeMatch || match))
}

/**
 * This hook returns the current app, expecting to be wrapped in an EnclosedAppProvider.
 * If not, it will throw an error.
 */
const useCurrentApp = (): IApp => {
  const enclosedApp = useEnclosedApp()
  if (enclosedApp) {
    return enclosedApp
  }
  throw new Error('Missing EnclosedAppContext')
}

export default useCurrentApp

export {
  useCurrentRouteApp,
}
