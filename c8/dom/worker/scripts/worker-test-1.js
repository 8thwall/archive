/* eslint-disable no-restricted-globals */
self.onmessage = (e) => {
  if (e.data === 'hello') {
    self.postMessage('test passed')
  }
}
/* eslint-enable no-restricted-globals */
