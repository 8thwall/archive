import * as ecs from '@8thwall/ecs'
import {KeyBoardEvents, mapKey} from './keyboard-controls'
import {CameraManager} from './camera-controls'

const {vec3} = ecs.math

/**
 * Class representing player controls for a game.
 */
class PlayerControlsSchema {
  /**
   * Creates an instance of PlayerControls.
   * @param {string} moveForwardKey - The key to move forward.
   * @param {string} moveBackwardKey - The key to move backward.
   * @param {string} moveLeftKey - The key to move left.
   * @param {string} moveRightKey - The key to move right.
   * @param {string} runKey - The key to run.
   */
  constructor(
    moveForwardKey,
    moveBackwardKey,
    moveLeftKey,
    moveRightKey,
    runKey
  ) {
    this.moveForwardKey = moveForwardKey
    this.moveBackwardKey = moveBackwardKey
    this.moveLeftKey = moveLeftKey
    this.moveRightKey = moveRightKey
    this.runKey = runKey
  }
}

class PlayerState {
  constructor() {
    this.movingForward = false
    this.movingBackward = false
    this.movingLeft = false
    this.movingRight = false
    this.running = false
    this.force = [0, 0, 0]
  }

  moveForward(movingForward) {
    this.movingForward = movingForward
    this.force[2] = movingForward ? 0.1 : 0
  }

  moveBackward(movingBackward) {
    this.movingBackward = movingBackward
    this.force[2] = movingBackward ? -0.1 : 0
  }

  moveLeft(movingLeft) {
    this.movingLeft = movingLeft
    this.force[0] = movingLeft ? -0.1 : 0
  }

  moveRight(movingRight) {
    this.movingRight = movingRight
    this.force[0] = movingRight ? 0.1 : 0
  }

  run(running) {
    this.running = running
  }

  getForce() {
    return this.force
  }
}

export class PlayerController {
  /**
   *
   * @param {*} world
   * @param {*} entityId
   * @param {*} playerBodyEntityId
   * @param {PlayerControlsSchema} controls
   */
  constructor(world, entityId, playerBodyEntityId, controls) {
    this.state = new PlayerState()
    this.controls = controls
    this.world = world
    this.entityId = entityId
    this.playerBodyEntityId = playerBodyEntityId
    this.cleanUp = () => {}

    this.setUpControls()
  }

  setUpControls() {
    this.cleanUp()
    const keyDownActions = {
      [mapKey(this.controls.moveForwardKey)]: () => this.state.moveForward(true),
      [mapKey(this.controls.moveBackwardKey)]: () => this.state.moveBackward(true),
      [mapKey(this.controls.moveLeftKey)]: () => this.state.moveLeft(true),
      [mapKey(this.controls.moveRightKey)]: () => this.state.moveRight(true),
      [mapKey(this.controls.runKey)]: () => this.state.run(true),
    }

    const keyUpActions = {
      [mapKey(this.controls.moveForwardKey)]: () => this.state.moveForward(false),
      [mapKey(this.controls.moveBackwardKey)]: () => this.state.moveBackward(false),
      [mapKey(this.controls.moveLeftKey)]: () => this.state.moveLeft(false),
      [mapKey(this.controls.moveRightKey)]: () => this.state.moveRight(false),
      [mapKey(this.controls.runKey)]: () => this.state.run(false),
    }

    const keyDownListener = ({data}) => keyDownActions[data.key] && keyDownActions[data.key]()

    const keyUpListener = ({data}) => keyUpActions[data.key] && keyUpActions[data.key]()

    this.world.events.addListener(
      this.world.events.globalId,
      KeyBoardEvents.KeyDown,
      keyDownListener
    )
    this.world.events.addListener(
      this.world.events.globalId,
      KeyBoardEvents.KeyUp,
      keyUpListener
    )

    this.cleanUp = () => {
      this.world.events.removeListener(
        this.world.events.globalId,
        KeyBoardEvents.KeyDown,
        keyDownListener
      )
      this.world.events.removeListener(
        this.world.events.globalId,
        KeyBoardEvents.KeyUp,
        keyUpListener
      )
    }
  }

  getForwardDirection() {
    return CameraManager.getForwardDirection()
  }

  getSideDirection() {
    return CameraManager.getSideDirection()
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  teleportTo(x, y, z) {
    // const properties = JSON.parse(
    //   JSON.stringify(ecs.Collider.get(this.world, this.playerBodyEntityId))
    // )
    // ecs.Collider.remove(this.world, this.playerBodyEntityId)
    // this.world.setPosition(this.playerBodyEntityId, x, y, z)
    // ecs.Collider.set(this.world, this.playerBodyEntityId, properties)
    const {world, entityId: eid} = PlayerController.instance
    const cursor = ecs.Position.cursor(world, eid)
    cursor.x = x
    cursor.y = y
    cursor.z = z
  }

  /**
   *
   * @param {number} fx
   * @param {number} fy
   * @param {number} fz
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  lookAt(fx, fy, fz, x, y, z) {
    CameraManager.cameraRig.setTarget(fx, fy, fz, x, y, z)
  }

  dispose() {
    this.cleanUp()
  }
}

Object.defineProperty(PlayerController, 'instance', {
  get: () => currentPlayer,
})

const clickHandler = () => {
  console.log('I clicked')
}

/**
 * @type {PlayerController|null}
 */
let currentPlayer = null

// Register the component with the ECS system
const PlayerControllerComponent = ecs.registerComponent({
  name: 'PlayerController',
  schema: {
    playerBody: ecs.eid,
    moveForwardKey: ecs.string,
    moveBackwardKey: ecs.string,
    moveLeftKey: ecs.string,
    moveRightKey: ecs.string,
    runKey: ecs.string,
  },

  schemaDefaults: {
    moveForwardKey: 'w',
    moveBackwardKey: 's',
    moveLeftKey: 'a',
    moveRightKey: 'd',
    runKey: 'Control',
  },
  add: (world, component) => {
    const {eid} = component
    currentPlayer = new PlayerController(
      world,
      eid,
      component.schema.playerBody,
      new PlayerControlsSchema(
        component.schema.moveForwardKey,
        component.schema.moveBackwardKey,
        component.schema.moveLeftKey,
        component.schema.moveRightKey,
        component.schema.runKey
      )
    )
  },
  tick: (world, component) => {
    if (!currentPlayer) return

    const forward = currentPlayer
      .getForwardDirection()
      .multiplyScalar(currentPlayer.state.force[2])

    const side = currentPlayer
      .getSideDirection()
      .multiplyScalar(currentPlayer.state.force[0])

    const final = forward.clone().add(side)

    const currentPosition = ecs.Position.cursor(world, component.schema.playerBody)

    if (!forward || !side || !final) return

    currentPosition.x += final.x
    currentPosition.z += final.z
  },

  remove: (world, component) => {
    world.events.removeListener(component.eid, ecs.Input.Fire, clickHandler)
    if (!currentPlayer) return
    currentPlayer.dispose()
  },
})

export {PlayerControllerComponent}
