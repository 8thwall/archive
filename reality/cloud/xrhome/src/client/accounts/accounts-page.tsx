import * as React from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Message, Card, Header, Container} from 'semantic-ui-react'
import {join} from 'path'
import {useTranslation} from 'react-i18next'

import HeadingTitle from '../widgets/heading-title'
import NotFoundPage from '../home/not-found-page'
import Page from '../widgets/page'
import accountActions from './account-actions'
import ErrorMessage from '../home/error-message'
import {getPathForWorkspacesPage, getPathForAccount, AccountPathEnum} from '../common/paths'
import {sortByAccount} from '../common'
import {withAccountsLoaded} from '../common/with-state-loaded'

import {UpdateAccountForm} from './widgets/update-account-form'
import {CreateAccountForm} from './widgets/create-account-form'
import {AccountCard} from './widgets/account-card'
import {usePendoAccountEffect} from '../common/use-pendo'
import type {AccountWithApps} from '../common/types/models'
import useActions from '../common/use-actions'
import {useSelector} from '../hooks'
import {PrimaryButton} from '../ui/components/primary-button'
import {Icon} from '../ui/components/icon'

const getAppCount = (account: AccountWithApps) => {
  const appCount = account.Apps && account.Apps.filter((
    a => a.status !== 'DELETED' && a.hostingType !== 'INTERNAL')).length
  return appCount || 0
}

const AccountsPage = () => {
  const accounts = useSelector(state => state.accounts.allAccounts)
  const history = useHistory()
  const {t} = useTranslation(['account-pages'])

  const sortedAccounts = [...accounts].sort(sortByAccount)

  return (
    <Page>
      <HeadingTitle className='main'>{t('accounts_page.heading')}</HeadingTitle>
      <ErrorMessage />
      <Container className='topContainer content' fluid>
        <p>{t('accounts_page.blurb')}</p>

        {/* TODO(wayne): Enable this when we handle upgrade/downgrade flow comprehensively */}
        {BuildIf.ALL_QA &&
          <p>
            <PrimaryButton onClick={() => history.push(join(getPathForWorkspacesPage(), 'new'))}>
              <Icon inline stroke='plus' /> {t('accounts_page.button.create_new_workspace')}
            </PrimaryButton>
          </p>
        }

        <Header as='h2'>{t('accounts_page.card_group.heading')}</Header>
        {accounts.length &&
          <Card.Group itemsPerRow={2}>
            {sortedAccounts.map(acct => (
              <AccountCard
                key={acct.uuid}
                a={{...acct}}
                isOwner={acct.Users[0].role === 'OWNER'}
                role={acct.Users?.[0].role || 'UNKNOWN'}
                appCount={getAppCount(acct)}
                select={() => history.push(getPathForAccount(acct))}
                onManageAccountClick={(event) => {
                  history.push(getPathForAccount(acct, AccountPathEnum.account))
                  event.stopPropagation()
                }}
                editAcct={(event) => {
                  history.push(getPathForAccount(acct, AccountPathEnum.publicProfile))
                  event.stopPropagation()
                }}
              />
            ))}
          </Card.Group>
        }
        {!accounts.length &&
          <Message info>{t('accounts_page.message.no_accounts')}</Message>
        }
      </Container>
    </Page>
  )
}

interface IEditAccountPage {
  account: AccountWithApps
  deleteAcct: (acct: {uuid: string, name: string}) => void
}

const EditAccountPage: React.FunctionComponent<IEditAccountPage> = ({account, deleteAcct}) => {
  const history = useHistory()
  const {t} = useTranslation(['account-pages'])
  usePendoAccountEffect(account)
  return (
    <Page>
      <HeadingTitle className='main'>
        {t('edit_account_page.heading', {name: account.name})}
      </HeadingTitle>
      <ErrorMessage />
      <Container className='topContainer content' fluid>
        <UpdateAccountForm
          account={account}
          onCancel={() => history.push(getPathForWorkspacesPage())}
          onDelete={() => deleteAcct(account)}
        />
      </Container>
    </Page>
  )
}

const CreateAccountPage = () => (
  <Page>
    <HeadingTitle className='main'>Create a New Workspace</HeadingTitle>
    <ErrorMessage />
    <Container className='topContainer content' fluid>
      <CreateAccountForm />
    </Container>
  </Page>
)

const Wrapper = () => {
  const accounts = useSelector(state => state.accounts.allAccounts)
  const {routeAccountName} = useParams<{routeAccountName: string}>()
  const {deleteAccount, error} = useActions(accountActions)
  const history = useHistory()

  if (!routeAccountName) {
    return <AccountsPage />
  }

  if (routeAccountName === 'new') {
    return <CreateAccountPage />
  }

  const selectedAccount = accounts.find(a => a.shortName === routeAccountName)

  if (!selectedAccount) {
    return <NotFoundPage />
  }

  return (
    <EditAccountPage
      account={selectedAccount}
      deleteAcct={({uuid, name}) => {
        if (accounts.length === 1) {
          error('You must have at least one workspace')
          return
        }
        const verify = prompt(`This is irreversible, all applications associated with this workspace will be disabled.\n\nAre you sure you want to delete company '${name}'?\n\nType 'DELETE' to confirm.`)
        if (verify === 'DELETE') {
          deleteAccount(uuid)
            .then(history.push(getPathForWorkspacesPage()))
        }
      }}
    />
  )
}

export default withAccountsLoaded(Wrapper)
