// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <opencv2/core/core.hpp>

#include "c8/hpoint.h"
#include "c8/io/capnp-messages.h"
#include "c8/quaternion.h"
#include "c8/vector.h"
#include "reality/app/xr/capnp/xr-capnp.h"

namespace c8 {

struct XRCapnpFeatureMatch {
  int featuresIndex;
  int previousFeaturesIndex;
};

struct XRCapnpTransform {
  HPoint3 position;
  Quaternion rotation;
};

struct XRCapnpFeatures {
  Vector<HPoint2> features;
  cv::Mat descriptors;
};

struct ExpandedReality {
  // Always present.
  int64_t eventIdEventTimeMicros;

  // Output when "outputMaskPose" is configured.
  XRCapnpTransform poseTransform;
  XRCapnpTransform poseTransformDelta;

  XRCapnpTransform poseExperimentalKeyframeKeyframeTransform;
  XRCapnpTransform poseExperimentalKeyframeKeyframeTransformDelta;

  // Output when "outputMaskFeatures" in configured.
  XRCapnpFeatures featuresFeatures;
  XRCapnpFeatures featuresPreviousFeatures;
  Vector<XRCapnpFeatureMatch> featuresMatches;
  XRCapnpFeatures featuresExperimentalKeyfameKeyframeFeatures;
  Vector<XRCapnpFeatureMatch> featuresExperimentalKeyframeMatches;
  int32_t featuresExperimentalKeyframeKeyframeLowMatchFrames = 0;
  int32_t featuresExperimentalKeyframeFramesSinceKeyframe = 0;

  // Outputs for the public facing xr api.
  ConstRootMessage<RealityResponse> xrResponse;
};

void pushRealityForward(
  XRCapnp &engine, const XRCapnpSensors &sensors, ExpandedReality *newReality);

void renderFrameForDisplay(const XRCapnpSensors &sensors, cv::Mat *mat);

}  // namespace c8
