import * as ecs from '@8thwall/ecs'

import {setXYZAngle} from '../helpers/angle'

const menuCreateTimes = new Map()

const MenuConfig = ecs.registerComponent({
  name: 'MenuConfig',
  schema: {
    // @asset
    backgroundImage: ecs.string,
    // @asset
    rotateImage: ecs.string,
    // @asset
    deleteImage: ecs.string,
    // @asset
    upgradeImage: ecs.string,
    // @asset
    cancelImage: ecs.string,
    camera: ecs.eid,
  },
})

const Menu = ecs.registerComponent({
  name: 'Menu',
  schema: {
    // @asset
    deleteImage: ecs.string,
    // @asset
    rotateImage: ecs.string,
    // @asset
    upgradeImage: ecs.string,
    // @asset
    cancelImage: ecs.string,
    // @asset
    backgroundImage: ecs.string,
    targetId: ecs.eid,
    canUpgrade: ecs.boolean,
    camera: ecs.eid,
  },
  add: (world, component) => {
    console.log('Creating menu!')

    const {deleteImage, rotateImage, upgradeImage, cancelImage, backgroundImage, canUpgrade} = component.schema

    // Create Root Entity
    const rootEntity = world.createEntity()
    const menuScale = 4
    world.setScale(rootEntity, menuScale, menuScale, menuScale)

    setXYZAngle(world, component.eid, -45, 45, 0)

    // Create Background Plane
    const background = world.createEntity()
    ecs.PlaneGeometry.set(world, background, {width: 1.5, height: 0.75})  // Adjust dimensions as needed
    ecs.Material.set(world, background, {opacity: 0.999, textureSrc: backgroundImage, r: 255, g: 255, b: 255})

    // Create Rotate Button
    const rotateButton = world.createEntity()
    ecs.PlaneGeometry.set(world, rotateButton, {width: 0.25, height: 0.25})
    ecs.Material.set(world, rotateButton, {opacity: 0.999, textureSrc: rotateImage, r: 255, g: 255, b: 255})

    const upgradeOpacity = canUpgrade ? 0.999 : 0
    // Create Upgrade Button
    const upgradeButton = world.createEntity()
    ecs.PlaneGeometry.set(world, upgradeButton, {width: 0.25, height: 0.25})
    ecs.Material.set(world, upgradeButton, {side: 'double', opacity: upgradeOpacity, textureSrc: upgradeImage, r: 255, g: 255, b: 255})

    // Create Delete Button
    const deleteButton = world.createEntity()
    ecs.PlaneGeometry.set(world, deleteButton, {width: 0.25, height: 0.25})
    ecs.Material.set(world, deleteButton, {opacity: 0.999, textureSrc: deleteImage, r: 255, g: 255, b: 255})

    // Create Cancel Button
    const cancelButton = world.createEntity()
    ecs.PlaneGeometry.set(world, cancelButton, {width: 0.2, height: 0.2})
    ecs.Material.set(world, cancelButton, {opacity: 0.999, textureSrc: cancelImage, r: 255, g: 255, b: 255})

    // Parent the planes to the root entity
    world.setParent(background, rootEntity)
    world.setParent(rotateButton, rootEntity)
    world.setParent(upgradeButton, rootEntity)
    world.setParent(deleteButton, rootEntity)
    world.setParent(cancelButton, rootEntity)

    const yPos = 0.08
    const buttonPosition = canUpgrade ? 0.4 : 0.2
    // Position the planes relative to each other within the root entity
    world.setPosition(background, 0, 0, 0)
    world.setPosition(rotateButton, -buttonPosition, yPos, 0.04)
    world.setPosition(upgradeButton, 0, yPos, 0.03)
    world.setPosition(deleteButton, buttonPosition, yPos, 0.04)
    world.setPosition(cancelButton, 0.7, 0.35, 0.06)

    menuCreateTimes.set(component.eid, world.time.elapsed)

    // Parent the root entity to the component entity
    world.setParent(rootEntity, component.eid)

    // Add event listeners for the buttons
    world.events.addListener(rotateButton, ecs.input.SCREEN_TOUCH_START, (e) => {
      world.events.dispatch(component.schema.targetId, 'menuRotate', {})
    })

    world.events.addListener(upgradeButton, ecs.input.SCREEN_TOUCH_START, (e) => {
      if (!canUpgrade) {
        return
      }
      world.events.dispatch(component.schema.targetId, 'menuUpgrade', {})
    })

    world.events.addListener(deleteButton, ecs.input.SCREEN_TOUCH_START, (e) => {
      world.events.dispatch(component.schema.targetId, 'menuDelete', {})
    })

    world.events.addListener(cancelButton, ecs.input.SCREEN_TOUCH_START, (e) => {
      world.events.dispatch(component.schema.targetId, 'menuCancel', {})
    })

    // Add a global touch event listener to close the menu
    const globalTouchListener = (e) => {
      const createTime = menuCreateTimes.get(component.eid)
      if (!createTime) return

      if (world.time.elapsed - createTime < 1000) {
        return
      }

      menuCreateTimes.delete(component.eid)

      // Check if the touch is outside the menu
      const touchOutsideMenu = ![background, rotateButton, upgradeButton, deleteButton, cancelButton].includes(e.target)
      if (touchOutsideMenu) {
        world.events.dispatch(component.schema.targetId, 'menuCancel', {})
        world.events.removeListener(world.events.globalId, ecs.input.SCREEN_TOUCH_START, globalTouchListener)
      }
    }

    world.events.addListener(world.events.globalId, ecs.input.SCREEN_TOUCH_START, globalTouchListener)
  },
})

const menuConfigQuery = ecs.defineQuery([MenuConfig])

const getMenuConfig = (world) => {
  const configs = menuConfigQuery(world)
  const menuConfig = MenuConfig.get(world, configs[0])
  return menuConfig
}

export {Menu, MenuConfig, getMenuConfig}
