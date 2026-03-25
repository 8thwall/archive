import {Platform} from './platform'

const enableVerboseLogging = false
let enableStandardLogging = true

const savedLoggingEnabled = localStorage.getItem('loggingEnabled')
if (savedLoggingEnabled !== null) {
  enableStandardLogging = savedLoggingEnabled === 'true'
} else {
  // unless set with settings disable logging on NAE
  enableStandardLogging = !Platform.isNativeQuest
}

const setLogsEnabled = (enabled: boolean) => {
  enableStandardLogging = enabled
  localStorage.setItem('loggingEnabled', enableStandardLogging ? 'true' : 'false')
  console.log(`Logging: ${enableStandardLogging ? 'enabled' : 'disabled'}`)
}
const getLogsEnabled = () => enableStandardLogging

const log = (...params) => {
  if (enableStandardLogging) {
    console.log(...params)
  }
}

const verboseLog = (...params) => {
  if (enableVerboseLogging) {
    console.log(...params)
  }
}

let renderInfo

const debugLog = (world, ...params) => {
  if (!renderInfo) {
    if (world.three.renderer) {
      renderInfo = world.three.renderer.info
    } else {
      console.log(params)
      return
    }
  }

  console.log(`[${renderInfo.render.frame}]${params}`)
}

const logger = {
  log,
  verboseLog,
  debugLog,
  setLogsEnabled,
  getLogsEnabled,
}

export {logger}
