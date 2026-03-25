import * as ecs from '@8thwall/ecs'

import {addCleanup, doCleanup} from '../helpers/cleanup'

const {THREE} = (window as any)

const SkyBox = ecs.registerComponent({
  name: 'SkyBox',
  schema: {
    // @asset
    texture: ecs.string,
  },

  add: (world, component) => {
    console.log(`SkyBox added with EID: ${component.eid}`)

    // Load the equirectangular texture
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(component.schema.texture, (texture) => {
      // Create the skybox material with the equirectangular texture
      const skyboxMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,  // Render the inside of the skybox
      })

      // Create the skybox geometry
      const skyboxGeometry = new THREE.SphereGeometry(500, 0, 0)
      skyboxGeometry.scale(1, 1, 1)  // Invert the sphere to render inside

      // Create the skybox mesh
      const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial)

      // Add the skybox to the scene
      world.scene.add(skybox)

      addCleanup(component, () => {
        world.scene.remove(skybox)
      })
    })
  },

  remove: (world, component) => {
    console.log(`SkyBox removed with EID: ${component.eid}`)
    doCleanup(component)
  },
})

export {SkyBox}
