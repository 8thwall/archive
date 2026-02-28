import React from 'react'

import Page from '../widgets/page'
import ModuleImportForm from './module-import-form'
import {useSelector} from '../hooks'
import useActions from '../common/use-actions'
import moduleActions from './actions'
import actions from '../browse/public-browse-actions'

interface IModuleImportPage {
  match: {params: {fromAccount: string, moduleName: string}}
}

const ModuleImportPage: React.FunctionComponent<IModuleImportPage> = ({match}) => {
  const {fromAccount: accountName, moduleName} = match.params

  const {listPublicModulesForAccount} = useActions(moduleActions)
  const {getPublicAccount} = useActions(actions)

  const accountUuid = useSelector(state => state.publicBrowse.accountByName[accountName])
  const account = useSelector(state => state.publicBrowse.Accounts[accountUuid])

  React.useEffect(() => {
    (async () => {
      if (!account) {
        await Promise.all([
          getPublicAccount(accountName),
        ])
      }
    })()
  }, [accountName, moduleName])

  React.useEffect(() => {
    (async () => {
      if (accountUuid) {
        await Promise.all([
          listPublicModulesForAccount(accountUuid),
        ])
      }
    })()
  }, [accountUuid])

  //   TODO(Dale): switch to moduleByName
  const module = useSelector(s => (
    accountUuid && s.modules?.publicByAccountUuid[accountUuid]
      ?.map(i => s.modules.publicEntities[i])
      ?.find(m => m.name === moduleName)
  ))

  return (
    <Page>
      {module && account &&
        <ModuleImportForm
          module={module}
          fromAccount={account}
        />}
    </Page>
  )
}

export default ModuleImportPage
