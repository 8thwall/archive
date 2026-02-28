// @visibility(//visibility:public)
// @package(npm-rendering)
// @attr(target = "node")
// @attr(esnext = 1)
// @attr(target_compatible_with = ASAN_INCOMPATIBLE)

// @attr[](data = ":dom-core")
// @attr[](data = "//c8/dom/worker:worker-core")
// @attr[](data = "//c8/dom/worker:worker-runner")
// @attr[](data = "//c8/dom/worker:worker-fetch-execution")

// @dep(:dom-core-types)
// @dep(//third_party/headless-gl)
// @dep(@miniaudio-addon//:miniaudio)
// @dep(//bzl/js:fetch)
// @dep(//bzl/js:vm-modules)
// @dep(:xml-http-request)

/* eslint-disable max-classes-per-file */
import vm from 'vm'
import path from 'path'
import module from 'node:module'

/* eslint-disable import/no-unresolved */
// @ts-ignore
// @inliner-skip-next
import {WebGLRenderingContext} from 'third_party/headless-gl/src/javascript/webgl-rendering-context'
// @ts-ignore
// @inliner-skip-next
import {
  WebGL2RenderingContext,
} from 'third_party/headless-gl/src/javascript/webgl2-rendering-context'
// @ts-ignore
// @inliner-skip-next
import {createContext, createWebGL2Context} from 'third_party/headless-gl/index'
// @ts-ignore
// @inliner-skip-next
import {playAudio, stopAudio, pauseAudio, resumeAudio, updateGain, decodeAudio}
  from 'external/miniaudio-addon/miniaudio'
/* eslint-enable import/no-unresolved */

import {fetchHtmlDocument} from '@nia/c8/dom/html-fetch'

// @inliner-skip-next
import type {Window} from '@nia/c8/dom/dom-core'

import {createVMContext, fetchScriptData, ContextOptions} from '@nia/c8/dom/context-helpers'

// Symbol to store the current window object in the parent-context global object. Can be used by
// node bindings in C++ that are on the parent-context to access the child-context window object.
const niaCurrentWindowSym = Symbol.for('niaCurrentWindow')

interface WindowOptions extends ContextOptions {
  onContextCreated?: (context: vm.Context) => void
  onBeforeNavigate?: (window: Window) => void
  devicePixelRatio?: number
}

const initWindowContext = async (
  context: vm.Context,
  options: WindowOptions
): Promise<Window> => {
  const initModule = new vm.SourceTextModule(`
    import {createWindowOnTarget, Window, HTMLDocument} from 'dom-core'
    const document = new HTMLDocument()
    document.title = niaWindowOptions.title || 'Untitled'
    createWindowOnTarget(document, niaWindowOptions, niaLocationCallback, globalThis)
  `, {
    context,
    identifier: __filename,
    initializeImportMeta(meta, mod) {  // eslint-disable-line @typescript-eslint/no-unused-vars
      meta.url = `file://${__filename}`
    },
  })

  const runfilesDir: string = context.__niaRunfilesDir
  const domCoreScriptPath = () => path.join(runfilesDir, '_main/c8/dom/dom-core.js')
  const domCorePath = domCoreScriptPath()
  const script = await fetchScriptData(domCorePath)
  const domCoreModule = new vm.SourceTextModule(script, {
    context,
    identifier: domCorePath,
    initializeImportMeta(meta, mod) {  // eslint-disable-line @typescript-eslint/no-unused-vars
      meta.url = `file://${domCorePath}`
    },
  })
  const createRequireModule = new vm.SyntheticModule(
    ['createRequire'],
    function createRequireModule() {
      this.setExport('createRequire', module.createRequire)
    }, {context}
  )

  const webGlRenderingContextModule = new vm.SyntheticModule(
    ['WebGLRenderingContext'],
    function webGlRenderingContextModule() {
      this.setExport('WebGLRenderingContext', WebGLRenderingContext)
    }, {context}
  )

  const webGl2RenderingContextModule = new vm.SyntheticModule(
    ['WebGL2RenderingContext'],
    function webGl2RenderingContextModule() {
      this.setExport('WebGL2RenderingContext', WebGL2RenderingContext)
    }, {context}
  )

  const createContextModule = new vm.SyntheticModule(
    ['createContext', 'createWebGL2Context'], function createContextModule() {
      this.setExport('createContext', createContext)
      this.setExport('createWebGL2Context', createWebGL2Context)
    }, {context}
  )

  const miniaudioModule = new vm.SyntheticModule(
    ['playAudio', 'stopAudio', 'pauseAudio', 'resumeAudio', 'updateGain', 'decodeAudio'],
    function miniaudioModule() {
      this.setExport('playAudio', playAudio)
      this.setExport('stopAudio', stopAudio)
      this.setExport('pauseAudio', pauseAudio)
      this.setExport('resumeAudio', resumeAudio)
      this.setExport('updateGain', updateGain)
      this.setExport('decodeAudio', decodeAudio)
    }, {context}
  )

  const importLinker = async (
    specifier: string,
    referencingModule: vm.Module  // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<vm.Module> => {
    if (specifier === 'third_party/headless-gl/src/javascript/webgl-rendering-context') {
      return webGlRenderingContextModule
    }
    if (specifier === 'third_party/headless-gl/src/javascript/webgl2-rendering-context') {
      return webGl2RenderingContextModule
    }
    if (specifier === 'third_party/headless-gl/index') {
      return createContextModule
    }
    if (specifier === 'external/miniaudio-addon/miniaudio') {
      return miniaudioModule
    }
    if (specifier === 'dom-core') {
      return domCoreModule
    }
    if (specifier === 'module' || specifier === 'node:module') {
      return createRequireModule
    }
    throw new Error(`Cannot find module ${specifier}`)
  }
  await initModule.link(importLinker)
  await initModule.evaluate()

  const window = vm.runInContext('window', context)

  // Set the current window object on the global object for use in NIA node bindings.
  const global = globalThis as any
  global[niaCurrentWindowSym] = window

  // Set the realm's execution context to the context.
  window.document[window.__nia.environmentSettingsSym].realmExecutionContext = context

  options.onBeforeNavigate?.(window)

  if (options.url && options.url !== 'about:blank') {
    await fetchHtmlDocument(options.url, window, context.fetch)
  }

  return window
}
class Dom {
  _context: (Window & vm.Context) | null

  _options: WindowOptions

  _windowChangeCallback: ((window: Window) => void) | null

  getOptions(): WindowOptions {
    return this._options
  }

  getCurrentContext(): vm.Context {
    return this._context!
  }

  getCurrentWindow(): Window {
    return this._context!.window
  }

  getGlobalFetchWorker(): any {
    return this._context!.fetchWorker
  }

  onWindowChange(callback: (window: Window) => void): void {
    this._windowChangeCallback = callback
  }

  async navigate(url: string): Promise<void> {
    const locationCallback = async (href: string): Promise<void> => this.navigate(href)
    this._options.url = url
    this._options.context = {
      ...this._options.context,
      niaWindowOptions: this._options,
      niaLocationCallback: locationCallback,
    }
    this._context?.fetchWorker?.terminate()
    this._context = createVMContext<Window, WindowOptions>(this._options)
    if (this._options.onContextCreated) {
      this._options.onContextCreated(this._context)
    }
    await initWindowContext(this._context, this._options)
    if (this._options.naeBuildMode) {
      this._context.fetchWorker.postMessage({
        commitId: (globalThis as any).commitId,
      })
    }
    if (this._windowChangeCallback) {
      this._windowChangeCallback(this._context.window)
    }
  }

  async dispose(): Promise<void> {
    await this._context!.fetchWorker.terminate()
  }

  constructor(options: WindowOptions) {
    this._context = null
    this._options = options
  }
}

const createDom = async (options: WindowOptions): Promise<Dom> => {
  const dom = new Dom(options)
  await dom.navigate(options.url || 'about:blank')
  return dom
}

export {Dom, WindowOptions, createDom}

// @inliner-skip-next
export type {
  CanvasRenderingContext2D,
  Document,
  ErrorEvent,
  HTMLAnchorElement,
  HTMLAreaElement,
  HTMLAudioElement,
  HTMLBaseElement,
  HTMLBodyElement,
  HTMLBRElement,
  HTMLButtonElement,
  HTMLCanvasElement,
  HTMLDataElement,
  HTMLDataListElement,
  HTMLDetailsElement,
  HTMLDialogElement,
  HTMLDirectoryElement,
  HTMLDivElement,
  HTMLDListElement,
  HTMLEmbedElement,
  HTMLFieldSetElement,
  HTMLFontElement,
  HTMLFormElement,
  HTMLFrameElement,
  HTMLFrameSetElement,
  HTMLHeadElement,
  HTMLHRElement,
  HTMLHtmlElement,
  HTMLIFrameElement,
  HTMLImageElement,
  HTMLLabelElement,
  HTMLLegendElement,
  HTMLLIElement,
  HTMLLinkElement,
  HTMLMapElement,
  HTMLMarqueeElement,
  HTMLMenuElement,
  HTMLMetaElement,
  HTMLMeterElement,
  HTMLModElement,
  HTMLObjectElement,
  HTMLOListElement,
  HTMLOptGroupElement,
  HTMLOptionElement,
  HTMLOutputElement,
  HTMLParagraphElement,
  HTMLParamElement,
  HTMLPictureElement,
  HTMLPreElement,
  HTMLProgressElement,
  HTMLQuoteElement,
  HTMLScriptElement,
  HTMLSelectElement,
  HTMLSlotElement,
  HTMLSourceElement,
  HTMLSpanElement,
  HTMLStyleElement,
  HTMLTableCaptionElement,
  HTMLTableCellElement,
  HTMLTableColElement,
  HTMLTableElement,
  HTMLTableRowElement,
  HTMLTableSectionElement,
  HTMLTemplateElement,
  HTMLTextAreaElement,
  HTMLTimeElement,
  HTMLTitleElement,
  HTMLTrackElement,
  HTMLUListElement,
  HTMLUnknownElement,
  HTMLVideoElement,
  StorageEvent,
  NodeList,
  Window,
  Worker,
} from '@nia/c8/dom/dom-core'
