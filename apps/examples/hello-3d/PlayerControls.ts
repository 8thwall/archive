import * as ecs from '@8thwall/ecs'

// Utility function: degrees to radians
const degToRad = (deg: number) => deg * Math.PI / 180

// Reusable math objects to avoid allocations
const tempQuat = ecs.math.quat.zero()
const tempVec3 = ecs.math.vec3.zero()
const tempMat4 = ecs.math.mat4.i()

// --- Main Component: Golf Ball Launch ---
// This handles aiming, power meter, swinging, club animation, physics, and simple respawn.
// Attach to the Player entity for each hole.

ecs.registerComponent({
  name: 'Player Controls',
  // --- Configuration exposed in Inspector ---
  schema: {
    // @label Player Rotation Speed
    rotationSpeed: ecs.f32,  // How fast the ball/club rotates (deg/sec)
    // @label Player Initial Rotation
    initialYRotation: ecs.f32,  // Starting Y rotation (degrees)
    // @label Reset Ball Height
    resetY: ecs.f32,  // Y position threshold for out-of-bounds respawn
    // @label Entity: Golf Ball
    golfBallObj: ecs.eid,  // Entity ID of the golf ball
    // @label Entity: Golf Club
    golfClubObj: ecs.eid,  // Entity ID of the golf club
    // @label UI: Controls
    controls: ecs.eid,  // Entity ID of the controls UI group
    // @label UI: Swing Button
    swingButton: ecs.eid,  // Entity ID of the swing button
    // @label UI: Left Arrow Button
    leftButton: ecs.eid,  // Entity ID of the left button
    // @label UI: Right Arrow Button
    rightButton: ecs.eid,  // Entity ID of the right button
    // @label UI: Swing Label
    swingLabel: ecs.eid,  // Entity ID of the label behind the swing button
    // @label UI: Power Meter Bar
    powerMeterBar: ecs.eid,  // Entity ID of the parent/container for the power meter
  },
  // --- Default Inspector values ---
  schemaDefaults: {
    rotationSpeed: 2.0,
    initialYRotation: 90,
    resetY: -3,
  },
  // --- Internal state not exposed in Inspector ---
  data: {
    velocity: ecs.f32,  // Launch power (derived from power meter)
    currentAngle: ecs.f32,  // Current aiming angle (radians)
    animStarted: ecs.boolean,  // Whether the power meter anim is running
    swingAnimTime: ecs.f32,  // Time since swing started
    lastSafeX: ecs.f32,  // Last safe ball X
    lastSafeY: ecs.f32,  // Last safe ball Y
    lastSafeZ: ecs.f32,  // Last safe ball Z
    leftHeld: ecs.boolean,  // Left UI/button/key held
    rightHeld: ecs.boolean,  // Right UI/button/key held
    hasInitializedAngle: ecs.boolean,  // Only apply initial rotation once
  },

  // --- The State Machine: Controls behavior, animation, and transitions ---
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    // --- Helper: For power meter color ---
    const colorStops = [
      {r: 255, g: 0, b: 0},
      {r: 255, g: 153, b: 0},
      {r: 255, g: 255, b: 0},
      {r: 0, g: 255, b: 0},
    ]
    const rgbToHex = (r, g, b) => {
      r = Math.max(0, Math.min(255, Math.round(r)))
      g = Math.max(0, Math.min(255, Math.round(g)))
      b = Math.max(0, Math.min(255, Math.round(b)))
      const toHex = c => c.toString(16).padStart(2, '0')
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }

    ecs.defineState('init')
      .initial()
      .listen(world.events.globalId, 'level-loaded', () => {
        ecs.Collider.set(world, schemaAttribute.get(eid).golfBallObj, {gravityFactor: 1})
      })
      .wait(4000, 'powerMeter')  // wait for golf ball to drop -> transition to powerMeter

    // --- State 1: Power Meter/Aiming ---
    ecs.defineState('powerMeter')
      .onEnter(() => {
        // Show UI, reset state, and remember safe position for respawn
        const {golfBallObj, powerMeterBar, controls} = schemaAttribute.get(eid)
        const dataCursor = dataAttribute.cursor(eid)

        world.getEntity(powerMeterBar).show()
        world.getEntity(controls).show()

        const pos = ecs.Position.get(world, golfBallObj)
        dataCursor.animStarted = false
        dataCursor.lastSafeX = pos?.x || 0
        dataCursor.lastSafeY = pos?.y || 0
        dataCursor.lastSafeZ = pos?.z || 0
        dataCursor.leftHeld = false
        dataCursor.rightHeld = false
        // Only apply initial rotation on first time
        dataCursor.hasInitializedAngle = dataCursor.hasInitializedAngle || false
      })
      .onTick(() => {
        // Get everything needed from schema
        const {powerMeterBar, rotationSpeed, initialYRotation} = schemaAttribute.get(eid)
        const data = dataAttribute.cursor(eid)
        const delta = world.time.delta * 0.001

        // --- INITIAL ROTATION (applies only once per entity) ---
        if (!data.hasInitializedAngle) {
          data.currentAngle = degToRad(initialYRotation)
          tempQuat.makeYRadians(data.currentAngle)
          world.setQuaternion(eid, tempQuat.x, tempQuat.y, tempQuat.z, tempQuat.w)
          data.hasInitializedAngle = true
        }

        // --- Animate the Power Meter Bar ---
        if (!data.animStarted && powerMeterBar) {
          ecs.CustomPropertyAnimation.set(world, powerMeterBar, {
            attribute: 'ui',
            property: 'height',
            from: 1,
            to: 150,
            duration: 1000,
            loop: true,
            reverse: true,
          })
          data.animStarted = true
        }

        // --- Power/Velocity Calculation and Color ---
        if (powerMeterBar) {
          const powerMeterUi = ecs.Ui.get(world, powerMeterBar)
          const heightValue = parseFloat(powerMeterUi.height)
          data.velocity = Math.max(1, Math.min(10, heightValue / 15))

          // Animate color based on bar height
          const t = Math.max(0, Math.min(1, (heightValue - 1) / 149))
          const segmentIndex = Math.floor(t * 3)
          const segmentT = (t - segmentIndex / 3) * 3
          const fromColor = colorStops[segmentIndex]
          const toColor = colorStops[Math.min(segmentIndex + 1, colorStops.length - 1)]
          const r = fromColor.r + (toColor.r - fromColor.r) * segmentT
          const g = fromColor.g + (toColor.g - fromColor.g) * segmentT
          const b = fromColor.b + (toColor.b - fromColor.b) * segmentT
          const hex = rgbToHex(r, g, b)
          ecs.Ui.mutate(world, powerMeterBar, (cursor) => {
            cursor.background = hex
            return false
          })
        }

        // --- INPUT HANDLING (UI + keyboard/gamepad) ---
        // Hold-to-turn via UI buttons
        if (world.input.getAction('left') || data.leftHeld) {
          data.currentAngle += rotationSpeed * delta
        }
        if (world.input.getAction('right') || data.rightHeld) {
          data.currentAngle -= rotationSpeed * delta
        }

        // Keep angle in -PI..PI
        if (data.currentAngle > Math.PI) data.currentAngle -= Math.PI * 2
        if (data.currentAngle < -Math.PI) data.currentAngle += Math.PI * 2

        // Apply rotation to ball entity (will also rotate club)
        tempQuat.makeYRadians(data.currentAngle)
        world.setQuaternion(eid, tempQuat.x, tempQuat.y, tempQuat.z, tempQuat.w)

        // --- SWING input ---
        if (world.input.getAction('swing')) {
          world.events.dispatch(eid, 'golf-swing')
        }
      })

      // --- UI Button events ---
      .listen(() => schemaAttribute.get(eid).leftButton, ecs.input.UI_PRESSED, () => {
        dataAttribute.cursor(eid).leftHeld = true
      })
      .listen(() => schemaAttribute.get(eid).leftButton, ecs.input.UI_RELEASED, () => {
        dataAttribute.cursor(eid).leftHeld = false
      })
      .listen(() => schemaAttribute.get(eid).rightButton, ecs.input.UI_PRESSED, () => {
        dataAttribute.cursor(eid).rightHeld = true
      })
      .listen(() => schemaAttribute.get(eid).rightButton, ecs.input.UI_RELEASED, () => {
        dataAttribute.cursor(eid).rightHeld = false
      })
      .listen(() => schemaAttribute.get(eid).swingButton, ecs.input.UI_HOVER_START, () => {
        ecs.Ui.set(world, schemaAttribute.get(eid).swingLabel, {
          background: '#14498F',
        })
      })
      .listen(() => schemaAttribute.get(eid).swingButton, ecs.input.UI_HOVER_END, () => {
        ecs.Ui.set(world, schemaAttribute.get(eid).swingLabel, {
          background: '#006EFF',
        })
      })
      .listen(() => schemaAttribute.get(eid).swingButton, ecs.input.UI_CLICK, () => {
        world.events.dispatch(eid, 'golf-swing')
      })
      // Save last safe position on swing event (for respawn)
      .listen(eid, 'golf-swing', () => {
        const pos = ecs.Position.get(world, schemaAttribute.get(eid).golfBallObj)
        if (pos) {
          const data = dataAttribute.cursor(eid)
          data.lastSafeX = pos.x
          data.lastSafeY = pos.y
          data.lastSafeZ = pos.z
        }
      })
      .onEvent('golf-swing', 'swing')  // Transition to swing

    // --- State 2: Club Animation and Ball Launch ---
    ecs.defineState('swing')
      .onEnter(() => {
        // Hide UI and start club animation
        const {powerMeterBar, controls} = schemaAttribute.get(eid)
        world.getEntity(powerMeterBar).hide()
        world.getEntity(controls).hide()
        dataAttribute.cursor(eid).swingAnimTime = 0
      })
      .onTick(() => {
        // Animate the club swinging forward/back
        const {golfClubObj} = schemaAttribute.get(eid)
        const data = dataAttribute.cursor(eid)
        const duration = 0.5
        data.swingAnimTime += world.time.delta * 0.001
        const t = Math.min(1, data.swingAnimTime / duration)
        let angle
        if (t < 0.45) {
          // Backswing cubic ease-out
          const t2 = t / 0.45
          angle = 30 + 30 * (t2 * t2 * t2)
        } else {
          // Downswing cubic ease-in
          const t2 = (t - 0.45) / 0.55
          angle = 60 + (-90) * (1 - Math.pow(1 - t2, 3))
        }
        const zRotation = ecs.math.quat.zRadians(angle * Math.PI / 180)
        const xRotation = ecs.math.quat.xDegrees(14)
        const combinedRotation = xRotation.times(zRotation)
        world.setQuaternion(golfClubObj, combinedRotation.x, combinedRotation.y, combinedRotation.z, combinedRotation.w)
        world.setPosition(golfClubObj, 0.1, 0.7, 0.2)
      })
      .wait(325, 'hitBall')  // After 325ms, hit the ball

    // --- State 3: Apply physics impulse to golf ball on swing ---
    ecs.defineState('hitBall')
      .onEnter(() => {
        const {golfBallObj} = schemaAttribute.get(eid)
        // play ball hit SFX
        if (ecs.Audio.has(world, golfBallObj)) {
          ecs.Audio.mutate(world, golfBallObj, (cursor) => {
            cursor.paused = false
          })
        }
        // Calculate forward direction based on current angle
        const data = dataAttribute.cursor(eid)
        tempQuat.makeYRadians(data.currentAngle)
        world.setQuaternion(golfBallObj, tempQuat.x, tempQuat.y, tempQuat.z, tempQuat.w)
        // Forward vector in local space (-X)
        world.getWorldTransform(golfBallObj, tempMat4)
        const {r} = tempMat4.decomposeTrs()
        const forward = r.timesVec(tempVec3.setXyz(-1, 0, 0))
        ecs.physics.applyImpulse(
          world, golfBallObj,
          forward.x * data.velocity,
          forward.y * data.velocity,
          forward.z * data.velocity
        )
      })
      .wait(100, 'waitForBall')  // Wait a moment for launch

    // --- State 4: Ball in flight (waiting to stop or go out-of-bounds) ---
    ecs.defineState('waitForBall')
      .onEnter(() => {
        // Hide UI and club while the ball is moving
        const {powerMeterBar, controls} = schemaAttribute.get(eid)
        world.getEntity(powerMeterBar).hide()
        world.getEntity(controls).hide()
        world.getEntity(eid).hide()
      })
      .onTick(() => {
        // Watch the ball position/speed for reset or next turn
        const {golfBallObj, resetY, powerMeterBar, controls} = schemaAttribute.get(eid)
        const data = dataAttribute.cursor(eid)
        const vel = ecs.physics.getLinearVelocity(world, golfBallObj)
        const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z)
        const ballPos = ecs.Position.get(world, golfBallObj)

        // Out-of-bounds respawn: move ball to last safe position
        if (ballPos?.y < resetY && typeof data.lastSafeX === 'number') {
          ecs.Position.set(world, golfBallObj, {
            x: data.lastSafeX,
            y: data.lastSafeY + 0.5,
            z: data.lastSafeZ,
          })
          ecs.physics.setLinearVelocity(world, golfBallObj, 0, 0, 0)
          ecs.physics.setAngularVelocity(world, golfBallObj, 0, 0, 0)
          world.getEntity(eid).show()
          world.getEntity(powerMeterBar).show()
          world.getEntity(controls).show()
        }

        // When the ball has come to a stop, allow next turn
        if (speed < 0.005) {
          world.time.setTimeout(() => {
            world.events.dispatch(eid, 'golf-reset')
          }, 800)
        }
      })
      .onEvent('golf-reset', 'powerMeter')  // Transition back to aiming
      .onExit(() => {
        // Reset club position and UI for next shot
        const {golfBallObj, golfClubObj, powerMeterBar, controls} = schemaAttribute.get(eid)
        const golfBallPos = ecs.Position.get(world, golfBallObj)
        if (golfBallPos) {
          ecs.Position.set(world, eid, {
            x: golfBallPos.x,
            y: golfBallPos.y,
            z: golfBallPos.z,
          })
        }
        tempQuat.makePitchYawRollDegrees(tempVec3.setXyz(14, 0, 0))
        world.setQuaternion(golfClubObj, tempQuat.x, tempQuat.y, tempQuat.z, tempQuat.w)
        world.getEntity(powerMeterBar).show()
        world.getEntity(controls).show()
        world.getEntity(eid).show()
      })
  },
})
