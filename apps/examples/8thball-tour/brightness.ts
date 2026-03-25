import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Custom Reflection Sky',
  schema: {
  },
  schemaDefaults: {
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {THREE} = window as any
    const textureLoader = new THREE.TextureLoader()

    ecs.defineState('off')
      .initial()
      .onEnter(() => {
        console.log('Viewing: Default')
        world.three.scene.background = null
        world.three.scene.environment = null
        world.three.scene.background = new THREE.Color(0x87ceeb)

        ecs.assets.load({url: 'assets/skybox.jpg'})
          .then((r) => {
            textureLoader.load(`${r.remoteUrl}`, (tex: any) => {
              tex.mapping = THREE.EquirectangularReflectionMapping
              tex.encoding = THREE.sRGBEncoding
              world.three.scene.environment = tex
            })
          })
      })
  },
})
