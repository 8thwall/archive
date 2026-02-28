import {XRHandMeshModel} from './xr-hand-mesh-model'
import {XRHandModel} from './xr-hand-model'

class XRHandModelFactory {
  constructor() {
    this.path = null
  }

  setPath(path) {
    this.path = path

    return this
  }

  createHandModel(controller) {
    const handModel = new XRHandModel(controller)

    controller.addEventListener('connected', (event) => {
      const xrInputSource = event.data

      if (xrInputSource.hand && !handModel.motionController) {
        handModel.xrInputSource = xrInputSource
        handModel.motionController =
          new XRHandMeshModel(handModel, controller, this.path, xrInputSource.handedness)
      }
    })

    controller.addEventListener('disconnected', () => {

      // handModel.motionController = null;
      // handModel.remove( scene );
      // scene = null;

    })

    return handModel
  }
}

export {
  XRHandModelFactory,
}
