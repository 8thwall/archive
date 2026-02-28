import {AFrameScene, DISABLE_IMAGE_TARGETS} from '../../../lib/aframe-components'
import {FloatingBackButton} from '../../../lib/material-ui-components'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

// The image targets for the flyer example are configured to load automatically, so we don't need
// to disable them or explicitly enable them.
const ImageTargetsFlyer = withRouter(() => (
  <React.Fragment>
    <FloatingBackButton />
    <AFrameScene sceneHtml={require('./flyer-scene.html')} />
  </React.Fragment>
))

export {ImageTargetsFlyer}
