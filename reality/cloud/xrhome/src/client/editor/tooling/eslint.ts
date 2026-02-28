import type {ParsedComponents} from '@ecs/shared/studio-component'
import uuidv4 from 'uuid/v4'

interface LintFixAndFormatRequest {
  filename: string
  val: string
}

interface LintFixAndFormatResponse {
  filename: string
  val: string
}

let eslintWorker_: Worker = null

const requests: Record<string, (LintFixAndFormatResponse) => void> = {}

// Worker is initialized on first use.
const getWorker = () => {
  if (!eslintWorker_) {
    eslintWorker_ = Build8.PLATFORM_TARGET === 'desktop'
      ? new Worker('desktop://dist/worker/client/eslint-worker.js')
      : new Worker(`/${Build8.DEPLOYMENT_PATH}/client/eslint-worker.js`)
    eslintWorker_.onmessage = (msg) => {
      requests[msg.data.requestId]?.(msg.data)
      delete requests[msg.data.requestId]
    }
  }
  return eslintWorker_
}

const lintAndFormat = ({filename, val}: LintFixAndFormatRequest) => (
  new Promise<LintFixAndFormatResponse>((resolve) => {
    const requestId = uuidv4()
    requests[requestId] = resolve
    getWorker().postMessage({
      command: 'lintfixandformat',
      offline: true,
      id: filename,
      val,
      requestId,
    })
  })
)

const getMonacoLintMarkers = (val, fileName) => (
  new Promise<any>((resolve) => {
    const requestId = uuidv4()
    requests[requestId] = resolve
    getWorker().postMessage({
      command: 'lint-monaco',
      val,
      fileName,
      requestId,
    })
  })
)

const getStudioComponents = (val: string) => (
  // NOTE(christoph): We might have issues serializing Error when we return from the worker.
  new Promise<ParsedComponents>((resolve) => {
    const requestId = uuidv4()
    requests[requestId] = resolve
    getWorker().postMessage({
      command: 'parse-components',
      val,
      requestId,
    })
  })
)

export {
  lintAndFormat,
  getMonacoLintMarkers,
  getStudioComponents,
}
