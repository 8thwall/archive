// @sublibrary(:dom-core-lib)
import type {Document} from './document'
import {HTMLVideoElement, createHTMLVideoElement} from './html-video-element'

// https://html.spec.whatwg.org/#htmlvideoelement

interface Video {
  prototype: typeof HTMLVideoElement
  new(): HTMLVideoElement
}

const createVideoConstructor = (doc: Document): Video => {
  const VideoConstructor: Video = function Video(url?: string) {
    const video = createHTMLVideoElement(doc)
    if (url) {
      video.src = url
      video.preload = 'auto'
    }
    return video
  } as any
  ;(VideoConstructor.prototype as any) = HTMLVideoElement.prototype
  return VideoConstructor
}

export {createVideoConstructor, Video}
