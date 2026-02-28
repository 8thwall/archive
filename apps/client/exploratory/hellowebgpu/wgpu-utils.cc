// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include <iostream>

#include <webgpu/webgpu_cpp.h>

#if JAVASCRIPT
#include <emscripten/emscripten.h>
#else
#include <dawn/common/Assert.h>
#include "dawn/common/Log.h"
#include <dawn/dawn_proc.h>  // nogncheck
#include "dawn/native/DawnNative.h"
#include "dawn/utils/ComboRenderPipelineDescriptor.h"
#include "dawn/utils/CommandLineParser.h"
#include "dawn/utils/WGPUHelpers.h"
#include "dawn/webgpu_cpp_print.h"
#include "dawn/common/SystemUtils.h"
#endif

#include "c8/c8-log.h"

#include "apps/client/exploratory/hellowebgpu/wgpu-utils.h"

namespace c8 {

#if JAVASCRIPT

void wgpuGetAdapterAsync(wgpu::Instance& instance, void (*callback)(wgpu::Adapter)) {
  instance.RequestAdapter(
    nullptr,
    [](WGPURequestAdapterStatus status, WGPUAdapter cAdapter, const char* message, void* userdata) {
      if (message) {
        C8Log("webgpu RequestAdapter: %s\n", message);
      }

      wgpu::Adapter adapter = wgpu::Adapter::Acquire(cAdapter);
      reinterpret_cast<void (*)(wgpu::Adapter)>(userdata)(adapter);
    },
    reinterpret_cast<void*>(callback));
}

void wgpuGetDeviceAsync(wgpu::Adapter& adapter, void (*callback)(wgpu::Device)) {
  adapter.RequestDevice(
    nullptr,
    [](WGPURequestDeviceStatus status, WGPUDevice cDevice, const char* message, void* userdata) {
      if (message) {
        C8Log("webgpu RequestDevice: %s\n", message);
      }

      wgpu::Device device = wgpu::Device::Acquire(cDevice);
      reinterpret_cast<void (*)(wgpu::Device)>(userdata)(device);
    },
    reinterpret_cast<void*>(callback));
}

// TODO(yuyan): remove swap chain related code after Emscripten is upgraded
// swap chain APIs are removed from the latest WebGPU headers
WGPUSwapChain createSwapChain(WGPUDevice device) {
  WGPUSurfaceDescriptorFromCanvasHTMLSelector canvDesc = {};
  canvDesc.chain.sType = WGPUSType_SurfaceDescriptorFromCanvasHTMLSelector;
  canvDesc.selector = "canvas";

  WGPUSurfaceDescriptor surfDesc = {};
  surfDesc.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&canvDesc);

  WGPUSurface surface = wgpuInstanceCreateSurface(nullptr, &surfDesc);

  WGPUSwapChainDescriptor swapDesc = {};
  swapDesc.usage  = WGPUTextureUsage_RenderAttachment;
  swapDesc.format = WGPUTextureFormat_BGRA8Unorm;
  // TODO(yuyan): query canvas dimensions
  swapDesc.width  = 512;
  swapDesc.height = 512;
  swapDesc.presentMode = WGPUPresentMode_Fifo;

  WGPUSwapChain swapchain = wgpuDeviceCreateSwapChain(device, surface, &swapDesc);

  return swapchain;
}

#else

bool parseCmdParams(
  const int argc,
  const char** argv,
  wgpu::BackendType* backendType,
  wgpu::AdapterType* adapterType,
  std::vector<std::string>* enableToggles,
  std::vector<std::string>* disableToggles) {
  dawn::utils::CommandLineParser opts;
  auto& helpOpt = opts.AddHelp();
  auto& enableTogglesOpt = opts.AddStringList("enable-toggles", "Toggles to enable in Dawn")
                             .ShortName('e')
                             .Parameter("comma separated list");
  auto& disableTogglesOpt = opts.AddStringList("disable-toggles", "Toggles to disable in Dawn")
                              .ShortName('d')
                              .Parameter("comma separated list");
  auto& backendOpt =
    opts.AddEnum<wgpu::BackendType>({{"d3d11", wgpu::BackendType::D3D11},
                                         {"d3d12", wgpu::BackendType::D3D12},
                                         {"metal", wgpu::BackendType::Metal},
                                         {"null", wgpu::BackendType::Null},
                                         {"opengl", wgpu::BackendType::OpenGL},
                                         {"opengles", wgpu::BackendType::OpenGLES},
                                         {"vulkan", wgpu::BackendType::Vulkan}},
                                        "backend", "The backend to get an adapter from")
      .ShortName('b')
      .Default(wgpu::BackendType::Undefined);
  auto& adapterTypeOpt = opts.AddEnum<wgpu::AdapterType>(
                           {
                             {"discrete", wgpu::AdapterType::DiscreteGPU},
                             {"integrated", wgpu::AdapterType::IntegratedGPU},
                             {"cpu", wgpu::AdapterType::CPU},
                           },
                           "adapter-type", "The type of adapter to request")
                           .ShortName('a')
                           .Default(wgpu::AdapterType::Unknown);

  auto result = opts.Parse(argc, argv);
  if (!result.success) {
    C8Log("[dawn] cmd line parse error %d\n", result.errorMessage.c_str());
    return false;
  }

  if (helpOpt.GetValue()) {
    std::cout << "Usage: " << argv[0] << " <options>\n\noptions\n";
    opts.PrintHelp(std::cout);
    return false;
  }

  *backendType = backendOpt.GetValue();
  *adapterType = adapterTypeOpt.GetValue();
  *enableToggles = enableTogglesOpt.GetOwnedValue();
  *disableToggles = disableTogglesOpt.GetOwnedValue();

  return true;
}

wgpu::Instance createWgpuInstance(const wgpu::ChainedStruct* nextInChain) {
  dawnProcSetProcs(&dawn::native::GetProcs());

  // Create the instance with the toggles
  wgpu::InstanceDescriptor instanceDescriptor = {};
  instanceDescriptor.nextInChain = nextInChain;
  instanceDescriptor.features.timedWaitAnyEnable = true;
  return wgpu::CreateInstance(&instanceDescriptor);
}

// Synchronously create the adapter
wgpu::Adapter requestWgpuAdapterSync(wgpu::Instance& instance, wgpu::RequestAdapterOptions* options = nullptr) {
  wgpu::Adapter adapter = nullptr;
  instance.WaitAny(
    instance.RequestAdapter(
      options, wgpu::CallbackMode::WaitAnyOnly,
      [&](wgpu::RequestAdapterStatus status, wgpu::Adapter adapt, wgpu::StringView message) {
        if (status != wgpu::RequestAdapterStatus::Success) {
          C8Log("[dawn] Failed to get an adapter: %s\n", message.data);
          return;
        }
      adapter = std::move(adapt);
    }),
    UINT64_MAX);
  return adapter;
}

// Synchronously create the device
wgpu::Device requestWgpuDeviceSync(wgpu::Instance& instance, wgpu::Adapter& adapter, wgpu::DeviceDescriptor* desc = nullptr) {
  wgpu::Device device = nullptr;
  instance.WaitAny(
    adapter.RequestDevice(
      desc,
      wgpu::CallbackMode::WaitAnyOnly,
      [&](wgpu::RequestDeviceStatus status, wgpu::Device dev, wgpu::StringView message) {
        if (status != wgpu::RequestDeviceStatus::Success) {
          C8Log("[dawn] Failed to get an device: %s\n", message.data);
          return;
        }
        device = std::move(dev);
    }),
    UINT64_MAX);
  return device;
}

bool initWgpuDeviceSync(
  wgpu::BackendType& backendType,
  wgpu::AdapterType& adapterType,
  std::vector<std::string>& enableToggles,
  std::vector<std::string>& disableToggles,
  wgpu::Instance* instance,
  wgpu::Adapter* adapter,
  wgpu::Device* device) {
  if (!instance || !adapter || !device) {
    C8Log("[dawn] Error: can't assign wgpu device.\n");
    return false;
  }

  // Create the toggles descriptor if not using emscripten.
  wgpu::ChainedStruct* togglesChain = nullptr;
  std::vector<const char*> enableToggleNames;
  std::vector<const char*> disabledToggleNames;
  for (const std::string& toggle : enableToggles) {
    enableToggleNames.push_back(toggle.c_str());
  }
  for (const std::string& toggle : disableToggles) {
    disabledToggleNames.push_back(toggle.c_str());
  }

  wgpu::DawnTogglesDescriptor toggles = {};
  toggles.enabledToggles = enableToggleNames.data();
  toggles.enabledToggleCount = enableToggleNames.size();
  toggles.disabledToggles = disabledToggleNames.data();
  toggles.disabledToggleCount = disabledToggleNames.size();

  togglesChain = &toggles;

  wgpu::Instance ins = createWgpuInstance(togglesChain);
  if (ins == nullptr) {
    C8Log("[dawn] Failed to get WebGPU instance\n");
    return false;
  }
  *instance = std::move(ins);

  // Setup base adapter options with toggles.
  wgpu::RequestAdapterOptions adapterOptions = {};
  adapterOptions.nextInChain = togglesChain;
  adapterOptions.backendType = backendType;
  if (backendType != wgpu::BackendType::Undefined) {
    adapterOptions.compatibilityMode = dawn::utils::BackendRequiresCompat(backendType);
  }

  switch (adapterType) {
    case wgpu::AdapterType::CPU:
      adapterOptions.forceFallbackAdapter = true;
      break;
    case wgpu::AdapterType::DiscreteGPU:
      adapterOptions.powerPreference = wgpu::PowerPreference::HighPerformance;
      break;
    case wgpu::AdapterType::IntegratedGPU:
      adapterOptions.powerPreference = wgpu::PowerPreference::LowPower;
      break;
    case wgpu::AdapterType::Unknown:
      break;
  }

  wgpu::Adapter adapt = requestWgpuAdapterSync(*instance, &adapterOptions);
  if (adapt == nullptr) {
    C8Log("[dawn] Failed to get WebGPU adapter\n");
    return false;
  }
  *adapter = std::move(adapt);

  // Create device descriptor with callbacks and toggles
  wgpu::DeviceDescriptor deviceDesc = {};
  deviceDesc.nextInChain = togglesChain;
  deviceDesc.SetDeviceLostCallback(
    wgpu::CallbackMode::AllowSpontaneous,
    [](const wgpu::Device&, wgpu::DeviceLostReason reason, wgpu::StringView message) {
      const char* reasonName = "";
      switch (reason) {
        case wgpu::DeviceLostReason::Unknown:
          reasonName = "Unknown";
          break;
        case wgpu::DeviceLostReason::Destroyed:
          reasonName = "Destroyed";
          break;
        case wgpu::DeviceLostReason::InstanceDropped:
          reasonName = "InstanceDropped";
          break;
        case wgpu::DeviceLostReason::FailedCreation:
          reasonName = "FailedCreation";
          break;
        default:
          DAWN_UNREACHABLE();
      }
      C8Log("[dawn] Device lost because of %s : %s\n", reasonName, message.data);
    });
  deviceDesc.SetUncapturedErrorCallback(
    [](const wgpu::Device&, wgpu::ErrorType type, wgpu::StringView message) {
      const char* errorTypeName = "";
      switch (type) {
        case wgpu::ErrorType::Validation:
          errorTypeName = "Validation";
          break;
        case wgpu::ErrorType::OutOfMemory:
          errorTypeName = "Out of memory";
          break;
        case wgpu::ErrorType::Unknown:
          errorTypeName = "Unknown";
          break;
        case wgpu::ErrorType::DeviceLost:
          errorTypeName = "Device lost";
          break;
        default:
          DAWN_UNREACHABLE();
      }
      C8Log("[dawn] Error type %s  error: %s\n", errorTypeName, message.data);
    });

  wgpu::Device dev = requestWgpuDeviceSync(*instance, *adapter, &deviceDesc);
  if (dev == nullptr) {
    C8Log("[dawn] Failed to get WebGPU device\n");
    return false;
  }
  *device = std::move(dev);

  return true;
}

bool initWgpuGlfwSurface(const wgpu::Instance& instance, GLFWwindow* window, wgpu::Surface* surface) {
  if (!window) {
    return false;
  }
  wgpu::Surface surf = wgpu::glfw::CreateSurfaceForWindow(instance, window);
  if (surf == nullptr) {
    return false;
  }
  *surface = std::move(surf);
  return true;
}

wgpu::TextureFormat configureSurface(
  const wgpu::Adapter& adapter,
  const wgpu::Device& device,
  const wgpu::Surface& surface,
  const uint32_t width, const uint32_t height) {
  // Configure the surface.
  wgpu::SurfaceCapabilities capabilities;
  surface.GetCapabilities(adapter, &capabilities);
  wgpu::SurfaceConfiguration config = {};
  config.device = device;
  config.format = capabilities.formats[0];
  config.width = width;
  config.height = height;
  surface.Configure(&config);
  return capabilities.formats[0];
}

#endif

}  // namespace c8
