// Copyright (c) 2016 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Object that manages state for native calls.

#pragma once

#include <mutex>

#include "apps/client/internalqa/omniscope/native/omniscope-app.h"
#include "apps/client/internalqa/omniscope/native/pipeline/omniscope-frame.h"
#include "apps/client/internalqa/omniscope/native/pipeline/omniscope-processor.h"
#include "c8/io/capnp-messages.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/protolog/xr-extern.h"
#include "c8/staged-ring-buffer.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/app/xr/common/camera-framework.h"
#include "reality/engine/executor/xr-engine.h"
#include "reality/engine/logging/xr-log-preparer.h"

namespace c8 {

class OmniscopePipeline {
public:
  // Default move constructors.
  OmniscopePipeline(OmniscopePipeline &&) = default;
  OmniscopePipeline &operator=(OmniscopePipeline &&) = default;

  // Disallow copying.
  OmniscopePipeline(const OmniscopePipeline &) = delete;
  OmniscopePipeline &operator=(const OmniscopePipeline &) = delete;

  // Creates and returns a singleton instance of OmniscopePipeline. Subsequent calls to this will
  // result in an error if the instance is not destroyed through destroyInstance first. Use
  // getInstance to receive a reference of a previously created instance.
  // @param showDemoViewsOnly When set to true, only show demo views in UITEST_VIEW_GROUP.
  static OmniscopePipeline *createInstance(bool showDemoViewsOnly = false);

  // Returns a reference to a previously created instance of OmniscopePipeline. Results in an error
  // if called before an instance is created.
  static OmniscopePipeline *getInstance();

  // Returns whether an instance has already been created.
  static bool hasInstance();

  // Destroys the instance of OmniscopePipeline, if it exists.
  static void destroyInstance();

  // Creates and inits the GL context on capture thread along with the capture frame processor. Must
  // happen after the engine is configured.
  // @param sharedContext The context to be shared with the new GL context. If it's a nullptr,
  // create only the processor but not the context.
  // @param useExternalOesTexture When set to true, use GL_TEXTURE_EXTERNAL_OES texture to hold
  // incoming capture frames; otherwise, use GL_TEXTURE_2D texture.
  void createCaptureContext(void *sharedContext, bool useExternalOesTexture = true);

  void initializeCameraPipeline(int captureWidth, int captureHeight);

  // Returns the handle of the GL texture for writing capture frames. If useExternalOesTexture
  // is true when calling createCaptureContext(), the texture will be an GL_TEXTURE_EXTERNAL_OES
  // texture; otherwise, a GL_TEXTURE_2D texture.
  uint32_t getSourceTexture() const { return sourceTexture_; }

  // Destroy GL Context on capture thread. Must happen after the capture context is initialized.
  void destroyCaptureContext();

  // Perform the capture and gpu process work on the next frame in the ring buffer.
  void processGlFrameAndStageRequest(
    const float mtx[16], const ConstRootMessage<RealityRequest> &request);

  kj::ArrayPtr<const uint8_t> executeStagedRequestAndGetSerializedResponsePtr();

  void renderFrameForDisplay();

  void pause();
  void resume();

  int currentView() const { return app_ == nullptr ? 0 : app_->currentView(); }
  void setView(int num);
  void goNext();
  void goPrev();

  void gotTouches(int count);

  void configure(const XRConfiguration::Reader &config);

  std::unique_ptr<Vector<uint8_t>> getAndResetAnalyticsRecord(
    const LogRecordHeader::Reader &logRecordHeader);

private:
  OmniscopePipeline(bool showDemoViewsOnly);

  void flushToScreen(OmniscopeFrame &frame);

  static OmniscopePipeline *xr_;

  ConstRootMessage<XRConfiguration> configForEngine_;

  std::unique_ptr<OmniscopeApp> app_;

  bool showDemoViewsOnly_ = false;
  bool needsViewConfig_ = true;
  bool needsDisplayFrameInvalidate_ = true;
  int captureWidth_ = 0;
  int captureHeight_ = 0;
  int displayWidth_ = 0;
  int displayHeight_ = 0;

  std::unique_ptr<OmniscopeProcessor> glProcessor_;
  uint32_t sourceTexture_ = 0;

  using OmniscopeRingBuffer = StagedRingBuffer<OmniscopeFrame, OmniscopeFrameStage>;

  std::unique_ptr<OmniscopeRingBuffer> ring_;
  std::unique_ptr<OmniscopeFrame> displayFrame_;
  OmniscopeRingBuffer::Stage renderStage_;

  ConstRootMessage<RealityResponse> lastRealityResponse_;
  ConstRootMessage<XrQueryResponse> lastQueryResponse_;

  XRLogPreparer logPreparer_;
};

}  // namespace c8
