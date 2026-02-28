// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <functional>
#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/geometry/intrinsics.h"
#include "c8/pixels/gpu-pixels-resizer.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/render/renderer.h"
#include "c8/quaternion.h"
#include "reality/engine/api/reality.capnp.h"
#include "reality/engine/ears/ear-roi-renderer.h"
#include "reality/engine/faces/face-roi-renderer.h"
#include "reality/engine/faces/face-roi-shader.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/hands/hand-roi-renderer.h"

namespace c8 {

using TexCopier = std::function<void(GlTexture src, GlFramebufferObject *dest)>;
using TexWarper = std::function<void(const HMatrix &mat, GlTexture src, GlFramebufferObject *dest)>;

// A data producer that produces a Gr8 feature pyramid.
class FeaturesDataProducer : public GlDataProducer {
public:
  FeaturesDataProducer(
    AppConfiguration appConfig, Gr8FeatureShader *glShader, bool hasHiResScans = false);
  void drawGl(FrameData &in) override;
  void readGl() override;

  void setNextImageRoi(ImageRoi imageRoi) { imageRoi_ = imageRoi; }

  Gr8Pyramid pyramid() const { return gl_.pyramid(); }
  GlRealityFrame &gl() { return gl_; }

private:
  GlRealityFrame gl_;
  static constexpr int PYR_SIZE = 1024;
  bool hasHiResScans_;
  c8_PixelPinholeCameraModel searchK_;
  ImageRoi imageRoi_;
};

class GravityWarpProducer : public GlDataProducer {
public:
  enum class WarpType {
    NONE,
    HORIZONTAL,
    VERTICAL,
  };

  GravityWarpProducer(const AppConfiguration &appConfig, TexWarper *warpTexture);
  void drawGl(FrameData &in) override;
  void readGl() override {}
  void setWarpType(WarpType warpType) { warpType_ = warpType; }

  GlTexture displayTex() const { return dest_.tex().tex(); }
  GLuint displayBuffer() const { return dest_.id(); }

private:
  AppConfiguration appConfig_;
  GlFramebufferObject dest_;
  TexWarper *warpTexture_;
  WarpType warpType_ = WarpType::NONE;
};

// A data producer that produces ROIs for faces.
class FaceRoiDataProducer : public GlDataProducer {
public:
  FaceRoiDataProducer(AppConfiguration appConfig, FaceRoiShader *glShader);
  void drawGl(FrameData &in) override;
  void readGl() override;

  FaceRoiRenderer &renderer() { return renderer_; }

private:
  FaceRoiRenderer renderer_;
};

// A data producer that produces ROIs for faces and ears.
class EarRoiDataProducer : public GlDataProducer {
public:
  EarRoiDataProducer(AppConfiguration appConfig, FaceRoiShader *glShader);
  void drawGl(FrameData &in) override;
  void readGl() override;

  FaceRoiRenderer &faceRenderer() { return faceRenderer_; }
  EarRoiRenderer &earRenderer() { return earRenderer_; }

private:
  FaceRoiRenderer faceRenderer_;
  EarRoiRenderer earRenderer_;
};

// A data producer that produces ROIs for hands.
class HandRoiDataProducer : public GlDataProducer {
public:
  HandRoiDataProducer(
    AppConfiguration appConfig,
    int localRoiSize,
    const std::shared_ptr<HandRoiRenderer> &handRenderer,
    FaceRoiShader *glShader);
  void drawGl(FrameData &in) override;
  void readGl() override;

  HandRoiRenderer &renderer() { return (*renderer_); }

private:
  // There are two data producers, but we want only one renderer.  There is only one renderer
  // in handcontroller.cc as well.
  std::shared_ptr<HandRoiRenderer> renderer_;
};

// A data producer that resizes images by scaling and letterboxing. It rotates the
// images as necessary.
class ResizedDataProducer : public GlDataProducer {
public:
  ResizedDataProducer(AppConfiguration appConfig, int previewWidth, int previewHeight);
  void drawGl(FrameData &in) override;
  void readGl() override;

  GpuPixelsResizer &gpuResizer() { return gpuResizer_; }
  ConstRGBA8888PlanePixels image() const;

private:
  GpuPixelsResizer gpuResizer_;
  int captureWidth_ = 0;
  int captureHeight_ = 0;
  int previewWidth_ = 0;
  int previewHeight_ = 0;
  RGBA8888PlanePixels image_;
};

// A data producer that produces a low res copy of the camera feed in a pixel buffer.
class CameraPreviewDataProducer : public GlDataProducer {
public:
  ConstRGBA8888PlanePixels cameraPreview() const { return camDisplayBuf_.pixels(); }
  RGBA8888PlanePixels cameraPreview() { return camDisplayBuf_.pixels(); }

  CameraPreviewDataProducer(
    AppConfiguration appConfig, int previewWidth, int previewHeight, TexCopier *copyTexture);

  void drawGl(FrameData &in) override;
  void readGl() override;

private:
  AppConfiguration appConfig_;
  GlFramebufferObject dest_;
  TexCopier *copyTexture_;
  RGBA8888PlanePixelBuffer camDisplayBuf_;
};

// A texture renderer that owns a pixel buffer, and will upload any data that gets written to it to
// a texture.
class PixelBufferTextureRenderer : public GlTextureRenderer {
public:
  PixelBufferTextureRenderer(int width, int height);
  void renderDisplay() override;
  GlTexture displayTex() override { return dest_.tex().tex(); }
  int displayBuffer() override { return dest_.id(); }

  RGBA8888PlanePixels displayBuf() { return displayBuf_.pixels(); }

private:
  GlFramebufferObject dest_;
  RGBA8888PlanePixelBuffer displayBuf_;
};

// A texture renderer that renders pixels that it doesn't own. These pixels should still be owned by
// some component of the viewdata, typically one of the data producers. This allows us to skip an
// in-cpu copy when rendering.
class ProducedPixelsTextureRenderer : public GlTextureRenderer {
public:
  void renderDisplay() override;
  GlTexture displayTex() override { return dest_.tex().tex(); }
  int displayBuffer() override { return dest_.id(); }

  void setPixels(ConstRGBA8888PlanePixels pixels);

private:
  GlFramebufferObject dest_;
  ConstRGBA8888PlanePixels pixels_;
};

// A texture renderer that renders a texture that it doesn't own. These texture should still be
// owned by some component of the viewdata, typically one of the data producers. This allows us to
// skip reading back the texture at all.
class RawTextureRenderer : public GlTextureRenderer {
public:
  RawTextureRenderer(int width, int height);
  void renderDisplay() override {};
  GlTexture displayTex() override { return displayTex_; }
  int displayBuffer() override { return displayBuffer_; }
  void setDisplayTex(int displayBuffer, GlTexture displayTex) {
    displayBuffer_ = displayBuffer;
    displayTex_ = displayTex;
  }

private:
  GlTexture displayTex_;
  int displayBuffer_ = 0;
};

// A texture renderer that renders an object8 scene graph. The actual renderer and scene
// should be owned by the rendering thread, and "render" should be called on every frame or
// when there is a user-triggered update to the scene, e.g. updating camera position.
// This object will invoke the renderer's render method and keep a pointer to the result.
class Object8Renderer : public GlTextureRenderer {
public:
  Object8Renderer(int width, int height);
  void renderDisplay() override {};
  GlTexture displayTex() override { return displayTex_; }
  int displayBuffer() override { return displayBuffer_; }

  // Render the scene assuming there is exactly one camera in the scene.
  void render(Renderer &renderer, Scene &scene);

  // Render the scene with the specified camera.
  void render(Renderer &renderer, Scene &scene, Camera &camera);

private:
  GlTexture displayTex_;
  int displayBuffer_ = 0;
};

namespace ViewDataGen {

// ViewData that creates a low-res camera feed preview and computes a feature pyramid. The pyramid
// and the camera preview have the same size. The user requests an output canvas at a specified
// size, and is responsible for all drawing operations into that canvas.
std::unique_ptr<OmniscopeViewData> cameraFeaturesCanvas(
  AppConfiguration appConfig,
  int canvasWidth,
  int canvasHeight,
  Gr8FeatureShader *glShader,
  TexCopier *texCopier);

// ViewData that creates a low-res camera feed preview. The user requests an output canvas at a
// specified size, and is responsible for all drawing operations into that canvas.
std::unique_ptr<OmniscopeViewData> cameraOnlyCanvas(
  AppConfiguration appConfig, int canvasWidth, int canvasHeight, TexCopier *texCopier);

// ViewData that creates a low-res camera feed preview and then displays that preview directly. Any
// modifications made to the cameraPreview() pixels during processCpu will be reflected in the
// display.
std::unique_ptr<OmniscopeViewData> cameraPreview(
  AppConfiguration appConfig, int width, int height, TexCopier *texCopier);

// ViewData that creates a low-res camera feed preview and computes a feature pyramid. The pyramid
// and the camera preview have the same size. Displays the camera preview directly. Any
// modifications made to the cameraPreview() pixels during processCpu will be reflected in the
// display.
std::unique_ptr<OmniscopeViewData> cameraPreviewFeatures(
  AppConfiguration appConfig, Gr8FeatureShader *glShader, TexCopier *texCopier);

// ViewData class that creates and displays a user-requested-size display buffer. No work is done to
// process the camera feed.
std::unique_ptr<OmniscopeViewData> canvasOnly(AppConfiguration appConfig, int width, int height);

// ViewData that computes a feature pyramid but doesn't copy the camera feed. The user requests an
// output canvas at a specified size, and is responsible for all drawing operations into that
// canvas.
std::unique_ptr<OmniscopeViewData> featuresOnlyCanvas(
  AppConfiguration appConfig, Gr8FeatureShader *glShader);

// ViewData that only displays the source camera texture without any modification. This factory
// configures the renderer, but the caller must still pass in the camera texture on each frame.
std::unique_ptr<OmniscopeViewData> rawCameraTextrue(const AppConfiguration &appConfig);

// ViewData that can be used to render a c8::Scene. Views that use this view data should collect
// data for scene updates in the processCpu stage, and then perform all scene updates in their own
// renderDisplay method. Data is passed to renderDisplay through a user defined CpuData type. At
// least once a frame, the Object8Renderer's render method should be called, although if playback is
// paused but user actions need to trigger a re-render, render should be called again. Views that
// use this viewdata will need their own renderer and scene, and those should only be accessed from
// their renderDisplay method.
template <typename CpuData>
std::unique_ptr<OmniscopeViewData> sceneRenderer(
  const AppConfiguration &appConfig, int width, int height) {
  auto viewData = std::make_unique<OmniscopeViewData>(appConfig);
  viewData->setRenderer(std::make_unique<Object8Renderer>(width, height))
    ->setCpuProcessingResult(std::make_unique<CpuData>());
  return viewData;
}

// ViewData that produces features and can be used to render a c8::Scene. Views that use this view
// data should collect data for scene updates in the processCpu stage, and then perform all scene
// updates in their own renderDisplay method. Data is passed to renderDisplay through a user defined
// CpuData type. At least once a frame, the Object8Renderer's render method should be called,
// although if playback is paused but user actions need to trigger a re-render, render should be
// called again. Views that use this viewdata will need their own renderer and scene, and those
// should only be accessed from their renderDisplay method.
template <typename CpuData>
std::unique_ptr<OmniscopeViewData> featuresObject8Renderer(
  const AppConfiguration &appConfig,
  int width,
  int height,
  Gr8FeatureShader *glShader,
  bool hasHiResScans = false) {
  auto viewData = std::make_unique<OmniscopeViewData>(appConfig);
  viewData->setRenderer(std::make_unique<Object8Renderer>(width, height))
    ->setCpuProcessingResult(std::make_unique<CpuData>())
    ->addProducer(std::make_unique<FeaturesDataProducer>(appConfig, glShader, hasHiResScans));
  return viewData;
}

// ViewData that produces face ROIs and can be used to render a c8::Scene. Views that use this view
// data should collect data for scene updates in the processCpu stage, and then perform all scene
// updates in their own renderDisplay method. Data is passed to renderDisplay through a user defined
// CpuData type. At least once a frame, the Object8Renderer's render method should be called,
// although if playback is paused but user actions need to trigger a re-render, render should be
// called again. Views that use this viewdata will need their own renderer and scene, and those
// should only be accessed from their renderDisplay method.
template <typename CpuData>
std::unique_ptr<OmniscopeViewData> faceRoiObject8Renderer(
  const AppConfiguration &appConfig, int width, int height, FaceRoiShader *shader) {
  auto viewData = std::make_unique<OmniscopeViewData>(appConfig);
  viewData->setRenderer(std::make_unique<Object8Renderer>(width + height, height))
    ->setCpuProcessingResult(std::make_unique<CpuData>())
    ->addProducer(std::make_unique<FaceRoiDataProducer>(appConfig, shader));
  return viewData;
}

// ViewData that produces ear ROIs and can be used to render a c8::Scene. Views that use this view
// data should collect data for scene updates in the processCpu stage, and then perform all scene
// updates in their own renderDisplay method. Data is passed to renderDisplay through a user defined
// CpuData type. At least once a frame, the Object8Renderer's render method should be called,
// although if playback is paused but user actions need to trigger a re-render, render should be
// called again. Views that use this viewdata will need their own renderer and scene, and those
// should only be accessed from their renderDisplay method.
template <typename CpuData>
std::unique_ptr<OmniscopeViewData> earRoiObject8Renderer(
  const AppConfiguration &appConfig, int width, int height, FaceRoiShader *shader) {
  auto viewData = std::make_unique<OmniscopeViewData>(appConfig);
  viewData->setRenderer(std::make_unique<Object8Renderer>(width + height, height))
    ->setCpuProcessingResult(std::make_unique<CpuData>())
    ->addProducer(std::make_unique<EarRoiDataProducer>(appConfig, shader));
  return viewData;
}

// ViewData that produces hand ROIs and can be used to render a c8::Scene. Views that use this view
// data should collect data for scene updates in the processCpu stage, and then perform all scene
// updates in their own renderDisplay method. Data is passed to renderDisplay through a user defined
// CpuData type. At least once a frame, the Object8Renderer's render method should be called,
// although if playback is paused but user actions need to trigger a re-render, render should be
// called again. Views that use this viewdata will need their own renderer and scene, and those
// should only be accessed from their renderDisplay method.
template <typename CpuData>
std::unique_ptr<OmniscopeViewData> handRoiObject8Renderer(
  const AppConfiguration &appConfig,
  int width,
  int height,
  int localRoiSize,
  const std::shared_ptr<HandRoiRenderer> &handRenderer,
  FaceRoiShader *shader) {
  auto viewData = std::make_unique<OmniscopeViewData>(appConfig);
  viewData->setRenderer(std::make_unique<Object8Renderer>(width + height, height))
    ->setCpuProcessingResult(std::make_unique<CpuData>())
    ->addProducer(
      std::make_unique<HandRoiDataProducer>(appConfig, localRoiSize, handRenderer, shader));
  return viewData;
}

}  // namespace ViewDataGen

}  // namespace c8
