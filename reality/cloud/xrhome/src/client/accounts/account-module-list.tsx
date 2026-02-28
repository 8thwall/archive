import React, {useEffect} from 'react'
import {Trans} from 'react-i18next'

import useCurrentAccount from '../common/use-current-account'
import moduleActions from '../modules/actions'
import useActions from '../common/use-actions'
import {ResponsiveCardGroup} from '../widgets/responsive-card-group'
import {ModuleCard} from '../modules/widgets/module-card'
import {NoResultsText} from './dashboard/no-results-text'
import {ModuleEmptySection} from '../modules/module-empty-section'
import {useAccountModules} from '../modules/use-account-modules'

interface IAccountModuleList {
  searchValue: string
}

const AccountModuleList: React.FC<IAccountModuleList> = ({searchValue}) => {
  const account = useCurrentAccount()
  const {listModulesForAccount} = useActions(moduleActions)
  const modules = useAccountModules(account)

  useEffect(() => {
    listModulesForAccount(account.uuid)
  }, [])

  const filteredModules = React.useMemo(() => {
    if (!searchValue) {
      return modules
    } else {
      const searchLower = searchValue.toLowerCase()
      return modules.filter(m => (
        m.title?.toLowerCase().includes(searchLower) ||
        m.name.toLowerCase().includes(searchLower)
      ))
    }
  }, [modules, searchValue])

  return (
    <>

      {modules?.length === 0 && (
        <ModuleEmptySection>
          <Trans
            ns='account-pages'
            i18nKey='account_dashboard_page.account_module_list.no_modules_created_yet'
          >
            <strong>You haven&apos;t created any modules yet.</strong><br />
            Click &lsquo;Create new module&rsquo; to start building your first one!
          </Trans>
        </ModuleEmptySection>
      )}

      {modules?.length > 0 && (filteredModules.length > 0
        ? (
          <ResponsiveCardGroup>
            {filteredModules.map(module => (
              <ModuleCard key={module.uuid} module={module} account={account} />
            ))}
          </ResponsiveCardGroup>
        )
        : <NoResultsText />
      )}
    </>
  )
}

export {
  AccountModuleList,
}
