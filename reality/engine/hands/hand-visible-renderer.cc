// Copyright (c) 2023 Niantic, Inc.
// Original Author: Dat Chu (datchu@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "hand-visible-renderer.h",
  };
  visibility = {
    "//visibility:public",
  };
  deps = {
    "//c8:c8-log",
    "//c8:exceptions",
    "//c8:hmatrix",
    "//c8:hpoint",
    "//c8:parameter-data",
    "//c8:string",
    "//c8:vector",
    "//c8/geometry:pixel-pinhole-camera-model",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixels",
    "//c8/pixels/opengl:gl-error",
    "//c8/pixels/opengl:gl-framebuffer",
    "//c8/pixels/opengl:gl-headers",
    "//c8/pixels/opengl:gl-program",
    "//c8/pixels/opengl:gl-quad",
    "//c8/pixels/opengl:gl-texture",
    "//c8/stats:scope-timer",
    "//reality/engine/hands/shaders:hand-visible-shader",
  };
}
cc_end(0x82c67bb6);

#include "c8/c8-log.h"
#include "c8/hmatrix.h"
#include "c8/parameter-data.h"
#include "c8/pixels/opengl/gl-error.h"
#include "reality/engine/hands/hand-visible-renderer.h"

namespace c8 {
namespace {
struct Settings {
  // Higher number is less edge
  float edgeSoftness;
  // 0-1
  float edgeThreshold;
  // 0.25+, higher value is more smoothing
  float smoothIntensity;
};

const Settings &settings() {
  static const Settings settings_{
    globalParams().getOrSet("HandVisibleRenderer.edgeSoftness", 6.78f),
    globalParams().getOrSet("HandVisibleRenderer.edgeThreshold", 0.15f),
    globalParams().getOrSet("HandVisibleRenderer.smoothIntensity", 1.0f),
  };
  return settings_;
}
}  // namespace

void HandVisibleRenderer::readPixels() {
  // Copy data to byte array
  glActiveTexture(GL_TEXTURE0);
  dest1_.bind();
  dest1_.tex().bind();

  auto o = outpix_.pixels();
  glReadPixels(0, 0, o.cols(), o.rows(), GL_RGBA, GL_UNSIGNED_BYTE, o.pixels());
}

void HandVisibleRenderer::drawStage(
  GlTexture src, GlFramebufferObject *dest, const GlProgramObject *shader) {
  src.bind();

  shaders_->bind(shader);

  dest->bind();
  checkGLError("[hand-visible-renderer] bind framebuffer");

  glViewport(0, 0, texWidth_, texHeight_);
  glClearColor(0, 0, 0, 1);
  glClear(GL_COLOR_BUFFER_BIT);

  GlVertexArray &quadToDraw = quad_;

  // Load vertex data
  quadToDraw.bind();
  checkGLError("[hand-visible-renderer] bind quad");

  glFrontFace(GL_CCW);

  // This will scale a pixel into uv scale so we can get data around a pixel via sampling
  glUniform2f(shader->location("scale"), 1.0 / texWidth_, 1.0 / texHeight_);
  glUniform1f(shader->location("intensity"), settings().edgeSoftness);
  glUniform1f(shader->location("edgeThreshold"), settings().edgeThreshold);
  glUniform1f(shader->location("smoothIntensity"), settings().smoothIntensity);

  quadToDraw.drawElements();
  checkGLError("[hand-visible-renderer] draw elements (full)");

  quadToDraw.unbind();
  checkGLError("[hand-visible-renderer] quadToDraw unbind");
}

void HandVisibleRenderer::drawTexture(GlTexture cameraTexture) {
  drawStage(cameraTexture, &edge_, shaders_->edgeShader());
  drawStage(cameraTexture, &smoothed_, shaders_->smoothShader());
  drawStage(cameraTexture, &dest1_, shaders_->finalShader());
}

void HandVisibleRenderer::draw(GLuint cameraTexture) {
  auto ct = wrapRGBA8888Texture(cameraTexture, inputWidth_, inputHeight_);
  readPixels();
  drawTexture(ct);
}

// Initialize the renderer to process an input with size specified by srcWidth and srcHeight.
void HandVisibleRenderer::initialize(HandVisibleShader *shader, int srcWidth, int srcHeight) {
  shaders_ = shader;
  inputWidth_ = srcWidth;
  inputHeight_ = srcHeight;
  // output is the same size as input
  texWidth_ = inputWidth_;
  texHeight_ = inputHeight_;
  outpix_ = RGBA8888PlanePixelBuffer(inputWidth_, inputWidth_);
  quad_ = makeVertexArrayRect();
  dest1_ = makeNearestRGBA8888Framebuffer(texWidth_, texHeight_);
  smoothed_ = makeNearestRGBA8888Framebuffer(texWidth_, texHeight_);
  edge_ = makeNearestRGBA8888Framebuffer(texWidth_, texHeight_);
}

}  // namespace c8
