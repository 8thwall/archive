// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include <webgpu/webgpu_cpp.h>

#include "c8/stats/scope-timer.h"
#include "c8/symbol-visibility.h"

#include "apps/client/exploratory/hellowebgpu/wgpu-renderer.h"

namespace c8 {

const char shaderCode[] = R"(
    @vertex fn vertexMain(@builtin(vertex_index) i : u32) ->
      @builtin(position) vec4f {
        const pos = array(vec2f(0, 1), vec2f(-1, -1), vec2f(1, -1));
        return vec4f(pos[i], 0, 1);
    }
    @fragment fn fragmentMain() -> @location(0) vec4f {
        return vec4f(1, 0, 0, 1);
    }
)";

void WgpuRenderer::initialize(wgpu::Device& device, wgpu::TextureFormat format) {
  device_ = device;

#if JAVASCRIPT
  // TODO(yuyan): remove this def when Emscripten is upgraded to 3.1.25 or above.
  wgpu::ShaderModuleWGSLDescriptor wgslDesc{};
  wgslDesc.source = shaderCode;
#else
  wgpu::ShaderSourceWGSL wgslDesc{};
  wgslDesc.code = shaderCode;
#endif

  wgpu::ShaderModuleDescriptor shaderModuleDescriptor{.nextInChain = &wgslDesc};
  wgpu::ShaderModule shaderModule = device_.CreateShaderModule(&shaderModuleDescriptor);

  wgpu::PipelineLayoutDescriptor pl{};
  pl.bindGroupLayoutCount = 0;
  pl.bindGroupLayouts = nullptr;

  wgpu::ColorTargetState colorTargetState{.format = format};

  wgpu::FragmentState fragmentState{.module = shaderModule,
                                    .targetCount = 1,
                                    .targets = &colorTargetState};

  wgpu::RenderPipelineDescriptor descriptor{};
  descriptor.layout = device_.CreatePipelineLayout(&pl);
#if JAVASCRIPT
  wgpu::VertexState vertexState{.module = shaderModule,
                                .entryPoint = "vertexMain"};
  descriptor.vertex = vertexState;
  fragmentState.entryPoint = "fragmentMain";
#else
  descriptor.vertex.module = shaderModule;
#endif
  descriptor.fragment = &fragmentState;

  pipeline_ = device_.CreateRenderPipeline(&descriptor);
}

wgpu::RenderPassEncoder WgpuRenderer::surfaceRenderPassEncoder(
  wgpu::CommandEncoder& encoder,
  wgpu::TextureView& surfaceTextureView) {
  wgpu::RenderPassColorAttachment attachment{
    .view = surfaceTextureView,
    .loadOp = wgpu::LoadOp::Clear,
    .storeOp = wgpu::StoreOp::Store,
    .clearValue = {0, 0, 0, 1}};

  wgpu::RenderPassDescriptor renderpass{.colorAttachmentCount = 1,
                                        .colorAttachments = &attachment};

  wgpu::RenderPassEncoder pass = encoder.BeginRenderPass(&renderpass);
  pass.SetPipeline(pipeline_);
  pass.Draw(3);

  return pass;
}

void WgpuRenderer::draw(wgpu::Texture& surfaceTexture) {
  wgpu::TextureView texView = surfaceTexture.CreateView();
  draw(texView);
}

void WgpuRenderer::draw(wgpu::TextureView& surfaceTextureView) {
  wgpu::CommandEncoder encoder = device_.CreateCommandEncoder();
  wgpu::RenderPassEncoder pass = surfaceRenderPassEncoder(encoder, surfaceTextureView);
  pass.End();
  wgpu::CommandBuffer commands = encoder.Finish();
  device_.GetQueue().Submit(1, &commands);
}

}  // namespace c8
