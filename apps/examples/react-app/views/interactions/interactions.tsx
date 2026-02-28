import {NavCard, OneColumnGrid, Page} from '../../lib/material-ui-components'
import {path} from '../../lib/routes'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter, Link} = ReactRouterDOM

const Interactions = withRouter(() => (
  <Page title='Interactions'>
    The demos on this page show the basics of user interaction with World Tracking, including
    placing content with a tap, and full gesture-based manipulation.
    <h3>Give it a try</h3>
    <OneColumnGrid>
      <NavCard
        title=''
        to={path(location, 'placeground')}
        text={'Tap the ground to dynamically place 3D content.'}
        img={require('../../assets/cards/interactions-placeground.png')}
      />
      <NavCard
        title=''
        to={path(location, 'manipulate')}
        text={'Manipulate 3D content with touch gestures: drag to move, pinch to scale, and use two fingers to rotate.'}
        img={require('../../assets/cards/interactions-manipulate.png')}
      />
    </OneColumnGrid>
  </Page>
))

export {Interactions}
