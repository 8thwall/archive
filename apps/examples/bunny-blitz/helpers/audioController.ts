import * as ecs from '@8thwall/ecs'

const PlayAudio = (world, componentEID) => {
  if (ecs.Audio.has(world, componentEID)) {
    const audio = ecs.Audio.cursor(world, componentEID)
    audio.paused = false
  }
}
const PauseAudio = (world, componentEID) => {
  if (ecs.Audio.has(world, componentEID)) {
    const audio = ecs.Audio.cursor(world, componentEID)
    audio.paused = true
  }
}
const ChangeAudio = (world, componentEID, newAudio) => {
  if (ecs.Audio.has(world, componentEID)) {
    const audio = ecs.Audio.cursor(world, componentEID)
    audio.url = newAudio
  }
}
export {PauseAudio, PlayAudio, ChangeAudio}
