// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "c8/geometry/face-types.h"
#include "c8/geometry/pixel-pinhole-camera-model.h"
#include "c8/map.h"
#include "c8/vector.h"
#include "reality/engine/api/hand.capnp.h"
#include "reality/engine/faces/tracked-face-state.h"
#include "reality/engine/hands/hand-detector-global.h"
#include "reality/engine/hands/hand-detector-local-mediapipe.h"
#include "reality/engine/hands/hand-types.h"
#include "reality/engine/hands/tracked-hand-state.h"

namespace c8 {

// HandDetectorLocal provides an abstraction layer above the deep net model for analyzing a hand
// in detail from a high res region of interest.
class HandTracker {
public:
  // Construct from a tflite model.
  HandTracker() = default;

  // Default move constructors.
  HandTracker(HandTracker &&) = default;
  HandTracker &operator=(HandTracker &&) = default;

  // Disallow copying.
  HandTracker(const HandTracker &) = delete;
  HandTracker &operator=(const HandTracker &) = delete;

  void setPalmDetectModel(const uint8_t *model, int modelSize);
  void setHandDetectModel(const uint8_t *model, int modelSize);

  void setPalmDetectModel(Vector<uint8_t> model) { setPalmDetectModel(model.data(), model.size()); }
  void setHandDetectModel(Vector<uint8_t> model) { setHandDetectModel(model.data(), model.size()); }

  HandTrackingResult track(
    const HandRenderResult &handRenderResult, c8_PixelPinholeCameraModel intrinsics);

  HandTrackingResult track(
    const HandRenderResult &handRenderResult,
    c8_PixelPinholeCameraModel intrinsics,
    DebugOptions::Reader options);

  // Set the maximum number of hands to track per tracker object.
  // The number is capped at 3.
  void setMaxTrackedHands(int n);

  // Clear in-progress tracking state.
  void reset();

private:
  std::unique_ptr<HandDetectorGlobal> handDetector_;
  std::unique_ptr<HandDetectorLocal> meshDetector_;
  TreeMap<int, TrackedHandState> handsById_;

  Vector<DetectedPoints> globalHands_;
  Vector<DetectedPoints> localHands_;
  Vector<Hand3d> handData_;
  Vector<int> lostIds_;

  void assignIdsToGlobalDetections(Vector<DetectedPoints> &detections);

  // Track 1 hand by default.
  // The number should be between 0 & 3 since we can track at most 3 hands simultaneously.
  int maxTrackedHands_ = 1;
};

}  // namespace c8
