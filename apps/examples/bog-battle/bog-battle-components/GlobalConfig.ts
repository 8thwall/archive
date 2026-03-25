import * as ecs from '@8thwall/ecs'

const GlobalConfig = ecs.registerComponent({
  name: 'GlobalConfig',
  schema: {
    // @asset
    deleteImage: ecs.string,
    // @asset
    actionImage: ecs.string,
    // @asset
    cancelImage: ecs.string,
    xSize: ecs.i32,
    zSize: ecs.i32,
  },
  add: (world, component) => {

  },
})

const globalConfigQuery = ecs.defineQuery([GlobalConfig])

const getGlobalConfig = (world) => {
  // console.log("Getting global config")
  const configs = globalConfigQuery(world)
  const globalConfig = GlobalConfig.get(world, configs[0])
  // console.log(globalConfig)
  return globalConfig
}

export {GlobalConfig, getGlobalConfig}
