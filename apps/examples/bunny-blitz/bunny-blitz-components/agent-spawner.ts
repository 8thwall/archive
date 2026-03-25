import * as ecs from '@8thwall/ecs'
import {randomPointInRadius} from '../helpers/radius'
import {Agent} from '../attract-repel-components/agent'
import {getAgentConfig} from '../attract-repel-components/agentConfig'
import {getGlobalConfig} from './global-config'

const {Audio, GltfModel, LookAtAnimation, Material, Position, Scale, Shadow} = ecs
const {mat4, vec3} = ecs.math

const v = vec3.zero()

const AgentSpawner = ecs.registerComponent({
  name: 'agentSpawner',
  schema: {
    // @asset
    baseModel: ecs.string,  // GLTF model to spawn
    // @asset
    biteAudio: ecs.string,  // Audio File for Bite
    // @asset
    biteVolume: ecs.f32,      // Volume for Bite Audio
    parent: ecs.eid,          // Parent container in which to spawn agents
    numberOfAgents: ecs.ui8,  // Number of initial agents to spawn
    radius: ecs.f32,
    scale: ecs.f32,
  },
  schemaDefaults: {
    numberOfAgents: 20,
    radius: 20,
    scale: 1,
  },
  add: (world, component) => {
    console.log(`Agent Spawner added with EID: ${component.eid}`)

    const getAgentComponentValues = () => {
      try {
        console.log('Getting values from agent config')
        const agentConfig = getAgentConfig(world)
        return agentConfig
      } catch (e) {
        console.log(e)
        console.log('No agent config, returning empty object')
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

    // Function to spawn a single agent
    const spawnAgent = () => {
      const tempMatrix = mat4.i()
      const radius = getSpawnRadius()
      const {x, z} = randomPointInRadius(radius)
      const agentEid = world.createEntity()
      world.setParent(agentEid, component.schema.parent)
      console.log(`Agent ID: ${agentEid}, x: ${x}, z:${z}`)

      // Attaching the GLTF model
      const modelUrl = component.schema.baseModel
      console.log(modelUrl)
      GltfModel.set(world, agentEid, {
        url: modelUrl,
      })
      // Attaching the bite Audio file
      const audioURL = component.schema.biteAudio
      Audio.set(world, agentEid, {
        url: audioURL,
        volume: component.schema.biteVolume,
        loop: false,
        pitch: 1.0,
        paused: true,
      })

      // ecs.BoxGeometry.set(world, agentEid, {width: 1, height: 1, depth: 1})
      Material.set(world, agentEid, {r: 255, g: 0, b: 100})
      world.getWorldTransform(component.schema.parent, tempMatrix)
      world.setTransform(agentEid, tempMatrix)
      Scale.set(world, agentEid, v.makeOne().setScale(component.schema.scale))
      Position.set(world, agentEid, v.setXyz(x, 0, z))
      Shadow.set(world, agentEid, {castShadow: true, receiveShadow: false})

      const agentComponentData = getAgentComponentValues()

      Agent.set(world, agentEid, {...agentComponentData})

      LookAtAnimation.set(world, component.eid, {})
    }

    // Spawn the initial set of agents
    for (let i = 0; i < component.schema.numberOfAgents; i++) {
      spawnAgent()
    }

    // Listen to global spawnAgent events to spawn more agents
    world.events.addListener(world.events.globalId, 'spawnAgent', spawnAgent)
  },
  remove: (world, component) => {
    console.log(`Agent Spawner removed with EID: ${component.eid}`)
    // Cleanup actions if necessary
  },
})

export {AgentSpawner}
