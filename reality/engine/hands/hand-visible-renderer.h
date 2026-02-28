// Copyright (c) 2023 Niantic, Inc.
// Original Author: Dat Chu (datchu@nianticlabs.com)
//
// Renderer for which finger is visible.

#pragma once

#include "c8/geometry/pixel-pinhole-camera-model.h"
#include "c8/hpoint.h"
#include "c8/pixels/opengl/gl-framebuffer.h"
#include "c8/pixels/opengl/gl-quad.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/opengl/gl.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixels.h"
#include "c8/vector.h"
#include "reality/engine/hands/shaders/hand-visible-shader.h"

namespace c8 {

class HandVisibleRenderer {
public:
  // Get the most recent rendered image.
  RGBA8888PlanePixels pixels() const { return outpix_.pixels(); }

  // The final texture that has everything
  GlTexture dest() const { return dest1_.tex().tex(); }
  // The texture that we render our smoothed image into
  GlTexture smoothed() const { return smoothed_.tex().tex(); }
  // The texture that has edge detection
  GlTexture edge() const { return edge_.tex().tex(); }

  // Force a readback of the image render. This is useful to finalize draw calls with DRAW_DEFERRED
  // when there is no imminent next frame to process.
  void readPixels();
  void draw(GLuint cameraTexture);
  // Initialize the renderer to process an input with size specified by srcWidth and srcHeight.
  void initialize(HandVisibleShader *shader, int srcWidth, int srcHeight);

  HandVisibleRenderer() = default;

  // Default move constructors.
  HandVisibleRenderer(HandVisibleRenderer &&o) = default;
  HandVisibleRenderer &operator=(HandVisibleRenderer &&o) = default;

  // Disallow copying.
  HandVisibleRenderer(const HandVisibleRenderer &) = delete;
  HandVisibleRenderer &operator=(const HandVisibleRenderer &) = delete;

private:
  GlVertexArray quad_;
  GlFramebufferObject dest1_;
  GlFramebufferObject smoothed_;
  GlFramebufferObject edge_;
  RGBA8888PlanePixelBuffer outpix_;

  int inputWidth_ = 0;
  int inputHeight_ = 0;
  int texWidth_ = 0;
  int texHeight_ = 0;

  HandVisibleShader *shaders_ = nullptr;
  void drawTexture(GlTexture cameraTexture);
  void drawStage(GlTexture src, GlFramebufferObject *dest, const GlProgramObject *shader);
};

}  // namespace c8
