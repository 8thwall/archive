import {ColorPicker, Page} from '../lib/material-ui-components'
import {PwaInstallPrompt} from '../lib/pwa-install-prompt'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

const Home = withRouter(({location, match}) => (
  <Page title='Immersive Web with 8th Wall' top={true}>
    <h3>Hello World</h3>
    This demo page shows how to make complete web apps featuring multiple immersive scenes. The page
    is built with 8th Wall's Cloud Editor using 8th Wall XR, A-Frame, React and Material UI. Pick a
    color below to navigate to an immersive page containing an experience featuring that color.
    <h3>Pick a color</h3>
    <ColorPicker />
    <PwaInstallPrompt />
  </Page>
))

export {Home}
