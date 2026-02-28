import React from 'react'
import {Redirect, Route, Router, Switch, useHistory, useLocation} from 'react-router-dom'
import type {History} from 'history'

import {HelmetProvider} from 'react-helmet-async'

import '../i18n/i18n'
import {HomePage} from './home-page'
import {
  HOME_PATH, LOGIN_PATH, ROOT_PATH, STUDIO_PATH_FORMAT, HOME_PATH_FORMAT,
} from './desktop-paths'
import {LoginPage} from './login-page'
import {StudioPage} from './studio-page'
import {CaughtErrorPage} from './caught-error-page'
import {ErrorBoundary} from '../common/error-boundary'
import {UiThemeProvider} from '../ui/theme'
import withTranslationLoaded from '../i18n/with-translations-loaded'
import {use8wI18nSettings} from '../i18n/use-8w-i18n-settings'
import {Loader} from '../ui/components/loader'
import {useCurrentUser, useUserHasSession} from '../user/use-current-user'
import usePendo from '../common/use-pendo'
import {NotFoundPage} from './not-found-page'
import {DesktopWithTopBar} from './desktop-top-bar'

interface IApp {
  history: History
}

const HistoryResumer = ({children}: {children: React.ReactElement}) => {
  const {pathname: currentPath} = useLocation()
  const loggedIn = useUserHasSession()
  const loginPending = useCurrentUser(user => user.loading)

  if (currentPath !== ROOT_PATH) {
    return children
  }

  if (loginPending) {
    return <Loader />
  }

  if (!loggedIn) {
    return <Redirect to={LOGIN_PATH} />
  }

  return <Redirect to={HOME_PATH} />
}

const InnerApp: React.FC = () => {
  use8wI18nSettings()
  usePendo()
  const history = useHistory()
  const [windowTitle, setWindowTitle] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    const unsubscribe = window.electron.onExternalNavigate((pathAndQuery) => {
      history.push(pathAndQuery)
    })
    return () => {
      unsubscribe()
    }
  }, [history])

  return (
    <UiThemeProvider mode='dark'>
      <DesktopWithTopBar windowTitle={windowTitle}>
        <ErrorBoundary fallback={CaughtErrorPage}>
          <HistoryResumer>
            <React.Suspense fallback={<Loader />}>
              <Switch>
                <Route path={HOME_PATH_FORMAT} exact component={HomePage} />
                <Route path={LOGIN_PATH} exact component={LoginPage} />
                <Route
                  path={STUDIO_PATH_FORMAT}
                  render={() => <StudioPage setWindowTitle={setWindowTitle} />}
                />
                <Route component={NotFoundPage} />
              </Switch>
            </React.Suspense>
          </HistoryResumer>
        </ErrorBoundary>
      </DesktopWithTopBar>
    </UiThemeProvider>
  )
}

const App: React.FC<IApp> = withTranslationLoaded(({history}) => (
  <HelmetProvider>
    <Router history={history}>
      <InnerApp />
    </Router>
  </HelmetProvider>
))

export default App
