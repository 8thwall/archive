// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "viewdata.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//c8:c8-log",
    "//c8/geometry:device-pose",
    "//c8:quaternion",
    "//c8/io:capnp-messages",
    "//c8/pixels:gpu-pixels-resizer",
    "//c8/pixels/opengl:gl-error",
    "//c8/pixels/opengl:gl-framebuffer",
    "//c8/pixels/opengl:gl-texture",
    "//c8/pixels/opengl:texture-transforms",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels/render:renderer",
    "//c8/stats:scope-timer",
    "//c8/geometry:intrinsics",
    "//reality/engine/api:reality.capnp-cc",
    "//reality/engine/ears:ear-roi-renderer",
    "//reality/engine/faces:face-roi-renderer",
    "//reality/engine/faces:face-roi-shader",
    "//reality/engine/hands:hand-roi-renderer",
    "//reality/engine/features:gl-reality-frame",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/geometry:image-warp",
  };
}
cc_end(0x506ac8db);

#include <memory>

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "c8/geometry/device-pose.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "reality/engine/geometry/image-warp.h"

namespace c8 {

CameraPreviewDataProducer::CameraPreviewDataProducer(
  AppConfiguration appConfig, int previewWidth, int previewHeight, TexCopier *copyTexture) {
  appConfig_ = appConfig;
  copyTexture_ = copyTexture;

  int camDisplayWidth = previewWidth;
  int camDisplayHeight = previewHeight;

  dest_.initialize(
    makeLinearRGBA8888Texture2D(camDisplayWidth, camDisplayHeight),
    GL_FRAMEBUFFER,
    GL_COLOR_ATTACHMENT0);
  checkGLError("[CameraPreviewDataProducer] initialize");

  camDisplayBuf_ = RGBA8888PlanePixelBuffer(camDisplayHeight, camDisplayWidth);
}

void CameraPreviewDataProducer::drawGl(FrameData &in) {
  ScopeTimer t("camera-preview-data-producer-draw");
  auto ct =
    wrapRGBA8888Texture(in.cameraTexture, appConfig_.captureWidth, appConfig_.captureHeight);
  (*copyTexture_)(ct, &dest_);
  checkGLError("[CameraPreviewDataProducer] drawGl");
}

void CameraPreviewDataProducer::readGl() {
  ScopeTimer t("camera-preview-data-producer-read");
  readFramebufferRGBA8888Pixels(dest_, camDisplayBuf_.pixels());
  checkGLError("[CameraPreviewDataProducer] readGl");
}

FeaturesDataProducer::FeaturesDataProducer(
  AppConfiguration appConfig, Gr8FeatureShader *glShader, bool hasHiResScans)
    : hasHiResScans_{hasHiResScans} {
  gl_.initialize(glShader, appConfig.captureWidth, appConfig.captureHeight, appConfig.rotation);

  auto l0 = gl_.pyramid().levels[0];
  searchK_ = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(appConfig.deviceModel), l0.w, l0.h);
  checkGLError("[FeaturesDataProducer] initialize");
}

void FeaturesDataProducer::drawGl(FrameData &in) {
  ScopeTimer t("feature-data-producer-draw");
  if (hasHiResScans_) {
    gl_.addNextDrawRoi(imageRoi_);
    gl_.addNextDrawHiResScans(searchK_, {0.0f, 0.0f});
  }

  gl_.draw(in.cameraTexture, GlRealityFrame::Options::DEFER_READ_RESTORE_STATE);
  checkGLError("[FeaturesDataProducer] drawGl");
}

void FeaturesDataProducer::readGl() {
  ScopeTimer t("feature-data-producer-read");
  gl_.readPixels();
  checkGLError("[FeaturesDataProducer] readGl");
}

GravityWarpProducer::GravityWarpProducer(const AppConfiguration &appConfig, TexWarper *warpTexture)
    : appConfig_{appConfig}, warpTexture_{warpTexture} {
  dest_.initialize(
    makeLinearRGBA8888Texture2D(appConfig.captureWidth, appConfig.captureHeight),
    GL_FRAMEBUFFER,
    GL_COLOR_ATTACHMENT0);
  checkGLError("[GravityWarpProducer] initialize");
}

void GravityWarpProducer::drawGl(FrameData &in) {
  ScopeTimer t("gravity-warp-producer-draw");
  auto xrDevicePose = xrRotationFromDeviceRotation(in.devicePose);

  auto intrinsics = Intrinsics::getProcessingIntrinsics(
    appConfig_.deviceModel, appConfig_.captureWidth, appConfig_.captureHeight);

  auto wrappedCamTex =
    wrapRGBA8888Texture(in.cameraTexture, appConfig_.captureWidth, appConfig_.captureHeight);

  switch (warpType_) {
    case WarpType::HORIZONTAL:
      (*warpTexture_)(glScaledHorizontalWarp(intrinsics, xrDevicePose), wrappedCamTex, &dest_);
      break;
    case WarpType::VERTICAL:
      (*warpTexture_)(glScaledVerticalWarp(intrinsics, xrDevicePose), wrappedCamTex, &dest_);
      break;
    case WarpType::NONE:
    default:
      (*warpTexture_)(HMatrixGen::i(), wrappedCamTex, &dest_);
      break;
  }
  checkGLError("[GravityWarpProducer] drawGl");
}

FaceRoiDataProducer::FaceRoiDataProducer(AppConfiguration appConfig, FaceRoiShader *shader) {
  renderer_.initialize(shader, appConfig.captureWidth, appConfig.captureHeight);
  checkGLError("[FaceRoiDataProducer] initialize");
}

void FaceRoiDataProducer::drawGl(FrameData &in) {
  ScopeTimer t("face-roi-data-producer-draw");
  renderer_.draw(in.cameraTexture, GpuReadPixelsOptions::DEFER_READ);
  checkGLError("[FaceRoiDataProducer] drawGl");
}

void FaceRoiDataProducer::readGl() {
  ScopeTimer t("face-roi-data-producer-read");
  renderer_.readPixels();
  checkGLError("[FaceRoiDataProducer] readGl");
}

EarRoiDataProducer::EarRoiDataProducer(AppConfiguration appConfig, FaceRoiShader *shader) {
  faceRenderer_.initialize(shader, appConfig.captureWidth, appConfig.captureHeight);
  checkGLError("[EarRoiDataProducer] faceRenderer_ initialize");
  earRenderer_.initialize(shader, appConfig.captureWidth, appConfig.captureHeight);
  checkGLError("[EarRoiDataProducer] earRenderer_ initialize");
}

void EarRoiDataProducer::drawGl(FrameData &in) {
  ScopeTimer t("ear-roi-data-producer-draw");
  faceRenderer_.draw(in.cameraTexture, GpuReadPixelsOptions::DEFER_READ);
  checkGLError("[EarRoiDataProducer] faceRenderer_ drawGl");
  earRenderer_.draw(in.cameraTexture, GpuReadPixelsOptions::DEFER_READ);
  checkGLError("[EarRoiDataProducer] earRenderer_ drawGl");
}

void EarRoiDataProducer::readGl() {
  ScopeTimer t("ear-roi-data-producer-read");
  faceRenderer_.readPixels();
  checkGLError("[EarRoiDataProducer] faceRenderer_ readGl");
  earRenderer_.readPixels();
  checkGLError("[EarRoiDataProducer] earRenderer_ readGl");
}

HandRoiDataProducer::HandRoiDataProducer(
  AppConfiguration appConfig,
  int localRoiSize,
  const std::shared_ptr<HandRoiRenderer> &handRenderer,
  FaceRoiShader *shader) {
  renderer_ = handRenderer;
  renderer_->initialize(shader, appConfig.captureWidth, appConfig.captureHeight, localRoiSize);
  checkGLError("[HandRoiDataProducer] initialize");
}

void HandRoiDataProducer::drawGl(FrameData &in) {
  ScopeTimer t("hand-roi-data-producer-draw");
  renderer_->draw(in.cameraTexture, GpuReadPixelsOptions::DEFER_READ);
  checkGLError("[HandRoiDataProducer] drawGl");
}

void HandRoiDataProducer::readGl() {
  ScopeTimer t("hand-roi-data-producer-read");
  renderer_->readPixels();
  checkGLError("[HandRoiDataProducer] readGl");
}

ResizedDataProducer::ResizedDataProducer(
  AppConfiguration appConfig, int previewWidth, int previewHeight) {
  captureWidth_ = appConfig.captureWidth;
  captureHeight_ = appConfig.captureHeight;
  previewWidth_ = previewWidth;
  previewHeight_ = previewHeight;
}

void ResizedDataProducer::drawGl(FrameData &in) {
  ScopeTimer t("resized-data-producer-draw");
  auto tex = wrapRGBA8888Texture(in.cameraTexture, captureWidth_, captureHeight_);
  gpuResizer_.drawNextImage();
  gpuResizer_.draw(tex, previewWidth_, previewHeight_);
  checkGLError("[ResizedDataProducer] drawGl");
}

void ResizedDataProducer::readGl() {
  ScopeTimer t("resized-data-producer-read");
  gpuResizer_.read();

  if (gpuResizer_.hasImage()) {
    image_ = gpuResizer_.claimImage();
  }
  checkGLError("[ResizedDataProducer] readGl");
}

ConstRGBA8888PlanePixels ResizedDataProducer::image() const { return image_; }

PixelBufferTextureRenderer::PixelBufferTextureRenderer(int width, int height) {
  displayBuf_ = RGBA8888PlanePixelBuffer(height, width);
  dest_ = makeLinearRGBA8888Framebuffer(width, height);
  checkGLError("[PixelBufferTextureRenderer] makeLinearRGBA8888Framebuffer");
}

void PixelBufferTextureRenderer::renderDisplay() {
  auto displayTex_ = displayTex();
  displayTex_.bind();
  checkGLError("[PixelBufferTextureRenderer] tex().bind()");

  displayTex_.setPixels(displayBuf_.pixels().pixels());
  checkGLError("[PixelBufferTextureRenderera] setPixels");
}

void ProducedPixelsTextureRenderer::renderDisplay() {
  auto displayTex_ = displayTex();
  displayTex_.bind();
  checkGLError("[ProducedPixelsTextureRenderer] tex().bind()");

  displayTex_.setPixels(pixels_.pixels());
  checkGLError("[ProducedPixelsTextureRenderer] setPixels");
}

void ProducedPixelsTextureRenderer::setPixels(ConstRGBA8888PlanePixels pixels) {
  pixels_ = pixels;
  auto displayTex_ = displayTex();
  if (pixels_.rows() != displayTex_.height() || pixels_.cols() != displayTex_.width()) {
    dest_ = makeLinearRGBA8888Framebuffer(pixels_.cols(), pixels_.rows());
    checkGLError("[ProducedPixelsTextureRenderer] setPixels");
  }
}

RawTextureRenderer::RawTextureRenderer(int width, int height) {
  displayTex_ = wrapRGBA8888Texture(0, width, height);
}

Object8Renderer::Object8Renderer(int width, int height) {
  displayTex_ = wrapRGBA8888Texture(0, width, height);
}

void Object8Renderer::render(Renderer &renderer, Scene &scene) {
  render(renderer, scene, scene.find<Camera>());
}

void Object8Renderer::render(Renderer &renderer, Scene &scene, Camera &camera) {
  auto result = renderer.render(scene);
  displayBuffer_ = result.bufferId;
  displayTex_ = wrapRGBA8888Texture(result.texId, result.width, result.height);
}

namespace ViewDataGen {

std::unique_ptr<OmniscopeViewData> cameraFeaturesCanvas(
  AppConfiguration appConfig,
  int canvasWidth,
  int canvasHeight,
  Gr8FeatureShader *glShader,
  TexCopier *texCopier) {
  auto viewData = std::make_unique<OmniscopeViewData>(appConfig);
  viewData->setRenderer(std::make_unique<PixelBufferTextureRenderer>(canvasWidth, canvasHeight))
    ->addProducer(std::make_unique<FeaturesDataProducer>(appConfig, glShader));

  auto l = viewData->producer<FeaturesDataProducer>().pyramid().levels[0];
  viewData->addProducer(
    std::make_unique<CameraPreviewDataProducer>(appConfig, l.w, l.h, texCopier));
  return viewData;
}

std::unique_ptr<OmniscopeViewData> cameraOnlyCanvas(
  AppConfiguration appConfig, int canvasWidth, int canvasHeight, TexCopier *texCopier) {
  auto viewData = std::make_unique<OmniscopeViewData>(appConfig);
  viewData->setRenderer(std::make_unique<PixelBufferTextureRenderer>(canvasWidth, canvasHeight))
    ->addProducer(std::make_unique<CameraPreviewDataProducer>(appConfig, 480, 640, texCopier));
  return viewData;
}

std::unique_ptr<OmniscopeViewData> cameraPreview(
  AppConfiguration appConfig, int width, int height, TexCopier *texCopier) {
  auto viewData = std::make_unique<OmniscopeViewData>(appConfig);
  viewData->setRenderer(std::make_unique<ProducedPixelsTextureRenderer>())
    ->addProducer(std::make_unique<CameraPreviewDataProducer>(appConfig, width, height, texCopier));
  viewData->renderer<ProducedPixelsTextureRenderer>().setPixels(
    viewData->producer<CameraPreviewDataProducer>().cameraPreview());
  return viewData;
}

std::unique_ptr<OmniscopeViewData> cameraPreviewFeatures(
  AppConfiguration appConfig, Gr8FeatureShader *glShader, TexCopier *texCopier) {
  auto viewData = std::make_unique<OmniscopeViewData>(appConfig);
  viewData->setRenderer(std::make_unique<ProducedPixelsTextureRenderer>())
    ->addProducer(std::make_unique<FeaturesDataProducer>(appConfig, glShader));

  auto l = viewData->producer<FeaturesDataProducer>().pyramid().levels[0];
  viewData->addProducer(
    std::make_unique<CameraPreviewDataProducer>(appConfig, l.w, l.h, texCopier));
  viewData->renderer<ProducedPixelsTextureRenderer>().setPixels(
    viewData->producer<CameraPreviewDataProducer>().cameraPreview());
  return viewData;
}

std::unique_ptr<OmniscopeViewData> canvasOnly(AppConfiguration appConfig, int width, int height) {
  auto viewData = std::make_unique<OmniscopeViewData>(appConfig);
  viewData->setRenderer(std::make_unique<PixelBufferTextureRenderer>(width, height));
  return viewData;
}

std::unique_ptr<OmniscopeViewData> featuresOnlyCanvas(
  AppConfiguration appConfig, Gr8FeatureShader *glShader) {

  auto viewData = std::make_unique<OmniscopeViewData>(appConfig);
  viewData
    ->setRenderer(
      std::make_unique<PixelBufferTextureRenderer>(
        GlRealityFrame::pyrSize(), GlRealityFrame::pyrSize()))
    ->addProducer(std::make_unique<FeaturesDataProducer>(appConfig, glShader));
  return viewData;
}

std::unique_ptr<OmniscopeViewData> rawCameraTextrue(const AppConfiguration &appConfig) {
  auto viewData = std::make_unique<OmniscopeViewData>(appConfig);
  viewData->setRenderer(
    std::make_unique<RawTextureRenderer>(appConfig.captureWidth, appConfig.captureHeight));
  return viewData;
}

}  // namespace ViewDataGen

}  // namespace c8
