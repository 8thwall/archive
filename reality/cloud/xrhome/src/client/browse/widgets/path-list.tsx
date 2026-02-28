import * as React from 'react'
import {join} from 'path'
import {Table} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'

import BrowseLink from './browse-link'
import {getKey} from '../file-browsing'
import {gray1, gray4, gray5, mainBackgroundColor} from '../../static/styles/settings'
import {bool} from '../../common/styles'
import {useSelector} from '../../hooks'
import FileBrowseContext from '../file-browse-context'
import {Icon} from '../../ui/components/icon'

const useStyles = createUseStyles({
  fileIcon: {
    paddingLeft: '0.5em !important',
    paddingRight: '0.5em !important',
  },
  nameBrowseLink: {
    width: '100% !important',
    textAlign: 'left !important',
    color: `${gray5} !important`,
    display: 'block !important',
    padding: '1em 0.5em !important',
  },
  name: {
    '&:hover': {
      background: `linear-gradient(45deg, ${gray1}, ${mainBackgroundColor})`,
    },
  },
  folder: {
    '& $name': {
      fontWeight: '700',
    },
  },
  commitDesc: {
    color: gray4,
  },
  updateTime: {
    color: gray4,
  },
})

/** Return a list for content of a folder. Each item should provide link to browse deeper into
 * the tree.
 */
const PathList: React.FunctionComponent = () => {
  const classes = useStyles()
  const {appOrModuleUuid, branch, path} = React.useContext(FileBrowseContext)
  const items = useSelector(
    state => state.publicBrowse.listByPath[getKey(appOrModuleUuid, branch, path)]
  )
  if (!items) {
    return null
  }
  const tableRows = (
    <>
      {items.map((item) => {
        const isFolder = item.type === 'folder'
        const fullPath = join(path, item.path)
        return (
          <Table.Row key={item.path} className={bool(isFolder, classes.folder)}>
            <Table.Cell collapsing className={classes.fileIcon}>
              <Icon stroke={isFolder ? 'folder' : 'fileOutline'} />
            </Table.Cell>
            <Table.Cell className={classes.name}>
              <BrowseLink className={classes.nameBrowseLink} path={fullPath}>
                {item.fileName}
              </BrowseLink>
            </Table.Cell>
            {/* TODO(dat): needs implementation */}
            {/* <Table.Cell className={classes.commitDesc}>{item.fileCommitDescription}</Table.Cell>
            <Table.Cell className={classes.updateTime} textAlign='right'></Table.Cell> */}
          </Table.Row>
        )
      })}
    </>
  )

  // Convenient up path
  if (path === '/') {
    return tableRows
  }

  const upPathFragments = path.split('/').slice(0, -1)
  // join returns '.' on an empty [''] input, we override it to '/' here
  // e.g. path = '/app/folder/foo/'
  const upPath = upPathFragments.length > 1
    ? `${join(...path.split('/').slice(0, -2))}/`
    : '/'
  return (
    <>
      <Table.Row key='..'>
        <Table.Cell collapsing />
        <Table.Cell className={classes.name}>
          <BrowseLink className={classes.nameBrowseLink} path={upPath}>..</BrowseLink>
        </Table.Cell>
        {/* TODO(dat): Add back when we have these information */}
        {/* <Table.Cell className={classes.commitDesc}></Table.Cell>
        <Table.Cell className={classes.updateTime} textAlign='right'></Table.Cell> */}
      </Table.Row>
      {tableRows}
    </>
  )
}

export default PathList
