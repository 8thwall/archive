// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

const SCALE = 3.0

const things: ecs.Eid[] = []

const spawner = ecs.registerComponent({
  name: 'spawner',
  schema: {
    // Add data that can be configured on the component.
    // @asset
    baseModel: ecs.string,  // GLTF model to spawn
    numberOfAgents: ecs.f32,  // Number of initial agents to spawn
    numberOfRows: ecs.f32,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
    numberOfAgents: 1600,
    numberOfRows: 40,
  },
  add: (world, component) => {
    // Function to spawn a single agent

    const {numberOfAgents, numberOfRows} = component.schema

    const getNextPos = (i) => {
      const x = Math.floor(i / numberOfRows) * SCALE
      const z = (i % numberOfRows) * SCALE
      return {x, z}
    }

    function spawnAgent(i) {
      const {x, z} = getNextPos(i)
      const agentEid = world.createEntity()
      things.push(agentEid)

      // // Attaching the GLTF model
      // const modelUrl = component.schema.baseModel
      // ecs.GltfModel.set(world, agentEid, {
      //   url: modelUrl,
      //   animationClip: 'CharacterArmature|Walk',
      //   loop: true,
      //   paused: false,
      // })
      ecs.BoxGeometry.set(world, agentEid, {
        width: 1,
        height: 1,
        depth: 1,
      })

      // ecs.BoxGeometry.set(world, agentEid, {width: 1, height: 1, depth: 1})
      ecs.Material.set(world, agentEid, {r: 255, g: 0, b: 100})
      world.setPosition(agentEid, x, 0, z)
      ecs.Shadow.set(world, agentEid, {castShadow: true, receiveShadow: false})
    }

    // Spawn the initial set of agents
    for (let i = 0; i < numberOfAgents; i++) {
      spawnAgent(i)
    }
  },
  tick: (world, component) => {
    const {quat} = ecs.math
    const {elapsed} = world.time
    for (const eid of things) {
      world.setQuaternion(eid, 0, 0, 0, 1)
    }
  },
})
