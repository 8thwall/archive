// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "c8/geometry/face-types.h"
#include "c8/vector.h"
#include "reality/engine/deepnets/tflite-interpreter.h"
#include "reality/engine/hands/hand-types.h"

namespace c8 {
constexpr size_t HAND_LOCAL_CACHE_SIZE = 3660000;

// HandDetectorLocal provides an abstraction layer above the deep net model for analyzing a face
// in detail from a high res region of interest.
class HandDetectorLocal {
public:
  // Construct from a tflite model.
  HandDetectorLocal(const uint8_t *modelData, int modelSize)
      : interpreter_(modelData, modelSize, HAND_LOCAL_CACHE_SIZE) {}
  HandDetectorLocal(const Vector<uint8_t> &modelData)
      : interpreter_(modelData, HAND_LOCAL_CACHE_SIZE) {}

  // Default move constructors.
  HandDetectorLocal(HandDetectorLocal &&) = default;
  HandDetectorLocal &operator=(HandDetectorLocal &&) = default;

  // Disallow copying.
  HandDetectorLocal(const HandDetectorLocal &) = delete;
  HandDetectorLocal &operator=(const HandDetectorLocal &) = delete;

  // Detect hands in a zoomed in crop of an image. The src should be 224x224.
  Vector<DetectedPoints> analyzeHand(RenderedSubImage src, c8_PixelPinholeCameraModel k);

private:
  TFLiteInterpreter interpreter_;
};

}  // namespace c8
