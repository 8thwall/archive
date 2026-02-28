// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "c8/geometry/face-types.h"
#include "c8/vector.h"
#include "reality/engine/deepnets/detection-anchor-nms.h"
#include "reality/engine/deepnets/tflite-interpreter.h"

namespace c8 {
constexpr size_t HAND_GLOBAL_CACHE_SIZE = 3510000;

// HandDetectorGlobal provides an abstraction layer above the deep net model for detecting multiple
// hands in a full image. The data extracted about each hand are relatively light-weight, and
// typically global hand detection is a precurosor to local hand detection which takes a zoomed-in
// image of each hand and extracts detailed information.
class HandDetectorGlobal {
public:
  // Construct from a tflite model.
  HandDetectorGlobal(const uint8_t *modelData, int modelSize)
      : interpreter_(modelData, modelSize, HAND_GLOBAL_CACHE_SIZE, NUM_THREADS) {
    initializeDetection();
  }
  HandDetectorGlobal(const Vector<uint8_t> &modelData)
      : interpreter_(modelData, HAND_GLOBAL_CACHE_SIZE, NUM_THREADS) {
    initializeDetection();
  }

  // Default move constructors.
  HandDetectorGlobal(HandDetectorGlobal &&) = default;
  HandDetectorGlobal &operator=(HandDetectorGlobal &&) = default;

  // Disallow copying.
  HandDetectorGlobal(const HandDetectorGlobal &) = delete;
  HandDetectorGlobal &operator=(const HandDetectorGlobal &) = delete;

  // Detect hands in a low resolution render of an image. The low resolution src should have its
  // longest dimension exactly equal to 192.
  Vector<DetectedPoints> detectHands(RenderedSubImage src, c8_PixelPinholeCameraModel k);

private:
  TFLiteInterpreter interpreter_;
  // TODO(dat): Collecting timing data when pthread run is available to determine a better value
  static constexpr int NUM_THREADS = 1;

  Vector<Anchor> anchors_;
  ProcessOptions decodeOptions_;
  void initializeDetection();
};

}  // namespace c8
