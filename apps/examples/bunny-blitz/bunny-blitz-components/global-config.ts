import * as ecs from '@8thwall/ecs'

const GlobalConfig = ecs.registerComponent({
  name: 'GlobalConfig',
  schema: {
    radius: ecs.f32,
  },  // No data needed, just behavior
  add: (world, component) => {
    console.log(`Global Config added with EID: ${component.eid}`)
  },
  remove: (world, component) => {
    console.log(`Global Config removed with EID: ${component.eid}`)
  },
})

const globalConfigQuery = ecs.defineQuery([GlobalConfig])

const getGlobalConfig = (world) => {
  console.log('Getting global config')
  const configs = globalConfigQuery(world)
  const globalConfig = GlobalConfig.get(world, configs[0])
  console.log(globalConfig)
  return globalConfig
}

export {GlobalConfig, getGlobalConfig}
