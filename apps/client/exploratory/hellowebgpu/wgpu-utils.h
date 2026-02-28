// Copyright (c) 2025 Niantic, inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)
//
// WebGPU Utilities

#pragma once

#include <memory>

#include <webgpu/webgpu_cpp.h>

#if JAVASCRIPT
#include <emscripten.h>
#include <emscripten/html5.h>
#include <emscripten/html5_webgpu.h>
#else
#include <GLFW/glfw3.h>
#include <webgpu/webgpu_glfw.h>
#endif

namespace c8 {

#if JAVASCRIPT

// Reference: https://github.com/emscripten-core/emscripten/blob/main/test/webgpu_jsvalstore.cpp
class EmJsHandle {
public:
  EmJsHandle() : mHandle(0) {}
  EmJsHandle(int handle) : mHandle(handle) {}
  ~EmJsHandle() {
    if (mHandle != 0) {
      emscripten_webgpu_release_js_handle(mHandle);
    }
  }

  EmJsHandle(const EmJsHandle&) = delete;
  EmJsHandle& operator=(const EmJsHandle&) = delete;

  EmJsHandle(EmJsHandle&& rhs) : mHandle(rhs.mHandle) { rhs.mHandle = 0; }

  EmJsHandle& operator=(EmJsHandle&& rhs) {
    int tmp = rhs.mHandle;
    rhs.mHandle = this->mHandle;
    this->mHandle = tmp;
    return *this;
  }

  int Get() { return mHandle; }

private:
  int mHandle;
};

void wgpuGetAdapterAsync(wgpu::Instance& instance, void (*callback)(wgpu::Adapter));

void wgpuGetDeviceAsync(wgpu::Adapter& adapter, void (*callback)(wgpu::Device));

// TODO(yuyan): remove swap chain related code after Emscripten is upgraded
WGPUSwapChain createSwapChain(WGPUDevice device);

#else

// Parse command line parameters
bool parseCmdParams(
  const int argc,
  const char** argv,
  wgpu::BackendType* backendType,
  wgpu::AdapterType* adapterType,
  std::vector<std::string>* enableToggles,
  std::vector<std::string>* disableToggles);

wgpu::Instance createWgpuInstance(const wgpu::ChainedStruct* nextInChain = nullptr);

// Initialize wgpu Instance, Adapter and Device
bool initWgpuDeviceSync(
  wgpu::BackendType& backendType,
  wgpu::AdapterType& adapterType,
  std::vector<std::string>& enableToggles,
  std::vector<std::string>& disableToggles,
  wgpu::Instance* instance,
  wgpu::Adapter* adapter,
  wgpu::Device* device);

bool initWgpuGlfwSurface(const wgpu::Instance& instance, GLFWwindow* window, wgpu::Surface* surface);

wgpu::TextureFormat configureSurface(
  const wgpu::Adapter& adapter,
  const wgpu::Device& device,
  const wgpu::Surface& surface,
  const uint32_t width,
  const uint32_t height);

#endif


}  // namespace c8
