/* eslint-disable no-alert */
import React from 'react'
import {createUseStyles} from 'react-jss'

import useCurrentAccount from '../common/use-current-account'
import Page from '../widgets/page'
import MainErrorMessage from '../home/error-message'
import WorkspaceCrumbHeading from '../widgets/workspace-crumb-heading'
import CollapsibleSetting from '../settings/collapsible-setting'
import useCurrentApp from '../common/use-current-app'
import useActions from '../common/use-actions'
import {PrimaryButton} from '../ui/components/primary-button'
import {IModuleActionsContext, ModuleActionsContext} from '../editor/modules/module-actions-context'
import {DependencyContext, IDependencyContext} from '../editor/dependency-context'
import {SpaceBetween} from '../ui/layout/space-between'
import ActionBar from '../ui/components/action-bar'
import CopyableBlock from '../widgets/copyable-block'
import {ModuleImportModal} from '../editor/modules/module-import-modal'
import type {ModuleDependency} from '../../shared/module/module-dependency'
import {MAX_DEPENDENCIES_PER_BUILD} from '../../shared/module/module-constants'
import * as SelfHostedDependencies from '../modules/self-hosted/self-hosted-reducer'
import {SelfHostedDependencyPane} from '../modules/self-hosted/self-hosted-dependency-pane'
import dependencyActions from '../editor/dependency-actions'
import {useAbandonableFunction} from '../hooks/use-abandonable-function'
import {RepoIdProvider} from '../git/repo-id-context'
import {ModuleTabs} from '../modules/self-hosted/module-tabs'
import {IconButton} from '../ui/components/icon-button'
import {Icon} from '../ui/components/icon'
import {Loader} from '../ui/components/loader'
import {MILLISECONDS_PER_SECOND} from '../../shared/time-utils'
import {useWebsocketHandler} from '../hooks/use-websocket-handler'
import {SOCKET_URL} from '../common/websocket-constants'
import WebsocketPool from '../websockets/websocket-pool'
import {ModuleEmptySection} from '../modules/module-empty-section'
import {useEvent} from '../hooks/use-event'
import {useChangeEffect} from '../hooks/use-change-effect'
import {getOrderedDependencies} from '../modules/self-hosted/dependency-order'
import {combine} from '../common/styles'
import {gray4} from '../static/styles/settings'
import {StandardLink} from '../ui/components/standard-link'
import {useUserGivenName} from '../user/use-current-user'

const COPY_RESET_DELAY_MS = 3 * MILLISECONDS_PER_SECOND
const SCRIPT_INDENTATION = '  '
const REFERENCE_MODULES_COMMENT = '  // Reference your modules using the following variables\n'

const AUTOSAVE_DELAY_MS = 5 * MILLISECONDS_PER_SECOND

const SETTINGS_UPDATE_ACTION = 'PROJECT_MODULE_SETTINGS_UPDATE'

const useStyles = createUseStyles({
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '2rem',
  },
  importButton: {
    cursor: 'pointer',
    borderRadius: '6px',
    padding: '7px 16px',
    display: 'inline-flex',
    gap: '0.5rem',
    alignItems: 'center',
    border: `1px solid ${gray4}`,
  },
})

const getVariableName = alias => alias.split(/-|_/g)
  .filter(Boolean)
  .map((aliasPart, index) => (
    index ? aliasPart.charAt(0).toUpperCase() + aliasPart.slice(1) : aliasPart
  )).join('')

const generateModulesScript = (dependencies: Record<string, ModuleDependency>) => {
  const scriptLines = ['\n\n', '<script>\n', REFERENCE_MODULES_COMMENT]
  getOrderedDependencies(dependencies).forEach((d) => {
    scriptLines.push(SCRIPT_INDENTATION)
    scriptLines.push(
      `const ${getVariableName(d.alias)} = window.Modules8.getModule({moduleId: '${d.moduleId}'})\n`
    )
  })
  scriptLines.push('</script>')
  return scriptLines.join('')
}

const SelfHostedModulePage: React.FC<{}> = () => {
  const account = useCurrentAccount()
  const app = useCurrentApp()
  const {
    fetchModuleExportDependencyHtml, fetchProjectDependencies, updateProjectDependencies,
  } = useActions(dependencyActions)
  const fetchExportDependencyAbandonable = useAbandonableFunction(fetchModuleExportDependencyHtml)
  const fetchProjectDependenciesAbandonable = useAbandonableFunction(fetchProjectDependencies)
  const updateProjectDependenciesAbandonable = useAbandonableFunction(updateProjectDependencies)

  const [isImporting, setIsImporting] = React.useState(false)
  const {fetchModuleImportDependency} = useActions(dependencyActions)
  const importDependency = useAbandonableFunction(fetchModuleImportDependency)

  const [{
    dependenciesById, isLoaded, previousDependenciesById, modifiedDependencies, lastUserEdits,
    didRefresh,
  }, dispatch] = React.useReducer(
    SelfHostedDependencies.reducer, {
      dependenciesById: {},
      isLoaded: false,
      previousDependenciesById: {},
      modifiedDependencies: [],
      lastUserEdits: {},
    }
  )

  const userName = useUserGivenName()

  const [shownSnippet, setShownSnippet] = React.useState('')
  const [copiedMainSnippet, setCopiedMainSnippet] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [activeDependencyId, setActiveDependencyId] = React.useState<string>(null)
  const [accordionExpanded, setAccordionExpanded] = React.useState(false)

  const classes = useStyles()

  const getSnippet = async (currentDependenciesById): Promise<string> => {
    if (Object.keys(currentDependenciesById).length > 0) {
      try {
        const snippet = await fetchExportDependencyAbandonable(app.uuid, currentDependenciesById)
        setShownSnippet(snippet.html + generateModulesScript(currentDependenciesById))
        return snippet.html
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
    }
    setShownSnippet('')
    return ''
  }

  React.useEffect(() => {
    fetchProjectDependenciesAbandonable(app.uuid).then((res) => {
      dispatch(SelfHostedDependencies.fullLoad(res.dependenciesById))
      getSnippet(res.dependenciesById)
    })
  }, [app.uuid])

  React.useEffect(() => {
    if (!copiedMainSnippet) {
      return undefined
    }

    const timer = setTimeout(() => {
      setCopiedMainSnippet(false)
    }, COPY_RESET_DELAY_MS)

    return () => {
      clearTimeout(timer)
    }
  }, [copiedMainSnippet])

  const specifier = {
    baseUrl: SOCKET_URL,
    params: {channel: `self-hosted.${app.uuid}`},
  }

  const refreshTimeout = React.useRef<ReturnType<typeof setTimeout>>()
  const autosaveTimeout = React.useRef<ReturnType<typeof setTimeout>>()

  React.useEffect(() => () => {
    clearTimeout(refreshTimeout.current)
    clearTimeout(autosaveTimeout.current)
  }, [])

  useWebsocketHandler((msg: {action: string}) => {
    if (msg?.action === SETTINGS_UPDATE_ACTION) {
      dispatch(SelfHostedDependencies.liveSettingsUpdate(msg as any, Date.now()))
      clearTimeout(refreshTimeout.current)
      refreshTimeout.current = setTimeout(async () => {
        const res = await fetchProjectDependenciesAbandonable(app.uuid)
        dispatch(SelfHostedDependencies.refresh(res.dependenciesById))
      }, 1000)
    }
  }, specifier)

  useChangeEffect(([prevDidRefresh]) => {
    if (didRefresh && !prevDidRefresh) {
      // NOTE(christoph): We do this in an effect after the reducer updates with the merged state
      dispatch(SelfHostedDependencies.confirmRefresh())
      getSnippet(dependenciesById)
    }
  }, [didRefresh])

  const dependencyCount = Object.keys(dependenciesById).length

  const copyMainSnippetToClipboard = (mainSnippet) => {
    navigator.clipboard.writeText(mainSnippet)
    setCopiedMainSnippet(true)
  }

  const saveSettings = useEvent(async () => {
    clearTimeout(autosaveTimeout.current)
    const latest = await updateProjectDependenciesAbandonable(
      app.uuid, dependenciesById, previousDependenciesById
    )
    dispatch(SelfHostedDependencies.fullLoad(latest.dependenciesById))
    WebsocketPool.broadcastMessage(specifier, {
      action: SETTINGS_UPDATE_ACTION,
      data: {
        userName,
        dependencyIds: modifiedDependencies,
      },
    })
    return getSnippet(latest.dependenciesById)
  })

  const loadAndCopySnippet = async () => {
    setLoading(true)
    const mainSnippet = await saveSettings()
    setLoading(false)
    if (mainSnippet) {
      copyMainSnippetToClipboard(mainSnippet)
    }
  }

  React.useEffect(() => {
    const currentDependenciesCount = Object.keys(dependenciesById).length
    const prevDependenciesCount = Object.keys(previousDependenciesById).length
    if (currentDependenciesCount === 0 && prevDependenciesCount > 0) {
      saveSettings()
    }
  }, [dependenciesById])

  if (!isLoaded) {
    return <Loader />
  }

  const dispatchEdit: typeof dispatch = (action) => {
    dispatch(action)
    clearTimeout(autosaveTimeout.current)
    autosaveTimeout.current = setTimeout(saveSettings, AUTOSAVE_DELAY_MS)
  }

  const moduleActionsContext: IModuleActionsContext = {
    onAliasChange: async () => {
      alert('Not implemented')
    },
    onDeleteDependency: () => {
      alert('Not implemented')
    },
    addDependency: async (moduleId, target, alias, targetOverride) => {
      const dependency: ModuleDependency = await importDependency(moduleId, app.uuid)
      if (dependenciesById[dependency.dependencyId]) {
        return
      }
      dependency.alias = alias
      // TODO(christoph): Save targetOverride separately
      dependency.target = targetOverride || target
      dependency.config = {}

      dispatchEdit(SelfHostedDependencies.addDependency(dependency))
    },
  }

  const dependencyContext: IDependencyContext = {
    aliasToPath: Object.values(dependenciesById).reduce((acc, dep) => {
      acc[dep.alias] = dep.dependencyId
      return acc
    }, {}),
    moduleIdToAlias: Object.values(dependenciesById).reduce((acc, dep) => {
      acc[dep.moduleId] = dep.alias
      return acc
    }, {}),
    dependenciesByPath: dependenciesById,
    targetOverrides: {},
    dependencyIdToPath: Object.values(dependenciesById).reduce((acc, dep) => {
      acc[dep.dependencyId] = dep.dependencyId
      return acc
    }, {}),
  }

  const visibleDependency = (activeDependencyId && dependenciesById[activeDependencyId]) ||
                            getOrderedDependencies(dependenciesById)[0]
  const visibleDependencyId = visibleDependency?.dependencyId

  return (
    <RepoIdProvider value={null}>
      <DependencyContext.Provider value={dependencyContext}>
        <ModuleActionsContext.Provider value={moduleActionsContext}>
          {isImporting && <ModuleImportModal
            onClose={() => setIsImporting(false)}
            isSelfHosted
            appHostingType={app.hostingType}
          />}
          <Page title='Project Modules'>
            <MainErrorMessage />
            <WorkspaceCrumbHeading text='Project Modules' account={account} app={app} />

            <SpaceBetween direction='vertical'>

              <p>
                8th Wall Modules is a comprehensive package manager and configurator that
                allows you to save and reuse components (code, assets, files) across projects
                in your Self-Hosted Project.{' '}
                <StandardLink href='https://8th.io/modules-in-self-hosted' newTab>
                  Learn More in Documentation ›
                </StandardLink>
              </p>

              <CollapsibleSetting
                active={accordionExpanded}
                onClick={() => setAccordionExpanded(!accordionExpanded)}
                title='Project Modules Integration'
              >
                <p>
                  Get started with Project Modules by adding your desired modules below and
                  then copy-pasting the corresponding code snippet into your project.
                  <br />
                  {shownSnippet &&
                    <i>
                      NOTE: You will have to re-copy the code snippet and update relevant projects
                      whenever you make a change to the module config settings.
                    </i>
                  }
                </p>

                {shownSnippet &&
                  <CopyableBlock
                    text={shownSnippet}
                    description={'Paste the following code snippet into your \
                        self-hosted project to use modules.'
                      }
                  />
                }
              </CollapsibleSetting>
              <div className={classes.actionRow}>
                {dependencyCount === 0 &&
                  <ActionBar>
                    <button
                      type='button'
                      className={combine('style-reset', classes.importButton)}
                      onClick={() => setIsImporting(true)}
                      disabled={dependencyCount >= MAX_DEPENDENCIES_PER_BUILD}
                    >
                      <Icon stroke='plus' color='gray4' />
                      Import Module
                    </button>

                  </ActionBar>
                }
                {dependencyCount > 0 &&
                  <ActionBar>
                    <ModuleTabs
                      visibleDependencyId={visibleDependency?.dependencyId}
                      onSelect={setActiveDependencyId}
                      lastUserEdits={lastUserEdits}
                    />
                    <IconButton
                      text='Add Module'
                      stroke='plus'
                      onClick={() => setIsImporting(true)}
                      disabled={dependencyCount >= MAX_DEPENDENCIES_PER_BUILD}
                    />
                  </ActionBar>
                }
                {dependencyCount > 0 &&
                  <ActionBar>
                    <PrimaryButton
                      loading={loading}
                      onClick={loadAndCopySnippet}
                    >
                      {copiedMainSnippet ? 'Copied!' : <>Copy&nbsp;Code</>}
                    </PrimaryButton>
                  </ActionBar>
                }
              </div>

              {dependencyCount === 0 && (
                <ModuleEmptySection>
                  <strong>You haven&apos;t added any modules to your project yet.</strong><br />
                  Click &lsquo;+ Import Module&rsquo; to start adding a module to your project.
                </ModuleEmptySection>
              )}
              {visibleDependency &&
                <SelfHostedDependencyPane
                  dependency={visibleDependency}
                  onChange={(updater) => {
                    dispatchEdit(
                      SelfHostedDependencies.updateDependency(visibleDependencyId, updater)
                    )
                  }}
                  onDelete={() => {
                    dispatchEdit(SelfHostedDependencies.deleteDependency(visibleDependencyId))
                  }}
                />
              }
            </SpaceBetween>
          </Page>
        </ModuleActionsContext.Provider>
      </DependencyContext.Provider>
    </RepoIdProvider>
  )
}

export default SelfHostedModulePage
