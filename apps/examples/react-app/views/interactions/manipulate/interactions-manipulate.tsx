import {AFrameScene, DISABLE_IMAGE_TARGETS} from '../../../lib/aframe-components'
import {FloatingBackButton} from '../../../lib/material-ui-components'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

const InteractionsManipulate = withRouter(() => (
  <React.Fragment>
    <FloatingBackButton />
    <AFrameScene
      sceneHtml={require('./manipulate-scene.html')}
      imageTargets={DISABLE_IMAGE_TARGETS}
    />
  </React.Fragment>
))

export {InteractionsManipulate}
