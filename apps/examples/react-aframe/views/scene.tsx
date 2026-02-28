import {AFrameScene} from '../lib/aframe-components'
import {FloatingBackButton} from '../lib/material-ui-components'
import {COLORS} from '../lib/colors'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

const Scene = withRouter(({match}) => (
  <React.Fragment>
    <FloatingBackButton />
    <AFrameScene sceneHtml={  // Use an HTML template, swapping its color for the color of this page.
      require('./cube.html').replace('#AD50FF', COLORS[match.path.split('/').filter(p => p).pop()])}
    />
  </React.Fragment>
))

export {Scene}
