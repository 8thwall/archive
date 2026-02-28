import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import FileBrowseView from '../browse/file-browse-view'
import {combine} from '../common/styles'
import BrowseLink from '../browse/widgets/browse-link'
import FileBrowseContext from '../browse/file-browse-context'
import {brandHighlight, gray4, gray5} from '../static/styles/settings'
import {useSelector} from '../hooks'

// TODO(christoph) Switch to common layout
const useStyles = createUseStyles({
  browseSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  branchSelect: {
    margin: '1.5em 0',
  },
  childLink: {
    'padding': '0.25em 0',
    'color': `${gray5} !important`,
    '&:hover': {
      color: `${gray4} !important`,
    },
    '& + &': {
      marginLeft: '1.25em',
    },
  },
  activeLink: {
    borderBottom: `4px solid ${brandHighlight} !important`,
  },
})

interface ICodePreviewSection {
  appUuid: string
}

const CodePreviewSection: React.FunctionComponent<ICodePreviewSection> = ({appUuid}) => {
  const [branch, setBranch] = React.useState<'master' | 'published'>('master')
  const [path, setPath] = React.useState('/')
  const classes = useStyles()
  const {t} = useTranslation(['app-pages'])

  const app = useSelector(state => state.apps.find(a => a.uuid === appUuid))

  const handleNavigationChange = (newBranch, newPath) => {
    setBranch(newBranch)
    setPath(newPath)
  }

  const browseLinks = (
    <>
      <BrowseLink
        branch='master'
        path='/'
        className={combine(branch === 'master' && classes.activeLink, classes.childLink)}
      >{t('project_dashboard_page.branch.latest')}

      </BrowseLink>
      <BrowseLink
        branch='published'
        path='/'
        className={combine(branch === 'published' && classes.activeLink, classes.childLink)}
      >{t('project_dashboard_page.branch.published')}
      </BrowseLink>
    </>
  )

  return (
    <div className={combine(classes.browseSection, 'browse')}>
      <FileBrowseContext.Provider
        value={{
          appOrModuleUuid: app.uuid,
          rootName: app.appName,
          commitHash: null,
          path,
          branch,
          onNavigationChange: handleNavigationChange,
          isPrivate: true,
          repoId: app.repoId,
        }}
      >
        <div className={classes.branchSelect}>
          {browseLinks}
        </div>
        <FileBrowseView />
      </FileBrowseContext.Provider>
    </div>
  )
}

export default CodePreviewSection
