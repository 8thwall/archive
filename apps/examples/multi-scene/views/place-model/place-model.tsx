import {AFrameScene, DISABLE_IMAGE_TARGETS} from '../../lib/aframe-components'
import {FloatingBackButton} from '../../lib/material-ui-components'
import {tapPlaceCursorComponent} from '../../lib/aframe/tap-place-cursor'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

const PlaceModel = withRouter(() => (
  <React.Fragment>
    <FloatingBackButton />
    <AFrameScene
      sceneHtml={require('./place-model.html')}
      components={[
        {name: 'tap-place-cursor', val: tapPlaceCursorComponent},
      ]}
      imageTargets={DISABLE_IMAGE_TARGETS}
    />
  </React.Fragment>
))

export {PlaceModel}
