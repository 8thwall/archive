import {AFrameScene, DISABLE_IMAGE_TARGETS} from '../../lib/aframe-components'
import {FloatingBackButton} from '../../lib/material-ui-components'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

const ARScene = withRouter(() => (
  <React.Fragment>
    <FloatingBackButton />
    <AFrameScene
      sceneHtml={require('./unitcube.html')}
      imageTargets={DISABLE_IMAGE_TARGETS}
    />
  </React.Fragment>
))

export {ARScene}
