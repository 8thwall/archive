onmessage = (e) => {
  if (e.data === 'Start Test') {
    throw new Error('test passed')
  }
  throw new Error('unexpected message')
}
