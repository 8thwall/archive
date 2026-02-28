import * as React from 'react'
import {createUseStyles} from 'react-jss'

import FileBrowseContext from './file-browse-context'
import PathBreadCrumb from './widgets/path-bread-crumb'
import FileContent from './widgets/file-content'
import FolderContent from './widgets/folder-content'
import useActions from '../common/use-actions'
import publicBrowseActions from './public-browse-actions'
import {brandLight, statusRounding, statusShadow} from '../static/styles/settings'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import {Loader} from '../ui/components/loader'

const useStyles = createUseStyles({
  statusBar: {
    padding: '1em',
    backgroundColor: brandLight,
    borderTopRightRadius: statusRounding,
    borderTopLeftRadius: statusRounding,
    marginBottom: '1px',
    boxShadow: statusShadow,
  },
})

const FileBrowseView: React.FunctionComponent = () => {
  const {
    appOrModuleUuid, commitHash, path, branch, isPrivate, isModule,
  } = React.useContext(FileBrowseContext)
  const isRouteToFolder = path.endsWith('/')
  const {listRepoPath, getRepoFile} = useActions(publicBrowseActions)
  const [loading, setLoading] = React.useState(true)
  const classes = useStyles()

  useAbandonableEffect(async (abandon) => {
    if (!commitHash && !isPrivate) {
      return
    }

    setLoading(true)

    const loadingPromise = isRouteToFolder
      ? listRepoPath(appOrModuleUuid, commitHash, branch, path, isPrivate, isModule)
      : getRepoFile(appOrModuleUuid, commitHash, branch, path, isPrivate, isModule)

    await abandon(loadingPromise)
    setLoading(false)
  }, [branch, appOrModuleUuid, path, commitHash])

  let contentToDisplay
  if (loading) {
    contentToDisplay = <Loader inline />
  } else if (isRouteToFolder) {
    contentToDisplay = (
      <FolderContent />
    )
  } else {
    contentToDisplay = (
      <FileContent path={path} />
    )
  }

  return (
    <>
      <div className={classes.statusBar}>
        <PathBreadCrumb />
      </div>
      {contentToDisplay}
    </>
  )
}

export default FileBrowseView
