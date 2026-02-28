import {MaterialUIApp} from './lib/material-ui-components'
import {appBase} from './lib/routes'
import {Home} from './views/home'
import {NotFound} from './views/notfound'
import {GettingStarted} from './views/gettingstarted/gettingstarted'
import {GettingStartedAframe} from './views/gettingstarted/aframe/gettingstarted-aframe'
import {GettingStartedThreejs} from './views/gettingstarted/threejs/gettingstarted-threejs'
import {ImageTargets} from './views/imagetargets/imagetargets'
import {ImageTargetsArtGallery} from './views/imagetargets/artgallery/imagetargets-artgallery'
import {ImageTargetsFlyer} from './views/imagetargets/flyer/imagetargets-flyer'
import {Interactions} from './views/interactions/interactions'
import {InteractionsManipulate} from './views/interactions/manipulate/interactions-manipulate'
import {InteractionsPlaceGround} from './views/interactions/placeground/interactions-placeground'
import {LearnMore} from './views/learnmore/learnmore'

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
          <Route exact path={`${base}/gettingstarted`} component={GettingStarted} />
          <Route exact path={`${base}/gettingstarted/aframe`} component={GettingStartedAframe} />
          <Route exact path={`${base}/gettingstarted/threejs`} component={GettingStartedThreejs} />
          <Route exact path={`${base}/imagetargets`} component={ImageTargets} />
          <Route exact path={`${base}/imagetargets/artgallery`} component={ImageTargetsArtGallery} />
          <Route exact path={`${base}/imagetargets/flyer`} component={ImageTargetsFlyer} />
          <Route exact path={`${base}/interactions`} component={Interactions} />
          <Route exact path={`${base}/interactions/manipulate`} component={InteractionsManipulate} />
          <Route exact path={`${base}/interactions/placeground`} component={InteractionsPlaceGround} />
          <Route exact path={`${base}/learnmore`} component={LearnMore} />
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
