import React, {FC} from 'react'
import {Accordion} from 'semantic-ui-react'

import {useSelector} from '../hooks'
import AccountSidebarAccordion from './account-sidebar-accordion'

const AccountSidebarAccordions: FC = () => {
  const accounts = Array.from(useSelector(state => state.accounts.allAccounts))
    .sort((a1, a2) => a1.name.localeCompare(a2.name))

  return (
    <Accordion exclusive={false}>
      {accounts.map(account => (
        <AccountSidebarAccordion key={account.shortName} account={account} />
      ))}
    </Accordion>
  )
}

export default AccountSidebarAccordions
