// @rule(js_binary)
/* eslint-disable import/no-unresolved */
import WEBGPUCC from 'apps/client/exploratory/hellowebgpu/webgpu-wasm'  // @dep(webgpu-wasm)
/* eslint-enable import/no-unresolved */

/* eslint-disable no-console */

let wgpucc_ = null

const frame = () => {
  if (wgpucc_) {
    wgpucc_._c8EmAsm_renderFrame()
  }

  requestAnimationFrame(frame)
}

const run = async () => {
  wgpucc_ = await WEBGPUCC({})

  if ('gpu' in navigator) {
    wgpucc_._c8EmAsm_initDevice()

    requestAnimationFrame(frame)
  } else {
    throw new Error('WebGPU not supported on this browser.')
  }
}

run()
