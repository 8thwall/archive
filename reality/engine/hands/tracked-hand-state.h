// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#pragma once

#include <deque>

#include "c8/filters.h"
#include "c8/hmatrix.h"
#include "reality/engine/geometry/pose-pnp.h"
#include "reality/engine/hands/hand-types.h"
#include "reality/engine/tracking/ray-point-filter.h"

namespace c8 {

struct HandTrackingResult {
  const Vector<DetectedPoints> *globalHands;
  const Vector<DetectedPoints> *localHands;
  const Vector<Hand3d> *handData;
  const Vector<int> *lostIds;
};

// A bank of filters for smoothing updates to the points on a hand in rayspace.
class HandPointsFilter {
public:
  HandPointsFilter();

  // Default move constructors.
  HandPointsFilter(HandPointsFilter &&) = delete;
  HandPointsFilter &operator=(HandPointsFilter &&) = delete;

  // Disallow copying.
  HandPointsFilter(const HandPointsFilter &) = delete;
  HandPointsFilter &operator=(const HandPointsFilter &) = delete;

  // Update the ray space detect points in place to filtered values.
  void apply(DetectedPoints *raySpacePoints);
  // Update the 3D hand landmarks in place to filtered values.
  void apply(Vector<HPoint3> *landmarkPoints);
  // Update the local vertices in place to filtered values.
  void applyLocalFilter(Vector<HPoint3> *localVertices);
  // Used for the root transform.
  void apply(HPoint3 *rootTranslation, bool isFirstFrame);

  // Update the wrist ray space detect points in place to filtered values.
  void applyWrist(DetectedPoints *wristRaySpacePoints);

private:
  void updateFilter();
  void applyFilter(Vector<HPoint3> *points, Vector<RayPointFilter3a> *filter);
  void applyRecursiveFilter(
    Vector<HPoint3> *points, Vector<RecursiveFilterLowPass<float>> *filterPtr, float alpha);

  Vector<RayPointFilter3a> rayFilters_;
  Vector<RayPointFilter3a> wristRayFilters_;
  Vector<RayPointFilter3a> pointFilters_;
  Vector<RayPointFilter3a> localPointsFilter_;

  Vector<RecursiveFilterLowPass<float>> recursiveRayFilters_;
  Vector<RecursiveFilterLowPass<float>> recursiveWristRayFilters_;
  Vector<RecursiveFilterLowPass<float>> recursivePointFilters_;
  Vector<RecursiveFilterLowPass<float>> recursiveLocalPointsFilter_;

  std::unique_ptr<RayPointFilter3a> translationFilter_;
  Vector<RecursiveFilterLowPass<float>> recursiveTranslationFilter_;
  RayPointFilterConfig config_;
  RayPointFilterConfig transformConfig_;
};

// optimize the translation by computing the difference of current and reference points in ray space
HPoint3 computeMeshTranslation(
  const Vector<HPoint3> &rayPoints,
  const Vector<HPoint3> &meshPts,
  const HPoint3 &startingPosition,
  Vector<float> *residualOutput);

// HandDetectorLocal provides an abstraction layer above the deep net model for analyzing a hand
// in detail from a high res region of interest.
class TrackedHandState {
public:
  // Default constructor.
  TrackedHandState() = default;

  // Default move constructors.
  TrackedHandState(TrackedHandState &&) = delete;
  TrackedHandState &operator=(TrackedHandState &&) = delete;

  // Disallow copying.
  TrackedHandState(const TrackedHandState &) = delete;
  TrackedHandState &operator=(const TrackedHandState &) = delete;

  // Locate hand by the local detection results from HandDetectorLocal with Mediapipe model
  Hand3d locateHand(const DetectedPoints &localHandDetection);

  // Locate hand by the local detection results from HandDetectorLocalMesh with hand mesh model
  Hand3d locateHandMesh(const DetectedPoints &localHandDetection, bool doTrackWrist = false);

  // Mark that a frame could have been tracked, so that framesSinceTracked can be updated, which
  // helps identify lost hands.
  void markFrame();

  Hand3d::TrackingStatus status() const { return status_; };
  Hand3d::HandKind getHandKind(const DetectedPoints &localHandDetection) const;

  // --------------- Debugging API. ------------------
  const Vector<float> &residuals() const { return residuals_; }
  const Vector<float> &inlierResiduals() const { return inlierResiduals_; }
  const int unstableFrames() const { return unstableFrames_; }

private:
  void updateStatus();
  void locateWrist(DetectedRayPoints raySpaceWristMeshLandmarks, bool isLeftHand);

  int framesTracked_ = 0;
  int framesSinceLocated_ = 0;
  HMatrix localPose_ = HMatrixGen::i();
  Hand3d::TrackingStatus status_;
  int unstableFrames_ = 0;
  bool wristLocated_ = false;

  // The following three are used for determining if we're in a LOST state.
  HMatrix previousPose_ = HMatrixGen::i();
  HandPointsFilter filter_;
  BoundingBox previousBBox_;
  BoundingBox currentBBox_;

  Vector<float> residuals_;
  Vector<float> inlierResiduals_;

  // 2D landmark data in ROI texture space
  DetectedPoints meshLocalLandmarks_;
  DetectedPoints wristMeshLocalLandmarks_;

  // Wrist transformation data.
  // Flip X to account for the flip in rotating the wrist.
  HMatrix wristMeshPose_ = HMatrixGen::scaleX(-1.0f);
  RobustPoseScratchSpace wristScratchSpace_;
};

}  // namespace c8
