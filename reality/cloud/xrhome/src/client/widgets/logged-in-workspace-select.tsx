import React from 'react'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'

import {SrOnly} from '../ui/components/sr-only'
import {useSelector} from '../hooks'
import {AccountPathEnum, getPathForAccount} from '../common/paths'
import useCurrentAccount from '../common/use-current-account'
import {StandardDropdownField} from '../ui/components/standard-dropdown-field'

const LoggedInWorkspaceSelect = () => {
  const {t} = useTranslation('navigation')
  const history = useHistory()
  const accounts = useSelector(state => state.accounts.allAccounts)
  const isSmallScreen = useSelector(state => state.common.isSmallScreen)
  const currentAccount = useCurrentAccount()
  const [selectedAccountUuid, setSelectedAccountUuid] = React.useState(currentAccount?.uuid)

  // TODO(kim): Add logic to more gracefully handle target destination
  // 1) User is on workspace-page => navigate to workspace page
  // 2) user is on any other page on account path enum => navigate to that page
  // 3) user is on any project page => navigate to worksapce page

  const handleAccountChange = (uuid: string) => {
    setSelectedAccountUuid(uuid)
    const selectedAccount = accounts.find(account => account.uuid === uuid)
    if (selectedAccount) {
      history.push(getPathForAccount(selectedAccount, AccountPathEnum.workspace))
    }
  }

  return (
    <StandardDropdownField
      id='workspace'
      value={selectedAccountUuid}
      onChange={handleAccountChange}
      label={<SrOnly>{t('logged_in_workplace_select')}</SrOnly>}
      placeholder={t('logged_in_workplace_select')}
      options={accounts?.map(a => ({value: a.uuid, content: a.name}))}
      width={isSmallScreen ? undefined : 'maxContent'}
    />
  )
}

export {LoggedInWorkspaceSelect}
