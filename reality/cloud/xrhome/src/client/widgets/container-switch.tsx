import React from 'react'
import {Switch, Route, useRouteMatch} from 'react-router-dom'
import {join} from 'path'

import NotFoundPage from '../home/not-found-page'
import type {IContainerPage} from './container-sidebar'
import {Loader} from '../ui/components/loader'

interface IContainerSwitch {
  pages: IContainerPage[]
  children?: React.ReactNode
}

const ContainerSwitch: React.FC<IContainerSwitch> = ({pages, children}) => {
  const match = useRouteMatch()
  return (
    <React.Suspense fallback={<Loader />}>
      <Switch>
        {pages.map(({name, path, routeComponent, routeRender, routePath, routeChildren}) => (
          <Route
            key={name}
            exact={!routePath && !path}
            path={join(match.path, routePath || path)}
            render={routeRender}
            component={routeComponent}
          >
            {routeChildren}
          </Route>
        ))}

        {children || <Route path={match.path}><NotFoundPage /></Route>}
      </Switch>
    </React.Suspense>
  )
}

export default ContainerSwitch
