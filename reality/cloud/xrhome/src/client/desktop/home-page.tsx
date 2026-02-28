import React from 'react'
import {Redirect, useHistory, useParams} from 'react-router-dom'
import {createUseStyles} from 'react-jss'
import type {DeepReadonly} from 'ts-essentials'

import {useTranslation} from 'react-i18next'

import {PROD} from '../../shared/studiohub/console-server-url-types'
import {createElectronUrl} from '../../shared/studiohub/create-electron-url'
import {getHomePath, HomePathParams} from './desktop-paths'
import {useSelector} from '../hooks'
import {StandardDropdownField} from '../ui/components/standard-dropdown-field'
import {TemplatePicker} from './template-picker'
import {ProjectList} from './project-list'
import {SrOnly} from '../ui/components/sr-only'
import {SpaceBetween} from '../ui/layout/space-between'
import {SideNavBar} from './side-nav-bar'
import {EnclosedAccountProvider} from '../accounts/enclosed-account-context'
import {isCloudStudioEnabled} from '../../shared/account-utils'
import {AssetLabStateContextProvider, useAssetLabStateContext} from '../asset-lab/asset-lab-context'
import AssetLabModal from '../asset-lab/asset-lab-modal'
import {SecondaryButton} from '../ui/components/secondary-button'
import {ProfileIconButton} from './profile-icon-button'
import {Loader} from '../ui/components/loader'
import useActions from '../common/use-actions'
import accountActions from '../accounts/account-actions'
import {NewProjectModal} from './new-project-modal'
import {Icon} from '../ui/components/icon'
import {PrimaryButton} from '../ui/components/primary-button'
import {useStringUrlState} from '../hooks/url-state'
import {FirstTimeSetupView} from './first-time-setup-view'
import {usePendoAccountEffect} from '../common/use-pendo'
import type {IAccount} from '../common/types/models'
import {useFreeCreditAllowance} from '../accounts/use-free-credit-allowance'

const useStyles = createUseStyles({
  homePage: {
    flex: '1 1 auto',
    overflowY: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 1rem 0 1rem',
    gap: '2rem',
  },
  workspaceDropdown: {
    width: '18rem',
  },
})

const AssetLabButton: React.FC = () => {
  const assetLabCtx = useAssetLabStateContext()
  const {open} = assetLabCtx.state
  const {t} = useTranslation(['studio-desktop-pages'])

  return (
    <>
      <SecondaryButton disabled={open} onClick={() => assetLabCtx.setState({open: true})}>
        <span>{t('home_page.button.open_asset_lab')}</span>
      </SecondaryButton>
      {open &&
        <React.Suspense fallback={null}>
          <AssetLabModal />
        </React.Suspense>
      }
    </>
  )
}

const getFallbackAccount = (
  accounts: DeepReadonly<IAccount>[], reduxSelectedAccountUuid: string
): IAccount => {
  const selectedAccountByRedux = accounts.find(a => a.uuid === reduxSelectedAccountUuid)
  if (selectedAccountByRedux) {
    return selectedAccountByRedux
  }

  try {
    const savedUuid = localStorage.getItem('lastSelectedAccountUuid')
    const lastSelectedAccount = savedUuid && accounts.find(a => a.uuid === savedUuid)
    if (lastSelectedAccount) {
      return lastSelectedAccount
    }
  } catch (e) {
    // Continue
  }

  return accounts[0]
}

const HomePage: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const {loadAppsForAccount} = useActions(accountActions)
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = React.useState(false)

  const allAccounts = useSelector(state => state.accounts.allAccounts)
  const accounts = allAccounts.filter(isCloudStudioEnabled)
  const [accountShortName, setAccountShortName] = useStringUrlState('accountShortName', undefined)
  const [appName, setAppName] = useStringUrlState('appName', undefined)
  const {t} = useTranslation(['studio-desktop-pages'])

  // NOTE(christoph): This is set when we call `loadAppsForAccount`. It's a good signal for
  // the most recent account the user was working in.
  const reduxSelectedAccountUuid = useSelector(state => state.accounts.selectedAccount)

  const {accountUuid: selectedAccountUuid} = useParams<HomePathParams>()

  const selectedAccount = accounts.find(a => a.uuid === selectedAccountUuid)
  usePendoAccountEffect(selectedAccount)

  if (!!(accountShortName && appName) && !isNewProjectModalOpen) {
    setIsNewProjectModalOpen(true)
  }

  useFreeCreditAllowance(selectedAccount?.uuid)

  React.useEffect(() => {
    if (selectedAccountUuid) {
      try {
        localStorage.setItem('lastSelectedAccountUuid', selectedAccountUuid)
      } catch (err) {
        // Ignore
      }
    }
  }, [selectedAccountUuid])

  React.useEffect(() => {
    if (selectedAccount?.uuid && reduxSelectedAccountUuid !== selectedAccount.uuid) {
      loadAppsForAccount(selectedAccount.uuid)
    }
  }, [selectedAccount?.uuid, reduxSelectedAccountUuid])

  if (!accounts.length) {
    // NOTE(christoph): The `initialize` action in account-actions.ts creates
    // an account automatically if the user isn't in any accounts, so we won't be stuck here.
    return (
      <>
        {window.electron.consoleServerUrl !== PROD &&
          <SecondaryButton
            onClick={() => {
              window.open(createElectronUrl(window.electron.consoleServerUrl))
            }}
          // eslint-disable-next-line local-rules/hardcoded-copy
          >
            [dev] Check connectivity to server
          </SecondaryButton>
        }
        <Loader />
      </>
    )
  }

  if (!selectedAccount) {
    const account = getFallbackAccount(accounts, reduxSelectedAccountUuid)
    return <Redirect to={getHomePath(account.uuid)} />
  }

  const handleAccountChange = (uuid: string) => {
    if (uuid !== selectedAccount.uuid) {
      history.push(getHomePath(uuid))
    }
  }

  return (
    <EnclosedAccountProvider value={selectedAccount}>
      <div className={classes.homePage}>
        <SpaceBetween between>
          <div className={classes.workspaceDropdown}>
            <StandardDropdownField
              id='workspace'
              value={selectedAccountUuid}
              onChange={handleAccountChange}
              label={<SrOnly>{t('home_page.label.select_workspace')}</SrOnly>}
              options={accounts.map(a => ({value: a.uuid, content: a.name}))}
            />
          </div>
          <SpaceBetween narrow>
            {BuildIf.LOCAL_DEV && (
              <SecondaryButton onClick={() => {
                setAccountShortName('8thwall')
                setAppName('wayne-cloud-studio')
              }}
              >
                <span>{t('home_page.button.duplicate_project')}</span>
              </SecondaryButton>
            )}
            <AssetLabStateContextProvider>
              <AssetLabButton />
            </AssetLabStateContextProvider>
            <PrimaryButton onClick={() => setIsNewProjectModalOpen(true)}>
              <Icon inline stroke='plus' />
              <span>{t('home_page.button.new_project')}</span>
            </PrimaryButton>
          </SpaceBetween>
        </SpaceBetween>
        <SpaceBetween extraWide noWrap grow>
          <SpaceBetween between direction='vertical'>
            <SideNavBar />
            <ProfileIconButton />
          </SpaceBetween>
          <SpaceBetween extraWide direction='vertical' grow>
            <TemplatePicker />
            <ProjectList />
          </SpaceBetween>
        </SpaceBetween>
      </div>
      {isNewProjectModalOpen &&
        <NewProjectModal
          accountShortName={accountShortName}
          appName={appName}
          onClose={() => {
            setAccountShortName(undefined)
            setAppName(undefined)
            setIsNewProjectModalOpen(false)
          }}
        />
      }

      <FirstTimeSetupView />
    </EnclosedAccountProvider>
  )
}

export {
  HomePage,
}
