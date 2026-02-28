import {NavCard, OneColumnGrid, Page} from '../../lib/material-ui-components'
import {path} from '../../lib/routes'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter, Link} = ReactRouterDOM

const ImageTargets = withRouter(() => (
  <Page title='Image Targets'>
    The demos on this page show the basics of Image Target Tracking in 8th Wall Web, including
    automatically and dynamically loaded image targets. In A-Frame, Image Targets can be tied to
    preselected scene elements, or can be used to generate content dynamically at runtime.
    <h3>Give it a try</h3>
    <OneColumnGrid>
      <NavCard
        title=''
        to={path(location, 'flyer')}
        text={'Attach 3D Models and videos to image targets. Automatically load image targets and link them to pre-selected <a-entity>s.'}
        img={require('../../assets/cards/imagetargets-flyer.png')}
      />
      <NavCard
        title=''
        to={path(location, 'artgallery')}
        text={'Simultaneously scan for a dynamic set of image targets and display metadata about them. Configures the set of image targets dynamically, and uses them generate new <a-entity>s at run time. Cloud-hosted image target metadata and React DOM overlays provide a richer interaction.'}
        img={require('../../assets/cards/imagetargets-artgallery.png')}
      />
    </OneColumnGrid>
  </Page>
))

export {ImageTargets}
