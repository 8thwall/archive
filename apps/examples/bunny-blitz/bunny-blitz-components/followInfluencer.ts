// @ts-ignore
import * as ecs from '@8thwall/ecs'
import {Influencer} from '../attract-repel-components/influencer'

const influencerQuery = ecs.defineQuery([Influencer])

const {Position} = ecs
const {vec3} = ecs.math

const targetPosition = vec3.zero()
const position = vec3.zero()
const v = vec3.zero()

const FollowInfluencer = ecs.registerComponent({
  name: 'FollowInfluencer',
  schema: {
    lerpAmount: ecs.f32,
  },
  schemaDefaults: {
    lerpAmount: 1,
  },
  add: (world, component) => {
    // Initialize or prepare any necessary data when the component is added to an entity
  },
  tick: (world, component) => {
    let influencers = []
    try {
      influencers = influencerQuery(world)
    } catch (e) {
      // Handle error during query
      console.log(e)
    }

    if (influencers.length === 0) {
      console.log('no influencers')
      return
    }

    // Retrieve positions
    targetPosition.setFrom(Position.get(world, influencers[0]))
    position.setFrom(Position.get(world, component.eid))

    // Lerp towards the target influencer's position in the x/z plane.
    v.setFrom(targetPosition).setMinus(position).setScale(component.schema.lerpAmount)
    position.setPlus(v.setXyz(v.x, 0, v.z))

    // Apply the updated position
    Position.set(world, component.eid, position)
  },
  remove: (world, component) => {
    // Clean up any data when the component is removed from an entity
  },
})

export {FollowInfluencer}
