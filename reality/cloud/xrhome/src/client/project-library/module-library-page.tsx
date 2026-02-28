import React from 'react'
import {useTranslation} from 'react-i18next'

import ErrorMessage from '../home/error-message'
import Page from '../widgets/page'
import ProjectCardPlaceholder from '../widgets/project-card-placeholder'
import {Footer} from '../widgets/web8-footer'
import {useLibraryStyles} from './library-styles'
import useActions from '../common/use-actions'
import moduleActions from '../modules/actions'
import {usePublicModules} from '../modules/use-public-modules'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import ModuleCard from '../browse/module-card'
import {ProjectModuleLibraryHeader} from './project-module-library-header'
import Icons from '../apps/icons'
import {useSelector} from '../hooks'
import {useUserHasSession} from '../user/use-current-user'
import {isUpgradedWebAccount} from '../../shared/account-utils'
import {filterCompatibleModules} from '../../shared/module-compatibility'
import {withAccountsLoaded} from '../common/with-state-loaded'

const ModuleLibraryPage: React.FC = () => {
  const classes = useLibraryStyles()
  const {t} = useTranslation(['public-featured-pages'])
  const hasUpgradedWebAccount = useSelector(
    state => !!state.accounts.allAccounts.find(acct => isUpgradedWebAccount(acct))
  )
  const isLoggedIn = useUserHasSession()
  const showEditorModules = !isLoggedIn || hasUpgradedWebAccount
  const rawModules = usePublicModules()
  const modules = showEditorModules
    ? rawModules
    : filterCompatibleModules(rawModules, false, 'CLOUD_STUDIO')
  const {listPublicModules} = useActions(moduleActions)
  const [isInitialLoad, setIsInitialLoad] = React.useState(true)
  const [searchValue, setSearchValue] = React.useState('')

  useAbandonableEffect(async (abandon) => {
    await abandon(listPublicModules())
    setIsInitialLoad(false)
  }, [])

  const filteredModules = React.useMemo(() => {
    if (!searchValue) {
      return modules
    } else {
      const searchLower = searchValue.toLowerCase()
      return modules.filter(
        m => [m.title, m.description, m.name, m.Account.name]
          .some(v => v?.toLowerCase().includes(searchLower))
      )
    }
  }, [modules, searchValue])

  const getModuleCardsView = () => {
    if (!modules || isInitialLoad) {
      return (<ProjectCardPlaceholder count={24} className={classes.cardContainer} />)
    } else {
      return (
        <div className={classes.cardContainer}>
          {filteredModules.map(m => (
            <ModuleCard
              key={m.uuid}
              account={m.Account}
              module={m}
              pageName='module-library'
              showAgency
            />
          ))}
        </div>
      )
    }
  }

  return (
    <Page
      centered={false}
      title={t('module_library_page.title')}
      className={classes.page}
      hasFooter={false}
    >
      <ErrorMessage />
      <div className={classes.content}>
        <ProjectModuleLibraryHeader />
        <div className={classes.searchContainer}>
          <img className={classes.searchIcon} src={Icons.search} alt='' />
          <input
            className={classes.searchInput}
            type='text'
            aria-label={t('project_library_page.input.search_label')}
            placeholder={t('project_library_page.input.placeholder.search_by_keyword')}
            onChange={e => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>
        {getModuleCardsView()}
      </div>
      <Footer />
    </Page>
  )
}

const WrappedModuleLibraryPage = withAccountsLoaded(ModuleLibraryPage)

const Wrapper = () => {
  const isLoggedIn = useUserHasSession()

  if (isLoggedIn) {
    return <WrappedModuleLibraryPage />
  } else {
    return <ModuleLibraryPage />
  }
}

export default Wrapper
