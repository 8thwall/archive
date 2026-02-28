// Copyright (c) 2025 Niantic Labs, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#ifdef JAVASCRIPT

#include <emscripten.h>
#include <emscripten/html5.h>
#include <emscripten/html5_webgpu.h>

//#include <webgpu/webgpu.h>
#include <webgpu/webgpu_cpp.h>

#include "c8/stats/scope-timer.h"
#include "c8/symbol-visibility.h"

#include "apps/client/exploratory/hellowebgpu/wgpu-utils.h"
#include "apps/client/exploratory/hellowebgpu/wgpu-renderer.h"

using namespace c8;

namespace {

struct ControllerData {
  wgpu::Instance instance;
  wgpu::Adapter adapter;

  EmJsHandle deviceHandle;
  wgpu::Device device;

  WGPUSwapChain swapChain;

  std::unique_ptr<WgpuRenderer> renderer;
};

std::unique_ptr<ControllerData> &data() {
  static std::unique_ptr<ControllerData> d(nullptr);
  if (d == nullptr) {
    d.reset(new ControllerData());
    d->renderer.reset(new WgpuRenderer());
  }
  return d;
}

void initDevice() {
  // TODO(yuyan): use an Emscripten version that has wgpu::CreateInstance(nullptr) implementation
  data()->instance = {};

  wgpuGetAdapterAsync(data()->instance, [](wgpu::Adapter a) {
    data()->adapter = std::move(a);
    wgpuGetDeviceAsync(data()->adapter, [](wgpu::Device dev) {
      data()->device = std::move(dev);
      data()->deviceHandle = EmJsHandle(emscripten_webgpu_export_device(data()->device.Get()));

      EM_ASM({
        const device = JsValStore.get($0);
        console.log(device);
      },
      data()->deviceHandle.Get());

      data()->device.SetUncapturedErrorCallback(
        [](WGPUErrorType errorType, const char* message, void*) {
          printf("%d: %s\n", errorType, message);
        },
        nullptr);

      data()->renderer->initialize(data()->device, wgpu::TextureFormat::BGRA8Unorm);

      data()->swapChain = createSwapChain(data()->device.Get());
    });
  });
}

void renderFrame() {
  if (!data()->device) {
    return;
  }

  WGPUTextureView backBufView = wgpuSwapChainGetCurrentTextureView(data()->swapChain);
  wgpu::TextureView texView = wgpu::TextureView::Acquire(backBufView);
  data()->renderer->draw(texView);
}

}  // namespace

extern "C" {

C8_PUBLIC
void c8EmAsm_initDevice() {
  initDevice();
}

C8_PUBLIC
void c8EmAsm_renderFrame() {
  renderFrame();
}

}  // EXTERN "C"
#else
#warning "webgpu-js-cc requires --cpu=js"
#endif
