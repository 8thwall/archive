import React from 'react'
import {useTranslation} from 'react-i18next'

import Icons from '../../apps/icons'
import {useTheme} from '../../user/use-theme'
import {useSelector} from '../../hooks'
import ProjectLibrary from '../../browse/project-library'
import useCurrentAccount from '../../common/use-current-account'
import blankProfilePage from '../../static/blankProfilePage.svg'
import {appHasRepo, isAdApp} from '../../../shared/app-utils'
import useActions from '../../common/use-actions'
import actions from '../../launcher/launcher-actions'
import DrillDownPane from './launcher-drilldown-pane'
import useNewProjectModalStyles from './new-app-modal-styles'
import type {IApp} from '../../common/types/models'
import {APP_HOSTING_TYPE_TEMPLATE_MAP} from '../../../shared/app-constants'

interface IMyProjectsPane {
  app: IApp
}

const MyProjectsPane: React.FC<IMyProjectsPane> = ({app}) => {
  const themeName = useTheme()
  const classes = useNewProjectModalStyles({themeName})
  const {t} = useTranslation(['cloud-editor-pages'])
  const currentAccount = useCurrentAccount()
  // NOTE(wayne): Filter apps based on matching hosting types to the current app. Need to check
  // if account owns the app as well due to external projects being included in the list.
  const apps = useSelector(s => s.apps).filter(a => appHasRepo(a) &&
    !isAdApp(a) && a.AccountUuid === currentAccount.uuid &&
    APP_HOSTING_TYPE_TEMPLATE_MAP[app.hostingType].includes(a.hostingType))
  const [filteredApps, setFilteredApps] = React.useState(apps)
  const [appSearchValue, setAppSearchValue] = React.useState('')
  const {clearSearchApps} = useActions(actions)
  const [drillDownAppUuid, setDrillDownAppUuid] = React.useState<string>(null)
  const drillDownApp = useSelector(state => state.apps.find(a => a.uuid === drillDownAppUuid))

  React.useEffect(() => {
    if (appSearchValue.length < 1) {
      setFilteredApps(apps)
      return
    }
    const lowerSearch = appSearchValue.toLowerCase()

    setFilteredApps(apps.filter(a => (a.appTitle?.toLowerCase().includes(lowerSearch)) ||
    a.appName?.toLowerCase().includes(lowerSearch) || a.appKey?.toLowerCase() === lowerSearch))
  }, [appSearchValue])

  React.useEffect(() => () => { clearSearchApps() }, [])

  const onAppSearch = (event) => {
    setAppSearchValue(event.target.value)
  }

  const openDrillDown = (appUuid: string) => {
    setDrillDownAppUuid(appUuid)
  }

  const closeDrillDown = () => {
    setDrillDownAppUuid(null)
  }

  if (drillDownApp) {
    return (
      <DrillDownPane
        app={drillDownApp}
        closeDrillDown={closeDrillDown}
        previousPaneName={
          t('editor_page.project_picker_modal.drill_down_page.previous.8th_wall_projects')
        }
      />
    )
  }

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <div className={classes.headerBlurb}>
          <img
            src={themeName === 'dark' ? Icons.launcherMyProjectDark : Icons.launcherMyProjectLight}
            alt='8th Wall'
          />
          <div className={classes.headerText}>
            {t('editor_page.project_picker_modal.my_projects.blurb')}
          </div>
        </div>
        <div className={classes.searchContainer}>
          <img className={classes.searchIcon} src={Icons.search} alt='Search' />
          <input
            className={classes.searchInput}
            type='text'
            placeholder={t('editor_page.project_picker.placeholder.search')}
            aria-label='Search'
            onChange={onAppSearch}
          />
        </div>
      </div>
      {filteredApps.length > 0
        ? (
          <ProjectLibrary
            className={classes.cardContainer}
            account={currentAccount}
            apps={filteredApps}
            pageName='project-picker-my-projects'
            projectCardClickEvent={openDrillDown}
          />
        )
        : (
          <div className={classes.noProject}>
            <img alt='blank profile page' src={blankProfilePage} />
            <p>{t('editor_page.project_picker_modal.no_projects_found')}</p>
          </div>
        )
      }
    </div>
  )
}

export default MyProjectsPane
