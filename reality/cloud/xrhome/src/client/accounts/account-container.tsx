import * as React from 'react'
import {useRouteMatch} from 'react-router-dom'

import {accountPages} from './account-config'
import ContainerSwitch from '../widgets/container-switch'
import {getSelectedAccount} from './account-select'
import AccountSidebar from '../widgets/account-sidebar'
import {connect} from '../common/connect'
import type {AccountPathEnum} from '../common/paths'
import {usePrivateNavigationEnabled} from '../brand8/brand8-gating'

const AccountContainer = ({account}) => {
  const brand8NavigationEnabled = usePrivateNavigationEnabled()
  const filteredPages = accountPages.filter(a => (
    a.availableOn === undefined || a.availableOn(account)
  ))
  const match = useRouteMatch<{currentPath: AccountPathEnum}>('/:accountSn/:currentPath')
  const foundPage = filteredPages.find(page => page.path === match.params.currentPath)
  const hideSidebar = brand8NavigationEnabled || foundPage?.hideSidebar
  return (
    <div className='with-sidebar'>
      {!hideSidebar && <AccountSidebar />}
      <ContainerSwitch pages={filteredPages} />
    </div>
  )
}

export default connect(state => ({
  account: getSelectedAccount(state),
}))(AccountContainer)
