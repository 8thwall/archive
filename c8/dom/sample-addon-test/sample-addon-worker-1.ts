// @rule(js_binary)
// @dep(:sample-addon)
import sampleAddon from '@nia/c8/dom/sample-addon-test/sample-addon'

const self = globalThis as any

const messageHandler = (eventData: any) => {
  if (eventData.data === 'start') {
    const obj = new sampleAddon.MyObject(42)
    const value = obj.getValue()
    self.postMessage(value)
  }
}

self.onmessage = messageHandler
