import './artgallery-style.scss'
import {AFrameScene, DISABLE_IMAGE_TARGETS} from '../../../lib/aframe-components'
import {FloatingBackButton} from '../../../lib/material-ui-components'
import {ArtGalleryComponents, ArtGalleryPrimitives} from './artgallery-components'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

const InfoSheet = () => (
  <div id='container' className='collapsed'>
    <div className='outer'>
      <div id='closeButton' onClick={() => document.getElementById('container').classList.add('collapsed')}>close</div>
    </div>
    <div id='contents'></div>
    <div className='outer'>Article provided by Wikipedia</div>
  </div>
)

const ImageTargetsArtGallery = withRouter(() => (
  <React.Fragment>
    <FloatingBackButton />
    <AFrameScene
      sceneHtml={require('./artgallery-scene.html')}
      imageTargets={['davinci', 'monet', 'renoir', 'seurat', 'vangogh']}
      components={ArtGalleryComponents}
      primitives={ArtGalleryPrimitives}
    />
    <InfoSheet />
  </React.Fragment>
))

export {ImageTargetsArtGallery}
