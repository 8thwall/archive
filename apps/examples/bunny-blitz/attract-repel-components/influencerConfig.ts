import * as ecs from '@8thwall/ecs'

const InfluencerConfig = ecs.registerComponent({
  name: 'InfluencerConfig',
  schema: {
    alertRadius: ecs.f32,
    activeRadius: ecs.f32,
    eventRadius: ecs.f32,
    attract: ecs.boolean,
    displayRadii: ecs.boolean,
    // @asset
    alertRadiusImage: ecs.string,
    // @asset
    activeRadiusImage: ecs.string,
    // @asset
    eventRadiusImage: ecs.string,
    scale: ecs.f32,  // To adjust radius by influencer scale
  },
  schemaDefaults: {
    alertRadius: 10.0,
    activeRadius: 5.0,
    eventRadius: 2.0,
    attract: true,
    displayRadii: false,
  },
  data: {

  },
  add: (world, component) => {

  },
  tick: (world, component) => {

  },
  remove: (world, component) => {
    console.log(`Influencer removed with EID: ${component.eid}`)
  },
})

const influencerConfigQuery = ecs.defineQuery([InfluencerConfig])

const getInfluencerConfig = (world) => {
  console.log('Getting agent config')
  const configs = influencerConfigQuery(world)
  const influencerConfig = InfluencerConfig.get(world, configs[0])
  return influencerConfig
}

export {InfluencerConfig, getInfluencerConfig}
