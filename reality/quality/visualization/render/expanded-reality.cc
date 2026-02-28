// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "expanded-reality.h",
  };
  deps = {
    "//c8:hpoint",
    "//c8/io:capnp-messages",
    "//c8/pixels:pixel-transforms",
    "//c8:quaternion",
    "//c8:vector",
    "//reality/app/xr/capnp:xr-capnp",
    "@opencv//:core",
  };
  visibility = {
    "//reality/quality:__subpackages__",
  };
}
cc_end(0xb47fb330);

#include "reality/quality/visualization/render/expanded-reality.h"

#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"

using namespace c8;

namespace {
void readDescriptorMat(const c8::FeatureDescriptorData::Reader &data, cv::Mat *out) {
  int dRows = data.getRows();
  int dCols = data.getCols();
  int dBytesPerRow = data.getBytesPerRow();
  uint8_t *dRowStart = const_cast<uint8_t *>(data.getUInt8FeatureData().begin());
  // Wraps the data pointed to by dRowStart without copying it.
  cv::Mat wrapper(dRows, dCols, CV_8UC1, dRowStart, dBytesPerRow);

  // Copy data out.
  *out = wrapper.clone();
}
}  // namespace

void c8::pushRealityForward(
  XRCapnp &engine, const XRCapnpSensors &sensors, ExpandedReality *newReality) {
  newReality->featuresFeatures.features.clear();
  newReality->featuresPreviousFeatures.features.clear();
  newReality->featuresExperimentalKeyfameKeyframeFeatures.features.clear();
  newReality->featuresMatches.clear();
  newReality->featuresExperimentalKeyframeMatches.clear();

  XRCapnpReality reality;
  engine.pushRealityForward(sensors, &reality);

  auto response = reality.xrResponse.reader();

  newReality->eventIdEventTimeMicros = response.getEventId().getEventTimeMicros();

  if (response.hasPose()) {
    auto outputR = response.getPose().getTransform().getRotation();
    auto outputT = response.getPose().getTransform().getPosition();
    newReality->poseTransform.rotation =
      Quaternion(outputR.getW(), outputR.getX(), outputR.getY(), outputR.getZ());
    newReality->poseTransform.position = HPoint3(outputT.getX(), outputT.getY(), outputT.getZ());

    auto outputPoseDeltaR = response.getPose().getTransformDelta().getRotation();
    auto outputPoseDeltaT = response.getPose().getTransformDelta().getPosition();
    newReality->poseTransformDelta.rotation = Quaternion(
      outputPoseDeltaR.getW(),
      outputPoseDeltaR.getX(),
      outputPoseDeltaR.getY(),
      outputPoseDeltaR.getZ());
    newReality->poseTransformDelta.position =
      HPoint3(outputPoseDeltaT.getX(), outputPoseDeltaT.getY(), outputPoseDeltaT.getZ());

    auto outputKfPoseR =
      response.getPose().getExperimental().getKeyframe().getKeyframeTransform().getRotation();
    auto outputKfPoseT =
      response.getPose().getExperimental().getKeyframe().getKeyframeTransform().getPosition();
    newReality->poseExperimentalKeyframeKeyframeTransform.rotation = Quaternion(
      outputKfPoseR.getW(), outputKfPoseR.getX(), outputKfPoseR.getY(), outputKfPoseR.getZ());
    newReality->poseExperimentalKeyframeKeyframeTransform.position =
      HPoint3(outputKfPoseT.getX(), outputKfPoseT.getY(), outputKfPoseT.getZ());

    auto outputKfPoseDeltaR =
      response.getPose().getExperimental().getKeyframe().getKeyframeTransformDelta().getRotation();
    auto outputKfPoseDeltaT =
      response.getPose().getExperimental().getKeyframe().getKeyframeTransformDelta().getPosition();
    newReality->poseExperimentalKeyframeKeyframeTransformDelta.rotation = Quaternion(
      outputKfPoseDeltaR.getW(),
      outputKfPoseDeltaR.getX(),
      outputKfPoseDeltaR.getY(),
      outputKfPoseDeltaR.getZ());
    newReality->poseExperimentalKeyframeKeyframeTransformDelta.position =
      HPoint3(outputKfPoseDeltaT.getX(), outputKfPoseDeltaT.getY(), outputKfPoseDeltaT.getZ());
  }

  if (response.hasFeatures()) {
    for (const FeatureKeyPoint::Reader &pt : response.getFeatures().getFeatures().getFeatures()) {
      newReality->featuresFeatures.features.push_back(HPoint2(pt.getX(), pt.getY()));
    }
    readDescriptorMat(
      response.getFeatures().getFeatures().getDescriptors(),
      &newReality->featuresFeatures.descriptors);

    for (const FeatureKeyPoint::Reader &pt :
         response.getFeatures().getPreviousFeatures().getFeatures()) {
      newReality->featuresPreviousFeatures.features.push_back(HPoint2(pt.getX(), pt.getY()));
    }
    readDescriptorMat(
      response.getFeatures().getPreviousFeatures().getDescriptors(),
      &newReality->featuresPreviousFeatures.descriptors);

    for (const FeatureMatch::Reader &match : response.getFeatures().getMatches()) {
      XRCapnpFeatureMatch cvmatch;
      cvmatch.featuresIndex = match.getFeaturesIndex();
      cvmatch.previousFeaturesIndex = match.getPreviousFeaturesIndex();
      newReality->featuresMatches.push_back(cvmatch);
    }

    for (const FeatureKeyPoint::Reader &pt : response.getFeatures()
                                               .getExperimental()
                                               .getKeyframe()
                                               .getKeyframeFeatures()
                                               .getFeatures()) {
      newReality->featuresExperimentalKeyfameKeyframeFeatures.features.push_back(
        HPoint2(pt.getX(), pt.getY()));
    }
    readDescriptorMat(
      response.getFeatures().getExperimental().getKeyframe().getKeyframeFeatures().getDescriptors(),
      &newReality->featuresExperimentalKeyfameKeyframeFeatures.descriptors);

    for (const FeatureMatch::Reader &match :
         response.getFeatures().getExperimental().getKeyframe().getKeyframeMatches()) {
      XRCapnpFeatureMatch cvmatch;
      cvmatch.featuresIndex = match.getFeaturesIndex();
      cvmatch.previousFeaturesIndex = match.getPreviousFeaturesIndex();
      newReality->featuresExperimentalKeyframeMatches.push_back(cvmatch);
    }

    newReality->featuresExperimentalKeyframeKeyframeLowMatchFrames =
      response.getFeatures().getExperimental().getKeyframe().getKeyframeLowMatchFrames();
    newReality->featuresExperimentalKeyframeFramesSinceKeyframe =
      response.getFeatures().getExperimental().getKeyframe().getFramesSinceKeyframe();
  }

  newReality->xrResponse = reality.xrResponse.clone();
}

// Update the frame display.
void c8::renderFrameForDisplay(const XRCapnpSensors &sensors, cv::Mat *mat) {
  if (mat == nullptr) {
    return;
  }
  ScopeTimer t("expanded-reality-render-frame-for-display");

  auto srcY = sensors.yBuffer->pixels();
  auto srcUV = sensors.uvBuffer->pixels();

  mat->create(srcY.rows(), srcY.cols(), CV_8UC3);
  BGR888PlanePixels dst(mat->rows, mat->cols, mat->step, mat->ptr(0));

  yuvToBgr(srcY, srcUV, &dst);
}
