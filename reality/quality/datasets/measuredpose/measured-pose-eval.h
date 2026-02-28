// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "c8/geometry/pixel-pinhole-camera-model.h"
#include "c8/hmatrix.h"
#include "c8/hpoint.h"
#include "c8/map.h"
#include "c8/pixels/render/object8.h"
#include "c8/vector.h"
#include "reality/engine/api/reality.capnp.h"
#include "reality/engine/executor/xr-engine.h"

namespace c8 {

class EvalFrame {
public:
  // Third party (ARCore/ARKit) map points in camera space.
  Vector<HPoint3> camPoints;
  c8_PixelPinholeCameraModel intrinsic;
  // Third party estimate of the camera pose.
  HMatrix measuredExtrinsic = HMatrixGen::i();
  // Our c8 estimate of the camera pose.
  HMatrix estimatedExtrinsic = HMatrixGen::i();
  // The initial extrinsic, used to correct c8 space.
  HMatrix c8Correction = HMatrixGen::i();
  int64_t frameNumber = -1;
  // Our c8 estimate of map points in c8 space that has been corrected for the initial extrinsic.
  Vector<HPoint3> c8RecentTriangulatedMapPointsInCorrectedWorld;
  Vector<HPoint3> c8TenuredTriangulatedMapPointsInCorrectedWorld;
  Vector<HPoint3> c8RecentGroundMapPointsInCorrectedWorld;
  Vector<HPoint3> c8TenuredGroundMapPointsInCorrectedWorld;
  // Stores the WorldPointId.id() for each point in *TriangulatedMapPointsInCorrectedWorld.
  Vector<uint32_t> c8RecentTriangulatedMapPointIds;
  Vector<uint32_t> c8TenuredTriangulatedMapPointIds;
  // Stores the WorldPointId.id() for each point in *GroundMapPointsInCorrectedWorld.
  Vector<uint32_t> c8RecentGroundMapPointIds;
  Vector<uint32_t> c8TenuredGroundMapPointIds;

  EvalFrame() = default;

  static EvalFrame compute(
    XREngine &xr,
    RealityRequest::Reader request,
    RealityResponse::Reader response,
    EvalFrame *previousFrame);

  EvalFrame(EvalFrame &&) = default;
  EvalFrame &operator=(EvalFrame &&) = default;

  // Allow copying.
  EvalFrame(const EvalFrame &) = default;
  EvalFrame &operator=(const EvalFrame &) = default;

private:
  EvalFrame(
    Vector<HPoint3> &&camPoints,
    c8_PixelPinholeCameraModel intrinsic,
    const HMatrix &measuredExtrinsic,
    const HMatrix &estimatedExtrinsic,
    const HMatrix &c8Correction,
    int64_t frameNumber,
    Vector<HPoint3> &&c8RecentTriangulatedMapPointsFromMeasuredPose,
    Vector<HPoint3> &&c8TenuredTriangulatedMapPointsFromMeasuredPose,
    Vector<HPoint3> &&c8RecentGroundMapPointsFromMeasuredPose,
    Vector<HPoint3> &&c8TenuredGroundMapPointsFromMeasuredPose,
    Vector<uint32_t> &&c8RecentTriangulatedMapPointsIds,
    Vector<uint32_t> &&c8TenuredTriangulatedMapPointsIds,
    Vector<uint32_t> &&c8RecentGroundMapPointsIds,
    Vector<uint32_t> &&c8TenuredGroundMapPointsIds);
};

struct ATESummary {
  // The trajectory produced in metric scale by ARKit/ARCore.
  Vector<HPoint3> measuredTrajectory;
  // The trajectory produced in C8 scale by our engine.
  Vector<HPoint3> estimatedTrajectory;
  // The estimatedTrajectory after being transformed so that we minimize the deltas between
  // the estimated and measured trajectory.  In other words, it's the estimated trajectory in
  // the measured trajectory's coordinate frame.
  Vector<HPoint3> estimatedInMeasured;
  // The transformation that transforms the estimated trajectory so as to minimize the delta between
  // the transformed estimated trajectory and the measured trajectory.  This is also known as
  // the absolute orientation transformation.  Note that the scale is uniform.
  HMatrix estimatedToMeasured = HMatrixGen::i();
  // The squared error on a per-frame basis between the measured trajectory and the transformed
  // estimated trajectory.
  Vector<float> errors;
  // The root-mean-squared-error between the ground truth trajectory and the aligned estimated
  // trajectory.
  float ateError = 0.0f;
};

struct EvalMotionLength {
  float measuredMotionLength = 0.0f;
  float estimatedMotionLength = 0.0f;
};

struct EvalFrameDelta {
  // Points in camera space representing the map generated from the third party (ARCore/ARKit)
  // library.
  Vector<HPoint3> camPoints;
  // camPoints projected into image space as pixels.
  Vector<HPoint2> imPoints;
  // Third party (ARCore/ARKit) estimate of the camera movement delta in relation to previous
  // frame's pose.
  HMatrix measuredEgomotion = HMatrixGen::i();
  // Points in camera space of the previous frame's camPoints transformed by the measuredEgomotion
  // delta.
  Vector<HPoint3> measuredLastCamPoints;
  // measuredLastCamPoints in image space.
  Vector<HPoint2> measuredImPoints;
  // Our XR8 estimate of the camera movement delta in relation to the previous frame's pose. This
  // may be scaled to better align our estimates with ARCore's estimates.
  HMatrix estimatedEgomotion = HMatrixGen::i();
  // Previous frame's camPoints transformed by the estimatedEgomotion delta.
  Vector<HPoint3> estimatedLastCamPoints;
  // estimatedLastCamPoints projected into image space as pixels.
  Vector<HPoint2> estimatedImPoints;

  static EvalFrameDelta compute(const EvalFrame &last, const EvalFrame &now, float scale);

  EvalFrameDelta(EvalFrameDelta &&) = default;
  EvalFrameDelta &operator=(EvalFrameDelta &&) = default;

  // Disallow copying.
  EvalFrameDelta(const EvalFrameDelta &) = delete;
  EvalFrameDelta &operator=(const EvalFrameDelta &) = delete;

  // Compute deltas from a sliding window with stride n.
  static Vector<EvalFrameDelta> deltas(const Vector<EvalFrame> &frames, float scale, int n);

  // Compute t-1 deltas from k frames.
  static Vector<EvalFrameDelta> deltas(const Vector<EvalFrame> &frames, float scale);

  // Compute t-1 motion lengths for each pair of frames. This is an input to estimateScale.
  static Vector<EvalMotionLength> motionLength(const Vector<EvalFrame> &frames);

  // Estimate the scale that best matches a true scale measured pose with a scale free estimated
  // pose by taking the mediun ratio between the measured and estimated motion lengths.
  // Estimated in Measured = scale * Estimated Scale Free.
  static float estimateScale(const Vector<EvalMotionLength> &motionLength);

  // Estimate the scale that best matches a true scale measured pose with a scale free estimated
  // pose. This does so by finding the absolute orientation transformation that minimizes the delta
  // between the estimated and measured trajectory.  The scale of that transformation is uniform, so
  // return that uniform scale.
  // Estimated in Measured = scale * Estimated Scale Free.
  static float estimateScale(const Vector<EvalFrame> &frames);

private:
  EvalFrameDelta(
    Vector<HPoint3> &&camPoints_,
    Vector<HPoint2> &&imPoints_,
    HMatrix &&measuredEgomotion_,
    Vector<HPoint3> &&measuredLastCamPoints_,
    Vector<HPoint2> &&measuredImPoints_,
    HMatrix &&estimatedEgomotion_,
    Vector<HPoint3> &&estimatedLastCamPoints_,
    Vector<HPoint2> &&estimatedImPoints_);
};

class MeasuredPoseEval {
public:
  MeasuredPoseEval();

  Tracker &tracker() { return xr_.tracker(); }

  void addFrame(RealityRequest::Reader request, RealityResponse::Reader response);

  // Returns the estimated scale that best matches a true scale measured pose with a scale free
  // estimated pose.  This is using the camera translation, or motion lengths, to determine the
  // estimated scale.
  float estimateScale();

  // Compute score statistics assuming the provided scale. Score statistics will be added as
  // counters to the summarizer.
  void anchoredMapPointPixelError(float scale, String prefix);

  // Compute motion prediction score statistics which will be added as counters to the summarizer.
  void predictedMotionErrorToSummarizer(const String &prefix);

  // ATE Error is the Root Mean Squared Error of the differences in the trajectories.  Root Mean
  // Square Error is the square root of the average of the squared differences between the aligned
  // estimated trajectory and the ground truth trajectory.
  // @param scaleTrajectory scales the c8 trajectory in order to minimize the ATE error between the
  // c8 and measured trajectory.
  void absoluteTrajectoryErrorToSummarizer(const String &prefix, bool scaleTrajectory);

  void scaleErrorToSummarizer(const String &prefix, float trueScale);

  void percentageTrackingToSummarizer(const String &prefix);

  // Information about each frame, including the world map points from the AR engine (in the
  // camera's point of view), the intrinsics, and the measured pose from both the native AR engine
  // and the XR Engine.
  const Vector<EvalFrame> &stats() const { return stats_; }

  // Explicitly disallow moving. The XrEngine member is unmoveable, so this method is already
  // implicitly deleted.
  MeasuredPoseEval(MeasuredPoseEval &&) = delete;
  MeasuredPoseEval &operator=(MeasuredPoseEval &&) = delete;

  // Disallow copying.
  MeasuredPoseEval(const MeasuredPoseEval &) = delete;
  MeasuredPoseEval &operator=(const MeasuredPoseEval &) = delete;

private:
  XREngine xr_;
  Vector<EvalFrame> stats_;
};

//  Returns the scale that scales synthetic space to c8 world space.
float computeSyntheticToC8Scale(Group *syntheticSceneContent);

// Normalizes the synthetic scene content to c8 space, which is how it is compared to the c8 SLAM
// map points. Also returns the scale that scales synthetic space to c8 world space, i.e. the result
// of computeSyntheticToC8Scale()
float normalizeSyntheticSceneContent(Group *syntheticSceneContent);

// Scores

// Anchored Map-Point Pixel Error Score: This score computes the pixel-level drift of virtual
// content anchored at all visible map points.  The algorithm is the following:
// 1) For each frame, start with two cameras (measured and estimated) in the same location, both
//    view the same points in a map. These map points are measured points in the world (e.g. from
//    ARKit or ARCore).
// 2) Advance the position of cameras forward by their egomotion for the last frame.
//    a) For the measured camera, this is its measured egomotion.
//    b) For the estimated camera, this is its estimated egomotion with translation scaled by a
//    value that should make its motion comparable with the measured camera.
// 3) Compute the positions of the map points projected into both frames. These pixel positions will
//    be different because the measured and estimated cameras moved by different amounts.
// 4) Compare the pixel distance of the projection into the measured camera and the estimated
//    camera.
Vector<float> anchoredMapPointPixelError(const Vector<EvalFrameDelta> &deltas);

// Return the per-frame cm distance between the predicted motion (without using computer
// vision) and the actual motion (using computer vision).
Vector<float> predictedMotionError(const Vector<EvalFrame> &frames);

Vector<float> percentageTracking(const Vector<EvalFrame> &frames);

// ATE Error is the Root Mean Squared Error of the differences in the trajectories.  Root Mean
// Square Error is the square root of the average of the squared differences between the aligned
// estimated trajectory and the ground truth trajectory.
// @param scaleTrajectory scales the c8 trajectory in order to minimize the ATE error between the c8
// and measured trajectory.
ATESummary absoluteTrajectoryError(const Vector<EvalFrame> &frames, bool scaleTrajectory = true);
}  // namespace c8
