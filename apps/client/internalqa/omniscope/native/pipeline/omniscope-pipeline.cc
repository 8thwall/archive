// Copyright (c) 2016 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "omniscope-pipeline.h",
  };
  visibility = {
    "//apps/client/internalqa/omniscope:__subpackages__",
  };
  deps = {
    ":omniscope-frame",
    ":omniscope-processor",
    "//apps/client/internalqa/omniscope/native:omniscope-app",
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//c8:exceptions",
    "//c8:staged-ring-buffer",
    "//c8/geometry:pixel-pinhole-camera-model",
    "//c8/pixels",
    "//c8/pixels/opengl:gl-headers",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/protolog:xr-requests",
    "//c8/stats:scope-timer",
    "//c8/stats:self-timing-scope-lock",
    "//c8/time:now",
    "//reality/app/xr/common:camera-framework",
    "//reality/engine/api:reality.capnp-cc",
    "//reality/engine/executor:xr-engine",
    "//reality/engine/logging:remote-streamer",
    "//reality/engine/logging:xr-log-preparer",
  };
}
cc_end(0xae8760bd);

#include "apps/client/internalqa/omniscope/native/pipeline/omniscope-pipeline.h"
#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/exceptions.h"
#include "c8/geometry/pixel-pinhole-camera-model.h"
#include "c8/io/capnp-messages.h"
#include "c8/pixels/opengl/gl.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/protolog/xr-requests.h"
#include "c8/stats/scope-timer.h"
#include "c8/stats/self-timing-scope-lock.h"
#include "c8/time/now.h"

using MutableRealityRequest = c8::MutableRootMessage<c8::RealityRequest>;
using MutableRealityResponse = c8::MutableRootMessage<c8::RealityResponse>;
using ConstRealityRequest = c8::ConstRootMessage<c8::RealityRequest>;
using ConstRealityResponse = c8::ConstRootMessage<c8::RealityResponse>;

namespace c8 {

// Singleton used across Unity threads.
OmniscopePipeline *OmniscopePipeline::xr_ = nullptr;

OmniscopePipeline::OmniscopePipeline(bool showDemoViewsOnly)
    : showDemoViewsOnly_(showDemoViewsOnly) {}

void OmniscopePipeline::createCaptureContext(void *sharedContext, bool useExternalOesTexture) {
  C8Log("[omniscope-pipeline] createCaptureContext(%p, %d)", sharedContext, useExternalOesTexture);
  glProcessor_.reset(new OmniscopeProcessor(sharedContext, useExternalOesTexture));
}

void OmniscopePipeline::initializeCameraPipeline(int captureWidth, int captureHeight) {
  C8Log("[omniscope-pipeline] initializeCameraPipeline(%d, %d)", captureWidth, captureHeight);
  sourceTexture_ = glProcessor_->createSourceTexture(captureWidth, captureHeight);

  if (app_ == nullptr) {
    C8Log("[omniscope-pipeline] new app_");
    app_.reset(new OmniscopeApp());
    if (showDemoViewsOnly_) {
      app_->setViewGroup(UITEST_VIEW_GROUP);
    } else {
      app_->setViewGroup(FEATURES_VIEW_GROUP);
    }
  } else {
    C8Log("[omniscope-pipeline] app_->initializeViews()");
    app_->initializeViews();
    needsViewConfig_ = true;
  }

  C8Log("[omniscope-pipeline] new displayFrame_");
  displayFrame_.reset(new OmniscopeFrame(captureWidth, captureHeight));

  C8Log("[omniscope-pipeline] new StagedRingBuffer");
  ring_.reset(new StagedRingBuffer<OmniscopeFrame, OmniscopeFrameStage>(
    3,
    {OmniscopeFrameStage::CAPTURE_AND_PROCESS_GPU,
     OmniscopeFrameStage::PROCESS_CPU,
     OmniscopeFrameStage::RENDER},
    captureWidth,
    captureHeight));
  C8Log("[omniscope-pipeline] initializeCameraPipeline done");

  captureWidth_ = captureWidth;
  captureHeight_ = captureHeight;
  if (captureHeight_ < captureWidth_) {
    std::swap(captureHeight_, captureWidth_);
  }
}

void OmniscopePipeline::processGlFrameAndStageRequest(
  const float mtx[16], const ConstRootMessage<RealityRequest> &request) {
  auto stage = ring_->getStage(OmniscopeFrameStage::CAPTURE_AND_PROCESS_GPU);
  if (!stage.hasValue()) {
    return;
  }
  ScopeTimer t("gl-frame-stage");

  if (needsViewConfig_) {
    needsViewConfig_ = false;
    AppConfiguration appConfig;
    appConfig.rotation = 0;  // TODO(nb): get from request
    appConfig.captureWidth = captureWidth_;
    appConfig.captureHeight = captureHeight_;
    appConfig.deviceInfo = request.reader().getDeviceInfo();
    appConfig.deviceModel = DeviceInfos::getDeviceModel(request.reader().getDeviceInfo());
    C8Log("[omniscope-pipeline] app_.current()->configure");
    app_->current()->configure(appConfig);
    needsDisplayFrameInvalidate_ = true;
  }

  // Run GPU processing on the frame.
  // C8Log("[omniscope-native] get stage OmniscopeFrameStage::CAPTURE_AND_PROCESS_GPU");
  OmniscopeFrame &frame = stage.get();

  if (frame.frame.viewData == nullptr) {
    app_->current()->initialize(frame.frame.viewData);
  }

  frame.frame.frameData.cameraTexture = frame.displayRgba.tex().id();
  frame.frame.frameData.cameraBuffer = frame.displayRgba.id();
  frame.frame.frameData.devicePose =
    toQuaternion(request.reader().getSensors().getPose().getDevicePose());
  frame.frame.frameData.videoTimeNanos =
    request.reader().getSensors().getCamera().getCurrentFrame().getVideoTimestampNanos();
  frame.frame.frameData.frameTimeNanos =
    request.reader().getSensors().getCamera().getCurrentFrame().getFrameTimestampNanos();
  frame.frame.frameData.timeNanos =
    request.reader().getSensors().getCamera().getCurrentFrame().getTimestampNanos();

  glProcessor_->processGlFrame(mtx, frame, app_->current());
}

void OmniscopePipeline::destroyCaptureContext() {
  C8Log("[omniscope-pipeline] destroyCaptureContext");
  // First delete the ring buffer while the GL context is still alive.
  if (ring_ != nullptr) {
    ring_->pauseAndClear();
  }
  app_->clearViews();
  // needsViewConfig_ = true;
  ring_.reset(nullptr);

  displayFrame_.reset(nullptr);

  sourceTexture_ = 0;

  // Then delete the processor and GL context.
  glProcessor_.reset(nullptr);
}

kj::ArrayPtr<const uint8_t> OmniscopePipeline::executeStagedRequestAndGetSerializedResponsePtr() {
  // Grab the processing stage while doing work here.
  auto stage = ring_->getStage(OmniscopeFrameStage::PROCESS_CPU);
  if (!stage.hasValue()) {
    return lastRealityResponse_.bytes();
  }
  // C8Log("[omniscope-pipeline] get stage OmniscopeFrameStage::PROCESS_CPU");
  ScopeTimer t("native-exec-staged");
  OmniscopeFrame &frame = stage.get();

  // Set the RGBA display texture.
  app_->current()->processCpu(frame.frame.viewData.get());

  MutableRealityResponse realityResponseMessage;
  auto responseBuilder = realityResponseMessage.builder();

  auto tex = frame.frame.viewData->displayTex();
  responseBuilder.getEventId().setEventTimeMicros(nowMicros());
  responseBuilder.getRgbaTexture().setPtr(tex.id());
  responseBuilder.getRgbaTexture().setWidth(tex.width());
  responseBuilder.getRgbaTexture().setHeight(tex.height());
  lastRealityResponse_ = ConstRealityResponse(realityResponseMessage);

  // C8Log("[omniscope-pipeline] end stage OmniscopeFrameStage::PROCESS_CPU");
  return lastRealityResponse_.bytes();
}

void OmniscopePipeline::renderFrameForDisplay() {
  // Hold on to the render stage until the next call to renderFrameForDisplay, since we don't know
  // when it would otherwise be free to release.
  if (ring_ == nullptr) {
    // renderFrameForDisplay may be called directly from unity, without going through the java
    // version which does safe shutdown checks.
    return;
  }
  auto renderStage = ring_->getStage(OmniscopeFrameStage::RENDER);
  if (!renderStage.hasValue()) {
    return;
  }
  ScopeTimer t("render-frame-for-display");
  // C8Log("[omniscope-pipeline] get stage OmniscopeFrameStage::RENDER");
  auto &renderstage = renderStage.get();
  app_->current()->renderDisplay(renderstage.frame.viewData.get());

  flushToScreen(renderstage);

  if (needsDisplayFrameInvalidate_) {
    displayFrame_->frame.viewData.reset(nullptr);
    needsDisplayFrameInvalidate_ = false;
  }

  std::swap(*displayFrame_, renderstage);

  // C8Log("[omniscope-pipeline] end stage OmniscopeFrameStage::RENDER");
}

void OmniscopePipeline::flushToScreen(OmniscopeFrame &renderFrame) {
  if (renderFrame.frame.viewData == nullptr) {
    C8Log("[omniscope-pipeline] flushToScreen: viewData is null");
    return;
  }
  auto &viewData = *renderFrame.frame.viewData;
  int displayBuffer = viewData.displayBuffer();
  if (displayBuffer == 0) {
    C8Log("[omniscope-pipeline] flushToScreen: displayRgba.id() is 0");
    return;
  }

  auto outTex = viewData.displayTex();
  auto displayWidth = displayWidth_;
  auto displayHeight = displayHeight_;
  auto outWidth = outTex.width();
  auto outHeight = outTex.height();

  // Keep the same aspect ratio as the input frame for the rendered content.
  const auto frameAspectRatio = static_cast<float>(outWidth) / outHeight;
  if (displayHeight > displayWidth) {
    displayWidth = static_cast<int>(displayHeight * frameAspectRatio);
  } else {
    displayHeight = static_cast<int>(displayWidth / frameAspectRatio);
  }

  int interpolation =
    displayWidth == outWidth && displayHeight == outHeight ? GL_NEAREST : GL_LINEAR;

  glBindFramebuffer(GL_FRAMEBUFFER, 0);
  glViewport(0, 0, displayWidth, displayHeight);
  glClearColor(0.1f, 0.0f, 0.1f, 1.0f);  // Dark purple, for debugging.
  glClear(GL_COLOR_BUFFER_BIT);
  glBindFramebuffer(GL_READ_FRAMEBUFFER, displayBuffer);
  glBindFramebuffer(GL_DRAW_FRAMEBUFFER, 0);
  glBlitFramebuffer(
    0,
    0,
    outWidth,
    outHeight,
    0,
    displayHeight,  // Flip the image.
    displayWidth,
    0,  // Flip the image.
    GL_COLOR_BUFFER_BIT,
    interpolation);
  glFlush();

  // Unbind read buffer; write buffer (screen, id 0) is effectively already unbound.
  glBindFramebuffer(GL_READ_FRAMEBUFFER, 0);
}

void OmniscopePipeline::goNext() {
  if (app_ == nullptr) {
    return;
  }
  ring_->pauseAndClear();
  app_->goNext();
  needsViewConfig_ = true;
  auto *frames = ring_->getRawFramesIfPaused();
  for (auto &frame : *frames) {
    frame.frame.viewData.reset(nullptr);
  }
  ring_->resume();
}

void OmniscopePipeline::goPrev() {
  if (app_ == nullptr) {
    return;
  }
  ring_->pauseAndClear();
  app_->goPrev();
  needsViewConfig_ = true;
  ring_->resume();
}

void OmniscopePipeline::setView(int num) {
  if (app_ == nullptr || num == currentView()) {
    return;
  }
  ring_->pauseAndClear();
  app_->setView(num);
  needsViewConfig_ = true;
  ring_->resume();
}

void OmniscopePipeline::gotTouches(int count) {
  ScopeTimer rt("handle-touches");
  C8Log("[omniscope-native] Got %d touches", count);
  Vector<Touch> touches(count);
  app_->current()->gotTouches(touches);
}

void OmniscopePipeline::pause() {
  // Pause the ring buffer to free up all threads.
  if (ring_ != nullptr) {
    ring_->pauseAndClear();
  }
  logPreparer_.endLoggingSession(ScopeTimer::summarizer());
}

void OmniscopePipeline::resume() {
  if (ring_ != nullptr) {
    ring_->resume();
  }
  logPreparer_.startNewLoggingSession();
}

void OmniscopePipeline::configure(const XRConfiguration::Reader &config) {
  C8Log("[omniscope-pipeline] configure:");
  C8LogCapnpMessage(config);
  if (config.hasGraphicsIntrinsics()) {
    displayWidth_ = config.getGraphicsIntrinsics().getTextureWidth();
    displayHeight_ = config.getGraphicsIntrinsics().getTextureHeight();
  }
}

std::unique_ptr<Vector<uint8_t>> OmniscopePipeline::getAndResetAnalyticsRecord(
  const LogRecordHeader::Reader &logRecordHeader) {
  auto logRecord = logPreparer_.prepareLogForUpload(logRecordHeader, ScopeTimer::summarizer());
  ScopeTimer::reset();
  return logRecord;
}

OmniscopePipeline *OmniscopePipeline::createInstance(bool showDemoViewsOnly) {
  if (xr_ != nullptr) {
    C8_THROW(
      "[omniscope-pipeline] Attempting to create multiple engines. Destroy the previous before "
      "creating a new one.");
  }

  xr_ = new OmniscopePipeline(showDemoViewsOnly);
  return xr_;
}

OmniscopePipeline *OmniscopePipeline::getInstance() {
  if (xr_ == nullptr) {
    C8_THROW("[omniscope-pipeline] Attempting to get engine instance before it's created.");
  }

  return xr_;
}

bool OmniscopePipeline::hasInstance() { return xr_ != nullptr; }

void OmniscopePipeline::destroyInstance() {
  if (xr_ != nullptr) {
    delete xr_;
    xr_ = nullptr;
  }
}

}  // namespace c8
