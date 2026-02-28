// Copyright (c) 2025 Niantic Labs, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include <iostream>

#include <GLFW/glfw3.h>

#include <webgpu/webgpu_cpp.h>
#include <webgpu/webgpu_glfw.h>

#include "c8/exceptions.h"

#include "apps/client/exploratory/hellowebgpu/wgpu-utils.h"
#include "apps/client/exploratory/hellowebgpu/wgpu-renderer.h"

using namespace c8;

static constexpr uint32_t kWidth = 800;
static constexpr uint32_t kHeight = 600;
uint32_t width = kWidth;
uint32_t height = kHeight;

wgpu::Instance instance = nullptr;
wgpu::Adapter adapter = nullptr;
wgpu::Device device = nullptr;

wgpu::Surface surface = nullptr;
wgpu::TextureFormat preferredSurfaceTextureFormat = wgpu::TextureFormat::BGRA8Unorm;


void errorCallback(int error, const char* description) {
  fprintf(stderr, "Error: %s\n", description);
}

void glfwWindowSizeCallback(GLFWwindow* window, int width, int height) {
  preferredSurfaceTextureFormat = configureSurface(adapter, device, surface, width, height);
}

int main(int argc, const char* argv[]) {
  // wgpu initialization
  wgpu::BackendType backendType = wgpu::BackendType::Undefined;
  wgpu::AdapterType adapterType = wgpu::AdapterType::Unknown;
  std::vector<std::string> enableToggles;
  std::vector<std::string> disableToggles;
  if (!c8::parseCmdParams(argc, argv, &backendType, &adapterType, &enableToggles, &disableToggles)) {
    return -1;
  }

  bool initOk = c8::initWgpuDeviceSync(backendType, adapterType, enableToggles, disableToggles, &instance, &adapter, &device);
  if (!initOk) {
    C8_THROW("Could not initialize WebGPU");
    return -1;
  }

  wgpu::AdapterInfo info;
  adapter.GetInfo(&info);
  std::cout << "Using adapter \"" << info.vendorID << "\"\n";

  // init GLFW window
  glfwSetErrorCallback(errorCallback);

  if (!glfwInit()) {
    C8_THROW("Could not initialize GLFW");
  }

  // Create the test window with no client API.
  glfwWindowHint(GLFW_CLIENT_API, GLFW_NO_API);
  GLFWwindow* window = glfwCreateWindow(width, height, "Native WebGPU Window", nullptr, nullptr);
  if (!window) {
    glfwTerminate();
    C8_THROW("Could not initialize GLFW window");
  }

  glfwSetWindowSizeCallback(window, glfwWindowSizeCallback);

  // Create the surface.
  bool surfOk = c8::initWgpuGlfwSurface(instance, window, &surface);
  if (!surface || !surfOk) {
    glfwTerminate();
    C8_THROW("Could not initialize GLFW surface");
  }

  preferredSurfaceTextureFormat = configureSurface(adapter, device, surface, width, height);

  // init renderer
  WgpuRenderer renderer;
  renderer.initialize(device, preferredSurfaceTextureFormat);

  while (!glfwWindowShouldClose(window)) {
    wgpu::SurfaceTexture surfaceTexture;
    surface.GetCurrentTexture(&surfaceTexture);
    renderer.draw(surfaceTexture.texture);
    surface.Present();
    // Poll for GLFW events.
    glfwPollEvents();
  }

  glfwDestroyWindow(window);
  glfwTerminate();

  return 0;
}
