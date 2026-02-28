import ecs from '@ecs/runtime'

ecs.registerComponent({
  name: 'debug-audio-src-toggle',
  schema: {period: ecs.f32},
  data: {counter: ecs.i32},
  add: (world, component) => {
    component.data.counter = 0
  },
  tick: (world, component) => {
    component.data.counter = (component.data.counter + 1) % 1200
    if (component.data.counter === 0) {
      ecs.Audio.set(world, component.eid, {
        url: 'https://static.8thwall.app/download/assets/FastWoosh-hdwbtau9s9.m4a',
        loop: true,
      })
      ecs.Audio.remove(world, component.eid)
    } else if (component.data.counter === 300) {
      ecs.Audio.set(world, component.eid, {
        url: 'https://static.8thwall.app/download/assets/FastWoosh-hdwbtau9s9.m4a',
        loop: true,
      })
      ecs.Audio.set(world, component.eid, {
        url: 'https://static.8thwall.app/download/assets/mp3-kg6dc6o2ia.mp3',
        loop: true,
      })
    } else if (component.data.counter === 600) {
      ecs.Audio.set(world, component.eid, {
        url: 'https://static.8thwall.app/download/assets/FastWoosh-hdwbtau9s9.m4a',
        loop: true,
      })
    } else if (component.data.counter === 900) {
      ecs.Audio.remove(world, component.eid)
      ecs.Audio.set(world, component.eid, {
        url: 'https://static.8thwall.app/download/assets/mp3-kg6dc6o2ia.mp3',
        loop: true,
      })
      ecs.Audio.set(world, component.eid, {
        url: 'https://static.8thwall.app/download/assets/Critter-v97lj7i25i.m4a',
        loop: true,
      })
    }
  },
})
