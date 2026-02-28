// @rule(js_binary)

// @attr(target = "node")
// @attr(esnext = 1)
// @attr(export_library = 1)
// @attr(mangle = 0)
// @package(npm-rendering)

// @attr(externals = "third_party/headless-gl/*")
// @attr(externalsType = "module")

export {EnvironmentSettings} from '../environment'
export {Encoding} from '../encoding'
export {
  ErrorEvent,
  MessageEvent,
} from '../dom-events'
export {ClassicScript, ModuleScript, ScriptFetchOptions} from '../script'
export {DOMException} from '../dom-exception'
export {OffscreenCanvas} from '../offscreen-canvas'
export {OffscreenCanvasRenderingContext2D} from '../offscreen-canvas-rendering-context-2d'
export {WebGLRenderingContext} from '../webgl-rendering-context'
export * from '../webgl-rendering-context-base'
export * from '../webgl-rendering-context-overloads'
export {WebGL2RenderingContext} from '../webgl2-rendering-context'
export * from '../webgl2-rendering-context-base'
export * from '../webgl2-rendering-context-overloads'
export {
  DedicatedWorkerGlobalScope,
  createWorkerGlobalContextOnTarget,
} from '../dedicated-worker-global-scope'
export type {Request, Response} from '../fetch-api'
export type {Transferable} from '../window-or-worker-global-scope'
export {WorkerGlobalScope} from '../worker-global-scope'
export {WorkerData} from '../worker'
