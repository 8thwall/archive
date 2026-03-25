// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {Hittable} from './hittable'
import {Hit} from './hit'
import {resolveHit} from './attack-resolution'

const HitboxController = ecs.registerComponent({
  name: 'hitbox-controller',
  schema: {
    // Add data that can be configured on the component.
    attack: ecs.string,

    // Owner of the hitbox.
    owner: ecs.eid,

    // Hack to work around Studio bug untethering children.
    startX: ecs.f32,
    startY: ecs.f32,
    startZ: ecs.f32,
    inactiveY: ecs.f32,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
    attack: 'DefaultAttack',
  },
  data: {
    // Each time the hitbox becomes active, it gets a different activeHitId. The goal is to ensure
    // that a hitTarget can only be hit once per hitbox attack, even if the hitbox is active for
    // multiple frames.  Although the physics system reports on collision start and end, you could
    // imagine bounce situations or multiple collisions can occur based on collider shapes.
    activeHitId: ecs.i32,
  },
  stateMachine: ({world, eid, dataAttribute, schemaAttribute}) => {
    const inactive = ecs.defineState('inactive').initial()

    const active = ecs.defineState('active')

    inactive.onEvent('activate', 'active')
    active.onEvent('deactivate', 'inactive')

    const alreadyHit: Set<ecs.Eid> = new Set()

    // Map of all hits by active Id.
    const hits: Map<number, Hit[]> = new Map()

    const both = ecs.defineStateGroup([inactive, active])

    // Hack to work around Studio bug untethering children. We would prefer to disable/enable the
    // collider, but that will make change the physics order and break static colliders that are
    // children.
    inactive.onTick(() => {
      // Move the collider to an inactiveY position as a workaround.
      const schema = schemaAttribute.get(eid)
      ecs.Position.set(world, eid, {x: schema.startX, y: schema.inactiveY, z: schema.startZ})
    })

    active.onEnter(() => {
      const data = dataAttribute.cursor(eid)
      data.activeHitId += 1
    }).onExit(() => {
      alreadyHit.clear()
    })

    active.listen(eid, ecs.physics.COLLISION_START_EVENT, (ev) => {
      const {target, currentTarget} = ev
      const schema = schemaAttribute.get(eid)

      if (target !== currentTarget || eid !== target) {
        // Only consider hits on the current hitbox, not its children.
        return
      }

      const eventData = ev.data as { other: ecs.Eid }
      const {other: hitTarget} = eventData

      if (!Hittable.has(world, hitTarget)) {
        // Only consider hits on entities with the Hittable component.
        return
      }

      // Get the actual target we are hitting, in the case of a shield, for example
      // this might be the entity parent of the shield entity.
      const otherTarget = Hittable.get(world, hitTarget).target || hitTarget

      if (schema.owner === otherTarget) {
        // Ignore self-collisions.
        return
      }

      // Record the hits for deferred resolution. This is because we might hit multiple parts of the
      // same target, (e.g. body and shield) on the same frame in undetermined order.
      const data = dataAttribute.get(target)
      if (!hits.has(data.activeHitId)) {
        hits.set(data.activeHitId, [{
          attack: schema.attack,
          target: otherTarget,
          hitTarget,
        }])
      } else {
        hits.get(data.activeHitId).push({
          attack: schema.attack,
          target: otherTarget,
          hitTarget,
        })
      }
    })

    active.onTick(() => {
      // Move the collider back into position as a workaround.
      const schema = schemaAttribute.get(eid)
      ecs.Position.set(world, eid, {x: schema.startX, y: schema.startY, z: schema.startZ})

      // Resolve each activeHitId independently, if resolution is split across multiple attacks from
      // the same hitbox (unlikely, but defensive).
      hits.forEach((hitList) => {
        // Resolve all of the hits in one activeHitId.
        // Map of target -> Hit, for the best hit found this activeHit.
        const bestHit: Map<ecs.Eid, Hit> = new Map()
        hitList.forEach((hit) => {
          // Previous hit if any.
          const previousHit = bestHit.get(hit.target) ?? null
          if (previousHit) {
            // If the most recent hit has higher priority, replace the previous lower priority hit.
            const currentHitPriorty = Hittable.get(world, hit.hitTarget).priority
            const previousHitPriority = Hittable.get(world, previousHit.hitTarget).priority
            if (currentHitPriorty < previousHitPriority) {
              bestHit.set(hit.target, hit)
            }
          } else {
            bestHit.set(hit.target, hit)
          }
        })
        // Now resolve the damage/result for each best hit if it wasn't hit already.
        bestHit.forEach((hit) => {
          if (!alreadyHit.has(hit.target)) {
            resolveHit(world, {
              hitbox: eid,
              hitboxOwner: schema.owner,
              hit,
            })
            alreadyHit.add(hit.target)
          }
        })
      })
      hits.clear()
    })
  },
})

export {HitboxController}
