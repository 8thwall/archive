import * as React from 'react'
import {Table} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'

import publicBrowseAction from '../public-browse-actions'
import FileBrowseContext from '../file-browse-context'
import FileContent from './file-content'
import PathList from './path-list'
import {useFileContent, getKey} from '../file-browsing'
import useActions from '../../common/use-actions'
import {gray1} from '../../static/styles/settings'
import {useSelector} from '../../hooks'

const README_FILENAME = 'README.md'

const useStyles = createUseStyles({
  fileAndFolder: {
    'backgroundColor': `${gray1} !important`,
    '& td': {
      // Allow our cells to take the entire size. Make clickability easier
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
    },
  },
})

const FolderContent: React.FC = () => {
  const classes = useStyles()
  const {
    appOrModuleUuid, commitHash, branch, path, isPrivate, isModule,
  } = React.useContext(FileBrowseContext)
  const isReadMeInThisFolder = useSelector((state) => {
    const containedFiles = state.publicBrowse.listByPath[
      getKey(appOrModuleUuid, branch, path)
    ]
    return containedFiles?.some(item => item.path === README_FILENAME)
  })

  const {getRepoFile} = useActions(publicBrowseAction)

  const readMePath = `${path}${README_FILENAME}`
  const readMeContent = useFileContent(appOrModuleUuid, branch, readMePath)

  React.useEffect(() => {
    if (isReadMeInThisFolder && appOrModuleUuid && branch) {
      getRepoFile(appOrModuleUuid, commitHash, branch, readMePath, isPrivate, isModule)
    }
  }, [isReadMeInThisFolder])

  return (
    <>
      <Table attached='bottom' className={classes.fileAndFolder} unstackable>
        {/* TODO(dat): Complete status bar when we have commit information */}
        {/* <Table.Header>
          </Table.Header> */}
        <Table.Body>
          <PathList />
        </Table.Body>
      </Table>
      {readMeContent && <FileContent
        path={readMePath}
      />}
    </>
  )
}

export default FolderContent
