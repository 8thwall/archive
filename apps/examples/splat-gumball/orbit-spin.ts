import * as ecs from '@8thwall/ecs'
const {THREE} = window as any

const INERTIA_TIMER = 200
const MOVING_TIMER = 30
const MAX_SPEED_FACTOR = 0.01

const upVector = new THREE.Vector3(0, 1, 0)
const cameraPos = new THREE.Vector3()
const pivotPoint = new THREE.Vector3()
const tempMatrix = new THREE.Matrix4()
const tempMat4 = ecs.math.mat4.i()
const cameraRotation = new THREE.Quaternion()

const setCameraPosition = (world, id, orbitData) => {
  orbitData.curPitch = orbitData.pitch
  orbitData.curYaw = orbitData.yaw
  orbitData.curDistance = orbitData.distance

  const sinPitch = Math.sin(orbitData.pitch)
  const cosPitch = Math.cos(orbitData.pitch)
  const sinYaw = Math.sin(orbitData.yaw)
  const cosYaw = Math.cos(orbitData.yaw)

  cameraPos.x = orbitData.distance * cosPitch * cosYaw
  cameraPos.y = orbitData.distance * sinPitch
  cameraPos.z = orbitData.distance * cosPitch * sinYaw

  // Clamp x position
  cameraPos.x = Math.max(orbitData.minX, Math.min(orbitData.maxX, cameraPos.x))

  // Add the pivot point to the position to get the final position
  cameraPos.add(pivotPoint)

  tempMatrix.lookAt(pivotPoint, cameraPos, upVector)
  cameraRotation.setFromRotationMatrix(tempMatrix)

  const posCursor = ecs.Position.cursor(world, id)
  posCursor.x = cameraPos.x
  posCursor.y = cameraPos.y
  posCursor.z = cameraPos.z

  const quatCursor = ecs.Quaternion.cursor(world, id)
  quatCursor.w = cameraRotation.w
  quatCursor.x = cameraRotation.x
  quatCursor.y = cameraRotation.y
  quatCursor.z = cameraRotation.z
}

const capSpeed = (speed, maxSpeed) => Math.sign(speed) *
Math.min(Math.abs(speed), maxSpeed * MAX_SPEED_FACTOR)

const updateDistance = (cursor, distanceMin, distanceMax) => {
  const newDistance = cursor.distance + cursor.delta
  const distanceClamped = Math.min(Math.max(newDistance, distanceMin), distanceMax)
  cursor.distance = distanceClamped
}

const createGestureMoveHandler = (
  controls, data, eid
) => (e: {data}) => {
  const {
    speed, maxAngularSpeed, maxZoomSpeed, distanceMin, distanceMax, invertedX, invertedY,
    invertedZoom,
  } =
    controls.get(eid)
  const cursor = data.cursor(eid)
  if (e.data.touchCount === 1) {
    const {positionChange} = e.data

    cursor.dx = capSpeed(positionChange.x * speed, maxAngularSpeed) * (invertedX ? -1 : 1) * -1
    cursor.dy = capSpeed(positionChange.y * speed, maxAngularSpeed) * (invertedY ? -1 : 1)

    const pitchAngle = cursor.pitch - cursor.dy
    const yawAngle = cursor.yaw - cursor.dx
    const pitchClamped = Math.min(Math.max(pitchAngle, cursor.minPitch),
      cursor.maxPitch)
    const yawAngleClamped = Math.min(Math.max(yawAngle, cursor.minYaw), cursor.maxYaw)
    cursor.pitch = pitchClamped
    cursor.yaw = cursor.constrainYaw ? yawAngleClamped : yawAngle
  } else if (e.data.touchCount === 2) {
    const {spreadChange} = e.data

    cursor.delta = capSpeed(spreadChange * speed, maxZoomSpeed) * (invertedZoom ? -1 : 1)
    updateDistance(cursor, distanceMin, distanceMax)
  }
  cursor.moving = MOVING_TIMER
  cursor.inertia = INERTIA_TIMER
}

const orbit = ecs.registerComponent({
  name: 'orbit',
  schema: {
    speed: ecs.f32,
    maxAngularSpeed: ecs.f32,
    maxZoomSpeed: ecs.f32,
    distanceMin: ecs.f32,
    distanceMax: ecs.f32,
    pitchAngleMin: ecs.f32,
    pitchAngleMax: ecs.f32,
    constrainYaw: ecs.boolean,
    yawAngleMin: ecs.f32,
    yawAngleMax: ecs.f32,
    inertiaFactor: ecs.f32,
    focusEntity: ecs.eid,
    invertedX: ecs.boolean,
    invertedY: ecs.boolean,
    invertedZoom: ecs.boolean,
    minX: ecs.f32,  // New: Minimum x-axis position
    maxX: ecs.f32,  // New: Maximum x-axis position
  },
  schemaDefaults: {
    speed: 5,
    maxAngularSpeed: 10,
    maxZoomSpeed: 10,
    distanceMin: 5,
    distanceMax: 20,
    pitchAngleMin: -90,
    pitchAngleMax: 90,
    constrainYaw: false,
    yawAngleMin: -180,
    yawAngleMax: 180,
    inertiaFactor: 0.3,
    minX: -10,  // New: Default minimum x-axis position
    maxX: 10,   // New: Default maximum x-axis position
  },
  data: {
    pitch: 'f32',
    yaw: 'f32',
    distance: 'f32',
    dx: 'f32',
    dy: 'f32',
    delta: 'f32',
    moving: 'f32',
    inertia: 'f32',
    minPitch: 'f32',
    maxPitch: 'f32',
    curPitch: 'f32',
    constrainYaw: 'boolean',
    minYaw: 'f32',
    maxYaw: 'f32',
    curYaw: 'f32',
    curDistance: 'f32',
    minX: 'f32',  // New: Minimum x-axis position
    maxX: 'f32',  // New: Maximum x-axis position
  },
  add: (world, component) => {
    const {schema, data} = component

    const {
      pitchAngleMax, pitchAngleMin, distanceMax, distanceMin, focusEntity, yawAngleMax, yawAngleMin,
      minX, maxX,  // New: Get minX and maxX from schema
    } = schema

    const validPitchInterval = pitchAngleMin <= pitchAngleMax
    const validYawInterval = yawAngleMin <= yawAngleMax

    const minPitch = validPitchInterval ? Math.max(pitchAngleMin, -89.9999) * (Math.PI / 180) : 0
    const maxPitch = validPitchInterval ? Math.min(pitchAngleMax, 89.9999) * (Math.PI / 180) : 0
    const minYaw = validYawInterval ? yawAngleMin * (Math.PI / 180) : -Math.PI
    const maxYaw = validYawInterval ? yawAngleMax * (Math.PI / 180) : Math.PI

    data.minPitch = minPitch
    data.maxPitch = maxPitch
    data.minYaw = minYaw
    data.maxYaw = maxYaw
    data.distance = (distanceMin + distanceMax) / 2
    data.pitch = (minPitch + maxPitch) / 2
    data.constrainYaw = schema.constrainYaw
    data.yaw = (minYaw + maxYaw) / 2
    data.minX = minX  // New: Set minX
    data.maxX = maxX  // New: Set maxX

    if (focusEntity) {
      world.getWorldTransform(focusEntity, tempMat4)
      tempMatrix.fromArray(tempMat4.data())
      pivotPoint.setFromMatrixPosition(tempMatrix)
    } else {
      pivotPoint.set(0, 0, 0)
    }

    // Set the initial camera position
    setCameraPosition(world, component.eid, data)
    const handleGesture = createGestureMoveHandler(
      component.schemaAttribute, component.dataAttribute, component.eid
    )
    world.events.addListener(world.events.globalId, ecs.input.GESTURE_MOVE, handleGesture)
  },

  tick: (world, component) => {
    const {schema, data} = component
    const {speed, inertiaFactor, maxZoomSpeed, maxAngularSpeed, distanceMin, distanceMax} = schema

    if (data.inertia > 0 && inertiaFactor !== 0 && data.moving <= 0) {
      const currentInertia = Math.min(
        inertiaFactor * world.time.delta * (data.inertia / INERTIA_TIMER), 1
      )

      if (data.delta !== 0) {
        const newDistance = data.distance +
        capSpeed((data.delta / speed) * currentInertia, maxZoomSpeed)
        const distanceClamped = Math.min(Math.max(newDistance, distanceMin), distanceMax)
        data.distance = distanceClamped
      }

      if (data.dy !== 0 || data.dx !== 0) {
        const pitchAngle = data.pitch -
        capSpeed((data.dy / speed) * currentInertia, maxAngularSpeed)
        const yawAngle = data.yaw - capSpeed(
          (data.dx / speed) * currentInertia, maxAngularSpeed
        )
        const pitchClamped = Math.min(Math.max(pitchAngle, data.minPitch), data.maxPitch)
        const yawAngleClamped = Math.min(Math.max(yawAngle, data.minYaw), data.maxYaw)
        data.pitch = pitchClamped
        data.yaw = data.constrainYaw ? yawAngleClamped : yawAngle
      }

      data.inertia -= world.time.delta

      if (data.inertia <= 0) {
        data.dx = 0
        data.dy = 0
        data.delta = 0
      }
    }

    if (data.moving > 0) {
      data.moving -= world.time.delta
    }

    if (data.curYaw !== data.yaw ||
      data.curPitch !== data.pitch ||
      data.curDistance !== data.distance) {
      setCameraPosition(world, component.eid, data)
    }
  },

  remove: (world, component) => {
    // Remove event listener if necessary
  },
})

export {orbit}