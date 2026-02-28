import ecs from '@ecs/runtime'

ecs.registerComponent({
  name: 'debug-audio-pause-toggle',
  schema: {period: ecs.f32},
  data: {counter: ecs.i32},
  add: (world, component) => {
    component.data.counter = 0
  },
  tick: (world, component) => {
    component.data.counter = (component.data.counter + 1) % 200
    if (component.data.counter === 0 && ecs.Audio.has(world, component.eid)) {
      const audio = ecs.Audio.cursor(world, component.eid)
      audio.paused = !audio.paused
    }
  },
})
