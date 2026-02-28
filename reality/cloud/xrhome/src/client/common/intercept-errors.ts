import fetchLog from './fetch-log'
import {envDeploymentStage} from './index'

const pageLoaded = new Date()

const MESSAGE_LIMIT = 1024
const STACK_LIMIT = 64

const formatStackTrace = stack => stack.toString()
  .split('\n')
  .map(x => x.trim().substring(0, MESSAGE_LIMIT))
  .slice(0, STACK_LIMIT)

const delay = ms => () => new Promise(resolve => setTimeout(resolve, ms)) as Promise<void>

// Built in 250ms spacing between submissions
// Batching requests requires a back-end log change
// TODO(pawel) batch requests once log.8thwall.com can handle them
let sendLimit
let numSent
let fetchLogPromise = Promise.resolve() as Promise<void>
const sendLogLimit = (channel, limit) => {
  sendLimit = limit
  numSent = 0
  return (log) => {
    if (numSent >= sendLimit) {
      return
    }
    numSent++
    fetchLogPromise = fetchLogPromise.then(() => fetchLog(channel, log)).then(delay(250))
  }
}

const startInterceptErrorsWithReduxState = (window, store, sendLog) => {
  if (!window.console) {
    return
  }

  const getContext = () => {
    const state = store.getState()
    return {
      selectedAccount: state.accounts.selectedAccount,
      userUuid: state.user.uuid,
      uri: window.location.pathname,
      pageLoaded,
      versionId: Build8.VERSION_ID,
      executableName: Build8.EXECUTABLE_NAME,
      deploymentStage: envDeploymentStage(),
    }
  }

  const oldWindowError = window.console.error.bind(window.console)

  window.console.error = (...args) => {
    // If the arguments are error-like (i.e. already have a stack trace) log the stack trace of the
    // error. Otherwise, generate an ad hoc stack trace, but remove the top elements. The first
    // element is a description string, and the second element is this method.
    const stackTrace = Array.isArray(args[0]?.stack)
      ? formatStackTrace(args[0].stack).slice(1)
      : formatStackTrace(new Error().stack).slice(2)
    const message = String(args.length ? args[0] : '').substring(0, MESSAGE_LIMIT)

    sendLog(Object.assign(getContext(), {stackTrace, message, args}))

    Function.prototype.apply.call(oldWindowError, window.console, args)
  }

  const handleError = (messageRaw, error) => {
    const message = messageRaw?.substring(0, MESSAGE_LIMIT) || ''
    // Remove the top element from the stack trace. The first element is a description string,
    // which we remove to be consistent with logging errors from console.error().
    const stackTrace = (error?.stack) ? formatStackTrace(error.stack).slice(1) : []

    if (message || stackTrace.length) {
      sendLog(Object.assign(getContext(), {stackTrace, message}))
    } else {
      let serializedMessage = '[unserializable]'
      try {
        serializedMessage = JSON.stringify(event).substring(0, MESSAGE_LIMIT)
      } catch {
        // json error
      }
      sendLog(Object.assign(
        getContext(), {message: `Unexpected error event: ${serializedMessage}`, stackTrace}
      ))
    }
  }

  window.addEventListener('error', (event) => {
    const {message, error} = event
    handleError(message, error)
  })

  window.addEventListener('unhandledrejection', ({reason}) => {
    if (reason instanceof Error) {
      handleError(reason.message, reason)
    }
  })
}

export {
  sendLogLimit,
  startInterceptErrorsWithReduxState,
}
