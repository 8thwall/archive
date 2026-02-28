import {AFrameScene, DISABLE_IMAGE_TARGETS} from '../../lib/aframe-components'
import {PwaInstallPrompt} from '../../lib/pwa-install-prompt'
import {StartARButton} from '../../lib/material-ui-components'
import {path} from '../../lib/routes'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

const Map = withRouter(({location}) => (
  <React.Fragment>
    <StartARButton buttonText={'Start AR'} to={path(location, 'ar')}/>
    <AFrameScene
      sceneHtml={require('./map.html')}
      imageTargets={DISABLE_IMAGE_TARGETS}
    />
    <PwaInstallPrompt />
  </React.Fragment>
))

export {Map}
