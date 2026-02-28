// @rule(js_binary)
// @dep(:sample-addon)
import sampleAddon from '@nia/c8/dom/sample-addon-test/sample-addon'

const self = globalThis as any

const messageHandler = (eventData: any) => {
  if (eventData.data === 'start') {
    const obj1 = new sampleAddon.MyObject(42)
    const obj2 = new sampleAddon.MyObject(55)
    const obj3 = new sampleAddon.MyObject(100)
    const obj4 = new sampleAddon.MyObject(200)
    const obj5 = new sampleAddon.MyObject(300)

    const value = obj1.getValue() + obj2.getValue() +
      obj3.getValue() + obj4.getValue() + obj5.getValue()
    self.postMessage(value)
  }
}

self.onmessage = messageHandler
