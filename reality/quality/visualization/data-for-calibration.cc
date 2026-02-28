// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Rami Farran (rami@8thwall.com)
//
// Program that finds variance between images/their feature points and gives
// the user a struct with the old and new points with their delta quaternion

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "data-for-calibration.h",
  };
  deps = {
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//c8/geometry:device-pose",
    "//c8/geometry:egomotion",
    "//c8/geometry:intrinsics",
    "//c8/pixels/opengl:gl-texture",
    "//c8/pixels/opengl:gl-headers",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/protolog:xr-requests",
    "//reality/engine/features:feature-detector",
    "//reality/engine/features:local-matcher",
    "//reality/quality/visualization/render:imgproc",
    "//reality/quality/visualization/xrom/drawing:components",
    "//reality/engine/features:gl-reality-frame",
  };
  visibility = {
    "//reality/quality/visualization:__pkg__",
    "//apps/client/boardless-calibratejs:__pkg__",
  };
}
cc_end(0x5de9d6fc);

#include <iostream>
#include <memory>

#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/geometry/device-pose.h"
#include "c8/geometry/egomotion.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/protolog/xr-requests.h"
#include "reality/engine/features/local-matcher.h"
#include "reality/quality/visualization/data-for-calibration.h"
#include "reality/quality/visualization/render/imgproc.h"
#include "reality/quality/visualization/xrom/drawing/components.h"

namespace c8 {

CalibrationCallback::CalibrationCallback() : localMatcher_(30, 20, 0.1f) {}

void CalibrationCallback::processFrame(Quaternion rotation, int orientation, GLuint cameraTexture) {
  ScopeTimer rt("calibration-callback-process-frame");
  if (!didInit_) {
    didInit_ = true;
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
    gl_.initialize(glShader_.get(), 480, 640, orientation);
  }
  {
    ScopeTimer t("gr8-pyramid");
    gl_.draw(cameraTexture, GlRealityFrame::Options::DEFER_READ);
  }
  Quaternion q;
  q = xrRotationFromDeviceRotation(rotation);

  std::unique_ptr<FrameWithPoints> f(
    new FrameWithPoints(Intrinsics::getCameraIntrinsics(DeviceInfos::NOT_SPECIFIED)));
  Vector<FrameWithPoints> roiPoints;
  if (hasPrevFrame_) {
    Vector<PointMatch> matches;
    {
      ScopeTimer t("xr-engine-request-execute");

      // Detect features in frame
      // TODO(alvin): This may not be the correct thing to pass in for rioPoints, but it
      //   resolves build failure spam for now.
      featureDetector_.detectFeatures(gl_.pyramid(), f.get(), &roiPoints);

      auto fpix = f->pixels();
      // Match frame features to features in prev frame
      if (hasPrevRotation_) {
        // Get rotation delta from prev frame
        Quaternion qDelta;
        qDelta = egomotion(prevDeviceRotation_, q);
        auto prevPix = previousPoints_->pixels();
        localMatcher_.match(*f, *previousPoints_, &matches);
        // Fourth, construct sample structs based on matches and rotation delta, add all samples to
        // set
        for (PointMatch match : matches) {
          CalibDataEntry sampleDataEntry;
          sampleDataEntry.oldPoint = prevPix[match.dictionaryIdx];
          sampleDataEntry.newPoint = fpix[match.wordsIdx];
          sampleDataEntry.qDelta = qDelta;
          sampleDataSet.push_back(sampleDataEntry);
        }
      }
    }
  }
  previousPoints_.reset(f.release());
  prevCameraTexture_ = cameraTexture;
  hasPrevFrame_ = true;
  prevDeviceRotation_ = q;
  hasPrevRotation_ = true;
}

int CalibrationCallback::getCount() { return count_; }

void CalibrationCallback::countUp() { count_++; }

float CalibrationCallback::getFocalLength() { return focalLength_; }

void CalibrationCallback::setFocalLength(float K) { focalLength_ = K; }

bool CalibrationCallback::hasPrevFrame() { return hasPrevFrame_; }

bool CalibrationCallback::hasPrevRotation() { return hasPrevRotation_; }

void CalibrationCallback::setPrevRotation(Quaternion prevRot) { prevDeviceRotation_ = prevRot; }

Quaternion CalibrationCallback::getPrevDeviceRotation() { return prevDeviceRotation_; }

void CalibrationCallback::setReprojectionError(float reprojError) {
  reprojectionError_ = reprojError;
}

float CalibrationCallback::getReprojectionError() { return reprojectionError_; }

bool calibrate(
  Quaternion rotation, CalibrationCallback *calib, int orientation, GLuint cameraTexture) {
  bool isUpdateNeeded = false;
  if (calib->getCount() < 400) {
    if (calib->hasPrevRotation()) {
      // Find rotation amount
      auto q = xrRotationFromDeviceRotation(rotation);
      C8Log("Q metrics: w: %f, x: %f, y: %f, z: %f", q.w(), q.x(), q.y(), q.z());
      C8Log(
        "PrevRot metrics: w: %f, x: %f, y: %f, z: %f",
        calib->getPrevDeviceRotation().w(),
        calib->getPrevDeviceRotation().x(),
        calib->getPrevDeviceRotation().y(),
        calib->getPrevDeviceRotation().z());
      auto qDelta = egomotion(calib->getPrevDeviceRotation(), q);
      auto checkPoint = HPoint3(0.0f, 0.0f, 1.0f);
      auto checker = (qDelta.toRotationMat() * checkPoint).flatten();
      auto rotationDelta = sqrt((checker.x() * checker.x()) + (checker.y() * checker.y()));
      C8Log("Rotation Delta: %f", rotationDelta);
      // TODO(rami): tweak this range to get the best average outcome across devices
      if (rotationDelta > 0.1 || rotationDelta < 0.0075) {
        calib->setPrevRotation(q);
        return isUpdateNeeded;
      }
      calib->countUp();
    }

    calib->processFrame(rotation, orientation, cameraTexture);

    if (calib->getCount() % 100 == 0 && calib->getCount() > 0) {
      float reprojError;
      calib->setFocalLength(findK(calib->sampleDataSet, &reprojError));
      calib->setReprojectionError(reprojError);
      isUpdateNeeded = true;
    }
  }
  return isUpdateNeeded;
}

float cost(const Vector<CalibDataEntry> &dataSet, float K) {
  Vector<float> costs;
  for (CalibDataEntry entry : dataSet) {
    auto oldPoint3 = entry.oldPoint.extrude();
    auto kMat = HMatrixGen::intrinsic(c8_PixelPinholeCameraModel{480, 640, 240.0f, 320.0f, K, K});
    auto predicted = (kMat * entry.qDelta.toRotationMat().inv() * kMat.inv() * oldPoint3).flatten();
    auto xd = predicted.x() - entry.newPoint.x();
    auto yd = predicted.y() - entry.newPoint.y();
    auto err = std::sqrt(xd * xd + yd * yd);
    costs.push_back(err);
  }

  sort(costs.begin(), costs.end());
  int i10 = costs.size() * 0.1;
  int i20 = costs.size() * 0.2;
  int i30 = costs.size() * 0.3;
  int i40 = costs.size() * 0.4;
  int i50 = costs.size() * 0.5;
  int i60 = costs.size() * 0.6;
  int i70 = costs.size() * 0.7;
  int i80 = costs.size() * 0.8;
  int i90 = costs.size() * 0.9;
  int i100 = costs.size() - 1;

  C8Log(
    "10%%: %f, 20%%: %f, 30%%: %f, 40%%: %f, 50%%: %f, 60%%: %f, 70%%: %f, 80%%: %f, 90%%: %f, "
    "100%%: %f",
    costs[i10],
    costs[i20],
    costs[i30],
    costs[i40],
    costs[i50],
    costs[i60],
    costs[i70],
    costs[i80],
    costs[i90],
    costs[i100]);

  float c = 0.0f;
  for (int i = 0; i < i50; ++i) {
    c += costs[i];
  }

  return c / (i50 + 1);
}

float findK(const Vector<CalibDataEntry> &dataSet, float *reprojError) {
  float smallestCost = std::numeric_limits<float>::max();
  float costOfSampleK;
  float bestK = 0;
  float start = 400;
  float end = 800;
  float inc = (end - start) * .25;
  bool foundOptimalLength = false;

  while (!foundOptimalLength) {
    for (float sampleK = start; sampleK <= end; sampleK += inc) {
      costOfSampleK = c8::cost(dataSet, sampleK);
      C8Log("Cost for %f: %f", sampleK, costOfSampleK);
      if (costOfSampleK < smallestCost) {
        smallestCost = costOfSampleK;
        *reprojError = smallestCost;
        bestK = sampleK;
      }
    }

    start = bestK - inc;
    end = bestK + inc;
    inc = (end - start) * .25;

    // Don't check the ends of the range again.
    start += inc;
    end -= inc;

    if (inc <= 1e-4) {
      foundOptimalLength = true;
    }
  }

  return bestK;
}
}  // namespace c8
