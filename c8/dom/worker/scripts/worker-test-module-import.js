const helloListener = () => {
  /* eslint-disable no-restricted-globals */
  self.onmessage = (e) => {
    if (e.data === 'hello') {
      self.postMessage('test passed')
      return
    }
    throw new Error('unexpected message')
  }
}

export default helloListener
