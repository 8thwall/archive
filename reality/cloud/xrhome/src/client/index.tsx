import './static/semantic/dist/semantic.min.css'
import './static/styles/index.scss'

import * as React from 'react'
import {hydrateRoot, createRoot} from 'react-dom/client'
import {Provider} from 'react-redux'
import {JssProvider, createGenerateId, SheetsRegistry} from 'react-jss'
import {HelmetProvider} from 'react-helmet-async'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

import App from './app'
import {getExtendedStore, getHistory} from './reducer'

import {startInterceptErrorsWithReduxState, sendLogLimit} from './common/intercept-errors'
import {decode} from '../shared/base64'
import {initializeHistoryListener} from './common/early-history-change'

const root = document.querySelector('#xrhome-root')
const sheets = new SheetsRegistry()
const generateId = createGenerateId()
const queryClient = new QueryClient()
queryClient.setDefaultOptions({
  queries: {
    refetchOnWindowFocus: false,
  },
})

const load8thWall = async () => {
  const initialState = window.__INITIAL_DATA__ && decode(window.__INITIAL_DATA__)
  const {store, initializePromise} = getExtendedStore(initialState)

  try {
    // Ensure we have initial state loaded before hydrating. This
    // prevents a flash of "loading" state on initial load.
    await initializePromise
  } catch (err) {
    // Ignore
  }

  startInterceptErrorsWithReduxState(window, store, sendLogLimit('ce', 25))

  initializeHistoryListener((window.history))

  const Application = (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <JssProvider registry={sheets} generateId={generateId}>
          <Provider store={store}>
            <App history={getHistory()} />
          </Provider>
        </JssProvider>
      </HelmetProvider>
    </QueryClientProvider>
  )

  const clearServerCss = () => {
    const ssStyles = document.getElementById('server-side-styles')
    ssStyles.parentNode.removeChild(ssStyles)
  }

  // NOTE(kyle): requestIdleCallback is not supported by Safari.
  const requestIdleCb = window.requestIdleCallback ?? window.setTimeout

  if (root.hasChildNodes() === true) {
    hydrateRoot(root, Application, {
    // NOTE(kyle): This is a no-op callback to supress hydration errors.
      onRecoverableError: () => {},
    })
    requestIdleCb(clearServerCss)
  } else {
    const appRoot = createRoot(root)
    appRoot.render(Application)
  }
}

load8thWall()
