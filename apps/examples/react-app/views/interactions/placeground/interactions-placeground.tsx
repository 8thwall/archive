import {AFrameScene, DISABLE_IMAGE_TARGETS} from '../../../lib/aframe-components'
import {FloatingBackButton} from '../../../lib/material-ui-components'
import {PlaceGroundComponents} from './placeground-components'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

const InteractionsPlaceGround = withRouter(() => (
  <React.Fragment>
    <FloatingBackButton />
    <AFrameScene
      sceneHtml={require('./placeground-scene.html')}
      imageTargets={DISABLE_IMAGE_TARGETS}
      components={PlaceGroundComponents}
    />
  </React.Fragment>
))

export {InteractionsPlaceGround}
