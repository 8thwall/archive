// No need to import z anymore

import {log} from '../utils/log'
import {responseSchema} from '../schema/common'

const DEFAULT_TIMEOUT_MS = 1000
const WEBSOCKET_SERVER_URI = 'ws://localhost:8080'

type PendingActionRequest = {
  resolve: (value: any) => void
  reject: (reason?: any) => void
  timer: ReturnType<typeof setTimeout>
}

const createWebSocketManager = () => {
  let ws_: WebSocket | null = null
  let connectionPromise: Promise<WebSocket> | null = null
  const pendingRequests = new Map<string, PendingActionRequest>()

  const ensureConnection = () => {
    if (ws_ && ws_.readyState === WebSocket.OPEN) {
      return Promise.resolve(ws_)
    }

    if (connectionPromise) {
      return connectionPromise
    }

    connectionPromise = new Promise<WebSocket>((connectionResolve, connectionReject) => {
      // NOTE(dat): You might get the error `WebSocket is not defined`.
      // Make sure you run `npm run start:debug` with node version 22.
      const ws = new WebSocket(WEBSOCKET_SERVER_URI)

      ws.onopen = () => {
        log('Established WebSocket connection')
        connectionPromise = null
        ws_ = ws
        connectionResolve(ws)
      }

      ws.onerror = (event) => {
        log('Error with WebSocket connection', event)
        connectionReject(new Error('Error with WebSocket connection'))
        // An error may occur before establishing a successful connection.
        connectionPromise = null
      }

      ws.onmessage = (event) => {
        log('Received message data', event.data)
        const eventData = JSON.parse(event.data)
        const pendingRequest = pendingRequests.get(eventData.requestId)
        if (!pendingRequest) {
          // No-op if we can't find the requestId.
          return
        }

        const {resolve, reject, timer} = pendingRequest
        clearTimeout(timer)
        pendingRequests.delete(eventData.requestId)
        const messageResponse = responseSchema.safeParse(eventData)
        if (!messageResponse.success) {
          reject(messageResponse.error || new Error('Malformed message'))
          return
        }

        if (messageResponse.data.isError) {
          reject(messageResponse.data.error || new Error('Request unsuccessful'))
          return
        }

        resolve(messageResponse.data.response)
      }

      ws.onclose = () => {
        log('WebSocket connection closed')
        pendingRequests.forEach(({reject, timer}) => {
          clearTimeout(timer)
          reject(new Error('WebSocket connection closed'))
        })
        pendingRequests.clear()
        ws_ = null
      }
    })

    return connectionPromise
  }
  const send = async ({
    action,
    parameters,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  }: {action: string, parameters: Record<string, any>, timeoutMs?: number}) => {
    const ws = await ensureConnection()
    return new Promise((
      resolve,
      reject
    ) => {
      const requestId = crypto.randomUUID()
      const timer = setTimeout(() => {
        pendingRequests.delete(requestId)
        reject(new Error(`requestId ${requestId} timed out after ${timeoutMs}ms`))
      }, timeoutMs)
      pendingRequests.set(requestId, {resolve, reject, timer})

      ws.send(JSON.stringify({
        requestId,
        action,
        parameters,
      }))
    })
  }

  return {
    send,
  }
}

export {
  createWebSocketManager,
}
