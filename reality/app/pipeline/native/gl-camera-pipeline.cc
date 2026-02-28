// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)
#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "gl-camera-pipeline.h",
  };
  deps = {
    ":gpu-frame-processor",
    ":pipeline-frame",
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//c8:exceptions",
    "//c8:staged-ring-buffer",
    "//c8/pixels",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/protolog:xr-requests",
    "//c8/stats:scope-timer",
    "//c8/stats:self-timing-scope-lock",
    "//reality/app/xr/common:camera-framework",
    "//c8/geometry:pixel-pinhole-camera-model",
    "//reality/engine/api:reality.capnp-cc",
  };
}
cc_end(0x95e66403);

#include <capnp/pretty-print.h>
#include <capnp/serialize.h>

#include <sstream>
#include <string>

#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/exceptions.h"
#include "c8/geometry/pixel-pinhole-camera-model.h"
#include "c8/io/capnp-messages.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/protolog/xr-requests.h"
#include "c8/stats/scope-timer.h"
#include "c8/stats/self-timing-scope-lock.h"
#include "c8/time/now.h"
#include "reality/app/pipeline/native/gl-camera-pipeline.h"

namespace c8 {

// Singleton used across Unity threads.
GlCameraPipeline *GlCameraPipeline::pipeline_ = nullptr;

void GlCameraPipeline::createCaptureContext(void *sharedContext) {
  C8Log("[xr-gl-android] createCaptureContext(%p)", sharedContext);
  glProcessor_.reset(new GpuFrameProcessor(sharedContext));
}

void GlCameraPipeline::initializeCameraPipeline(int captureWidth, int captureHeight) {
  C8Log("[xr-gl-android] initializeCameraPipeline(%d, %d)", captureWidth, captureHeight);
  needsViewConfig_ = true;

  C8Log("[xr-gl-android] createSourceTexture(%dx%d)", captureWidth, captureHeight);
  externalSrcTexture_ = glProcessor_->createSourceTexture(captureWidth, captureHeight);

  C8Log("[xr-gl-android] %s", "new displayFrame_");
  displayFrame_.reset(new PipelineFrame(captureWidth, captureHeight));

  C8Log("[xr-gl-android] %s", "new StagedRingBuffer");
  ring_.reset(new StagedRingBuffer<PipelineFrame, PipelineFrameStage>(
    3,
    {PipelineFrameStage::CAPTURE_AND_PROCESS_GPU,
     PipelineFrameStage::PROCESS_CPU,
     PipelineFrameStage::RENDER},
    captureWidth,
    captureHeight));

  C8Log("[xr-gl-android] %s", "initializeCameraPipeline done");
  captureWidth_ = captureWidth;
  captureHeight_ = captureHeight;
  if (captureHeight_ < captureWidth_) {
    std::swap(captureHeight_, captureWidth_);
  }
}

void GlCameraPipeline::processGlFrameAndStageRequest(
  const float mtx[16], const ConstRootMessage<RealityRequest> &request) {
  auto stage = ring_->getStage(PipelineFrameStage::CAPTURE_AND_PROCESS_GPU);
  if (!stage.hasValue()) {
    return;
  }

  if (view_ == nullptr) {
    C8Log("[gl-camera-pipeline] CAPTURE_AND_PROCESS_GPU: No view configured for frame.");
    return;
  }

  ScopeTimer t("pipeline-stage-capture-and-process-gpu");

  if (needsViewConfig_) {
    needsViewConfig_ = false;
    PipelineAppConfiguration appConfig;
    appConfig.rotation = 0;  // TODO(nb): get from request
    appConfig.captureWidth = captureWidth_;
    appConfig.captureHeight = captureHeight_;
    appConfig.deviceInfo = request.reader().getDeviceInfo();
    appConfig.deviceModel = DeviceInfos::getDeviceModel(request.reader().getDeviceInfo());
    C8Log("[omniscope-android] %s", "app_.current()->configure");
    view_->configure(appConfig);
    needsDisplayFrameInvalidate_ = true;
  }

  PipelineFrame &frame = stage.get();

  if (frame.frame.viewData == nullptr) {
    view_->initialize(frame.frame.viewData);
  }

  MutableRootMessage<RealityRequest> realityRequestMessage(request.reader());
  auto requestBuilder = realityRequestMessage.builder();

  // Stage a copy of the request.
  frame.frame.frameData.cameraTexture = frame.displayRgba.tex().id();
  frame.frame.frameData.request = ConstRootMessage<RealityRequest>(realityRequestMessage);

  // Run GPU processing on the frame.
  glProcessor_->processGlFrame(mtx, frame, view_.get());
}

void GlCameraPipeline::destroyCaptureContext() {
  C8Log("[xr-gl-android] %s", "destroyCaptureContext");
  // First delete the ring buffer while the GL context is still alive.
  if (ring_ != nullptr) {
    ring_->pauseAndClear();
  }
  view_.reset(nullptr);
  ring_.reset(nullptr);
  framesReadyForRender_ = 0;

  displayFrame_.reset(nullptr);

  externalSrcTexture_ = 0;

  // Then delete the processor and GL context.
  glProcessor_.reset(nullptr);
}

kj::ArrayPtr<const uint8_t> GlCameraPipeline::executeStagedRequestAndGetSerializedResponsePtr() {
  // Grab the processing stage while doing work here.
  auto stage = ring_->getStage(PipelineFrameStage::PROCESS_CPU);
  if (!stage.hasValue()) {
    return displayFrame_->frame.frameData.response.bytes();
  }
  if (view_ == nullptr) {
    C8Log("[gl-camera-pipeline] PROCESS_CPU: No view configured for frame.");
    return displayFrame_->frame.frameData.response.bytes();
  }
  ScopeTimer t("pipeline-stage-process-cpu");
  PipelineFrame &frame = stage.get();

  if (frame.frame.viewData == nullptr) {
    C8Log("[gl-camera-pipeline] PROCESS_CPU: Skipping uninitialized frame.");
    return displayFrame_->frame.frameData.response.bytes();
  }

  view_->processCpu(frame.frame.viewData.get());

  MutableRootMessage<RealityResponse> realityResponseMessage;
  auto responseBuilder = realityResponseMessage.builder();

  // auto tex = frame.frame.viewData->displayTex();

  responseBuilder.getEventId().setEventTimeMicros(nowMicros());
  // responseBuilder.getRgbaTexture().setPtr(tex.id());
  // responseBuilder.getRgbaTexture().setWidth(tex.width());
  // responseBuilder.getRgbaTexture().setHeight(tex.height());

  frame.frame.frameData.response = ConstRootMessage<RealityResponse>(realityResponseMessage);

  return frame.frame.frameData.response.bytes();
}

kj::ArrayPtr<const uint8_t> GlCameraPipeline::renderFrameForDisplay() {
  if (ring_ == nullptr) {
    // renderFrameForDisplay may be called directly from unity, without going through the java
    // version which does safe shutdown checks.
    return displayFrame_->frame.frameData.response.bytes();
  }

  auto renderStage = ring_->getStage(PipelineFrameStage::RENDER);
  int numFrames = 0;

  if (!renderStage.hasValue()) {
    return displayFrame_->frame.frameData.response.bytes();
  }
  if (view_ == nullptr) {
    C8Log("[gl-camera-pipeline] RENDER: No view configured for frame.");
    return displayFrame_->frame.frameData.response.bytes();
  }

  // Hold on to the render stage until the next call to renderFrameForDisplay, since we don't know
  // when it would otherwise be free to release.
  ScopeTimer t("pipeline-stage-render");
  // C8Log("[omniscope-android] %s", "get statge OmniscopeFrameStage::RENDER");
  auto &renderstage = renderStage.get();
  view_->renderDisplay(renderstage.frame.viewData.get());
  if (needsDisplayFrameInvalidate_) {
    displayFrame_->frame.viewData.reset(nullptr);
    needsDisplayFrameInvalidate_ = false;
  }
  std::swap(*displayFrame_, renderstage);
  return displayFrame_->frame.frameData.response.bytes();
}

// Take ownership of a view.
void GlCameraPipeline::setView(std::unique_ptr<PipelineView> &&view) {
  ring_->pauseAndClear();
  view_ = std::move(view);
  needsViewConfig_ = true;
  ring_->resume();
}

void GlCameraPipeline::pause() {
  // Pause the ring buffer to free up all threads.
  if (ring_ != nullptr) {
    ring_->pauseAndClear();
  }
}

void GlCameraPipeline::resume() {
  if (ring_ != nullptr) {
    ring_->resume();
  }
}

GlCameraPipeline *GlCameraPipeline::createInstance() {
  if (pipeline_ != nullptr) {
    throw new RuntimeError(
      "Attempting to create multiple engines. Destroy the previous before creating a new one.");
  }

  pipeline_ = new GlCameraPipeline();
  return pipeline_;
}

GlCameraPipeline *GlCameraPipeline::getInstance() {
  if (pipeline_ == nullptr) {
    throw new RuntimeError("Attempting to get engine instance before it's created.");
  }

  return pipeline_;
}

bool GlCameraPipeline::hasInstance() { return pipeline_ != nullptr; }

void GlCameraPipeline::destroyInstance() {
  if (pipeline_ != nullptr) {
    delete pipeline_;
    pipeline_ = nullptr;
  }
}

}  // namespace c8
