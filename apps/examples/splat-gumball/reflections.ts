import * as ecs from '@8thwall/ecs'

const {THREE} = window as any

let reflectionRenderTarget = null
let reflectionCamera = null

// Helper function to apply reflection to an object
function applyReflectionToObject(object3D: any): void {
  if (reflectionCamera) {
    object3D.material.envMap = reflectionCamera.renderTarget.texture
    object3D.traverse((node: any) => {
      if (node.isMesh) {
        node.material.envMap = reflectionCamera.renderTarget.texture
      }
    })
  }
}

const StaticReflectionsComponent = ecs.registerComponent({
  name: 'static-reflection',
  schema: {
    near: ecs.i32,
    far: ecs.i32,
    resolution: ecs.i32,
    isReflectionRendered: ecs.boolean,
  },
  schemaDefaults: {
    near: 1,
    far: 2048,
    resolution: 128,
    isReflectionRendered: false,
  },
  add: (world, component) => {
    const {near, far, resolution} = component.schema

    reflectionRenderTarget = new THREE.WebGLCubeRenderTarget(resolution, {generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter})
    reflectionCamera = new THREE.CubeCamera(near, far, reflectionRenderTarget)

    world.three.scene.add(reflectionCamera)

    // Set a timeout to stop updating after 5 seconds
    setTimeout(() => {
      component.schema.isReflectionRendered = true
      console.log('Reflection rendering complete and now static')

      // Perform one final update before becoming static
      const object3D = world.three.entityToObject.get(component.eid)
      if (reflectionCamera && object3D) {
        reflectionCamera.update(world.three.renderer, world.three.scene)
        applyReflectionToObject(object3D)
      }
    }, 5000)  // 5000 milliseconds = 5 seconds
  },
  tick: (world, component) => {
    if (!component.schema.isReflectionRendered) {
      const object3D = world.three.entityToObject.get(component.eid)

      if (reflectionCamera && object3D) {
        reflectionCamera.position.copy(object3D.position)
        reflectionCamera.update(world.three.renderer, world.three.scene)
        applyReflectionToObject(object3D)
      }
    }
  },
  remove: (world, component) => {
    if (reflectionCamera) {
      world.three.scene.remove(reflectionCamera)
    }
    if (reflectionRenderTarget) {
      reflectionRenderTarget.dispose()
    }
    reflectionCamera = null
    reflectionRenderTarget = null
  },
})

export {StaticReflectionsComponent}
