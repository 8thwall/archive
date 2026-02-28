import {COLORS} from './lib/colors'
import {MaterialUIApp} from './lib/material-ui-components'
import {appBase} from './lib/routes'
import {Home} from './views/home'
import {NotFound} from './views/notfound'
import {Scene} from './views/scene'

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
          <Route exact path={`${base}/`} component={Home} />
          {Object.keys(COLORS).map(  // Create one route per color in COLORS.
            color => (<Route exact path={`${base}/${color}`} component={Scene} />)
          )}
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
