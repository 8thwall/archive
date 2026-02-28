import React from 'react'
import {Link} from 'react-router-dom'
import {createUseStyles} from 'react-jss'
import {basename} from 'path'
import type {LocationDescriptor} from 'history'

import {getPathForFile, getPathForDependency} from '../common/paths'
import type {IAccount, IApp} from '../common/types/models'
import {useCurrentGit} from '../git/hooks/use-current-git'
import {useDependencyContext} from './dependency-context'

const useStyles = createUseStyles({
  fileLink: {
    'textDecoration': 'underline',
    'color': 'inherit',
    '&:hover': {
      color: 'inherit',
    },
  },
})

interface IFileLink {
  account: IAccount
  app: IApp
  file?: string
  line?: number
  column?: number
  moduleId?: string
}

const makeFileString = (file: string, line?: number, column?: number) => {
  const lineString = line ? `:${line}` : ''
  const columnString = (line && column) ? `:${column}` : ''
  return `${basename(file)}${lineString}${columnString}`
}

const FileLink: React.FC<IFileLink> = ({account, app, file, line, column, moduleId}) => {
  const classes = useStyles()

  const fileExists = useCurrentGit(git => !!git.filesByPath[file])

  const dependencyContext = useDependencyContext()

  let link: LocationDescriptor
  let linkText: string

  const moduleAlias = moduleId && dependencyContext.moduleIdToAlias[moduleId]
  if (moduleAlias) {
    link = account && app && getPathForDependency(account, app, moduleAlias)
    // eslint-disable-next-line local-rules/hardcoded-copy
    linkText = file ? `${makeFileString(file, line, column)} (${moduleAlias})` : moduleAlias
  } else if (fileExists && account && app) {
    link = getPathForFile(account, app, file, line, column)
    linkText = makeFileString(file, line, column)
  } else if (file) {
    linkText = basename(file)
  }

  if (!linkText) {
    return null
  }

  if (link) {
    return (
      <Link className={classes.fileLink} to={link}>
        {linkText}
      </Link>
    )
  } else {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{linkText}</>
  }
}

export default FileLink
