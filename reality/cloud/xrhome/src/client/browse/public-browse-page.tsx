import * as React from 'react'
import {Redirect, useParams} from 'react-router-dom'
import {createUseStyles} from 'react-jss'

import {Loader} from '../ui/components/loader'
import Page from '../widgets/page'
import Title from '../widgets/title'
import ErrorMessage from '../home/error-message'
import actions from './public-browse-actions'
import {getPathForApp} from '../common/paths'
import NotFoundPage from '../home/not-found-page'
import {getDisplayNameForApp} from '../../shared/app-utils'
import PublicBrowseView from './public-browse-view'
import useActions from '../common/use-actions'
import {useCurrentRouteApp} from '../common/use-current-app'
import {useSelector} from '../hooks'
import IndustryCarousel from '../discovery/industry-carousel'
import {KEYWORDS} from '../../shared/discovery-constants'
import {useUserHasSession} from '../user/use-current-user'
import {useAbandonableEffect} from '../hooks/abandonable-effect'

type PublicBrowsePageParams = {
  account: string
  routeAppName: string
}

const useStyles = createUseStyles({
  browse: {
    '& > .page-content': {
      paddingTop: '2em',  // padding from the header
    },
    '& .embed8-pop-over': {
      'top': '100%',
      'bottom': 'unset',
      'transform': 'translate(calc(-50%), 5px)',
      '&::after': {
        top: '0%',
      },
    },
  },
})

const PublicBrowsePage: React.FC = () => {
  const classes = useStyles()
  const {account: accountName, routeAppName} = useParams<PublicBrowsePageParams>()
  const {getPublicAccountApp, getPublicAccount, loadFeaturedAppDescription} = useActions(actions)
  const accountUuid = useSelector(state => state.publicBrowse.accountByName[accountName])
  const appUuid = useSelector(state => state.publicBrowse.appByName[routeAppName])
  const account = useSelector(state => state.publicBrowse.Accounts[accountUuid])
  const app = useSelector(state => state.publicBrowse.Apps[appUuid])
  const featuredDescriptionText = useSelector(state => (
    app?.featuredDescriptionId
      ? state.publicBrowse.descriptionById[app.featuredDescriptionId]
      : undefined
  ))
  const ownApp = useCurrentRouteApp()
  const isAccountLoaded = useSelector(state => state.accounts?.accountLoaded)
  const isLoggedIn = useUserHasSession()
  const stillNeedsDescriptionText = app?.featuredDescriptionId &&
    typeof featuredDescriptionText !== 'string'

  const hasFullData = !!(app?.FeaturedAppImages && account)

  const [finishedLoadFor, setFinishedLoadFor] = React.useState<[string, string]>(null)
  const finishedLoad = finishedLoadFor?.[0] === accountName && finishedLoadFor?.[1] === routeAppName

  useAbandonableEffect(async (executor) => {
    if (hasFullData) {
      return
    }
    try {
      await executor(Promise.all([
        getPublicAccountApp(accountName, routeAppName),
        getPublicAccount(accountName),
      ]))
    } finally {
      setFinishedLoadFor([accountName, routeAppName])
    }
  }, [hasFullData, accountName, routeAppName])

  React.useEffect(() => {
    if (!stillNeedsDescriptionText) {
      return
    }
    loadFeaturedAppDescription(app.featuredDescriptionId)
  }, [app?.featuredDescriptionId])

  if (!accountUuid || !appUuid || !account || !app) {
  // If logged in and we know the app isn't featured, redirect to default page
    if (ownApp && !ownApp.publicFeatured) {
      return <Redirect to={getPathForApp(accountName, routeAppName)} />
    }
  }

  const publicAppLoading = !hasFullData && !finishedLoad
  const ownAppsLoading = isLoggedIn && !isAccountLoaded

  if (publicAppLoading || stillNeedsDescriptionText || (!hasFullData && ownAppsLoading)) {
    return <Loader />
  }

  if (!hasFullData) {
    return <NotFoundPage />
  }

  return (
    <Page
      className={classes.browse}
      centered={false}
    >
      <Title>{`${getDisplayNameForApp(app)} | ${account.name}`}</Title>
      <ErrorMessage />
      <PublicBrowseView
        accountUuid={accountUuid}
        appUuid={appUuid}
        featuredDescriptionText={featuredDescriptionText}
      />
      <IndustryCarousel pageName='public-project' keywords={KEYWORDS} showExploreMore />
    </Page>
  )
}

export default PublicBrowsePage
