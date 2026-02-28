// @sublibrary(:dom-core-lib)
import type {Document} from './document'
import {HTMLAudioElement, createHTMLAudioElement} from './html-audio-element'

interface Audio {
  prototype: typeof HTMLAudioElement
  new(): HTMLAudioElement
}

const createAudioConstructor = (doc: Document): Audio => {
  const AudioConstructor: Audio = function Audio(url?: string) {
    const audio = createHTMLAudioElement(doc)
    if (url) {
      audio.src = url
      audio.preload = 'auto'
    }
    return audio
  } as any
  ;(AudioConstructor.prototype as any) = HTMLAudioElement.prototype
  return AudioConstructor
}

export {createAudioConstructor, Audio}
