import * as ecs from '@8thwall/ecs'
import {AGENT_BEHAVIOR} from '../attract-repel-components/agent'
import {InfluencerSpawner} from './influencerSpawner'
import {BurstParticles} from '../helpers/particleSpawner'
import {Influencer} from '../attract-repel-components/influencer'
import {PlayAudio, ChangeAudio} from '../helpers/audioController'

const {Scale} = ecs
const {vec3} = ecs.math

const v = vec3.zero()

const influencerSpawnerQuery = ecs.defineQuery([InfluencerSpawner])
const influencerQuery = ecs.defineQuery([Influencer])

const bunnyEat = (world, eid, influencerId) => {
  PlayAudio(world, eid)
  world.events.dispatch(influencerId, 'reduceHealth', {})
}

const destroyBunny = (world, eid, destroyAudio) => {
  console.log(destroyAudio)
  ChangeAudio(world, eid, destroyAudio)
  PlayAudio(world, eid)
  console.log(`destroying bunny ${eid}`)
  Scale.set(world, eid, v.makeZero())
  world.time.setTimeout(() => {
    world.deleteEntity(eid)
  }, 500)
  world.time.setTimeout(() => {
    console.log('Dispatching spawnAgent event.')
    world.events.dispatch(world.events.globalId, 'spawnAgent', {})
  }, 1000)
}

const EventManager = ecs.registerComponent({
  name: 'eventManager',
  schema: {
    // @asset
    bunnyDestroyAudio: ecs.string,  // audio when bunny dies
    // @asset
    carrotParticleModel: ecs.string,  // audio when bunny dies
    // @asset
    bunnyParticleModel: ecs.string,  // audio when bunny dies
  },
  add: (world, component) => {
    console.log(`Event Manager added with EID: ${component.eid}`)
    // world.events.addListener(world.events.globalId, 'stateChanged', (e) => {
    //   console.log('Receieved', 'stateChanged', 'on', e.target, 'event:', e)
    // })

    world.events.addListener(world.events.globalId, 'agentInfluencerEvent', (e) => {
      const {behavior, influencer} = (e.data as any)
      if (behavior === AGENT_BEHAVIOR.SEEK) {
        bunnyEat(world, e.target, influencer)
        const carrotParticle = component.schema.carrotParticleModel
        BurstParticles(world, influencer, carrotParticle)
      }

      if (behavior === AGENT_BEHAVIOR.AVOID) {
        const destroyAudio = component.schema.bunnyDestroyAudio
        destroyBunny(world, e.target, destroyAudio)
        const bunnyParticle = component.schema.bunnyParticleModel
        BurstParticles(world, e.target, bunnyParticle)
      }
    })

    world.events.addListener(world.events.globalId, 'buttonTap', (e) => {
      const influencers = influencerQuery(world)
      influencers.forEach((influencer) => {
        world.deleteEntity(influencer)
      })

      const spawners = influencerSpawnerQuery(world)
      const spawner = InfluencerSpawner.cursor(world, spawners[0])

      spawner.attract = !spawner.attract

      world.events.dispatch(world.events.globalId, 'spawnInfluencer', {})
    })

    world.events.addListener(world.events.globalId, 'zeroHP', (e) => {
      world.events.dispatch(world.events.globalId, 'spawnInfluencer', {})
    })
  },
  remove: (world, component) => {
    console.log(`Event Manager removed with EID: ${component.eid}`)
  },
})

export {EventManager}
