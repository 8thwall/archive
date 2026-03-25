import * as ecs from '@8thwall/ecs'

const AgentConfig = ecs.registerComponent({
  name: 'AgentConfig',
  schema: {
    speed: ecs.f32,
    rotationOffset: ecs.f32,
    yOffset: ecs.f32,
    idleUpdateInterval: ecs.f32,
    eventUpdateInterval: ecs.f32,
    animated: ecs.boolean,
    // @condition animated=true
    idleAnimation: ecs.string,
    // @condition animated=true
    idleMovementAnimation: ecs.string,
    // @condition animated=true
    alertAnimation: ecs.string,
    // @condition animated=true
    activeAnimation: ecs.string,
    // @condition animated=true
    eventAnimation: ecs.string,
  },
  schemaDefaults: {
    speed: 0.1,
    rotationOffset: 0,
    idleUpdateInterval: 2000,
    eventUpdateInterval: 1000,
    yOffset: 0,
  },
  data: {
  },
  add: (world, component) => {
  },
  tick: (world, component) => {
  },
  remove: (world, component) => {
    console.log(`AgentConfig removed with EID: ${component.eid}`)
  },
})

const agentConfigQuery = ecs.defineQuery([AgentConfig])

const getAgentConfig = (world) => {
  console.log('Getting agent config')
  const configs = agentConfigQuery(world)
  const agentConfig = AgentConfig.get(world, configs[0])
  return agentConfig
}

export {AgentConfig, getAgentConfig}
