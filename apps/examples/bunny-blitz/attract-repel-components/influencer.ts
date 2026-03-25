import * as ecs from '@8thwall/ecs'

const {CircleGeometry, GltfModel, Material, Position, Quaternion} = ecs
const {quat, vec3} = ecs.math

const WHITE_COLOR = {r: 255, g: 255, b: 255}
const v = vec3.zero()
const q90nx = quat.pitchYawRollDegrees(vec3.xyz(-90, 0, 0))  // 90 degrees about negative x

const createCircle = (world, parent, radius, color, imageTexture, yOffset) => {
  const circle = world.createEntity()
  CircleGeometry.set(world, circle, {radius})
  Material.set(world, circle, color)
  if (imageTexture) {
    Material.set(world, circle, {textureSrc: imageTexture, opacity: 0.999})
  }
  world.setParent(circle, parent)
  Position.set(world, circle, v.setXyz(0, yOffset + 0.05, 0))
  Quaternion.set(world, circle, q90nx)
  return circle
}

const Influencer = ecs.registerComponent({
  name: 'influencer',
  schema: {
    alertRadius: ecs.f32,
    activeRadius: ecs.f32,
    eventRadius: ecs.f32,
    attract: ecs.boolean,
    displayRadii: ecs.boolean,
    // @asset
    alertRadiusImage: ecs.string,
    // @asset
    activeRadiusImage: ecs.string,
    // @asset
    eventRadiusImage: ecs.string,
    idleAnimation: ecs.string,
    moveAnimation: ecs.string,
    eventAnimation: ecs.string,
    scale: ecs.f32,  // To adjust radius by influencer scale
  },
  schemaDefaults: {
    alertRadius: 10.0,
    activeRadius: 5.0,
    eventRadius: 2.0,
    attract: true,
    displayRadii: false,
  },
  data: {
    currentPositionX: ecs.f32,
    currentPositionY: ecs.f32,
    currentPositionZ: ecs.f32,
  },
  add: (world, component) => {
    console.log(`Influencer added with EID: ${component.eid}`)

    const position = ecs.Position.cursor(world, component.eid)
    component.data.currentPositionX = position.x
    component.data.currentPositionY = position.y
    component.data.currentPositionZ = position.z

    if (component.schema.displayRadii) {
      const alertColor = component.schema.alertRadiusImage ? WHITE_COLOR : {r: 255, g: 255, b: 0}
      const activeColor = component.schema.activeRadiusImage ? WHITE_COLOR : {r: 0, g: 255, b: 0}
      const eventColor = component.schema.eventRadiusImage ? WHITE_COLOR : {r: 255, g: 0, b: 0}

      createCircle(
        world,
        component.eid,
        component.schema.alertRadius / component.schema.scale,
        alertColor,
        component.schema.alertRadiusImage,
        0.01
      )

      createCircle(
        world,
        component.eid,
        component.schema.activeRadius / component.schema.scale,
        activeColor,
        component.schema.activeRadiusImage,
        0.02
      )

      createCircle(
        world,
        component.eid,
        component.schema.eventRadius / component.schema.scale,
        eventColor,
        component.schema.eventRadiusImage,
        0.03
      )
    }

    if (component.schema.idleAnimation) {
      GltfModel.set(world, component.eid, {animationClip: component.schema.idleAnimation})
    }

    world.events.addListener(component.eid, 'moveStart', (e) => {
      const influencer = Influencer.get(world, e.target)
      if (influencer.moveAnimation) {
        GltfModel.set(world, e.target, {animationClip: influencer.moveAnimation})
      }
    })

    world.events.addListener(component.eid, 'moveEnd', (e) => {
      const influencer = Influencer.get(world, e.target)
      if (influencer.idleAnimation) {
        GltfModel.set(world, e.target, {animationClip: influencer.idleAnimation})
      }
    })
  },
  tick: (world, component) => {
    const position = Position.get(world, component.eid)
    component.data.currentPositionX = position.x
    component.data.currentPositionY = position.y
    component.data.currentPositionZ = position.z

    // Implement logic to check proximity of agents and apply influence based on radii
    // Example pseudocode:
    // for each agent:
    //   if distance < component.schema.eventRadius and world.time.absolute > component.data.lastTriggerTime + delay:
    //     triggerEvent();
    //     component.data.lastTriggerTime = world.time.absolute;
    //   else if distance < component.schema.activeRadius:
    //     moveAgent(component.schema.attract);
  },
  remove: (world, component) => {
    console.log(`Influencer removed with EID: ${component.eid}`)
  },
})

export {
  Influencer,
}
