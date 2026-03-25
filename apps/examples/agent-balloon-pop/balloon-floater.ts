import * as ecs from '@8thwall/ecs'

const BalloonFloater = ecs.registerComponent({
  name: 'Balloon Floater',
  schema: {
    floatSpeed: ecs.f32,  // Speed of vertical oscillation
    floatAmplitude: ecs.f32,  // How far up and down the balloon moves
    driftSpeed: ecs.f32,  // Speed of horizontal drift motion
    driftAmplitude: ecs.f32,  // How far side to side the balloon drifts
    phaseOffset: ecs.f32,  // Phase offset to make balloons float at different times
    rotationAmount: ecs.f32,  // Amount of gentle rotation while floating
  },
  schemaDefaults: {
    floatSpeed: 1.2,  // Gentle floating speed
    floatAmplitude: 0.3,  // Subtle vertical movement
    driftSpeed: 0.8,  // Slower horizontal drift
    driftAmplitude: 0.2,  // Small side-to-side movement
    phaseOffset: 0.0,  // No phase offset by default
    rotationAmount: 5.0,  // Gentle rotation in degrees
  },
  data: {
    initialPositionX: ecs.f32,  // Store initial X position
    initialPositionY: ecs.f32,  // Store initial Y position
    initialPositionZ: ecs.f32,  // Store initial Z position
    elapsedTime: ecs.f32,  // Track elapsed time for animations
    hasRecordedInitialPosition: ecs.boolean,  // Track if initial position is recorded
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    // Helper function to record initial position
    const recordInitialPosition = () => {
      const data = dataAttribute.cursor(eid)
      
      if (data.hasRecordedInitialPosition) return

      const pos = ecs.Position.get(world, eid)
      data.initialPositionX = pos.x
      data.initialPositionY = pos.y
      data.initialPositionZ = pos.z
      data.elapsedTime = 0
      data.hasRecordedInitialPosition = true
      
      console.log(`Recorded initial position for balloon floater: ${pos.x}, ${pos.y}, ${pos.z}`)
    }

    // Helper function to apply floating motion
    const applyFloatingMotion = () => {
      const {floatSpeed, floatAmplitude, driftSpeed, driftAmplitude, phaseOffset, rotationAmount} = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)
      
      if (!data.hasRecordedInitialPosition) return

      // Update elapsed time
      data.elapsedTime += world.time.delta / 1000 // Convert to seconds

      // Calculate time with phase offset
      const verticalTime = data.elapsedTime * floatSpeed + phaseOffset
      const horizontalTime = data.elapsedTime * driftSpeed + phaseOffset * 0.7 // Slightly different phase for horizontal

      // Calculate vertical floating motion using sine wave
      const verticalOffset = Math.sin(verticalTime) * floatAmplitude

      // Calculate horizontal drift using a slower sine wave
      const horizontalOffsetX = Math.sin(horizontalTime) * driftAmplitude
      const horizontalOffsetZ = Math.cos(horizontalTime * 0.6) * driftAmplitude * 0.5 // Subtle Z-axis drift

      // Apply position updates
      ecs.Position.set(world, eid, {
        x: data.initialPositionX + horizontalOffsetX,
        y: data.initialPositionY + verticalOffset,
        z: data.initialPositionZ + horizontalOffsetZ,
      })

      // Apply gentle rotation for added realism
      const rotationY = Math.sin(verticalTime * 0.3) * (rotationAmount * Math.PI / 180) // Convert degrees to radians
      const rotationZ = Math.cos(horizontalTime * 0.4) * (rotationAmount * 0.5 * Math.PI / 180) // Smaller rotation on Z-axis

      // Create quaternion from Euler angles (small rotations)
      const {quat} = ecs.math
      const rotation = quat.pitchYawRollRadians(ecs.math.vec3.xyz(0, rotationY, rotationZ))
      
      ecs.Quaternion.set(world, eid, {
        x: rotation.x,
        y: rotation.y,
        z: rotation.z,
        w: rotation.w,
      })
    }

    // State: Floating - continuous gentle floating motion
    ecs.defineState('floating')
      .initial()
      .onEnter(() => {
        recordInitialPosition()
        console.log('Balloon floater started')
      })
      .onTick(() => {
        applyFloatingMotion()
      })
  },
  add: (world, component) => {
    // Initialize data when component is added
    component.data.hasRecordedInitialPosition = false
    component.data.elapsedTime = 0
  },
})

export {BalloonFloater}