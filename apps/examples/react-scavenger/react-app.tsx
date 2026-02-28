import {MaterialUIApp} from './lib/material-ui-components'
import {appBase} from './lib/routes'
import {Map} from './views/map/map'
import {NotFound} from './views/notfound'
import {ARScene} from './views/ar/arscene'

declare let React: any
declare let ReactDOM: any
declare let ReactRouterDOM: any

const {BrowserRouter, Route, Switch} = ReactRouterDOM

const base = appBase()

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={`${base}/`} component={Map} />
          <Route exact path={`${base}/ar`} component={ARScene} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    )
  }
}

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
