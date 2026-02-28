// @attr(target = "node")
// @attr(esnext = 1)
// @package(npm-rendering)

// @dep(//third_party/headless-gl)

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
/* eslint-enable import/no-unresolved */

import {createVMContext, fetchScriptData, ContextOptions} from '@nia/c8/dom/context-helpers'

// @dep(:worker-core-types)
// @inliner-skip-next
import type {
  EnvironmentSettings,
  WorkerGlobalScope,
} from '@nia/c8/dom/worker/worker-core'

interface WorkerContextOptions extends ContextOptions {
  name: string
  type: 'classic' | 'module'
}

const initWorkerContext = async (
  context: vm.Context,
  options: WorkerContextOptions
) => {
  const workerCoreModuleName = 'worker-core'

  const initModule = new vm.SourceTextModule(`
    import {
      createWorkerGlobalContextOnTarget,
      WorkerGlobalScope
    } from '${workerCoreModuleName}'
    
    import {createRequire} from 'module'

    const require = createRequire(import.meta.url)
    globalThis.require = require

    createWorkerGlobalContextOnTarget(globalThis)
  `, {
    context,
    identifier: __filename,
    initializeImportMeta(meta, mod) {  // eslint-disable-line @typescript-eslint/no-unused-vars
      meta.url = `file://${__filename}`
    },
  })
  const runfilesDir: string = context.__niaRunfilesDir
  const workerCoreScriptPath =
    () => path.join(runfilesDir, '_main/c8/dom/worker/worker-core.js')
  const workerCorePath = workerCoreScriptPath()
  const script = await fetchScriptData(workerCorePath)
  const workerCoreModule = new vm.SourceTextModule(script, {
    context,
    identifier: workerCorePath,
    initializeImportMeta(meta, mod) {  // eslint-disable-line @typescript-eslint/no-unused-vars
      meta.url = `file://${workerCorePath}`
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

  const importLinker = async (
    specifier: string,
    referencingModule: vm.Module  // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<vm.Module> => {
    if (specifier === 'module' || specifier === 'node:module') {
      return createRequireModule
    }
    if (specifier === workerCoreModuleName) {
      return workerCoreModule
    }
    if (specifier === 'third_party/headless-gl/src/javascript/webgl-rendering-context') {
      return webGlRenderingContextModule
    }
    if (specifier === 'third_party/headless-gl/src/javascript/webgl2-rendering-context') {
      return webGl2RenderingContextModule
    }
    if (specifier === 'third_party/headless-gl/index') {
      return createContextModule
    }
    throw new Error(`Cannot find module ${specifier}`)
  }
  await initModule.link(importLinker)
  await initModule.evaluate()

  const self = vm.runInContext('self', context)

  const environmentSettings: EnvironmentSettings = {
    id: (globalThis as any).crypto?.randomUUID() || '',
    creationUrl: new URL('about:blank'),
    topLevelCreationUrl: null,  // null for workers
    topLevelOrigin: null,
    targetBrowseContext: null,
    activeServiceWorker: null,
    executionReady: false,
    realmExecutionContext: context,
    globalObject: self,
    moduleMap: new Map(),
    apiBaseUrl: new URL('about:blank'),
    origin: {},
    corsIsolatedCapability: false,
    timeOrigin: performance.now(),
  }
  self.__nia.environmentSettings = environmentSettings
  self.__nia.name = options.name
  self.__nia.type = options.type
}

class WorkerContext {
  _context: (WorkerGlobalScope & vm.Context) | null

  _options: WorkerContextOptions

  constructor(options: WorkerContextOptions) {
    this._context = null
    this._options = options
  }

  async navigate(url: string): Promise<void> {
    this._options.url = url
    this._options.context = {
      ...this._options.context,
      __niaNodeExecPath: process.execPath,
    }

    // TODO(lreyna): Need better way to customize context from tests
    if (process.env.BAZEL_TEST) {
      this._options.context = {
        ...this._options.context,
        process,
      }
    }

    this._context = createVMContext<WorkerGlobalScope, WorkerContextOptions>(this._options)
    await initWorkerContext(this._context, this._options)
  }
}

const createWorkerContext = async (options: WorkerContextOptions): Promise<WorkerContext> => {
  const workerContext = new WorkerContext(options)
  await workerContext.navigate(options.url || 'about:blank')
  return workerContext
}

export {createWorkerContext}
