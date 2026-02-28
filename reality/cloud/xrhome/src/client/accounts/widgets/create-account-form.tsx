import React from 'react'
import {Form} from 'semantic-ui-react'
import {useHistory} from 'react-router-dom'

import accountActions from '../account-actions'
import {getPathForAccount} from '../../common/paths'
import {AccountTypeCardSelects} from '../account-type-card-select'
import {useSelector} from '../../hooks'
import useActions from '../../common/use-actions'

const useHasAccount = (type: string) => useSelector(s => s.accounts.allAccounts
  .some(({accountType, Users}) => {
    if (accountType !== type) {
      return false
    }
    const u = Users.find(({UserUuid}) => UserUuid === s.user.uuid)
    return u && u.role === 'OWNER'
  }))

const CreateAccountForm: React.FC = () => {
  const [accountType, setAccountType] = React.useState('WebDeveloper')

  const hasCamera = useHasAccount('WebCamera')
  const hasWeb = useHasAccount('WebDeveloper')

  const history = useHistory()

  const {error, addAccount} = useActions(accountActions)

  const addAccountAndClearForm = async () => {
    if (hasCamera && accountType === 'WebCamera') {
      error('You are only permitted one FREE AR Camera workspace')
      return
    }
    if (hasWeb && accountType === 'WebDeveloper') {
      // eslint-disable-next-line local-rules/hardcoded-copy
      error('You are only permitted one Basic workspace')
      return
    }
    error('')
    const account = await addAccount({accountType})
    history.push(getPathForAccount(account))
  }

  return (
    <Form onSubmit={addAccountAndClearForm}>
      <Form.Field>
        <AccountTypeCardSelects value={accountType} selectAccountType={setAccountType} />
      </Form.Field>
      <Form.Button primary icon='add square' content='Create' />
    </Form>
  )
}

export {
  CreateAccountForm,
}
