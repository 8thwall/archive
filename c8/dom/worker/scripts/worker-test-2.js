onmessage = (e) => {
  if (e.data === 'hello') {
    postMessage('test passed')
  }
}
