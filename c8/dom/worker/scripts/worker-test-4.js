/* eslint-disable no-restricted-globals */
onmessage = (e) => {
  if (e.data === 'Start Test') {
    let result = true

    if (typeof globalThis === 'undefined') {
      result = false
    }

    if (typeof globalThis.self === 'undefined') {
      result = false
    }

    if (globalThis !== self) {
      result = false
    }

    if (result) {
      postMessage('test passed')
      return
    } else {
      postMessage('test failed')
      return
    }
  }
  throw new Error('unexpected message')
}
