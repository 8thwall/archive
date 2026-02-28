import * as ecs from '@8thwall/ecs'
import {ScavengerHuntPoi} from './scavenger-hunt-poi'

const ScavengerHuntLocation = ecs.registerComponent({
  name: 'Scavenger Hunt Location',
  schema: {
    // @label Distance Threshold
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
  add: (world, component) => {
    const bubble = world.createEntity()
    world.setParent(bubble, component.eid)

    ecs.Position.set(world, bubble, {
      x: 0,
      y: 2,
      z: 0,
    })

    ScavengerHuntPoi.set(world, bubble, {
      threshold: component.schema.threshold,
      displayName: component.schema.displayName,
      spaceName: component.schema.spaceName,
      thumbnailImage: component.schema.thumbnailImage,
      ringR: component.schema.ringR,
      ringG: component.schema.ringG,
      ringB: component.schema.ringB,
      sphereR: component.schema.sphereR,
      sphereG: component.schema.sphereG,
      sphereB: component.schema.sphereB,
    })
  },
})

export {ScavengerHuntLocation}
