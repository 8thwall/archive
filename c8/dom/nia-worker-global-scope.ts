// @sublibrary(:dom-core-lib)
import threads from 'node:worker_threads'
import process from 'node:process'

import type {EnvironmentSettings} from './environment'
import type {ClassicScript, ModuleScript} from './script'

import {fetchClassicWorkerScript} from './fetch-classic-worker-script'
import {fetchClassicWorkerImportedScript} from './fetch-classic-worker-imported-script'
import {fetchModuleWorkerScriptGraph} from './fetch-module-script'
import {runClassicScript, runModuleScript} from './execute-script'

type WorkerType = 'classic' | 'module'

// See: https://html.spec.whatwg.org/multipage/workers.html#workerglobalscope
interface NiaWorkerGlobalScopeObject {
  fetchClassicWorkerScript: typeof fetchClassicWorkerScript,
  fetchClassicWorkerImportedScript: typeof fetchClassicWorkerImportedScript,
  fetchModuleWorkerScriptGraph: typeof fetchModuleWorkerScriptGraph,
  runClassicScript: typeof runClassicScript,
  runModuleScript: typeof runModuleScript,
  processExit: typeof process.exit,
  associatedWorker: threads.MessagePort,
  currentScript: ClassicScript | ModuleScript,
  environmentSettings: EnvironmentSettings,
  type: WorkerType,
  url: URL,
  name: string,
  closing: boolean,
}

interface NiaWorkerGlobalScope {
  __nia: NiaWorkerGlobalScopeObject
}

const mixinNiaWorkerGlobalScope = <T extends NiaWorkerGlobalScope>(proto: T) => {
  const niaWorkerGlobalScopeObj = {} as NiaWorkerGlobalScopeObject
  Object.defineProperties(niaWorkerGlobalScopeObj, {
    fetchClassicWorkerScript: {value: fetchClassicWorkerScript},
    fetchClassicWorkerImportedScript: {value: fetchClassicWorkerImportedScript},
    fetchModuleWorkerScriptGraph: {value: fetchModuleWorkerScriptGraph},
    runClassicScript: {value: runClassicScript},
    runModuleScript: {value: runModuleScript},
    processExit: {value: process.exit},
    associatedWorker: {value: threads.parentPort},
    currentScript: {value: null, writable: true},
    environmentSettings: {value: null, writable: true},
    type: {value: null, writable: true},
    url: {value: null, writable: true},
    name: {value: null, writable: true},
    closing: {value: false, writable: true},
  })
  Object.defineProperty(proto, '__nia', {value: niaWorkerGlobalScopeObj})
}

export {mixinNiaWorkerGlobalScope, NiaWorkerGlobalScope}
