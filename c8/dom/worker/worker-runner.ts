// @rule(js_binary)
// @attr(target = "node")
// @attr(esnext = 1)
// @package(npm-rendering)
import threads from 'worker_threads'

import {fileURLToPath} from 'url'
import v8 from 'v8'
import vm from 'vm'

import {fetchScriptData} from '@nia/c8/dom/context-helpers'
import {createWorkerContext} from '@nia/c8/dom/worker/worker-context'

const workerExecScriptPath = () => {
  const fileUrl = new URL('./worker-fetch-execution.js', threads.workerData.creationUrl)
  return fileURLToPath(fileUrl)
}

let context: vm.Context | null
const executeRunner = async () => {
  const {url, type, name, internalStoragePath, naeBuildMode} = threads.workerData
  const contextObject = await createWorkerContext({
    url,
    type,
    name,
    internalStoragePath,
    naeBuildMode,
  })
  context = contextObject._context
  const script = await fetchScriptData(workerExecScriptPath())
  const workerExecutionScript = new vm.Script(script)
  workerExecutionScript.runInContext(context as vm.Context)
}

process.on('exit', () => {
  context = null

  // https://github.com/legraphista/expose-gc/blob/master/function.js
  v8.setFlagsFromString('--expose_gc')
  const gc = vm.runInNewContext('gc')
  gc()
})

executeRunner()
