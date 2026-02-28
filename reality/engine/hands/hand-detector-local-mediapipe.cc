// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"
cc_library {
  hdrs = {
    "hand-detector-local-mediapipe.h",
  };
  deps = {
    "//c8:vector",
    "//c8/stats:scope-timer",
    "//c8/pixels:pixel-transforms",
    "//reality/engine/faces:face-geometry",
    "//reality/engine/hands:hand-types",
    "//reality/engine/deepnets:tflite-interpreter",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0x520303ab);

#include <cmath>

#include "c8/c8-log.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "reality/engine/faces/face-geometry.h"
#include "reality/engine/hands/hand-detector-local-mediapipe.h"
#include "reality/engine/hands/hand-types.h"

namespace c8 {

Vector<DetectedPoints> HandDetectorLocal::analyzeHand(
  RenderedSubImage src, c8_PixelPinholeCameraModel k) {
  ScopeTimer t("hand-detect-local-mediapipe-analyze-hand");
  toLetterboxRGBFloat0To1(
    src.image,
    HAND_LANDMARK_DETECTION_INPUT_SIZE,
    HAND_LANDMARK_DETECTION_INPUT_SIZE,
    interpreter_->typed_input_tensor<float>(0));

  {
    ScopeTimer t1("hand-detect-local-mediapipe-invoke");
    interpreter_->Invoke();
  }

  // output tensor 0 - "landmark_tensors"
  // output tensor 1 - "hand_flag_tensor"
  // output tensor 2 - "handedness_tensor" - 0 is Left & 1 is Right
  // output tensor 3 - "world_landmark_tensor"
  const auto *classTensor = interpreter_->typed_output_tensor<float>(1);
  auto confidence = classTensor[0];

  if (confidence <= 0.5f) {
    return {};
  }

  const auto *handednessTensor = interpreter_->typed_output_tensor<float>(2);
  int handedness = (handednessTensor[0] > 0.5f) ? HANDEDNESS_RIGHT : HANDEDNESS_LEFT;

  const auto *meshData = interpreter_->typed_output_tensor<float>(0);

  DetectedPoints d{
    confidence,
    handedness,
    src.viewport,
    src.roi,
    {},  // bounding box -- will fill later.
    {},  // points -- will fill later.
    k,
  };

  constexpr int meshDataSize = 63;

  d.points.reserve(meshDataSize / 3);

  constexpr float scale = 1.0f / 223.0f;
  constexpr float scaleZ = scale * 2.5f;
  for (int i = 0; i < meshDataSize; i += 3) {
    d.points.push_back({
      meshData[i] * scale,
      meshData[i + 1] * scale,
      meshData[i + 2] * scaleZ,
    });
  }

  auto texToRay = renderTexToRaySpace(src.roi, k);

  Vector<HPoint3> referencePts = {
    {d.points[HANDLANDMARK_WRIST].x(), d.points[HANDLANDMARK_WRIST].y(), 1.0f},  // wrist
    {d.points[HANDLANDMARK_INDEX_FINGER_PIP].x(),
     d.points[HANDLANDMARK_INDEX_FINGER_PIP].y(),
     1.0f},  // index finger
    {d.points[HANDLANDMARK_MIDDLE_FINGER_PIP].x(),
     d.points[HANDLANDMARK_MIDDLE_FINGER_PIP].y(),
     1.0f},  // middle finger
    {d.points[HANDLANDMARK_RING_FINGER_PIP].x(),
     d.points[HANDLANDMARK_RING_FINGER_PIP].y(),
     1.0f},  // ring finger
  };
  auto rayRefPts = texToRay * referencePts;

  // Compute the average location of index finger, middle finger and ring finger pip
  float dx = (rayRefPts[1].x() + rayRefPts[3].x()) / 2.0f;
  float dy = (rayRefPts[1].y() + rayRefPts[3].y()) / 2.0f;
  dx = (dx + rayRefPts[2].x()) / 2.0f;
  dy = (dy + rayRefPts[2].y()) / 2.0f;
  // make the line between the above average position and wrist position vertical
  float atanInX = rayRefPts[0].x() - dx;
  float atanInY = rayRefPts[0].y() - dy;
  auto zRotRad = std::atan2(atanInY, atanInX);
  if (atanInX < 0 && atanInY > 0) {
    zRotRad -= (M_PI + M_PI_2);
  } else {
    zRotRad += M_PI_2;
  }

  auto transformForBox = HMatrixGen::zRadians(-zRotRad)
    * HMatrixGen::translation(-rayRefPts[2].x(), -rayRefPts[2].y(), 1.0f) * texToRay;
  auto pixPts = transformForBox * d.points;

  HPoint3 minVal;
  HPoint3 maxVal;
  calculateBoundingCube(pixPts, &minVal, &maxVal);

  Vector<HPoint3> boxRays = {
    {minVal.x(), maxVal.y(), 1.0f},  // lower left
    {maxVal.x(), maxVal.y(), 1.0f},  // lower right
    {minVal.x(), minVal.y(), 1.0f},  // upper left
    {maxVal.x(), minVal.y(), 1.0f},  // upper right
  };

  auto boxCorners = transformForBox.inv() * boxRays;

  // Return the rectangular bounding box from hand landmarks.
  d.boundingBox = {
    {boxCorners[0].x(), boxCorners[0].y()},  // upper left
    {boxCorners[1].x(), boxCorners[1].y()},  // upper right
    {boxCorners[2].x(), boxCorners[2].y()},  // lower left
    {boxCorners[3].x(), boxCorners[3].y()},  // lower right
  };

  return {d};
}  // namespace c8

}  // namespace c8
