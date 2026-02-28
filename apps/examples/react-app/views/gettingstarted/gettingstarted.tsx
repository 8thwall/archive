import {NavCard, OneColumnGrid, Page} from '../../lib/material-ui-components'
import {path} from '../../lib/routes'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter, Link} = ReactRouterDOM

const GettingStarted = withRouter(() => (
  <Page title='Getting Started'>
    The demos on this page show the basics of World Tracking in 8th Wall Web, including mounting
    and unmounting immersive content with React.
    <h3>Give it a try</h3>
    <OneColumnGrid>
      <NavCard
        title=''
        to={path(location, 'aframe')}
        text={'Basic example of world tracking in A-Frame. Manage an immersive <a-scene> and 2D DOM elements with React.'}
        img={require('../../assets/cards/gettingstarted-aframe.png')}
      />
      <NavCard
        title=''
        to={path(location, 'threejs')}
        text={'Basic example of world tracking in both three.js. Manage an immersive three.js <canvas> and 2D DOM elements with React.'}
        img={require('../../assets/cards/gettingstarted-threejs.png')}
      />
    </OneColumnGrid>
  </Page>
))

export {GettingStarted}
