// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

// #include <webgpu/webgpu.h>
#include <webgpu/webgpu_cpp.h>

#include <iostream>

#include <GLFW/glfw3.h>
#include <imgui.h>
#include <backends/imgui_impl_glfw.h>
#include <backends/imgui_impl_wgpu.h>

#include "c8/exceptions.h"

#include "apps/client/exploratory/hellowebgpu/wgpu-utils.h"
#include "apps/client/exploratory/hellowebgpu/wgpu-renderer.h"

// Reference: https://github.com/ocornut/imgui/blob/master/examples/example_glfw_wgpu/main.cpp
// Note: this example is using C++ APIs for surface initialization and rendering.

using namespace c8;

static int wgpu_swap_chain_width = 800;
static int wgpu_swap_chain_height = 600;

wgpu::Instance instance = nullptr;
wgpu::Adapter adapter = nullptr;
wgpu::Device device = nullptr;

wgpu::Surface surface = nullptr;
wgpu::TextureFormat preferredSurfaceTextureFormat = wgpu::TextureFormat::BGRA8Unorm;

c8::WgpuRenderer renderer;

static void glfwErrorCallback(int error, const char* description) {
  printf("GLFW Error %d: %s\n", error, description);
}

static bool InitWGPU(GLFWwindow* window) {
  // Create the surface.
  bool surfaceOk = c8::initWgpuGlfwSurface(instance, window, &surface);
  return surfaceOk;
}

void CreateSwapChain(int width, int height) {
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
  glfwSetErrorCallback(glfwErrorCallback);
  if (!glfwInit()) {
    return 1;
  }

  // Make sure GLFW does not initialize any graphics context.
  // This needs to be done explicitly later.
  glfwWindowHint(GLFW_CLIENT_API, GLFW_NO_API);
  GLFWwindow* window = glfwCreateWindow(
    wgpu_swap_chain_width,
    wgpu_swap_chain_height,
    "Dear ImGui GLFW+WebGPU example",
    nullptr, nullptr);

  if (window == nullptr) {
    return 1;
  }

  // Initialize the WebGPU environment
  if (!InitWGPU(window)) {
    if (window) {
      glfwDestroyWindow(window);
    }
    glfwTerminate();
    return 1;
  }
  CreateSwapChain(wgpu_swap_chain_width, wgpu_swap_chain_height);
  glfwShowWindow(window);

  renderer.initialize(device, preferredSurfaceTextureFormat);

  // Setup Dear ImGui context
  IMGUI_CHECKVERSION();
  ImGui::CreateContext();
  ImGuiIO& io = ImGui::GetIO(); (void)io;
  io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;     // Enable Keyboard Controls
  io.ConfigFlags |= ImGuiConfigFlags_NavEnableGamepad;      // Enable Gamepad Controls

  // Setup Dear ImGui style
  ImGui::StyleColorsDark();
  // ImGui::StyleColorsLight();

  // Setup Platform/Renderer backends
  ImGui_ImplGlfw_InitForOther(window, true);

  ImGui_ImplWGPU_InitInfo init_info;
  init_info.Device = device.Get();
  init_info.NumFramesInFlight = 3;
  init_info.RenderTargetFormat = static_cast<WGPUTextureFormat>(preferredSurfaceTextureFormat);
  init_info.DepthStencilFormat = WGPUTextureFormat_Undefined;
  ImGui_ImplWGPU_Init(&init_info);

  // Load Fonts
  // - If no fonts are loaded, dear imgui will use the default font. You can also load multiple fonts and use ImGui::PushFont()/PopFont() to select them.
  // - AddFontFromFileTTF() will return the ImFont* so you can store it if you need to select the font among multiple.
  // - If the file cannot be loaded, the function will return a nullptr. Please handle those errors in your application (e.g. use an assertion, or display an error and quit).
  // - The fonts will be rasterized at a given size (w/ oversampling) and stored into a texture when calling ImFontAtlas::Build()/GetTexDataAsXXXX(), which ImGui_ImplXXXX_NewFrame below will call.
  // - Use '#define IMGUI_ENABLE_FREETYPE' in your imconfig file to use Freetype for higher quality font rendering.
  // - Read 'docs/FONTS.md' for more instructions and details.
  // - Remember that in C/C++ if you want to include a backslash \ in a string literal you need to write a double backslash \\ !
  // - Emscripten allows preloading a file or folder to be accessible at runtime. See Makefile for details.
  //io.Fonts->AddFontDefault();
#ifndef IMGUI_DISABLE_FILE_FUNCTIONS
  //io.Fonts->AddFontFromFileTTF("fonts/segoeui.ttf", 18.0f);
  //io.Fonts->AddFontFromFileTTF("fonts/DroidSans.ttf", 16.0f);
  //io.Fonts->AddFontFromFileTTF("fonts/Roboto-Medium.ttf", 16.0f);
  //io.Fonts->AddFontFromFileTTF("fonts/Cousine-Regular.ttf", 15.0f);
  //io.Fonts->AddFontFromFileTTF("fonts/ProggyTiny.ttf", 10.0f);
  //ImFont* font = io.Fonts->AddFontFromFileTTF("fonts/ArialUni.ttf", 18.0f, nullptr, io.Fonts->GetGlyphRangesJapanese());
  //IM_ASSERT(font != nullptr);
#endif

  // Our state
  bool show_demo_window = true;
  bool show_another_window = false;
  ImVec4 clear_color = ImVec4(0.45f, 0.55f, 0.60f, 1.00f);

  // Main loop
  while (!glfwWindowShouldClose(window)) {
    // Poll and handle events (inputs, window resize, etc.)
    // You can read the io.WantCaptureMouse, io.WantCaptureKeyboard flags to tell if dear imgui wants to use your inputs.
    // - When io.WantCaptureMouse is true, do not dispatch mouse input data to your main application, or clear/overwrite your copy of the mouse data.
    // - When io.WantCaptureKeyboard is true, do not dispatch keyboard input data to your main application, or clear/overwrite your copy of the keyboard data.
    // Generally you may always pass all inputs to dear imgui, and hide them from your application based on those two flags.
    glfwPollEvents();
    if (glfwGetWindowAttrib(window, GLFW_ICONIFIED) != 0) {
      ImGui_ImplGlfw_Sleep(10);
      continue;
    }

    // React to changes in screen size
    int width, height;
    glfwGetFramebufferSize((GLFWwindow*)window, &width, &height);
    if (width != wgpu_swap_chain_width || height != wgpu_swap_chain_height) {
      ImGui_ImplWGPU_InvalidateDeviceObjects();
      CreateSwapChain(width, height);
      ImGui_ImplWGPU_CreateDeviceObjects();
    }

    // Start the Dear ImGui frame
    ImGui_ImplWGPU_NewFrame();
    ImGui_ImplGlfw_NewFrame();
    ImGui::NewFrame();

    // 1. Show the big demo window (Most of the sample code is in ImGui::ShowDemoWindow()! You can browse its code to learn more about Dear ImGui!).
    // if (show_demo_window)
    //   ImGui::ShowDemoWindow(&show_demo_window);

    // 2. Show a simple window that we create ourselves. We use a Begin/End pair to create a named window.
    {
      static float f = 0.0f;
      static int counter = 0;

      ImGui::Begin("Hello, world!");                                // Create a window called "Hello, world!" and append into it.

      ImGui::Text("This is some useful text.");                     // Display some text (you can use a format strings too)
      ImGui::Checkbox("Demo Window", &show_demo_window);            // Edit bools storing our window open/close state
      ImGui::Checkbox("Another Window", &show_another_window);

      ImGui::SliderFloat("float", &f, 0.0f, 1.0f);                  // Edit 1 float using a slider from 0.0f to 1.0f
      ImGui::ColorEdit3("clear color", (float*)&clear_color);       // Edit 3 floats representing a color

      if (ImGui::Button("Button"))                                  // Buttons return true when clicked (most widgets return true when edited/activated)
        counter++;
      ImGui::SameLine();
      ImGui::Text("counter = %d", counter);

      ImGui::Text("Application average %.3f ms/frame (%.1f FPS)", 1000.0f / io.Framerate, io.Framerate);
      ImGui::End();
    }


    // 3. Show another simple window.
    if (show_another_window) {
      ImGui::Begin("Another Window", &show_another_window);         // Pass a pointer to our bool variable (the window will have a closing button that will clear the bool when clicked)
      ImGui::Text("Hello from another window!");
      if (ImGui::Button("Close Me")) {
        show_another_window = false;
      }
      ImGui::End();
    }

    // Rendering
    ImGui::Render();

    device.Tick();

    wgpu::SurfaceTexture surfaceTexture;
    surface.GetCurrentTexture(&surfaceTexture);
    wgpu::TextureView surfaceTexView = surfaceTexture.texture.CreateView();

    wgpu::CommandEncoder encoder = device.CreateCommandEncoder();
    wgpu::RenderPassEncoder pass = renderer.surfaceRenderPassEncoder(encoder, surfaceTexView);
    ImGui_ImplWGPU_RenderDrawData(ImGui::GetDrawData(), pass.Get());
    pass.End();
    wgpu::CommandBuffer commands = encoder.Finish();
    device.GetQueue().Submit(1, &commands);

    surface.Present();
  }

  // Cleanup
  ImGui_ImplWGPU_Shutdown();
  ImGui_ImplGlfw_Shutdown();
  ImGui::DestroyContext();

  glfwDestroyWindow(window);
  glfwTerminate();

  return 0;
}
