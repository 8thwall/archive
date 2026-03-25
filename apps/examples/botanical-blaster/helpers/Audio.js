import * as ecs from '@8thwall/ecs'

export class AudioClip {
  constructor(world, entityId, length) {
    this.world = world
    this.entityId = entityId
    this.length = length
    this.clear = () => {}
    this.pool = []

    this.properties = JSON.parse(
      JSON.stringify(ecs.Audio.cursor(this.world, this.entityId))
    )
  }

  get() {
    const entity = this.pool.shift()
    if (!entity) return this.world.createEntity()
    return entity
  }

  play(parentEntity) {
    if (!parentEntity) parentEntity = this.entityId
    const audioClipId = this.get()
    this.world.setParent(audioClipId, parentEntity)

    if (!ecs.Audio.has(this.world, audioClipId)) {
      ecs.Audio.set(this.world, audioClipId, this.properties)
    }

    const audio = ecs.Audio.cursor(this.world, audioClipId)
    audio.paused = false

    setTimeout(() => {
      const audio = ecs.Audio.cursor(this.world, audioClipId)
      audio.paused = true
      this.pool.push(audioClipId)
    }, this.length * 2)
  }

  stop() {
    this.clear()
  }
}
