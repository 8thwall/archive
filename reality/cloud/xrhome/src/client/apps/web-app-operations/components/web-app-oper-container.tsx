import React from 'react'
import {useHistory} from 'react-router-dom'
import {createUseStyles} from 'react-jss'

import CreateAppForm from './create-app-form'
import appActions, {NewAppData} from '../../apps-actions'
import navigationActions from '../../../navigations/navigation-actions'
import {getPathForAccount, AppPathEnum, getPathForApp} from '../../../common/paths'
import {
  appHasRepo, is8thWallHosted, isCloudStudioApp, deriveAppCoverImageUrl,
} from '../../../../shared/app-utils'
import {makeProjectSpecifier} from '../../../../shared/project-specifier'
import type {IAccount, IApp, IPublicAccount, IPublicApp} from '../../../common/types/models'
import {useSelector} from '../../../hooks'
import useActions from '../../../common/use-actions'
import {AppLoadingScreen} from '../../app-loading-screen'
import {
  useAppLoadingProgress, useAppLoadingScreenContext, useLoadingApp,
} from '../../widgets/loading-screen/app-loading-screen-context'

const useStyles = createUseStyles({
  loadingScreenContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
  },
})
interface IWebAppOperationContainer {
  fromAccount?: IAccount | IPublicAccount
  fromApp?: IApp | IPublicApp
  isMyAccount?: boolean
  account: IAccount
}

const WebAppOperationContainer: React.FC<IWebAppOperationContainer> = ({
  fromAccount, fromApp, isMyAccount, account,
}) => {
  const {startAppLoading, clearLoadingApp} = useAppLoadingScreenContext()
  const appLoadProgress = useAppLoadingProgress()
  const loadingApp = useLoadingApp()
  const classes = useStyles()
  const [currentPage, setCurrentPage] = React.useState<'info' | 'duplicating'>('info')
  const {deleteAppImmediate, cloneIntoApp} = useActions(appActions)
  const hasPopPath = useSelector(state => state.navigations.pathStack.length > 0)

  const history = useHistory()

  const {popCheckpoint} = useActions(navigationActions)

  const onCancel = () => {
    const backPath = hasPopPath ? popCheckpoint() : getPathForAccount(account)
    history.push(backPath)
  }

  const doneRedirect = (app: IApp) => {
    let page: AppPathEnum = AppPathEnum.project
    if (app.hostingType === 'CLOUD_EDITOR') {
      page = AppPathEnum.files
    } else if (isCloudStudioApp(app)) {
      page = AppPathEnum.studio
    }
    history.push(getPathForApp(account, app, page))
  }

  React.useEffect(() => {
    if (appLoadProgress === 'DONE') {
      doneRedirect(loadingApp)
    }
  }, [appLoadProgress])

  const onDuplicateApp = async (app: IApp) => {
    // Setting the app loading context to trigger other UI not in this component.
    setCurrentPage('duplicating')
    try {
      const needsRepo = is8thWallHosted(app) && appHasRepo(fromApp)
      await cloneIntoApp({
        appUuid: app.uuid,
        fromAppUuid: fromApp.uuid,
        fromProjectSpecifier: needsRepo && makeProjectSpecifier(fromAccount, fromApp),
        deployment: needsRepo && !isMyAccount && 'published',
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error during app duplicate:', err)
      setCurrentPage('info')
      deleteAppImmediate(app)
      clearLoadingApp()
    }
  }

  const onAppInfoComplete = async (details: NewAppData) => {
    const newApp = await startAppLoading(
      deriveAppCoverImageUrl(fromApp),
      {...details, isWeb: true}
    )
    if (fromApp) {
      onDuplicateApp(newApp)
    } else {
      doneRedirect(newApp)
    }
  }

  const appLoadingScreen = (
    <div className={classes.loadingScreenContainer}>
      <AppLoadingScreen />
    </div>
  )

  switch (currentPage) {
    case 'info':
      return (
        <CreateAppForm
          onCancel={onCancel}
          onSubmit={onAppInfoComplete}
          fromAccount={fromAccount}
          fromApp={fromApp}
          isMyAccount={isMyAccount}
        />
      )
    case 'duplicating':
      return appLoadingScreen
    default:
      throw new Error('Invalid Create App page')
  }
}

export default WebAppOperationContainer
