import * as React from 'react'
import {Router} from 'react-router-dom'
import {configure} from 'react-hotkeys'
import type {History} from 'history'

import './i18n/i18n'
import {useSelector} from './hooks'
import {TermsOfService} from './home/terms'
import userActions from './user/user-actions'
import AppSwitch from './app-switch'
import TopBar from './messages/top-bar/top-bar'
import usePendo from './common/use-pendo'
import useStalePageRefresher from './common/use-stale-page-refresher'
import useActions from './common/use-actions'
import {UiThemeProvider} from './ui/theme'
import {LoggedOutMessage} from './messages/logged-out-message'
import withTranslationLoaded from './i18n/with-translations-loaded'
import {use8wI18nSettings} from './i18n/use-8w-i18n-settings'
import {useUserConfirmed} from './user/use-current-user'
import {MigrateExistingUsersModal} from './accounts/widgets/migrate-existing-users-modal'
import {useDebounce} from './common/use-debounce'
import {ErrorBoundary} from './common/error-boundary'
import {Brand8QaContextProvider} from './brand8/brand8-qa-context'
import {Brand8OptionsModal} from './brand8/brand8-options-modal'
import {getDefaultTheme} from './brand8/brand8-gating'

const CaughtErrorPage = React.lazy(() => import('./home/caught-error-page'))

configure({
  ignoreTags: [],
})

const App = () => {
  const {listenWindowResize} = useActions(userActions)
  const {showToS, showMigrateUser} = useSelector(s => s.common)
  const confirmed = useUserConfirmed()

  const debouncedResize = useDebounce(React.useRef(listenWindowResize), 500)

  React.useEffect(() => {
    listenWindowResize(window.innerWidth)

    const handleResize = () => {
      debouncedResize(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Brand8QaContextProvider>
      <UiThemeProvider mode={getDefaultTheme()}>
        {BuildIf.ALL_QA && <Brand8OptionsModal />}
        <ErrorBoundary fallback={CaughtErrorPage}>
          <LoggedOutMessage />
          <TopBar />
          <AppSwitch />
          {showMigrateUser && <MigrateExistingUsersModal />}
          {confirmed && showToS && <TermsOfService /> }
        </ErrorBoundary>
      </UiThemeProvider>
    </Brand8QaContextProvider>
  )
}

const AppWithTranslations = withTranslationLoaded(() => {
  use8wI18nSettings()
  return <App />
})

const AppWithRouter: React.FC<{history: History}> = ({history}) => {
  useStalePageRefresher()
  usePendo()

  return (
    <Router history={history}>
      <AppWithTranslations />
    </Router>
  )
}

export default AppWithRouter
