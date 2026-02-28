// @sublibrary(:dom-core-lib)
type FrameRequestCallback = (time: number) => void

interface AnimationFrameProvider {
  requestAnimationFrame(callback: FrameRequestCallback): number
  cancelAnimationFrame(handle: number): void
}

const global = globalThis as any
const contextMethods: AnimationFrameProvider = {
  requestAnimationFrame: global.requestAnimationFrame || (() => {
    throw new Error('requestAnimationFrame is not implemented')
  }) as (callback: FrameRequestCallback) => number,
  cancelAnimationFrame: global.cancelAnimationFrame || (() => {
    throw new Error('cancelAnimationFrame is not implemented')
  }) as (handle: number) => void,
}

const mixinAnimationFrameProvider = <T extends AnimationFrameProvider>(proto: T) => {
  proto.requestAnimationFrame = contextMethods.requestAnimationFrame
  proto.cancelAnimationFrame = contextMethods.cancelAnimationFrame
}

export {FrameRequestCallback, AnimationFrameProvider, mixinAnimationFrameProvider}
