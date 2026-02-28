/* eslint-disable no-restricted-globals */
self.onmessage = (e) => {
  if (e.data === 'hello') {
    self.postMessage('test passed')
    self.close()
    return
  }

  throw new Error('test failed')
}
/* eslint-enable no-restricted-globals */
