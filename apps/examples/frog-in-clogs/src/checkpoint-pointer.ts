import * as ecs from '@8thwall/ecs'
import {checkpointManager} from './checkpoint-manager'

// Pure Y-axis rotation quaternion
function quatFromYRotation(angleRad: number) {
  const half = angleRad / 2
  return [0, Math.sin(half), 0, Math.cos(half)]
}

const checkpointPointer = ecs.registerComponent({
  name: 'Checkpoint Pointer',
  schema: {
    checkpointManagerEntity: ecs.eid,  // Reference to the checkpoint manager entity
    smoothing: ecs.f32,  // Rotation smoothing factor (0-1, higher = smoother/slower)
  },
  schemaDefaults: {
    smoothing: 0.1,  // Default smooth rotation
  },
  data: {
    targetCheckpointEid: ecs.eid,  // Current target checkpoint entity
    targetYaw: ecs.f32,  // Target Y rotation in radians
    currentYaw: ecs.f32,  // Current Y rotation in radians
    hasTarget: ecs.boolean,  // Whether we have a valid target
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    // Helper to get checkpoint entity by index from checkpoint manager
    const getCheckpointEntity = (managerEid: ecs.Eid, index: number): ecs.Eid | null => {
      const managerSchema = checkpointManager.get(world, managerEid)
      if (!managerSchema) return null
      
      switch (index) {
        case 0: return managerSchema.checkpoint1 || null
        case 1: return managerSchema.checkpoint2 || null
        case 2: return managerSchema.checkpoint3 || null
        case 3: return managerSchema.checkpoint4 || null
        case 4: return managerSchema.checkpoint5 || null
        case 5: return managerSchema.checkpoint6 || null
        case 6: return managerSchema.checkpoint7 || null
        case 7: return managerSchema.checkpoint8 || null
        default: return null
      }
    }

    // Helper to calculate angle to target
    const calculateYawToTarget = (fromX: number, fromZ: number, toX: number, toZ: number): number => {
      const dx = toX - fromX
      const dz = toZ - fromZ
      return Math.atan2(dx, dz)  // Y-axis rotation angle
    }

    // Helper to smoothly interpolate between angles
    const lerpAngle = (from: number, to: number, t: number): number => {
      // Handle angle wrapping
      let diff = to - from
      while (diff > Math.PI) diff -= 2 * Math.PI
      while (diff < -Math.PI) diff += 2 * Math.PI
      return from + diff * t
    }

    ecs.defineState('initialize').initial()
      .onEnter(() => {
        const schema = schemaAttribute.get(eid)
        
        if (!schema.checkpointManagerEntity) {
          console.error('[checkpoint-pointer] No checkpoint manager entity configured!')
          return
        }

        // Initialize data
        const quaternion = ecs.Quaternion.get(world, eid)
        const initialYaw = quaternion ? Math.atan2(2 * (quaternion.w * quaternion.y + quaternion.x * quaternion.z), 1 - 2 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z)) : 0
        
        dataAttribute.set(eid, {
          targetCheckpointEid: BigInt(0),
          targetYaw: initialYaw,
          currentYaw: initialYaw,
          hasTarget: false,
        })

        console.log('[checkpoint-pointer] Initialized')

        // Listen for checkpoint-advanced events
        world.events.addListener(world.events.globalId, 'checkpoint-advanced', (event: any) => {
          const data = dataAttribute.cursor(eid)
          const checkpointData = event.data
          
          if (!checkpointData) return

          const checkpointIndex = checkpointData.checkpointIndex
          const checkpointEntity = getCheckpointEntity(schema.checkpointManagerEntity, checkpointIndex)
          
          if (checkpointEntity) {
            data.targetCheckpointEid = checkpointEntity
            data.hasTarget = true
            console.log(`[checkpoint-pointer] Now pointing to checkpoint ${checkpointIndex} (entity: ${checkpointEntity})`)
          } else {
            console.warn(`[checkpoint-pointer] Could not find checkpoint entity for index ${checkpointIndex}`)
            data.hasTarget = false
          }
        })

        // Get initial checkpoint (checkpoint 0)
        const initialCheckpoint = getCheckpointEntity(schema.checkpointManagerEntity, 0)
        if (initialCheckpoint) {
          const data = dataAttribute.cursor(eid)
          data.targetCheckpointEid = initialCheckpoint
          data.hasTarget = true
          console.log(`[checkpoint-pointer] Initial target set to checkpoint 0 (entity: ${initialCheckpoint})`)
        }
      })
      .onTick(() => {
        const data = dataAttribute.cursor(eid)
        const schema = schemaAttribute.get(eid)
        
        if (!data.hasTarget) return

        // Get pointer's current position
        const pointerPos = ecs.Position.get(world, eid)
        if (!pointerPos) return

        // Get target checkpoint position
        const targetPos = ecs.Position.get(world, data.targetCheckpointEid)
        if (!targetPos) return

        // Calculate target yaw angle
        data.targetYaw = calculateYawToTarget(pointerPos.x, pointerPos.z, targetPos.x, targetPos.z)

        // Smoothly interpolate current yaw toward target yaw
        data.currentYaw = lerpAngle(data.currentYaw, data.targetYaw, schema.smoothing)

        // Apply rotation using quaternion (only Y axis - swivel)
        const yawQuat = quatFromYRotation(data.currentYaw)
        world.setQuaternion(eid, yawQuat[0], yawQuat[1], yawQuat[2], yawQuat[3])
      })
  },
})

export {checkpointPointer}