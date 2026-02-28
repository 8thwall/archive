// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {describe, it, assert} from '@nia/bzl/js/chai-js'
import {WebAssembly} from '@nia/c8/dom/web-assembly'

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

// This WebAssembly binary was generated with https://webassembly.github.io/wabt/demo/wat2wasm:
// From this code:
// (module
//   (func (export "addTwo") (param i32 i32) (result i32)
//     local.get 0
//     local.get 1
//     i32.add))
const addTwoWasmBytes = base64ToArrayBuffer(
  'AGFzbQEAAAABBwFgAn9/AX8DAgEABwoBBmFkZFR3bwAACgkBBwAgACABagsACgRuYW1lAgMBAAA='
)

describe('WebAssembly tests', async () => {
  it('can instantiate', async () => {
    const {instance} = await WebAssembly.instantiate(addTwoWasmBytes) as any
    assert.strictEqual(instance.exports.addTwo(5, 7), 12)
  })

  it('can compile and then instantiate', async () => {
    const wasmModule = await WebAssembly.compile(addTwoWasmBytes)
    const instance = await WebAssembly.instantiate(wasmModule) as any
    assert.strictEqual(instance.exports.addTwo(5, 7), 12)
  })

  it('can create and use WebAssembly.Memory', () => {
    const memory = new WebAssembly.Memory({initial: 1})
    assert(memory instanceof WebAssembly.Memory)
    assert.strictEqual(memory.buffer.byteLength, 65536)
  })

  it('throws on invalid wasm bytes', async () => {
    let threw = false
    try {
      await WebAssembly.compile(new Uint8Array([0, 1, 2, 3]))
    } catch (e) {
      threw = true
      assert(e instanceof Error)
    }
    assert.strictEqual(threw, true)
  })

  it('can create a WebAssembly.Module and check exports', async () => {
    const module = await WebAssembly.compile(addTwoWasmBytes)
    assert(module instanceof WebAssembly.Module)
    // Optionally check exports if your polyfill supports it
    if (WebAssembly.Module.exports) {
      const exports = WebAssembly.Module.exports(module)
      assert(Array.isArray(exports))
    }
  })

  it('can construct different WebAssembly objects w/o error', async () => {
    /* eslint-disable no-new */
    new WebAssembly.Memory({initial: 1})
    new WebAssembly.Table({initial: 1, element: 'anyfunc'})
    new WebAssembly.Global({value: 'i32', mutable: true}, 100)
    new WebAssembly.Instance(
      await WebAssembly.compile(addTwoWasmBytes),
      {
        env: {
          g: new WebAssembly.Global({value: 'i32', mutable: true}, 100),
        },
      }
    )

    new WebAssembly.Module(addTwoWasmBytes)
    new WebAssembly.CompileError('Test error')
    new WebAssembly.LinkError('Test link error')
    new WebAssembly.RuntimeError('Test runtime error')
    /* eslint-enable no-new */
  })
})
