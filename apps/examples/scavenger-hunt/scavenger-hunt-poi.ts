import * as ecs from '@8thwall/ecs'

const {THREE} = window as any
const textureLoader = new THREE.TextureLoader()

const ScavengerHuntPoi = ecs.registerComponent({
  name: 'Scavenger Hunt POI',
  schema: {
    threshold: ecs.f32,
    displayName: ecs.string,
    spaceName: ecs.string,
    // @asset
    thumbnailImage: ecs.string,
    // @group start Ring Color:color
    ringR: ecs.f32,
    ringG: ecs.f32,
    ringB: ecs.f32,
    // @group end
    // @group start Sphere Color:color
    sphereR: ecs.f32,
    sphereG: ecs.f32,
    sphereB: ecs.f32,
    // @group end
  },
  schemaDefaults: {
    threshold: 0.5,
    displayName: 'My Location',
    spaceName: 'My Space Name',
    ringR: 255,
    ringG: 255,
    ringB: 255,
    sphereR: 255,
    sphereG: 255,
    sphereB: 255,
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    const toDisc = ecs.defineTrigger()
    const toSphere = ecs.defineTrigger()

    ecs.defineState('sphere')
      .initial()
      .onEnter(() => {
        const {sphereR, sphereG, sphereB} = schemaAttribute.get(eid)

        ecs.ScaleAnimation.set(world, eid, {
          fromX: 0,
          fromY: 0,
          fromZ: 0,
          toX: 1,
          toY: 1,
          toZ: 1,
          duration: 200,
          easeIn: true,
          easingFunction: 'bounce',
          loop: false,
        })

        ecs.SphereGeometry.set(world, eid, {
          radius: 0.5,
        })

        ecs.Material.set(world, eid, {
          roughness: 1,
          metalness: 0,
          r: sphereR,
          g: sphereG,
          b: sphereB,
        })
      })
      .onExit(() => {
        ecs.SphereGeometry.remove(world, eid)
        ecs.Material.remove(world, eid)
      })
      .onTick(() => {
        const {threshold} = schemaAttribute.get(eid)
        const {x, z} = ecs.Position.get(world, world.getParent(eid))
        const d = Math.sqrt(x * x + z * z)

        if (d <= threshold) {
          toDisc.trigger()
          world.events.dispatch(world.events.globalId, 'geofence-entered', {
            eid,
          })
        }
      })
      .onTrigger(toDisc, 'disc')
    ecs.defineState('disc')
      .onEnter(() => {
        ecs.Scale.set(world, eid, {x: 0, y: 0, z: 0})

        ecs.GltfModel.set(world, eid, {
          url: 'assets/poi-disc.glb',
        })
      })
      .onTick(() => {
        const {threshold} = schemaAttribute.get(eid)
        const {x, z} = ecs.Position.get(world, world.getParent(eid))
        const d = Math.sqrt(x * x + z * z)

        if (d > threshold) {
          toSphere.trigger()
          world.events.dispatch(world.events.globalId, 'geofence-exited', {
            eid,
          })
        }
      })
      .onExit(() => {
        ecs.GltfModel.remove(world, eid)
        ecs.RotateAnimation.remove(world, eid)
      })
      .listen(eid, ecs.events.GLTF_MODEL_LOADED, (e) => {
        const {ringR, ringG, ringB, thumbnailImage} = schemaAttribute.get(eid)

        ecs.assets.load({url: thumbnailImage})
          .then((r) => {
            textureLoader.load(`${r.remoteUrl}`, (tex: any) => {
              const object3d = world.three.entityToObject.get(eid)

              if (object3d.getObjectByName('outer').material) {
                object3d.getObjectByName('outer').material.color.setRGB(ringR / 255, ringG / 255, ringB / 255)
                object3d.getObjectByName('outer').material.needsUpdate = true
              }

              if (object3d.getObjectByName('inner').material) {
                object3d.getObjectByName('inner').material.map = tex
                object3d.getObjectByName('inner').material.needsUpdate = true
              }

              ecs.RotateAnimation.set(world, eid, {
                shortestPath: false,
                loop: true,
                toY: 360,
                duration: 12000,
              })

              ecs.ScaleAnimation.set(world, eid, {
                fromX: 0,
                fromY: 0,
                fromZ: 0,
                toX: 2,
                toY: 2,
                toZ: 2,
                duration: 200,
                easeIn: true,
                easingFunction: 'bounce',
                loop: false,
              })
            })
          })
      })
      .onTrigger(toSphere, 'sphere')
  },
  add: (world, component) => {
    ecs.Shadow.set(world, component.eid, {
      receiveShadow: false,
      castShadow: true,
    })
  },
})

export {ScavengerHuntPoi}
