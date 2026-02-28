/* eslint-disable no-restricted-globals */
self.onmessage = (e) => {
  if (ArrayBuffer.isView(e.data)) {
    e.data[0] = 1
    self.postMessage(e.data, [e.data.buffer])
    return
  } else if ('transfer' in e.data) {
    e.data.transfer[0] = 1
    self.postMessage(e.data.transfer, {transfer: [e.data.transfer.buffer]})
  }
  throw new Error('unexpected message')
}
/* eslint-enable no-restricted-globals */
