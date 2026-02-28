// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#pragma once

#include <atomic>
#include <mutex>

#include "c8/io/capnp-messages.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/protolog/xr-extern.h"
#include "c8/staged-ring-buffer.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/app/pipeline/native/gpu-frame-processor.h"
#include "reality/app/pipeline/native/pipeline-frame.h"
#include "reality/app/xr/common/camera-framework.h"

namespace c8 {

class GlCameraPipeline {
public:
  // Disallow move, since we have unmovable members.
  GlCameraPipeline(GlCameraPipeline &&) = delete;
  GlCameraPipeline &operator=(GlCameraPipeline &&) = delete;

  // Disallow copying.
  GlCameraPipeline(const GlCameraPipeline &) = delete;
  GlCameraPipeline &operator=(const GlCameraPipeline &) = delete;

  // Creates and returns a singleton instance of GlCameraPipeline. Subsequent calls to
  // this will result in an error if the instance is not destroyed through destroyInstance first.
  // Use getInstance to receive a reference of a previously created instance.
  static GlCameraPipeline *createInstance();

  // Returns a reference to a previously created instance of GlCameraPipeline. Results in an error
  // if called before an instance is created.
  static GlCameraPipeline *getInstance();

  // Returns whether an instance has already been created.
  static bool hasInstance();

  // Destroys the instance of GlCameraPipeline, if it exists.
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

  const PipelineFrame *displayFrame() const { return displayFrame_.get(); }

  // Take ownership of a view.
  void setView(std::unique_ptr<PipelineView> &&view);

private:
  // Default constructor.
  GlCameraPipeline() = default;

  std::unique_ptr<PipelineView> view_;

  static GlCameraPipeline *pipeline_;

  std::atomic<int> framesReadyForRender_;

  bool needsViewConfig_ = true;
  bool needsDisplayFrameInvalidate_ = true;
  int captureWidth_ = 0;
  int captureHeight_ = 0;

  std::unique_ptr<GpuFrameProcessor> glProcessor_;
  uint32_t externalSrcTexture_ = 0;

  using GlCameraPipelineRingBuffer = StagedRingBuffer<PipelineFrame, PipelineFrameStage>;

  std::unique_ptr<GlCameraPipelineRingBuffer> ring_;
  std::unique_ptr<PipelineFrame> displayFrame_;
  GlCameraPipelineRingBuffer::Stage renderStage_;
};

}  // namespace c8
