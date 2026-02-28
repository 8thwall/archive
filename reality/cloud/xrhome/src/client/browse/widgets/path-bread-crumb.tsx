import * as React from 'react'
import {createUseStyles} from 'react-jss'

import BrowseLink from './browse-link'
import FileBrowseContext from '../file-browse-context'

const CRUMB_DIVIDER = '  /  '

const useStyles = createUseStyles({
  browselinkRoot: {
    fontWeight: '800',
  },
})

const PathBreadCrumb: React.FunctionComponent = () => {
  const classes = useStyles()
  const {rootName, path} = React.useContext(FileBrowseContext)
  const pathFragments = path.split('/')
  // e.g. /app/foo/index.js = ['', 'app', 'foo', 'index.js']. We are interested in ['app', 'foo']
  const lastFragment = pathFragments[pathFragments.length - 1]
  const fragmentsBeforeMe = pathFragments.slice(1, -1)
  const breadCrumbDom = fragmentsBeforeMe.map((f, i) => {
    const link = `${fragmentsBeforeMe.slice(0, i + 1).join('/')}/`
    return (
      <React.Fragment key={link}>
        {CRUMB_DIVIDER}
        {(i !== fragmentsBeforeMe.length - 1 || lastFragment !== '')
          ? <BrowseLink path={link}>{f}</BrowseLink>
          : f
        }
      </React.Fragment>
    )
  })
  return (
    <span>
      <BrowseLink className={classes.browselinkRoot} path='/'>
        {rootName}
      </BrowseLink>
      {breadCrumbDom}
      {CRUMB_DIVIDER}
      {lastFragment}
    </span>
  )
}

export default PathBreadCrumb
