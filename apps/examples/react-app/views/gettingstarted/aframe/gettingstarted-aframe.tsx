import {AFrameScene, DISABLE_IMAGE_TARGETS} from '../../../lib/aframe-components'
import {FloatingBackButton} from '../../../lib/material-ui-components'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

const GettingStartedAframe = withRouter(() => (
  <React.Fragment>
    <FloatingBackButton />
    <AFrameScene
      sceneHtml={require('./cube-aframe-scene.html')}
      imageTargets={DISABLE_IMAGE_TARGETS}
    />
  </React.Fragment>
))

export {GettingStartedAframe}
