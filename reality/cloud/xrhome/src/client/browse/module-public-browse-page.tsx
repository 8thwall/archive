import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {useParams} from 'react-router-dom'

import {Loader} from '../ui/components/loader'
import Page from '../widgets/page'
import Title from '../widgets/title'
import ErrorMessage from '../home/error-message'
import actions from './public-browse-actions'
import NotFoundPage from '../home/not-found-page'
import ModulePublicBrowseView from './module-public-browse-view'
import useActions from '../common/use-actions'
import {useSelector} from '../hooks'
import IndustryCarousel from '../discovery/industry-carousel'
import {KEYWORDS} from '../../shared/discovery-constants'
import {getDisplayNameForModule} from '../../shared/module/module-display-name'
import moduleActions from '../modules/actions'
import moduleVersionActions from '../modules/module-version-actions'
import {compareVersionInfo} from '../../shared/module/compare-module-target'
import {deriveModuleCoverImageUrl} from '../../shared/module-cover-image'

interface IModulePublicBrowsePage {
  match: { params: { account: string, moduleName: string } }
}

const useStyles = createUseStyles({
  content: {
    'display': 'flex',
    'flexDirection': 'column',
    '& .code-editor': {
      flexGrow: '1',
      display: 'flex',
      flexDirection: 'column',
    },
  },
  browse: {
    '& > .page-content': {
      paddingTop: '2em',  // padding from the header
    },
  },
})

const ModulePublicBrowsePage: React.FC<IModulePublicBrowsePage> = () => {
  const classes = useStyles()
  const {account: accountName, moduleName} = useParams<{account: string, moduleName: string}>()
  const {getPublicAccount} = useActions(actions)
  const {
    listPublicModulesForAccount, fetchModuleReadme, loadModuleFeaturedDescription,
  } = useActions(moduleActions)
  const {fetchPublicModuleVersions} = useActions(moduleVersionActions)
  const accountUuid = useSelector(state => state.publicBrowse.accountByName[accountName])
  const [fetchedReadme, setFetchedReadme] = React.useState(false)
  const [loadedDescription, setLoadedDescription] = React.useState(false)
  const [loadedModules, setLoadedModules] = React.useState(false)
  const [loadedAccount, setLoadedAccount] = React.useState(!!accountUuid)

  React.useEffect(() => {
    (async () => {
      if (accountUuid) {
        await listPublicModulesForAccount(accountUuid)
        setLoadedModules(true)
      }
    }
    )()
  }, [accountUuid])

  //   TODO(Dale): switch to moduleByName
  const module = useSelector(s => (
    accountUuid && s.modules?.publicByAccountUuid[accountUuid]
      ?.map(i => s.modules.publicEntities[i])
      ?.find(m => m.name === moduleName)
  ))

  const account = useSelector(state => state.publicBrowse.Accounts[accountUuid])

  const versions = useSelector(
    s => s.modules.versions[module?.uuid]
  )?.patchData.filter(version => !version.deprecated)

  const latestVersion = versions && [...versions].sort(compareVersionInfo)[0]

  const [featuredDescription, setFeaturedDescription] = React.useState(null)

  React.useEffect(() => {
    (async () => {
      if (!account) {
        await getPublicAccount(accountName)
        setLoadedAccount(true)
      }
    })()
  }, [accountName, moduleName])

  React.useEffect(() => {
    if (module?.uuid) {
      fetchPublicModuleVersions(module.uuid)
    }
  }, [module?.uuid])

  React.useEffect(() => {
    (async () => {
      try {
        setFetchedReadme(false)
        if (module?.featuredDescriptionId) {
          setFeaturedDescription(await loadModuleFeaturedDescription(module))
        } else if (latestVersion) {
          // Note(Dale): fall back for modules that have no overview (8th wall first party modules)
          const {readme} = await fetchModuleReadme({
            moduleId: module.uuid, target: latestVersion.patchTarget,
          })
          setFeaturedDescription(readme)
          setFetchedReadme(true)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        setLoadedDescription(true)
      }
    })()
  }, [module?.featuredDescriptionId, latestVersion])

  const failedToLoadModule = (loadedAccount && !accountUuid) || (loadedModules && !module) ||
  versions?.length === 0
  if (failedToLoadModule) {
    return <NotFoundPage />
  }

  const loading = !loadedAccount || !loadedModules || !loadedDescription || !versions
  if (loading) {
    return <Loader />
  }

  return (
    <Page
      className={classes.browse}
      centered={false}
      title={module.title}
      image={deriveModuleCoverImageUrl(module)}
      description={module.description}
    >
      <Title>{`${getDisplayNameForModule(module)} | ${account?.name}`}</Title>
      <ErrorMessage />
      <div className={classes.content}>
        <ModulePublicBrowseView
          accountUuid={accountUuid}
          module={module}
          featuredDescriptionText={featuredDescription}
          versions={versions}
          latestVersion={latestVersion}
          useReadme={fetchedReadme}
        />
      </div>
      {/* TODO(Dale): Make an industry carousel for modules and use this here */}
      <IndustryCarousel pageName='public-project' keywords={KEYWORDS} showExploreMore />
    </Page>
  )
}

export default ModulePublicBrowsePage
