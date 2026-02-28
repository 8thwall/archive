import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserHistory} from 'history'
import {HelmetProvider} from 'react-helmet-async'

import App from './arcade-app'

const root = document.querySelector('#arcade-root')

const appRoot = createRoot(root)

appRoot.render(
  <React.Suspense fallback={null}>
    <HelmetProvider>
      <App history={createBrowserHistory()} />
    </HelmetProvider>
  </React.Suspense>
)
