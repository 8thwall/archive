import {createSelector} from 'reselect'

import type {IAccount} from '../common/types/models'
import type {RootState} from '../reducer'
import type {UserAccountRole} from '../common/types/db'

const getSelectedAccount: (state: RootState) => IAccount | undefined = createSelector(
  state => state.accounts.selectedAccount,
  state => state.accounts.allAccounts,
  (selectedAccount: string, accounts: IAccount[]) => (
    accounts.find(acct => acct.uuid === selectedAccount)
  )
)

const getSelectedAccountField = <T extends keyof IAccount>(
  // eslint-disable-next-line arrow-parens
  state: RootState,
  field: T
): IAccount[T] | null => {
  const acct = getSelectedAccount(state)
  return acct ? acct[field] : null
}

const getSelectedAccountName = (state: RootState): string | null => {
  const acct = getSelectedAccount(state)
  return acct ? acct.name : null
}

const getSelectedAccountRole = (state: RootState): UserAccountRole | null => {
  const acct = getSelectedAccount(state)
  return acct && acct.Users.length ? acct.Users[0].role : null
}

export {
  getSelectedAccount,
  getSelectedAccountField,
  getSelectedAccountName,
  getSelectedAccountRole,
}
