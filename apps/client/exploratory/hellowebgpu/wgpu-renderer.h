// Copyright (c) 2025 Niantic, inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)
//
// Renderer using WGPU

#pragma once

#include <memory>

#include <webgpu/webgpu_cpp.h>

namespace c8 {

class WgpuRenderer {
public:
  void initialize(wgpu::Device& device, wgpu::TextureFormat format);

  wgpu::RenderPassEncoder surfaceRenderPassEncoder(
    wgpu::CommandEncoder& encoder,
    wgpu::TextureView& surfaceTextureView);

  void draw(wgpu::Texture& surfaceTexture);

  void draw(wgpu::TextureView& surfaceTextureView);

  // Default constructor.
  explicit WgpuRenderer() = default;

  // Default move constructors.
  WgpuRenderer(WgpuRenderer&&) = default;
  WgpuRenderer &operator=(WgpuRenderer &&o) = default;

  // Disallow copying.
  WgpuRenderer(const WgpuRenderer&) = delete;
  WgpuRenderer &operator=(const WgpuRenderer &) = delete;

private:
  wgpu::Device device_;
  wgpu::Buffer vertexBuffer_;
  wgpu::RenderPipeline pipeline_;
};

}  // namespace c8
