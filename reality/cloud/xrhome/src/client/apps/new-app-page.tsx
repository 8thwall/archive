import * as React from 'react'
import {useHistory} from 'react-router-dom'

import CreateAppAccountSelect from './create/create-app-account-select'
import CreateCameraApp from './create/create-camera-app'
import CreateUnityApp from './create/create-unity-app'
import CreateWebApp from './create/create-web-app'
import Page from '../widgets/page'
import {FluidCardContent} from '../widgets/fluid-card'
import appsActions from './apps-actions'
import ErrorMessage from '../home/error-message'
import {getPathForAccount} from '../common/paths'
import {
  isCameraAccount,
  isUnityAccount,
  isUpgradedWebAccount,
} from '../../shared/account-utils'
import {withAccountsLoaded} from '../common/with-state-loaded'
import icons from './icons'
import usePageStyles from '../styles/page-styles'
import useTextStyles from '../styles/text-styles'
import useActions from '../common/use-actions'
import useCurrentAccount from '../common/use-current-account'
import {AppLoadingScreenContextProvider} from './widgets/loading-screen/app-loading-screen-context'

const NewAppPage: React.FC = () => {
  const history = useHistory()
  const pageStyles = usePageStyles()
  const textStyles = useTextStyles()

  const {newApp} = useActions(appsActions)

  const account = useCurrentAccount()

  const createAndGoToAccount = app => newApp(app)
    .then(() => history.push(getPathForAccount(account)))

  let appCreate
  if (isCameraAccount(account)) {
    appCreate = (<CreateCameraApp />)
  } else if (isUnityAccount(account)) {
    appCreate = (
      <CreateUnityApp create={createAndGoToAccount} />
    )
  } else if (account || isUpgradedWebAccount(account)) {
    appCreate = (<CreateWebApp />)
  } else {
    // TODO(kim): change heading style
    appCreate = (
      <>
        <div className={textStyles.heading}>
          <img
            className={textStyles.headingImage}
            src={icons.newProjectHeading}
            alt='New Project'
            title='New Project'
          />
          <h1 className={textStyles.headingText}>New Project</h1>
        </div>
        <div className={pageStyles.createContainer}>
          <FluidCardContent>
            <CreateAppAccountSelect />
          </FluidCardContent>
        </div>
      </>
    )
  }

  return (
    <Page
      centered={false}
      className={pageStyles.pageProfile}
    >
      <ErrorMessage />
      {appCreate}
    </Page>
  )
}

const NewAppPageWithContexts = () => (
  <AppLoadingScreenContextProvider>
    <NewAppPage />
  </AppLoadingScreenContextProvider>
)

export default withAccountsLoaded(NewAppPageWithContexts)
