/* eslint-disable import/no-unresolved */

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {BrowserRouter, Route, Redirect} from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import {ThemeProvider} from '@material-ui/core/styles'
import {Provider} from 'react-redux'

import OmniViewer from 'apps/client/internalqa/omniscope/js/container/view/omni-viewer'
import OmniRecorder from 'apps/client/internalqa/omniscope/js/container/recording/omni-recorder'

import theme from 'apps/client/internalqa/omniscope/js/container/theme'
import getStore from 'apps/client/internalqa/omniscope/js/container/reducer'

interface Route {
  to: string
  key: string
  component: React.Component
  exact?: boolean
}

const store = getStore()
const OmniscopeApp = () => {
  const routes : Route[] = [
    {to: '/viewer/:viewGroup?/:viewId?', key: 'viewer', component: OmniViewer},
    {to: '/recorder', key: 'recorder', component: OmniRecorder},
  ]
  const defaultRoute = '/recorder'

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Provider store={store}>
          <div>
            {routes.map(r => (
              <Route key={r.key} exact={r.exact} path={r.to} component={r.component} />
            ))}
            <Route exact path='/'>
              <Redirect to={defaultRoute} />
            </Route>
          </div>
        </Provider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

window.onload = () => {
  const rootElement = document.getElementById('root')
  // render container managed by React
  // addScript()
  ReactDOM.render(<OmniscopeApp />, rootElement)
}
