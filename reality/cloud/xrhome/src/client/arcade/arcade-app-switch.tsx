import React from 'react'
import {Switch, Route, withRouter, useRouteMatch, Redirect} from 'react-router-dom'
import {join} from 'path'

import {Loader} from '../ui/components/loader'
import HomePage from './components/home-page'

interface PageInfo {
  path: string | string[]
  component?: React.ComponentType<any>
  exact?: boolean
}

const AppSwitch: React.FunctionComponent = () => {
  const match = useRouteMatch()

  const alwaysPages = [
    {
      path: '',
      component: HomePage,
    },
  ]

  // Route's path prop can be be string | string[]
  const getRoutePath = (path: string | string[]) => (Array.isArray(path)
    ? path.map(p => join(match.path, p))
    : join(match.path, path)
  )
  const getRouteKey = (path: string | string[]) => path.toString()

  const getRoute = ({path, component, exact = true}: PageInfo) => (
    <Route
      key={getRouteKey(path)}
      exact={exact !== false}
      path={getRoutePath(path)}
      component={component}
    />
  )

  const routes = [
    ...(alwaysPages.filter(page => !!page).map(getRoute)),
    <Route key='/404' path={match.path}><Redirect to='/' /></Route>,
  ]

  return (
    <React.Suspense fallback={<Loader />}>
      <Switch>{routes}</Switch>
    </React.Suspense>
  )
}

export default withRouter(AppSwitch)
