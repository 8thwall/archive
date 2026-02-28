import * as React from 'react'
import {join} from 'path'
import {Link} from 'react-router-dom'
import {createUseStyles} from 'react-jss'

import {BranchEnum, getSubPathForBrowse, ModuleBranchEnum} from '../../common/paths'
import {combine} from '../../common/styles'
import FileBrowseContext from '../file-browse-context'
import {brandPurple} from '../../static/styles/settings'

interface IBrowseLink {
  branch?: BranchEnum | ModuleBranchEnum
  path: string
  className?: string
  children?: React.ReactNode
}

const useStyles = createUseStyles({
  browseLink: {
    'backgroundColor': 'transparent',
    'border': 'none',
    'fontSize': 'inherit',
    'fontFamily': 'inherit',
    'color': brandPurple,
    'cursor': 'pointer',
    'padding': '0',
    'margin': '0',
    '&:hover': {
      color: '#1e70bf',
    },
  },
})

const BrowseLink: React.FunctionComponent<IBrowseLink> =
  ({branch, path, className, ...rest}) => {
    const classes = useStyles()
    const context = React.useContext(FileBrowseContext)

    // Empty strings are falsy so allow empty string to be a valid override for context branch.
    const branchToUse = branch ?? context.pathSegment ?? context.branch

    if (context.onNavigationChange) {
      return (
        <button
          type='button'
          className={combine(classes.browseLink, className)}
          onClick={() => context.onNavigationChange(branchToUse, join('/', path))}
          {...rest}
        />
      )
    } else {
      return (
        <Link
          {...rest}
          className={combine(classes.browseLink, className)}
          to={join(context.routePrefix, getSubPathForBrowse(branchToUse, path))}
        />
      )
    }
  }

export default BrowseLink
