// @rule(js_binary)
// @attr(target = "node")
// @attr(esnext = 1)
// @package(npm-rendering)
// This file is intended to run in a vm context, within a node worker thread.
import threads from 'worker_threads'
import vm from 'vm'

// @dep(:worker-core-types)
// @inliner-skip-next
import type {
  ClassicScript,
  MessageEvent,
  ModuleScript,
  Request,
  Response,
  WorkerData,
  WorkerGlobalScope,
} from '@nia/c8/dom/worker/worker-core'

const self = globalThis as unknown as WorkerGlobalScope

// `Blob` objects are registered within the current thread. If using Worker
//    * Threads, `Blob` objects registered within one Worker will not be available
//    * to other workers or the main thread.
// `Blob` objects are registered within the current context.
//    * If using VM context, `Blob` objects registered within one context will not
//    * be available to other contexts.
const checkBlob = (url: string): string => {
  if (!url.startsWith('blob:')) {
    return url
  }

  return URL.createObjectURL(threads.workerData.blob)
}

const parseDataUrl = (url: string) => {
  // eslint-disable-next-line prefer-const
  let [m, type, encoding, data] = url.match(/^data: *([^;,]*)(?: *; *([^,]*))? *,(.*)$/) || []
  if (!m) throw Error('Invalid Data URL.')
  if (encoding) {
    switch (encoding.toLowerCase()) {
      case 'base64':
        data = Buffer.from(data, 'base64').toString()
        break
      default:
        throw Error(`Unknown Data URL encoding "${encoding}"`)
    }
  }
  return {type, data}
}

const evaluateDataUrl = (url: string, name: string) => {
  const {data} = parseDataUrl(url)
  return vm.runInContext(data, self.__nia.environmentSettings.realmExecutionContext, {
    filename: `worker.<${name}>`,
  })
}

// Enqueue messages to dispatch after modules are loaded
let eventQueue: Event[] | null = []
const prepareWorkerGlobalScope = () => {
  threads.parentPort?.on('message', (eventData: any) => {
    const messageEvent: MessageEvent = new (globalThis as any).MessageEvent('message', eventData)

    if (self.__nia.closing) {
      console.log('Worker is closing, discarding message')  // eslint-disable-line no-console
      return
    }

    if (eventData.data.__nia && eventData.source === '__nia') {
      if (eventData.data.__nia === 'terminate') {
        self.close()
        return
      }
    }

    if (eventQueue == null) {
      self.dispatchEvent(messageEvent)
    } else {
      eventQueue.push(messageEvent)
    }
  })

  threads.parentPort?.on('error', (err) => {
    err.type = 'Error'
    self.dispatchEvent(err)
  })
}

const flush = () => {
  const buffered = eventQueue
  eventQueue = null
  buffered?.forEach((event) => { self.dispatchEvent(event) })
}

const loadWorker = () => {
  // Load the data URL or module
  const {url, creationUrl, credentials} = threads.workerData as WorkerData
  const creationUrlObj = new URL(creationUrl)

  if (url.startsWith('data:text/javascript')) {
    evaluateDataUrl(url, `${threads.workerData.name}::${creationUrl}`)
    flush()
  } else if (
    url.startsWith('file:') ||
    url.startsWith('blob:') ||
    url.startsWith('http:') ||
    url.startsWith('https:')) {
    const {environmentSettings} = self.__nia
    environmentSettings.creationUrl = creationUrlObj
    environmentSettings.apiBaseUrl = creationUrlObj

    const mod = new URL(checkBlob(url))

    // In both cases, let performFetch be the following perform the fetch hook given request,
    // isTopLevel and processCustomFetchResponse:
    const performFetch = (request: Request, isTopLevel: boolean,
      processCustomFetchResponse: (response: Response, bodyBytes: ArrayBuffer) => void) => {
      // 1. If isTopLevel is false, fetch request with processResponseConsumeBody
      // set to processCustomFetchResponse, and abort these steps.
      if (!isTopLevel) {
        self.fetch(request).then((response) => {
          response.arrayBuffer().then(
            bodyBytes => processCustomFetchResponse(response, bodyBytes)
          )
        })
      }

      // 2. Set request's reserved client to inside settings.
      // [NOT IMPLEMENTED]

      // 3. Fetch request with processResponseConsumeBody set to the following steps given
      // response response and null, failure, or a byte sequence bodyBytes:
      self.fetch(request).then((response) => {
        response.arrayBuffer().then(
          (bodyBytes) => {
            // 1. Set worker global scope's url to response's url.
            self.__nia.url = new URL(response.url)

            // 2. Initialize worker global scope's policy container given worker global scope,
            // response, and inside settings.
            // [NOT IMPLEMENTED]

            // 3. If the Run CSP initialization for a global object algorithm returns "Blocked" when
            // executed upon worker global scope, set response to a network error. [CSP]
            // [NOT IMPLEMENTED]

            // 4. If worker global scope's embedder policy's value is compatible with cross-origin
            // isolation and is shared is true, then set agent's agent cluster's cross-origin
            // isolation mode to "logical" or "concrete". The one chosen is implementation-defined.
            // [NOT IMPLEMENTED]

            // 5. If the result of checking a global object's embedder policy w/ worker globalscope,
            // outside settings, and response is false, then set response to a network error.
            // [NOT IMPLEMENTED]

            // 6. Set worker global scope' cross-origin isolated capability to true if agent's agent
            // cluster's cross-origin isolation mode is "concrete".
            // [NOT IMPLEMENTED]

            // 7. If is shared is false and owner's cross-origin isolated capability is false,
            // then set worker global scope's cross-origin isolated capability to false.
            // [NOT IMPLEMENTED]

            // 8. If is shared is false and response's url's scheme is "data",
            // then set worker global scope's cross-origin isolated capability to false.
            // [NOT IMPLEMENTED]

            // 9. Run processCustomFetchResponse with response and bodyBytes.
            processCustomFetchResponse(response, bodyBytes)
          }
        )
      })
    }

    // In both cases, let onComplete given script be the following steps:
    const afterLoadWorker = (script: ClassicScript | ModuleScript, rethrowErrors?: boolean) => {
      // 1. If script is null or if script's error to rethrow is non-null, then:
      if (script === null || script.errorToRethrow !== null) {
        // 1. Queue a global task on the DOM manipulation task source given worker's
        // relevant global object to fire an event named error at worker.
        setTimeout(() => { self.dispatchEvent(new (globalThis as any).ErrorEvent('error')) })

        // 2. Run the environment discarding steps for inside settings.
        // [NOT IMPLEMENTED]

        // 3. Abort these steps.
        return
      }

      // 2. Associate worker with worker global scope.
      // [IMPLEMENTATION NOTE] This is done by the WorkerGlobalScope Prototype.

      // 3. Let inside port be a new MessagePort object in inside settings's realm.
      // [NOT IMPLEMENTED]

      // 4. Associate inside port with worker global scope.
      // [NOT IMPLEMENTED]

      // 5. Entangle outside port and inside port.
      // [NOT IMPLEMENTED]

      // 6. Create a new WorkerLocation object and associate it with worker global scope.
      Object.assign(self.location, mod)

      // 7. Closing orphan workers: Start monitoring the worker such that no sooner than it
      // stops being a protected worker, and no later than it stops being a permissible worker,
      // worker global scope's closing flag is set to true.
      // [NOT IMPLEMENTED]

      // 8. Suspending workers: Start monitoring the worker, such that whenever
      // worker global scope's closing flag is false and the worker is a suspendable worker,
      // the user agent suspends execution of script in that worker until such time as either
      // the closing flag switches to true or the worker stops being a suspendable worker.
      // [NOT IMPLEMENTED]

      // 9. Set inside settings's execution ready flag.
      // [NOT IMPLEMENTED]

      // 10. If script is a classic script, then run the classic script script.
      // Otherwise, it is a module script; run the module script script.
      const oldCurrentScript = self.__nia.currentScript
      self.__nia.currentScript = script

      if (script.constructor.name === 'ClassicScript') {
        self.__nia.runClassicScript(script as ClassicScript, rethrowErrors)
      } else {
        self.__nia.runModuleScript(script as ModuleScript, rethrowErrors)
      }
      self.__nia.currentScript = oldCurrentScript

      // 11. Enable outside port's port message queue.
      // [NOT IMPLEMENTED]

      // 12. If is shared is false, enable the port message queue of the worker's implicit port.
      // [NOT IMPLEMENTED]

      // 13. If is shared is true, then queue a global task on DOM manipulation task source
      // given worker global scope to fire an event named connect at worker global scope,
      // using MessageEvent, with the data attribute initialized to the empty string,
      // the ports attribute initialized to a new frozen array containing inside port,
      // and the source attribute initialized to inside port.
      // [NOT IMPLEMENTED]

      // 14. Enable the client message queue of the ServiceWorkerContainer object whose associated
      // service worker client is worker global scope's relevant settings object.
      // [NOT IMPLEMENTED]

      // 15. Run the responsible event loop specified by inside settings until it is destroyed.
      flush()

      // 16. Clear the worker global scope's map of active timers.
      // [NOT IMPLEMENTED]

      // 17. Disentangle all the ports in the list of the worker's ports.
      // [NOT IMPLEMENTED]

      // 18. Empty worker global scope's owner set.
      // [NOT IMPLEMENTED]
    }

    // Let destination be "sharedworker" if is shared is true, and "worker" otherwise.
    const destination = 'worker'
    // Obtain script by switching on the value of options's type member:
    if (self.__nia.type === 'classic') {
      self.__nia.fetchClassicWorkerScript(
        mod,
        self.__nia.environmentSettings,  // outside settings
        destination,
        self.__nia.environmentSettings,  // inside settings
        afterLoadWorker as (script: ClassicScript, rethrowErrors?: boolean) => void,
        performFetch
      )
    } else {  // worker with module type
      self.__nia.fetchModuleWorkerScriptGraph(
        mod,
        self.__nia.environmentSettings,
        destination,
        credentials,
        self.__nia.environmentSettings,
        afterLoadWorker as (script: ModuleScript, rethrowErrors?: boolean) => void,
        performFetch
      )
    }
  } else {
    throw Error(`Unsupported module URL: ${url}`)
  }
}

try {
  prepareWorkerGlobalScope()
  loadWorker()
} catch (e) {
  console.error(e)  // eslint-disable-line no-console
  throw e
}
