// Copyright (c) 2023 Niantic Labs
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#pragma once

#include "c8/geometry/face-types.h"
#include "c8/geometry/pixel-pinhole-camera-model.h"
#include "c8/map.h"
#include "c8/vector.h"
#include "reality/engine/api/hand.capnp.h"
#include "reality/engine/faces/tracked-face-state.h"
#include "reality/engine/hands/hand-detector-global.h"
#include "reality/engine/hands/hand-detector-local-mesh.h"
#include "reality/engine/hands/hand-types.h"
#include "reality/engine/hands/tracked-hand-state.h"

namespace c8 {

// HandDetectorLocalMesh provides an abstraction layer above the deep net model for analyzing a hand
// in detail from a high res region of interest.
class HandMeshTracker {
public:
  // Construct from a tflite model.
  HandMeshTracker() = default;

  // Default move constructors.
  HandMeshTracker(HandMeshTracker &&) = default;
  HandMeshTracker &operator=(HandMeshTracker &&) = default;

  // Disallow copying.
  HandMeshTracker(const HandMeshTracker &) = delete;
  HandMeshTracker &operator=(const HandMeshTracker &) = delete;

  void setPalmDetectModel(const uint8_t *model, int modelSize);
  void setHandMeshModel(const uint8_t *model, int modelSize);

  void setPalmDetectModel(Vector<uint8_t> model) { setPalmDetectModel(model.data(), model.size()); }
  void setHandMeshModel(Vector<uint8_t> model) { setHandMeshModel(model.data(), model.size()); }

  HandTrackingResult track(
    const HandRenderResult &handRenderResult, c8_PixelPinholeCameraModel intrinsics, bool doTrackWrists);

  HandTrackingResult track(
    const HandRenderResult &handRenderResult,
    c8_PixelPinholeCameraModel intrinsics,
    bool doTrackWrist,
    DebugOptions::Reader options);

  // Set the maximum number of hands to track per tracker object.
  // The number is capped at 3.
  void setMaxTrackedHands(int n);

  // Clear in-progress tracking state.
  void reset();

  // --------------- Debugging API. ------------------
  const TreeMap<int, TrackedHandState> &handsById() const { return handsById_; }

private:
  std::unique_ptr<HandDetectorGlobal> handDetector_;
  std::unique_ptr<HandDetectorLocalMesh> meshDetector_;
  TreeMap<int, TrackedHandState> handsById_;

  Vector<DetectedPoints> globalHands_;
  Vector<DetectedPoints> localHands_;
  Vector<Hand3d> handData_;
  Vector<int> lostIds_;
  bool forceGlobalNextFrame_ = false;

  void assignIdsToGlobalDetections(Vector<DetectedPoints> &detections);

  // Track 1 hand by default.
  // The number should be between 0 & 3 since we can track at most 3 hands simultaneously.
  int maxTrackedHands_ = 1;
};

}  // namespace c8
