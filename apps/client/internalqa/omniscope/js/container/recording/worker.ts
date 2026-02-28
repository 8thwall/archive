import {Buffer} from 'buffer'

// Since we don't configure the worker with its own tsconfig specifying lib: ['webworker']
const ctx: Worker = self as any

// We need to make sure the message is not sent across the wire until an earlier frame
// has been sent. Moving linearization to the client makes sure the server is not spammed.
let workerQueue = Promise.resolve()
const appendFrame = ({id, deviceSuffix, message, frameNum}) => {
  workerQueue = workerQueue.then(() => {
    const messageBuffer = Buffer.from(message)
    return fetch(`/record/${deviceSuffix}/${id}/${frameNum}`, {
      credentials: 'same-origin',
      method: 'PATCH',
      body: messageBuffer,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
      .then((res) => {
        ctx.postMessage({id, status: res.status})
      })
  })
}

const resetQueue = () => {
  workerQueue = Promise.resolve()
}

const ACTIONS = {
  append: appendFrame,
  reset: resetQueue,
}

ctx.onmessage = (e) => {
  const {action} = e.data
  if (ACTIONS[action]) {
    ACTIONS[action](e.data)
  } else {
    console.error(`Worker does not understand how to perform action ${action}`)
  }
}
