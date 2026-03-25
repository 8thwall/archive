import * as ecs from '@8thwall/ecs'
import {randomPointInRadius} from '../helpers/radius'
import {Influencer} from '../attract-repel-components/influencer'
import {Health} from './health'
import {getInfluencerConfig} from '../attract-repel-components/influencerConfig'
import {getGlobalConfig} from './global-config'
import {HoldDrag} from './hold-drag'

const {Audio, GltfModel, Position, Scale, Shadow} = ecs
const {mat4, vec3} = ecs.math

const v = vec3.zero()

const InfluencerSpawner = ecs.registerComponent({
  name: 'InfluencerSpawner',
  schema: {
    // @asset
    audioVolume: ecs.f32,
    // @asset
    attractModel: ecs.string,  // GLTF model to spawn
    // @asset
    attractAudio: ecs.string,  // audio at attract spawn
    attractScale: ecs.f32,
    // @asset
    repelModel: ecs.string,
    // @asset
    repelAudio: ecs.string,  // audio at repel
    repelScale: ecs.f32,
    parent: ecs.eid,  // Parent container in which to spawn agents
    radius: ecs.f32,
    health: ecs.i32,  // Health for the influencer (for the carrot)
    attract: ecs.boolean,
    attractIdleAnimation: ecs.string,
    attractMoveAnimation: ecs.string,
    attractEventAnimation: ecs.string,
    repelIdleAnimation: ecs.string,
    repelMoveAnimation: ecs.string,
    repelEventAnimation: ecs.string,
  },
  schemaDefaults: {
    radius: 15,
  },
  add: (world, component) => {
    console.log(`Influencer Spawner added with EID: ${component.eid}`)

    const getInfluencerComponentValues = () => {
      try {
        console.log('Getting values from influencer config')
        const influencerConfig = getInfluencerConfig(world)
        return influencerConfig
      } catch (e) {
        console.log(e)
        console.log('No influencer config, returning empty object')
        return {}
      }
    }

    const getSpawnRadius = () => {
      try {
        console.log('Getting values from global config')
        const globalConfig = getGlobalConfig(world)
        return globalConfig.radius
      } catch (e) {
        console.log(e)
        console.log('No global config, using component values')
        return component.schema.radius
      }
    }

    // Function to spawn a single influencer
    const spawnInfluencer = () => {
      const tempMatrix = mat4.i()
      const radius = getSpawnRadius()
      const {x, z} = randomPointInRadius(radius / 2)

      const influencerEid = world.createEntity()
      world.setParent(influencerEid, component.schema.parent)
      console.log(`Influencer EID: ${influencerEid}, x: ${x}, z:${z}`)

      // Attaching the GLTF model
      const modelUrl = component.schema.attract ? component.schema.attractModel : component.schema.repelModel
      const audioUrl = component.schema.attract ? component.schema.attractAudio : component.schema.repelAudio
      const animations = component.schema.attract ? {
        moveAnimation: component.schema.attractMoveAnimation,
        idleAnimation: component.schema.attractIdleAnimation,
        eventAnimation: component.schema.attractEventAnimation,
      } : {
        moveAnimation: component.schema.repelMoveAnimation,
        idleAnimation: component.schema.repelIdleAnimation,
        eventAnimation: component.schema.repelEventAnimation,
      }
      const scale = component.schema.attract ? component.schema.attractScale : component.schema.repelScale
      console.log(modelUrl)
      GltfModel.set(world, influencerEid, {
        url: modelUrl,
      })
      if (component.schema.attract) {
        Audio.set(world, influencerEid, {
          url: audioUrl,
          volume: component.schema.audioVolume,
          loop: false,
          pitch: 1.0,
          paused: false,
        })
      }

      // BoxGeometry.set(world, agentEid, {width: 1, height: 1, depth: 1})
      // Material.set(world, influencerEid, {r: 255, g: 0, b: 100})
      world.getWorldTransform(component.schema.parent, tempMatrix)
      world.setTransform(influencerEid, tempMatrix)
      Scale.set(world, influencerEid, v.makeOne().setScale(scale))
      Position.set(world, influencerEid, v.setXyz(x, 0.5, z))
      Shadow.set(world, influencerEid, {castShadow: true, receiveShadow: false})

      const influencerComponentData = getInfluencerComponentValues()

      Influencer.set(world, influencerEid, {
        ...influencerComponentData,
        ...animations,
        attract: component.schema.attract,
        scale,
      })
      if (component.schema.attract) {
        Health.set(world, influencerEid, {health: component.schema.health})
      }
      HoldDrag.set(world, influencerEid, {factor: 50, lag: 0.7, distanceThreshold: 0.05})
    }

    spawnInfluencer()

    // Listen to global spawnInfluencer events to spawn more agents
    world.events.addListener(world.events.globalId, 'spawnInfluencer', spawnInfluencer)
  },
  remove: (world, component) => {
    console.log(`Influencer Spawner removed with EID: ${component.eid}`)
    // Cleanup actions if necessary
  },
})

export {InfluencerSpawner}
