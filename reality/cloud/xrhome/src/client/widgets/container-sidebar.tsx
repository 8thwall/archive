import React from 'react'
import {Route, RouteProps, useRouteMatch} from 'react-router-dom'
import {join} from 'path'
import type {SemanticICONS} from 'semantic-ui-react'

import {useTranslation} from 'react-i18next'

import ResponsiveSidebar, {IResponsiveSidebarProps} from './responsive-sidebar'

interface IContainerPage {
  name: string
  icon?: SemanticICONS
  iconComponent?: React.ComponentType<{className: string}>
  path: string
  alternatePaths?: string[]
  routePath?: string
  routeComponent?: any
  hideInSidebar?: boolean
  routeRender?: RouteProps['render']
  routeChildren?: any
  a8?: string
  disabled?: boolean
  disabledMessage?: string
  hideSidebar?: boolean
}

const pageMatchesPath = (page: IContainerPage, path: string): boolean => (
  page.path === path || (!path && !page.path) || page.alternatePaths?.includes(path)
)

interface IContainerSidebar extends Omit<IResponsiveSidebarProps, 'children'> {
  pages: IContainerPage[]
  children?: React.ReactNode
}

// Assumes that props.match.path is the root of the container
const ContainerSidebar: React.FC<IContainerSidebar> = ({pages, children, ...rest}) => {
  const {t} = useTranslation(['app-pages'])
  const match = useRouteMatch()

  return (
    <Route
      path={join(match.path, ':currentPath?')}
      render={({match: {params: {currentPath}}}) => {
        const activePage = pages.find(page => pageMatchesPath(page, currentPath))
        if (activePage?.hideSidebar) {
          return null
        }

        return (
          <>
            <ResponsiveSidebar {...rest}>
              {pages.filter(({hideInSidebar}) => !hideInSidebar).map(page => (
                <ResponsiveSidebar.Item
                  key={page.name}
                  {...page}
                  active={page === activePage}
                  text={t(page.name)}
                  link={join(match.url, page.path)}
                  disabledMessage={t(page.disabledMessage)}
                />
              ))}
            </ResponsiveSidebar>
            {children}
          </>
        )
      }}
    />
  )
}

export default ContainerSidebar

export type {
  IContainerPage,
}
