import * as ecs from '@8thwall/ecs'

const {THREE} = (window as any)

const Environment = ecs.registerComponent({
  name: 'Environment',
  schema: {
    // @asset
    skyBoxPositiveXTexture: ecs.string,
    // @asset
    skyBoxNegativeXTexture: ecs.string,
    // @asset
    skyBoxPositiveYTexture: ecs.string,
    // @asset
    skyBoxNegativeYTexture: ecs.string,
    // @asset
    skyBoxPositiveZTexture: ecs.string,
    // @asset
    skyBoxNegativeZTexture: ecs.string,

    enableShadows: ecs.boolean,
    enableACES: ecs.boolean,

    enableFog: ecs.boolean,
    // @condition enableFog=true
    fogExponent: ecs.f32,

    // @group start fog:color
    // @group condition enableFog=true
    fogColorRed: ecs.f32,
    fogColorGreen: ecs.f32,
    fogColorBlue: ecs.f32,
    // @group end
  },
  schemaDefaults: {
    enableShadows: true,
    enableACES: true,
    enableFog: true,
    fogExponent: 0.025,
    fogColorRed: 0,
    fogColorGreen: 0,
    fogColorBlue: 0,
  },
  add: (world, component) => {
    const {enableShadows, enableACES, enableFog} = component.schema

    if (enableACES) {
      world.three.renderer.toneMaping = THREE.ACESFilmicToneMapping
    }

    if (enableShadows) {
      world.three.renderer.shadowMap.enabled = true
      world.three.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }

    if (enableFog) {
      const {fogColorRed, fogColorGreen, fogColorBlue, fogExponent} =
        component.schema
      world.scene.fog = new THREE.FogExp2(
        new THREE.Color(fogColorRed, fogColorGreen, fogColorBlue).getHex(),
        fogExponent
      )
    }

    const loader = new THREE.CubeTextureLoader()
    loader.setPath('')  // Set the path to your images
    // Load the cube texture
    loader.load(
      [
        component.schema.skyBoxPositiveXTexture,
        component.schema.skyBoxNegativeXTexture,
        component.schema.skyBoxPositiveYTexture,
        component.schema.skyBoxNegativeYTexture,
        component.schema.skyBoxPositiveZTexture,
        component.schema.skyBoxNegativeZTexture,
      ],
      (textureCube) => {
        world.scene.background = textureCube
      }
    )
  },
  remove: (world, component) => {
    world.scene.background = null
    world.scene.environment = null
  },
})

export {Environment}
