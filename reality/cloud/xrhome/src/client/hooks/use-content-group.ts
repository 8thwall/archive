import React from 'react'
import {matchPath} from 'react-router'

import {addHistoryChangeHandler, removeHistoryChangeHandler} from '../common/early-history-change'
import type {PageInfo} from '../app-switch'

const useContentGroup = (getRoutes: (path: string) => PageInfo[]) => {
  React.useEffect(() => {
    const handler = (newPath: string) => {
      const routes = getRoutes(newPath)
      const currentPage = routes.find(({path, exact}) => (
        matchPath(newPath, {path, exact: exact !== false})
      ))
      const contentGroup = currentPage?.contentGroup

      window.dataLayer.push({contentGroup})
    }

    addHistoryChangeHandler(handler)

    return () => removeHistoryChangeHandler(handler)
  }, [getRoutes])
}

export {
  useContentGroup,
}
