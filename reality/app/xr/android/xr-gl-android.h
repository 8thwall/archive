// Copyright (c) 2016 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Object that manages state for android native calls.

#pragma once

#ifdef ANDROID

#include <jni.h>
#include <mutex>
#include <atomic>

#include "c8/io/capnp-messages.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/protolog/xr-extern.h"
#include "c8/staged-ring-buffer.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/app/xr/android/xr-gl-android-frame.h"
#include "reality/app/xr/android/xr-gl-android-processor.h"
#include "reality/app/xr/common/camera-framework.h"
#include "reality/engine/executor/xr-engine.h"
#include "reality/engine/logging/xr-log-preparer.h"

namespace c8 {

class XRGLAndroid {
public:
  // Disallow move, since we have unmovable members.
  XRGLAndroid(XRGLAndroid &&) = delete;
  XRGLAndroid &operator=(XRGLAndroid &&) = delete;

  // Disallow copying.
  XRGLAndroid(const XRGLAndroid &) = delete;
  XRGLAndroid &operator=(const XRGLAndroid &) = delete;

  // Creates and returns a singleton instance of XRGLAndroid. Subsequent calls to
  // this will result in an error if the instance is not destroyed through destroyInstance first.
  // Use getInstance to receive a reference of a previously created instance.
  static XRGLAndroid *createInstance();

  // Returns a reference to a previously created instance of XRGLAndroid. Results in an error if
  // called before an instance is created.
  static XRGLAndroid *getInstance();

  // Returns whether an instance has already been created.
  static bool hasInstance();

  // Destroys the instance of XRGLAndroid, if it exists.
  static void destroyInstance();

  // Create and init the GL Context on capture thread. Must happen after the engine is configured.
  void createCaptureContext(void *sharedContext);

  void initializeCameraPipeline(int captureWidth, int captureHeight);

  // Create OpenGL OES_EXTERNAL_TEXTURE for writing capture frames.
  uint32_t getSourceTexture() const { return externalSrcTexture_; }

  // Destroy GL Context on capture thread. Must happen after the capture context is initialized.
  void destroyCaptureContext();

  // Perform the capture and gpu process work on the next frame in the ring buffer.
  void processGlFrameAndStageRequest(
    const float mtx[16], const ConstRootMessage<RealityRequest> &request);

  kj::ArrayPtr<const uint8_t> executeStagedRequestAndGetSerializedResponsePtr();

  void configure(XRConfiguration::Reader config);
  kj::ArrayPtr<const uint8_t> query(XrQueryRequest::Reader request);

  kj::ArrayPtr<const uint8_t> renderFrameForDisplay();

  void pause();
  void resume();
  void recenter() { needsEngineReset_ = true; };

  std::unique_ptr<Vector<uint8_t>> getAndResetAnalyticsRecord(
    const LogRecordHeader::Reader &logRecordHeader);

  void setRealityPostprocessor(RealityPostprocessor *realityPostprocessor) {
    realityPostprocessor_ = realityPostprocessor;
  }

  RealityPostprocessor *getRealityPostprocessor() { return realityPostprocessor_; }

  void setFeatureProvider(std::unique_ptr<FeatureProvider> &&featureProvider) {
    featureProvider_ = std::move(featureProvider);
    if (featureProvider_->status("yuvtex")) {
      output_ = XrGlAndroidFrameOutput::OUTPUT_YUV;
    }
  }

private:
  // Default constructor.
  XRGLAndroid();

  void resetEngine();

  static XRGLAndroid *xRAndroid_;

  std::atomic<int> framesReadyForRender_;
  std::unique_ptr<XREngine> engine_;
  ConstRootMessage<XRConfiguration> configForEngine_;

  std::unique_ptr<XrGlAndroidProcessor> glProcessor_;
  uint32_t externalSrcTexture_ = 0;

  using XrGlAndroidRingBuffer = StagedRingBuffer<XrGlAndroidFrame, XrGlAndroidFrameStage>;

  std::unique_ptr<XrGlAndroidRingBuffer> ring_;
  std::unique_ptr<XrGlAndroidFrame> displayFrame_;
  XrGlAndroidRingBuffer::Stage renderStage_;

  bool needsEngineReset_ = false;
  LatencySummarizer latencySummarizer_;

  ConstRootMessage<RealityResponse> lastRealityResponse_;
  ConstRootMessage<XrQueryResponse> lastQueryResponse_;

  XRLogPreparer logPreparer_;

  RealityPostprocessor *realityPostprocessor_ = nullptr;
  std::unique_ptr<FeatureProvider> featureProvider_;

  XrGlAndroidFrameOutput output_ = XrGlAndroidFrameOutput::OUTPUT_GR8_PYRAMID;
};

}  // namespace c8

#endif  // ANDROID
