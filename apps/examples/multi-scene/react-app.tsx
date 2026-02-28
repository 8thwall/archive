import {MaterialUIApp} from './lib/material-ui-components'
import {appBase} from './lib/routes'
import {Home} from './views/home'
import {NotFound} from './views/notfound'
import {PlaceModel} from './views/place-model/place-model'
import {Glass} from './views/glass/glass'
// import {Donut} from './views/donut/donut'
// import {Bee} from './views/bee/bee'
// import {Rose} from './views/rose/rose'

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
          <Route exact path={`${base}/place-model`} component={PlaceModel} />
          <Route exact path={`${base}/glass`} component={Glass} />
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
