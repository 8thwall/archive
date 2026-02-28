/* eslint-disable no-restricted-globals */
onmessage = (e) => {
  if (e.data === 'Start Test') {
    const result = !!globalThis.__niaInternalStoragePath

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
