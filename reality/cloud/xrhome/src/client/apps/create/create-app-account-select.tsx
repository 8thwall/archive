import React from 'react'
import {useHistory} from 'react-router-dom'
import {Dropdown} from 'semantic-ui-react'
import {join} from 'path'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import type {DeepReadonly} from 'ts-essentials'

import {withAccountsLoaded} from '../../common/with-state-loaded'
import {
  AccountPathEnum, getPathForAccount, getPathForAppNoTrailing,
} from '../../common/paths'
import {
  getPlanTypeForAccountType, isEditorEnabled, isWebAccount,
} from '../../../shared/account-utils'
import type {
  AccountWithApps, IAccount, IApp, IPublicAccount, IPublicApp,
} from '../../common/types/models'
import useTextStyles from '../../styles/text-styles'
import {combine} from '../../common/styles'
import {gray3} from '../../static/styles/settings'
import useCurrentAccount from '../../common/use-current-account'
import {useSelector} from '../../hooks'

const useStyles = createUseStyles({
  workspaceSelection: {
    '& .ui.disabled.selection.dropdown > .dropdown.icon': {
      display: 'none',
    },
  },
  disabled: {
    color: gray3,
  },
})

const generateAccountOptions = (
  accounts: DeepReadonly<Array<AccountWithApps>>,
  duplicatingProject: boolean = false,
  upgradeRequired: string
) => accounts.map((account) => {
  const accountName = `${account.name} - ${getPlanTypeForAccountType(account.accountType)}`
  const isDisabled = duplicatingProject ? !isWebAccount(account) : false

  return {
    key: account.uuid,
    value: account.uuid,
    text: (duplicatingProject && !isEditorEnabled(account))
      ? `${accountName} ${upgradeRequired}`
      : accountName,
    disabled: isDisabled,
  }
})

interface ICreateAppAccountSelect {
  fromAccount?: IAccount | IPublicAccount
  fromApp?: IApp | IPublicApp
  disabled?: boolean
}

const CreateAppAccountSelect: React.FC<ICreateAppAccountSelect> = ({
  fromAccount, fromApp, disabled = false,
}) => {
  const account = useCurrentAccount()
  const allAccounts = useSelector(s => s.accounts.allAccounts)
  const history = useHistory()
  const textStyles = useTextStyles()
  const classes = useStyles()
  const {t} = useTranslation(['app-pages'])

  const isDuplicating = !!fromApp
  const onChange = (_, data: {value: string}) => {
    const nextAccount = allAccounts.find(a => a.uuid === data.value)
    let path = getPathForAccount(nextAccount, fromApp
      ? AccountPathEnum.duplicateProject
      : AccountPathEnum.createProject)
    if (fromApp) {
      path = join(path, getPathForAppNoTrailing(fromAccount, fromApp))
    }
    history.push(path)
  }
  const accountOptions = generateAccountOptions(allAccounts, isDuplicating,
    t('create_project_page.create_app_account_select.upgrade_required'))

  return (
    <div className={classes.workspaceSelection}>
      {disabled
        ? (
          <h3 className={combine(classes.disabled, textStyles.miniHeading)}>
            {t('create_project_page.create_app_account_select.heading.destination_workspace')}
          </h3>)
        : (
          <h3 className={textStyles.miniHeading}>
            {t('create_project_page.create_app_account_select.heading.select_workspace')}
            <span className={textStyles.requiredField}> *</span>
          </h3>)
      }
      <Dropdown
        fluid
        selection
        placeholder={
          t('create_project_page.create_app_account_select.heading.select_workspace')
        }
        options={accountOptions}
        value={account && account.uuid}
        selectOnBlur={false}
        onChange={onChange}
        style={{marginBottom: '1em'}}
        disabled={disabled}
      />
    </div>
  )
}

export default withAccountsLoaded(CreateAppAccountSelect)
