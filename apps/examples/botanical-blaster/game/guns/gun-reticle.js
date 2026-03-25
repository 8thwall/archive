import * as ecs from '@8thwall/ecs'
import {CameraManager} from '../../components/controls/camera-controls'

const GunReticle = ecs.registerComponent({
  name: 'GunReticle',
  schema: {},
  add: (world, component) => {
    try {
      const {scene} = world
      const {eid} = component
      const reticleGeometry = new THREE.CircleGeometry(0.005, 32)
      const reticleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        depthTest: false,
        opacity: 0.7,
        transparent: true,
      })
      const reticleMesh = new THREE.Mesh(reticleGeometry, reticleMaterial)
      reticleMesh.userData.isReticle = true
      reticleMesh.position.set(0, 0, -1)
      reticleMesh.renderOrder = 9999

      if (!CameraManager.camera) {
        /**
         * @param {CustomEvent<import("three").PerspectiveCamera>} param
         */
        const cameraSetListener = ({detail}) => {
          detail.add(reticleMesh)
        }

        CameraManager.addEventListener(
          CameraManager.events.CameraSet,
          cameraSetListener
        )
      } else {
        CameraManager.camera.add(reticleMesh)
      }
    } catch (error) {
      console.warn('error in gun retical')
      console.error(error)
    }
  },
  remove: (world, component) => {},
})

export {GunReticle}
