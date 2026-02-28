import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'

import Icons from '../../apps/icons'
import {useTheme} from '../../user/use-theme'
import {combine} from '../../common/styles'
import ProjectLibrary from '../../browse/project-library'
import useActions from '../../common/use-actions'
import actions from '../../launcher/launcher-actions'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import {useSelector} from '../../hooks'
import blankProfilePage from '../../static/blankProfilePage.svg'
import DrillDownPane from './launcher-drilldown-pane'
import useNewProjectModalStyles from './new-app-modal-styles'
import type {IApp} from '../../common/types/models'
import {isCloudStudioApp} from '../../../shared/app-utils'
import {Loader} from '../../ui/components/loader'

interface IQuickStartPane {
  app: IApp
}

const QuickStartPane: React.FC<IQuickStartPane> = ({app}) => {
  const themeName = useTheme()
  const classes = useNewProjectModalStyles({themeName})
  const {t} = useTranslation(['cloud-editor-pages'])
  const {getSearchApps, clearSearchApps, getConsoleApp} = useActions(actions)
  const apps = useSelector(state => state.launcher.searchApps)
  const [drillDownAppUuid, setDrillDownAppUuid] = useState<string>(null)
  const drillDownApp = useSelector(
    state => state.launcher.consoleApps.find(a => a.uuid === drillDownAppUuid)
  )
  const techTypes = [
    'A-Frame',
    'Three.js',
    t('editor_page.project_picker_modal.quick-start_pane.tech_type.other'),
  ]
  const loading = useSelector(state => state.launcher.pending.getSearchApps)
  const drillDownLoading = useSelector(state => state.launcher.pending.getConsoleApp)
  const [activeTechType, setActiveTechType] = useState(techTypes[0])

  const searchParams = {
    ...(activeTechType === techTypes[2]
      ? {tag: ['quick-start', 'no-renderer']}
      : {tech: [activeTechType], tag: ['quick-start']}
    ),
    ...(isCloudStudioApp(app) ? {tag: ['quick-start'], tech: []} : {}),
    type: app?.hostingType,
  }

  useAbandonableEffect(async (executor) => {
    // NOTE(wayne): Put no-renderer projects into the "Other" tab
    await executor(getSearchApps(searchParams))
  }, [activeTechType])

  // useAbandonableEffect does not support clean up functions
  useEffect(() => () => { clearSearchApps() }, [])

  const setTechTypeClickHandler = (techType) => {
    setActiveTechType(techType)
  }

  const closeDrillDown = () => {
    setDrillDownAppUuid(null)
  }

  const openDrillDown = async (appUuid: string) => {
    await getConsoleApp(appUuid)
    setDrillDownAppUuid(appUuid)
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

  if (drillDownLoading) {
    return (
      <div className={classes.container}>
        {/* eslint-disable-next-line local-rules/ui-component-styling */}
        <Loader className={classes.loader} />
      </div>
    )
  }

  const projectList = apps?.length
    ? (
      <ProjectLibrary
        className={classes.cardContainer}
        apps={apps}
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

  const projectView = loading
    // eslint-disable-next-line local-rules/ui-component-styling
    ? <Loader className={classes.loader} />
    : projectList

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <div className={classes.headerBlurb}>
          <img
            src={themeName === 'dark'
              ? Icons.launcherQuickstartDark
              : Icons.launcherQuickstartLight}
            alt='Quick Start'
          />
          <div className={classes.headerText}>
            {t('editor_page.project_picker_modal.quick_start_pane.blurb')}
          </div>
        </div>
        <div role='tablist' className={classes.techTypesContainer}>
          {!isCloudStudioApp(app) && techTypes.map((tech, index) => (
            <div
              role='tab'
              tabIndex={index}
              key={tech}
              className={combine(classes.techType, activeTechType === tech && classes.activeTech)}
              onClick={() => setTechTypeClickHandler(tech)}
              onKeyDown={() => setTechTypeClickHandler(tech)}
            >{tech}
            </div>
          ))}
        </div>
      </div>
      {projectView}
    </div>
  )
}

export default QuickStartPane
