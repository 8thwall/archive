import React, {useState, useRef, useEffect} from 'react'
import {useTranslation} from 'react-i18next'

import Icons from '../../apps/icons'
import {useTheme} from '../../user/use-theme'
import SelectDropDown from '../../widgets/select-dropdown'
import ProjectLibrary from '../../browse/project-library'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import {useSelector} from '../../hooks'
import useActions from '../../common/use-actions'
import actions from '../../launcher/launcher-actions'
import blankProfilePage from '../../static/blankProfilePage.svg'
import DrillDownPane from './launcher-drilldown-pane'
import useNewProjectModalStyles from './new-app-modal-styles'
import type {IApp} from '../../common/types/models'
import {isCloudStudioApp} from '../../../shared/app-utils'
import {combine} from '../../common/styles'
import {Loader} from '../../ui/components/loader'

interface IEighthWallTemplatesPane {
  app: IApp
}

const EighthWallTemplatesPane: React.FC<IEighthWallTemplatesPane> = ({app}) => {
  const themeName = useTheme()
  const classes = useNewProjectModalStyles({themeName})
  const {t} = useTranslation(['cloud-editor-pages'])
  const apps = useSelector(state => state.launcher.searchApps)
  const [drillDownAppUuid, setDrillDownAppUuid] = useState<string>(null)
  const drillDownApp = useSelector(
    state => state.launcher.consoleApps.find(a => a.uuid === drillDownAppUuid)
  )
  const loading = useSelector(state => state.launcher.pending.getSearchApps)

  const drillDownLoading = useSelector(state => state.launcher.pending.getConsoleApp)
  const {getSearchApps, getConsoleApp, clearSearchApps} = useActions(actions)
  const latestAbortController = useRef<AbortController>()
  const [query, setQuery] = useState('')
  const [techType, setTechType] = useState<string[]>([])
  const [framework, setFramework] = useState<string[]>([])

  /* eslint-disable local-rules/hardcoded-copy */
  const techTypes = [
    t('editor_page.project_picker.dropdown.select.all_types'),
    'World Effects',
    'VPS',
    'Image Targets - Curved',
    'Image Targets - Flat',
    'Face Effects',
    'Hand Tracking',
    'Sky Effects',
    'Shared AR',
    'Holograms',
    'Avatars',
  ]

  const frameworks = [
    t('editor_page.project_picker.dropdown.select.all_frameworks'),
    'A-Frame',
    'Three.js',
    'Babylon.js',
  ]

  const templateTabs = [
    {
      name: t('editor_page.project_picker_modal.8th_wall_templates_pane.tab.all_projects'),
      value: 'all',
    },
    {
      name: t('editor_page.project_picker_modal.8th_wall_templates_pane.tab.official_projects'),
      value: '8thwall',
    },
    {
      name: t('editor_page.project_picker_modal.8th_wall_templates_pane.tab.community_projects'),
      value: 'community',
    },
  ]
  /* eslint-enable local-rules/hardcoded-copy */

  const [activeTemplateTab, setActiveTemplateTab] = useState(templateTabs[0])

  useAbandonableEffect(async (executor) => {
    const techTags = []
    if (techType?.length) {
      techTags.push(techType)
    }
    if (framework?.length) {
      techTags.push(framework)
    }

    const reqBody = {
      q: query,
      tech: techTags,
      community: templateTabs.find(({name}) => activeTemplateTab.name === name).value,
      tag: [],
      type: app?.hostingType,
    }

    // For aborting the last fetch request with search-as-you-type feature
    if (latestAbortController.current) {
      latestAbortController.current.abort()
    }
    latestAbortController.current = new AbortController()
    await executor(getSearchApps(reqBody, latestAbortController.current.signal))
  }, [query, techType, framework, activeTemplateTab])

  useEffect(() => () => {
    clearSearchApps()
  }, [])

  const closeDrillDown = () => {
    setDrillDownAppUuid(null)
  }

  const openDrillDown = async (appUuid: string) => {
    await getConsoleApp(appUuid)
    setDrillDownAppUuid(appUuid)
  }

  const onChangeHandler = (type, value, remove = false) => {
    if (type === 'query') {
      setQuery(value)
    }
    if (type === 'tech') {
      if (remove) {
        setTechType(techType.filter(tag => tag !== value))
      } else {
        // techTypes[0] is 'All'
        setTechType(value === techTypes[0]
          ? []
          : techType.concat([value]))
      }
    }
    if (type === 'framework') {
      // frameworks[0] is 'All'
      setFramework(value === frameworks[0] ? [] : [value])
    }
    if (type === 'templateTab') {
      setActiveTemplateTab(value)
    }
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

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <div className={classes.headerBlurb}>
          <img
            src={themeName === 'dark' ? Icons.launcherRocketDark : Icons.launcherRocketLight}
            alt='8th Wall'
          />
          <div className={classes.headerText}>
            {t('editor_page.project_picker_modal.8th_wall_templates_pane.blurb')}
          </div>
        </div>
        {!isCloudStudioApp(app) &&
          <div className={classes.filterContainer}>
            <div className={classes.searchContainer}>
              <img className={classes.searchIcon} src={Icons.search} alt='Search' />
              <input
                className={classes.searchInput}
                type='text'
                placeholder={t('editor_page.project_picker.placeholder.search')}
                aria-label='Search'
                onChange={e => onChangeHandler('query', e.target.value)}
                value={query}
              />
              {loading &&
                <div className={classes.loaderContainer}>
                  {/* eslint-disable-next-line local-rules/ui-component-styling */}
                  <Loader size='tiny' inline centered className={classes.loader} />
                </div>
              }
            </div>
            <div className={classes.dropDownsContainer}>
              <SelectDropDown
                className={classes.dropDown}
                type='tech'
                selected={techType}
                options={techTypes}
                onClickOption={onChangeHandler}
                isMultiSelect='types'
              />
              <SelectDropDown
                className={classes.dropDown}
                type='framework'
                selected={framework}
                options={frameworks}
                onClickOption={onChangeHandler}
              />
            </div>
          </div>
        }
        {isCloudStudioApp(app) &&
          <div role='tablist' className={classes.techTypesContainer}>
            {templateTabs.map((tab, index) => (
              <div
                role='tab'
                tabIndex={index}
                key={tab.name}
                className={
                  combine(classes.templateTabs,
                    activeTemplateTab.name === tab.name && classes.activeTech)
                }
                onClick={() => onChangeHandler('templateTab', tab)}
                onKeyDown={() => onChangeHandler('templateTab', tab)}
              >
                {tab.name}
              </div>
            ))}
          </div>
        }
      </div>
      {!apps?.length && !loading
        ? (
          <div className={classes.noProject}>
            <img alt='blank profile page' src={blankProfilePage} />
            <p>{t('editor_page.project_picker_modal.no_projects_found')}</p>
          </div>
        )
        : (
          <ProjectLibrary
            className={classes.cardContainer}
            apps={apps}
            pageName='project-picker-8th-wall-projects'
            projectCardClickEvent={openDrillDown}
            showAgency
          />
        )
      }
    </div>
  )
}

export default EighthWallTemplatesPane
