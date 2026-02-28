// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Rami Farran (rami@8thwall.com)
//
// Program that finds variance between images/their feature points and gives
// the user a struct with the old and new points with their delta quaternion

#pragma once

#include "c8/geometry/intrinsics.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/opengl/gl.h"
#include "reality/engine/features/feature-detector.h"
#include "reality/engine/features/gl-reality-frame.h"

namespace c8 {

void checkGLError(String op);

struct CalibDataEntry {
  HPoint2 oldPoint;
  HPoint2 newPoint;
  Quaternion qDelta;
};

class CalibrationCallback {
public:
  CalibrationCallback();
  Vector<CalibDataEntry> sampleDataSet;

  void processFrame(Quaternion rotation, int orientation, GLuint cameraTexture);

  int getCount();

  void countUp();

  float getFocalLength();

  void setFocalLength(float K);

  bool hasPrevFrame();

  bool hasPrevRotation();

  void setPrevRotation(Quaternion prevRot);

  Quaternion getPrevDeviceRotation();

  void setReprojectionError(float reprojError);

  float getReprojectionError();

private:
  bool didInit_ = false;
  bool hasPrevFrame_ = false;
  bool hasPrevRotation_ = false;
  int count_ = 0;
  float focalLength_ = 0.0f;
  float reprojectionError_;
  LocalMatcher<OrbFeature> localMatcher_;
  Quaternion prevDeviceRotation_;
  FeatureDetector featureDetector_;
  GlRealityFrame gl_;
  std::unique_ptr<Gr8FeatureShader> glShader_;
  GLuint prevCameraTexture_;
  MutableRootMessage<RealityRequest> previousRequest_;
  std::unique_ptr<FrameWithPoints> previousPoints_;
};

bool calibrate(
  Quaternion rotation, CalibrationCallback *calibCallback, int orientation, GLuint cameraTexture);

// Finds the cost of a certain focal length on a dataset
float cost(const Vector<CalibDataEntry> &dataSet, float K);

// Finds the focal length with the lowest average cost for the dataset
float findK(const Vector<CalibDataEntry> &dataSet, float *reprojError);

}  // namespace c8
