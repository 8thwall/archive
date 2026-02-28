// Copyright (c) 2016 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#ifdef ANDROID

#include "reality/app/xr/android/xr-gl-android.h"

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

using MutableRealityRequest = c8::MutableRootMessage<c8::RealityRequest>;
using MutableRealityResponse = c8::MutableRootMessage<c8::RealityResponse>;
using ConstRealityRequest = c8::ConstRootMessage<c8::RealityRequest>;
using ConstRealityResponse = c8::ConstRootMessage<c8::RealityResponse>;

namespace c8 {

// Singleton used across Unity threads.
XRGLAndroid *XRGLAndroid::xRAndroid_ = nullptr;

void XRGLAndroid::configure(XRConfiguration::Reader config) {
  // Whitelist and merge in fields that will get passed to the engine now and whenever it's rebuilt.
  if (config.hasCoordinateConfiguration()) {
    MutableRootMessage<XRConfiguration> configMessageBuilder;
    configMessageBuilder.builder().setCoordinateConfiguration(config.getCoordinateConfiguration());
    configForEngine_ = ConstRootMessage<XRConfiguration>(configMessageBuilder);
    engine_->configure(configForEngine_.reader());
  }
}

kj::ArrayPtr<const uint8_t> XRGLAndroid::query(XrQueryRequest::Reader request) {
  MutableRootMessage<XrQueryResponse> response;
  auto builder = response.builder();
  engine_->query(request, &builder);
  lastQueryResponse_ = ConstRootMessage<XrQueryResponse>(response);
  return lastQueryResponse_.bytes();
}

void XRGLAndroid::createCaptureContext(void *sharedContext) {
  C8Log("[xr-gl-android] createCaptureContext(%p)", sharedContext);
  glProcessor_.reset(new XrGlAndroidProcessor(sharedContext));
}

void XRGLAndroid::initializeCameraPipeline(int captureWidth, int captureHeight) {
  C8Log("[xr-gl-android] initializeCameraPipeline(%d, %d)", captureWidth, captureHeight);

  // TODO(mc): GET THESE FROM THE CONFIG.
  float captureRatio = static_cast<float>(captureWidth) / captureHeight;
  if (captureRatio > 1.0f) {
    captureRatio = 1.0f / captureRatio;
  }
  int yuvHeight = 640;
  int yuvWidth = 640 * captureRatio;

  C8Log("[xr-gl-android] createSourceTexture(%dx%d)", captureWidth, captureHeight);
  externalSrcTexture_ = glProcessor_->createSourceTexture(captureWidth, captureHeight);

  C8Log("[xr-gl-android] %s", "Maybe get gr8 shader");
  Gr8FeatureShader *shader =
    output_ == XrGlAndroidFrameOutput::OUTPUT_GR8_PYRAMID ? glProcessor_->gr8Shader() : nullptr;

  C8Log("[xr-gl-android] %s", "new displayFrame_");
  displayFrame_.reset(new XrGlAndroidFrame(
    captureWidth, captureHeight, output_, yuvWidth, yuvHeight, shader));
  C8Log("[xr-gl-android] %s", "new StagedRingBuffer");
  ring_.reset(new StagedRingBuffer<XrGlAndroidFrame, XrGlAndroidFrameStage>(
    6,
    {XrGlAndroidFrameStage::CAPTURE_AND_PROCESS_GPU,
     XrGlAndroidFrameStage::PROCESS_CPU,
     XrGlAndroidFrameStage::RENDER},
    captureWidth,
    captureHeight,
    output_,
    yuvWidth,
    yuvHeight,
    shader));
  framesReadyForRender_ = 0;
  C8Log("[xr-gl-android] %s", "initializeCameraPipeline done");
}

void XRGLAndroid::processGlFrameAndStageRequest(
  const float mtx[16], const ConstRootMessage<RealityRequest> &request) {
  auto stage = ring_->getStage(XrGlAndroidFrameStage::CAPTURE_AND_PROCESS_GPU);
  if (!stage.hasValue()) {
    return;
  }
  ScopeTimer t("gl-frame-stage");

  XrGlAndroidFrame &frame = stage.get();

  MutableRealityRequest realityRequestMessage(request.reader());
  auto requestBuilder = realityRequestMessage.builder();

  // Stage a copy of the request.
  frame.realityRequest = ConstRealityRequest(realityRequestMessage);

  // Run GPU processing on the frame.
  glProcessor_->processGlFrame(mtx, frame);
}

void XRGLAndroid::destroyCaptureContext() {
  C8Log("[xr-gl-android] %s", "destroyCaptureContext");
  // First delete the ring buffer while the GL context is still alive.
  if (ring_ != nullptr) {
    ring_->pauseAndClear();
  }
  ring_.reset(nullptr);
  framesReadyForRender_ = 0;

  displayFrame_.reset(nullptr);

  externalSrcTexture_ = 0;

  // Then delete the processor and GL context.
  glProcessor_.reset(nullptr);
}

kj::ArrayPtr<const uint8_t> XRGLAndroid::executeStagedRequestAndGetSerializedResponsePtr() {
  // Grab the processing stage while doing work here.
  auto stage = ring_->getStage(XrGlAndroidFrameStage::PROCESS_CPU);
  if (!stage.hasValue()) {
    return displayFrame_->realityResponse.bytes();
  }
  ScopeTimer t("android-exec-staged");
  XrGlAndroidFrame &frame = stage.get();

  MutableRealityResponse realityResponseMessage;
  auto responseBuilder = realityResponseMessage.builder();

  // TODO(nb): update request on frame?
  MutableRootMessage<RealityRequest> requestMessage(frame.realityRequest.reader());
  auto requestBuilder = requestMessage.builder();

  {
    if (needsEngineReset_) {
      resetEngine();
    }

    ScopeTimer t1("build-req");
    if (requestBuilder.getFlags().hasLogMask()) {
      auto status = responseBuilder.getStatus().getError();
      status.setFailed(true);
      status.setCode(ResponseError::ErrorCode::INVALID_REQUEST);
      status.setMessage("Request log mask currently unimplemented in XR.");
      frame.realityResponse = ConstRealityResponse(realityResponseMessage);
      return frame.realityResponse.bytes();
    }

    if (frame.output == XrGlAndroidFrameOutput::OUTPUT_YUV) {
      auto currentFrame = requestBuilder.getSensors().getCamera().getCurrentFrame();
      auto yImage = currentFrame.getImage().getOneOf().getGrayImagePointer();
      auto uvImage = currentFrame.getUvImage().getOneOf().getGrayImagePointer();

      // Set the y plane request data.
      yImage.setCols(frame.processingY.pixels().cols());
      yImage.setRows(frame.processingY.pixels().rows());
      yImage.setBytesPerRow(frame.processingY.pixels().rowBytes());
      yImage.setUInt8PixelDataPointer(
        reinterpret_cast<size_t>(frame.processingY.pixels().pixels()));

      // Set the uv plane request data.
      uvImage.setCols(frame.processingUV.pixels().cols());
      uvImage.setRows(frame.processingUV.pixels().rows());
      uvImage.setBytesPerRow(frame.processingUV.pixels().rowBytes());
      uvImage.setUInt8PixelDataPointer(
        reinterpret_cast<size_t>(frame.processingUV.pixels().pixels()));
    } else if (!frame.realityRequest.reader().getSensors().hasARCore()) {
      auto pyramid = frame.pyramid.pyramid();
      auto reqCam = requestBuilder.getSensors().getCamera();
      auto pyramidBuilder = reqCam.getCurrentFrame().getPyramid();
      pyramidBuilder.getImage().setCols(pyramid.data.cols());
      pyramidBuilder.getImage().setRows(pyramid.data.rows());
      pyramidBuilder.getImage().setBytesPerRow(pyramid.data.rowBytes());
      pyramidBuilder.getImage().setUInt8PixelDataPointer(
        reinterpret_cast<size_t>(pyramid.data.pixels()));

      auto levels = pyramidBuilder.initLevels(pyramid.levels.size());
      for (int i = 0; i < pyramid.levels.size(); i++) {
        levels[i].setC(pyramid.levels[i].c);
        levels[i].setR(pyramid.levels[i].r);
        levels[i].setW(pyramid.levels[i].w);
        levels[i].setH(pyramid.levels[i].h);
        levels[i].setRotated(pyramid.levels[i].rotated);
      }
    }
  }

  {
    ScopeTimer t1("exec-req");
    engine_->execute(requestBuilder.asReader(), &responseBuilder);
  }

  for (const auto &roi : getRois(responseBuilder.getEngineExport().asReader())) {
    // Set ROIs for this frame on its next call to draw.
    frame.pyramid.addNextDrawRoi(roi);
  }

  // TODO(nb):
  // if (!detectionImages_.empty()) {
  //   data->gl().addNextDrawHiResScans(intrinsics, {0.0f, 0.0f});
  // }

  // Set the RGBA display texture.
  responseBuilder.getRgbaTexture().setPtr(frame.displayRgba.tex().id());
  responseBuilder.getRgbaTexture().setWidth(frame.displayRgba.tex().width());
  responseBuilder.getRgbaTexture().setHeight(frame.displayRgba.tex().height());

  // If streaming is supported, stream request and response to the remote.
  if (realityPostprocessor_ != nullptr) {
    ScopeTimer t1("maybe-stream");

    auto remoteRealityResponse =
      realityPostprocessor_->update(requestBuilder.asReader(), responseBuilder.asReader());

    // TODO(nb): Should we omit the has check here, and set the entire response?
    if (remoteRealityResponse.hasXRResponse()) {
      responseBuilder.setXRResponse(remoteRealityResponse.getXRResponse());
    }
  }

  {
    ScopeTimer t1("extract-result");
    frame.realityResponse = ConstRealityResponse(realityResponseMessage);
  }

  framesReadyForRender_++;
  return frame.realityResponse.bytes();
}

kj::ArrayPtr<const uint8_t> XRGLAndroid::renderFrameForDisplay() {
  if (ring_ == nullptr) {
    // renderFrameForDisplay may be called directly from unity, without going through the java
    // version which does safe shutdown checks.
    return displayFrame_->realityResponse.bytes();;
  }

  auto renderStage = ring_->getStage(XrGlAndroidFrameStage::RENDER);
  int numFrames = 0;

  /**
   * On some older devices, Unity's render loop performs slower than we are able to capture and
   * process frames. When this occurs, the render stage backs up,causing the ring buffer to fill
   * to it's capacity. This also then forces the capture stage (and capture thread) to lock up.
   * This is unfortunate because Unity renders the last processed frame, not the last
   * frame to go through the render stage.
   *
   * Instead of that, we will flush out all processed frames on each render so that Unity's
   * render performance does not affect the capture thread. This still maintains the original
   * property that Unity's render will perform, at best, at the rate of which camera frames are
   * received.
   */
  while ((numFrames = --framesReadyForRender_) > 0) {
    renderStage = ring_->getStage(XrGlAndroidFrameStage::RENDER);
  }

  if (!renderStage.hasValue()) {
    return displayFrame_->realityResponse.bytes();;
  }

  // Hold on to the render stage until the next call to renderFrameForDisplay, since we don't know
  // when it would otherwise be free to release.
  ScopeTimer t("render-frame-for-display");
  std::swap(*displayFrame_, renderStage.get());
  return displayFrame_->realityResponse.bytes();
}

void XRGLAndroid::pause() {
  if (realityPostprocessor_ != nullptr) {
    realityPostprocessor_->pause();
  }
  if (featureProvider_ != nullptr) {
    featureProvider_->pause();
  }
  // Pause the ring buffer to free up all threads.
  if (ring_ != nullptr) {
    ring_->pauseAndClear();
  }
  logPreparer_.endLoggingSession(ScopeTimer::summarizer());
}

void XRGLAndroid::resume() {
  if (realityPostprocessor_ != nullptr) {
    realityPostprocessor_->resume();
  }
  if (featureProvider_ != nullptr) {
    featureProvider_->resume();
  }
  if (ring_ != nullptr) {
    ring_->resume();
  }
  logPreparer_.startNewLoggingSession();
}

std::unique_ptr<Vector<uint8_t>> XRGLAndroid::getAndResetAnalyticsRecord(
  const LogRecordHeader::Reader &logRecordHeader) {
  auto logRecord = logPreparer_.prepareLogForUpload(logRecordHeader, &latencySummarizer_);
  ScopeTimer::reset();
  return logRecord;
}

XRGLAndroid::XRGLAndroid() { resetEngine(); }

void XRGLAndroid::resetEngine() {
  needsEngineReset_ = false;
  engine_.reset(new XREngine());
  engine_->setResetLoggingTreeRoot(true);
  engine_->configure(configForEngine_.reader());
}

XRGLAndroid *XRGLAndroid::createInstance() {
  if (xRAndroid_ != nullptr) {
    throw new RuntimeError(
      "Attempting to create multiple engines. Destroy the previous before creating a new one.");
  }

  xRAndroid_ = new XRGLAndroid();
  return xRAndroid_;
}

XRGLAndroid *XRGLAndroid::getInstance() {
  if (xRAndroid_ == nullptr) {
    throw new RuntimeError("Attempting to get engine instance before it's created.");
  }

  return xRAndroid_;
}

bool XRGLAndroid::hasInstance() { return xRAndroid_ != nullptr; }

void XRGLAndroid::destroyInstance() {
  if (xRAndroid_ != nullptr) {
    delete xRAndroid_;
    xRAndroid_ = nullptr;
  }
}

}  // namespace c8

#endif  // ANDROID
