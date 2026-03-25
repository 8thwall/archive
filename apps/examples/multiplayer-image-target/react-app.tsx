import {MaterialUIApp} from './lib/material-ui-components'
import {appBase} from './lib/routes'
import {Home} from './views/home'
import {ArExperience} from './views/ar-experience'

declare let React: any
declare let ReactDOM: any
declare let ReactRouterDOM: any

const {BrowserRouter, Route, Switch} = ReactRouterDOM

const base = appBase()

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={`${base}/`} component={Home} />
      <Route exact path={`${base}/room`} component={ArExperience} />
    </Switch>
  </BrowserRouter>
)

const render = () => {
  document.body.insertAdjacentHTML('beforeend', '<div id="root"></div>')
  ReactDOM.render(
    <MaterialUIApp>
      <App />
    </MaterialUIApp>,
    document.getElementById('root')
  )
}

export {render}