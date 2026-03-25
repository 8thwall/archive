import {AudioClip} from '../../helpers/Audio'
import * as ecs from '@8thwall/ecs'
import {AudioClipComponent} from './audio-clip'

class AudioBankManagerClass {
  constructor() {
    /**
     * @type {Map<string,AudioBank>}
     */
    this.banks = new Map()
  }

  /**
   * @param {AudioBank} bank
   */
  registerAudioBank(bank) {
    this.banks.set(bank.name, bank)
  }

  /**
   * @param {string}  id
   * @returns {AudioBank}
   */
  getAudioBank(id) {
    const bank = this.banks.get(id)
    if (!bank) {
      throw new Error(`Bank with id ${id} does not exists`)
    }
    return bank
  }
}

class AudioBank {
  constructor(name) {
    this.name = name

    /**
     * @type {Map<string,AudioClip>}
     */
    this.clips = new Map()
  }

  /**
   * @param {string} id
   * @param {AudioClip} clip
   */
  registerClip(id, clip) {
    this.clips.set(id, clip)
  }

  /**
   * @param {string}  id
   * @returns {AudioClip}
   */
  getClip(id) {
    const clip = this.clips.get(id)
    if (!clip) {
      throw new Error(`Clip with id ${id} does not exists`)
    }
    return clip
  }
}

export const AudioBankManager = new AudioBankManagerClass()

const AudioBankComponent = ecs.registerComponent({
  name: 'AudioBank',
  schema: {
    name: ecs.string,
  },
  schemaDefaults: {
    name: '',
  },
  add: (world, component) => {
    const {name} = component.schema
    const bank = new AudioBank(name)
    AudioBankManager.registerAudioBank(bank)

    const traverse = (parent, run) => {
      for (const child of world.getChildren(parent)) {
        run(child)
        traverse(child, run)
      }
    }

    traverse(component.eid, (eid) => {
      if (
        AudioClipComponent.has(world, eid) &&
        ecs.Audio.has(world, eid)
      ) {
        const {name, length} = AudioClipComponent.get(world, eid)
        bank.registerClip(name, new AudioClip(world, eid, length))
        console.log(bank.getClip(name))
      }
    })
  },
  remove: (world, component) => {},
})

export {AudioBankComponent}
