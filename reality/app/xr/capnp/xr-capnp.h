// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// OpenCV functions for running the RealityEngine.

#pragma once

#include "c8/hpoint.h"
#include "c8/io/capnp-messages.h"
#include "c8/quaternion.h"
#include "c8/vector.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/protolog/xr-extern.h"
#include "reality/engine/executor/xr-engine.h"

namespace c8 {

struct XRCapnpReality {
  ConstRootMessage<RealityResponse> xrResponse;
};

struct XRCapnpSensors {
  std::unique_ptr<MutableRootMessage<RealityRequest>> requestMessage;
  std::unique_ptr<YPlanePixelBuffer> yBuffer;
  std::unique_ptr<UVPlanePixelBuffer> uvBuffer;
  GlTexture rgbaTexture;

  // Initialize with non-null empty sensor data.
  XRCapnpSensors() {
    requestMessage.reset(new MutableRootMessage<RealityRequest>());
    yBuffer.reset(new YPlanePixelBuffer(0, 0));
    uvBuffer.reset(new UVPlanePixelBuffer(0, 0));
  }
};

struct XRCapnpConfiguration {
  bool outputMaskSensorTest = false;
  bool outputMaskPose = false;
  bool outputMaskFeatures = false;
  bool disableExperimental = false;
  MutableRootMessage<XRConfiguration> xrConfig;

  // Inline construction.
  XRCapnpConfiguration(bool sensorTest, bool pose, bool features)
      : outputMaskSensorTest(sensorTest), outputMaskPose(pose), outputMaskFeatures(features) {
    xrConfig.builder().getMask().setCamera(pose);
    xrConfig.builder().getMask().setFeatureSet(true);
  }

  // Default constructors.
  XRCapnpConfiguration() {};
  XRCapnpConfiguration(XRCapnpConfiguration &&) = default;
  XRCapnpConfiguration &operator=(XRCapnpConfiguration &&) = default;
  XRCapnpConfiguration(const XRCapnpConfiguration &) = delete;
  XRCapnpConfiguration &operator=(const XRCapnpConfiguration &) = delete;
};

class XRCapnp {
public:
  // Inline configuration on construction.
  XRCapnp(XRCapnpConfiguration &&config) : configuration_(std::move(config)) {
    engine_.reset(new XREngine());
    engine_->setDisableSummaryLog(true);
    engine_->configure(configuration_.xrConfig.reader());
  }

  void configure(XRConfiguration::Reader config) {
    if (engine_ != nullptr) {
      engine_->configure(config);
    }

    if (config.hasMask()) {
      configuration_.xrConfig = MutableRootMessage<XRConfiguration>(config);
    }
  }

  // Get the most recent reality.
  void pushRealityForward(const XRCapnpSensors &sensors, XRCapnpReality *newReality);

  InternalRealityState::Reader experimentalEngineInternalState() {
    return fakeInternalState_.reader();
  }

  // When logging timers for the engine, reset the logging tree root so that /xr-engine is at the
  // top level. This is useful for having consistent timers across outer calling contexts, if that's
  // desired.
  void setResetLoggingTreeRoot(bool reset) { engine_->setResetLoggingTreeRoot(reset); }

  ConstRootMessage<XrQueryResponse> *query(XrQueryRequest::Reader request) {
    MutableRootMessage<XrQueryResponse> response;
    auto responseBuilder = response.builder();
    if (engine_ != nullptr) {
      engine_->query(request, &responseBuilder);
    }
    lastQueryResponse_ = ConstRootMessage<XrQueryResponse>(response);
    return &lastQueryResponse_;
  }

  RealityRequest::Reader lastRequest() { return lastRequest_.reader(); }

  // Default move constructors.
  XRCapnp(XRCapnp &&) = default;
  XRCapnp &operator=(XRCapnp &&) = default;

  // Default constructor disallowed; require configuration.
  XRCapnp() = delete;
  // Disallow copying.
  XRCapnp(const XRCapnp &) = delete;
  XRCapnp &operator=(const XRCapnp &) = delete;

  LatencySummarizer *summarizer() { return ScopeTimer::summarizer(); }

private:
  // Only one of these will be non-null.
  std::unique_ptr<XREngine> engine_ = nullptr;

  XRCapnpConfiguration configuration_;
  const XRCapnpSensors *lastSensorValues_;
  ConstRootMessage<XrQueryResponse> lastQueryResponse_;
  ConstRootMessage<RealityRequest> lastRequest_;
  ConstRootMessage<InternalRealityState> fakeInternalState_;
};

}  // namespace c8
