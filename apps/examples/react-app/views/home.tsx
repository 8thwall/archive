import {NavCard, OneColumnGrid, Page} from '../lib/material-ui-components'
import {PwaInstallPrompt} from '../lib/pwa-install-prompt'
import {path} from '../lib/routes'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

const Home = withRouter(({location}) => (
  <Page title='Immersive Web with 8th Wall' top={true}>
    This demo page shows how to make complete web apps with 8th Wall's Cloud Editor using
    React. Jump into any of the AR demos below.
    <h3>Give it a try</h3>
    <OneColumnGrid>
      <NavCard
        title='Getting Started'
        to={path(location, 'gettingstarted')}
        text={'Basic examples of world tracking, in both A-Frame and three.js.'}
        img={require('../assets/cards/card0.png')}
      />
      <NavCard
        title='Interactions'
        to={path(location, 'interactions')}
        text={'Learn about basic AR interactions, like tap to place, hold to drag, and pinch to scale.'}
        img={require('../assets/cards/card1.png')}
      />
      <NavCard
        title='Image Targets'
        to={path(location, 'imagetargets')}
        text={'Tie immersive content to images.'}
        img={require('../assets/cards/card2.png')}
      />
    </OneColumnGrid>
    <h3>Learn More</h3>
    <NavCard
      title='Learn More'
      to={path(location, 'learnmore')}
      text={'Find out more about 8th Wall XR.'}
      img={require('../assets/cards/card3.png')}
    />
    <PwaInstallPrompt />
  </Page>
))

export {Home}
