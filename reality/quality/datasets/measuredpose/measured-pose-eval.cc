// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "measured-pose-eval.h",
  };
  deps = {
    "//c8:hmatrix",
    "//c8:hpoint",
    "//c8:map",
    "//c8:vector",
    "//c8/geometry:egomotion",
    "//c8/geometry:intrinsics",
    "//c8/geometry:pixel-pinhole-camera-model",
    "//c8/geometry:vectors",
    "//c8/io:file-io",
    "//c8/pixels/render:object8",
    "//c8/protolog:xr-requests",
    "//c8/string:containers",
    "//reality/engine/api:reality.capnp-cc",
    "//reality/engine/executor:xr-engine",
  };
  data = {
    "//reality/quality/benchmark:sequences",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0xdf165999);

#include "c8/geometry/egomotion.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/vectors.h"
#include "c8/io/file-io.h"
#include "c8/pixels/render/object8.h"
#include "c8/protolog/xr-requests.h"
#include "c8/string/containers.h"
#include "reality/quality/datasets/measuredpose/measured-pose-eval.h"

namespace c8 {

namespace {

float anchoredMapPointPixelErrorInternal(const EvalFrameDelta &frameDelta) {
  if (frameDelta.measuredImPoints.empty()) {
    return -1.0f;
  }
  float sumErr = 0;
  for (int p = 0; p < frameDelta.measuredImPoints.size(); ++p) {
    float xd = frameDelta.measuredImPoints[p].x() - frameDelta.estimatedImPoints[p].x();
    float yd = frameDelta.measuredImPoints[p].y() - frameDelta.estimatedImPoints[p].y();
    float err = std::sqrt(xd * xd + yd * yd);
    float err1K = 1e3 * err + 1;
    sumErr += err1K;
  }
  auto result = sumErr / frameDelta.measuredImPoints.size();
  if (result < 0.f) {
    C8_THROW(
      "[measured-pose-eval@anchoredMapPointPixelErrorInternal] Returning a negative error. This is "
      "most likeley because of overflow.");
  }
  return result;
}

Vector<float> anchoredMapPointPixelErrorInternal(const Vector<EvalFrameDelta> &deltas) {
  Vector<float> s;
  s.reserve(deltas.size());
  for (const auto &d : deltas) {
    s.push_back(anchoredMapPointPixelErrorInternal(d));
  }
  return s;
}

// Gets a matrix required to correct the c8 world points from their initial transform.
HMatrix correctC8Position(const ResponsePose::Reader &computedPose) {
  auto initRot = computedPose.getInitialTransform().getRotation();
  auto initPos = computedPose.getInitialTransform().getPosition();
  auto initRotQ = Quaternion(initRot.getW(), initRot.getX(), initRot.getY(), initRot.getZ());
  auto initPosV = HVector3(initPos.getX(), initPos.getY(), initPos.getZ());
  return cameraMotion(initPosV, initRotQ);
}

}  // namespace

EvalFrame EvalFrame::compute(
  XREngine &xr,
  RealityRequest::Reader request,
  RealityResponse::Reader response,
  EvalFrame *previousFrame) {

  auto me = response.getXRResponse().getCamera().getExtrinsic();
  auto measuredExtrinsic =
    cameraMotion(toHVector(me.getPosition()), toQuaternion(me.getRotation()));

  auto deviceModel = DeviceInfos::getDeviceModel(request.getDeviceInfo());
  c8_PixelPinholeCameraModel intrinsic = Intrinsics::getProcessingIntrinsics(deviceModel, 480, 640);
  if (request.getSensors().hasARCore()) {
    // For ARCore sequences, get the real intrinsics so we can project world points to image points
    // for eval. This requires correcting the self-reported intrinsics from arcore (which are for a
    // 16:9 crop) to cover the full 4:3 sensor.  This is legacy code for handling our representative
    // sequences.
    float s = 360.0f / 1080.0f;
    auto i = request.getSensors().getCamera().getPixelIntrinsics();
    intrinsic = {
      static_cast<int>(i.getPixelsWidth() * s) + 120,
      static_cast<int>(i.getPixelsHeight() * s),
      i.getCenterPointX() * s + 60,
      i.getCenterPointY() * s,
      i.getFocalLengthHorizontal() * s,
      i.getFocalLengthVertical() * s};
  } else if (request.getSensors().hasARKit()) {
    // ARKit has special logic to account for things like changes in focal point on a frame by frame
    // basis. Example intrinsics for iPhone 12 Pro Max:
    //   Our intrinsic:
    //     (w: 480, h: 640, cx: 239.50, cy: 319.50, fh: 496.00, fv: 496.00)
    //   ARKit provided intrinsic:
    //     (w: 1440, h: 1920, cx: 713.17, cy: 967.70, fh: 1520.30, fv: 1520.30)
    //   Scaled ARKit provided intrinsic:
    //     (w: 480, h: 640, cx: 237.39, cy: 322.23, fh: 506.77, fv: 506.77)
    // To given a rough understanding of how much the dynamic intrinsics can change, for the
    // depth-mapping/log.1625079428-600 sequence, we get the following ranges:
    //   cx: 237.38 to 238.65
    //   cy: 320.91 to 322.4
    //   fh and fv scale uniformally between 482.29 to 515.71
    auto i = request.getSensors().getCamera().getPixelIntrinsics();
    intrinsic = Intrinsics::cropAndScaleIntrinsics(
      {static_cast<int>(i.getPixelsWidth()),
       static_cast<int>(i.getPixelsHeight()),
       i.getCenterPointX(),
       i.getCenterPointY(),
       i.getFocalLengthHorizontal(),
       i.getFocalLengthVertical()},
      480,
      640);
  }

  // Returns ARCore world points.
  Vector<HPoint3> worldPoints;
  for (auto rpt : response.getFeatureSet().getPoints()) {
    worldPoints.push_back(toHPoint(rpt.getPosition()));
  }

  // Extract IMU info from request.
  TrackingSensorFrame sf;
  prepareTrackingSensorFrame(
    DeviceInfos::getDeviceModel(request.getDeviceInfo()),
    request.getDeviceInfo().getManufacturer(),
    intrinsic,
    request.getSensors(),
    &sf);

  // Put world points in view space
  auto camPoints = measuredExtrinsic.inv() * worldPoints;

  // Remove the other sensors so that it forces our engine to use our own technology on the raw
  // request.  Otherwise, it will just return the extrinsic from ARCore/ARKit, which is used for
  // 8th Wall Unity applications.
  MutableRootMessage<RealityRequest> c8Request(request);
  c8Request.builder().getSensors().disownARKit();
  c8Request.builder().getSensors().disownARCore();
  c8Request.builder().getSensors().disownTango();
  c8Request.builder().getSensors().getCamera().disownPixelIntrinsics();

  auto frame =
    request.getSensors().getCamera().getCurrentFrame().getImage().getOneOf().getGrayImagePointer();
  auto cg = c8Request.builder().getXRConfiguration().getCameraConfiguration().getCaptureGeometry();
  cg.setWidth(frame.getCols());
  cg.setHeight(frame.getRows());

  MutableRootMessage<RealityResponse> c8Response;
  auto c8ResponseBuilder = c8Response.builder();
  xr.execute(c8Request.reader(), &c8ResponseBuilder);

  auto ee = c8Response.reader().getXRResponse().getCamera().getExtrinsic();
  auto estimatedExtrinsic =
    cameraMotion(toHVector(ee.getPosition()), toQuaternion(ee.getRotation()));

  // Get XR8 map points.
  Vector<HPoint3> c8RecentTriangulatedMapPointsInCorrectedWorld;
  Vector<HPoint3> c8TenuredTriangulatedMapPointsInCorrectedWorld;
  Vector<HPoint3> c8RecentGroundMapPointsInCorrectedWorld;
  Vector<HPoint3> c8TenuredGroundMapPointsInCorrectedWorld;
  // Store the WorldPointId.id() of triangulated and ground points for mapStructureError.
  Vector<uint32_t> c8RecentTriangulatedMapPointIds;
  Vector<uint32_t> c8TenuredTriangulatedMapPointIds;
  Vector<uint32_t> c8RecentGroundMapPointIds;
  Vector<uint32_t> c8TenuredGroundMapPointIds;

  // Correct the map points based on the initial transform of the camera.
  auto c8Correction = correctC8Position(c8Response.reader().getPose());
  auto c8CorrectionInv = c8Correction.inv();
  c8RecentTriangulatedMapPointsInCorrectedWorld =
    c8CorrectionInv * c8RecentTriangulatedMapPointsInCorrectedWorld;
  c8TenuredTriangulatedMapPointsInCorrectedWorld =
    c8CorrectionInv * c8TenuredTriangulatedMapPointsInCorrectedWorld;
  c8RecentGroundMapPointsInCorrectedWorld =
    c8CorrectionInv * c8RecentGroundMapPointsInCorrectedWorld;
  c8TenuredGroundMapPointsInCorrectedWorld =
    c8CorrectionInv * c8TenuredGroundMapPointsInCorrectedWorld;

  auto frameNumber = xr.tracker().currentFrame();
  return EvalFrame(
    std::move(camPoints),
    intrinsic,
    measuredExtrinsic,
    estimatedExtrinsic,
    c8Correction,
    frameNumber,
    std::move(c8RecentTriangulatedMapPointsInCorrectedWorld),
    std::move(c8TenuredTriangulatedMapPointsInCorrectedWorld),
    std::move(c8RecentGroundMapPointsInCorrectedWorld),
    std::move(c8TenuredGroundMapPointsInCorrectedWorld),
    std::move(c8RecentTriangulatedMapPointIds),
    std::move(c8TenuredTriangulatedMapPointIds),
    std::move(c8RecentGroundMapPointIds),
    std::move(c8TenuredGroundMapPointIds));
}

EvalFrame::EvalFrame(
  Vector<HPoint3> &&camPoints_,
  c8_PixelPinholeCameraModel intrinsic_,
  const HMatrix &measuredExtrinsic_,
  const HMatrix &estimatedExtrinsic_,
  const HMatrix &c8Correction_,
  int64_t frameNumber_,
  Vector<HPoint3> &&c8RecentTriangulatedMapPointsInCorrectedWorld_,
  Vector<HPoint3> &&c8TenuredTriangulatedMapPointsInCorrectedWorld_,
  Vector<HPoint3> &&c8RecentGroundMapPointsInCorrectedWorld_,
  Vector<HPoint3> &&c8TenuredGroundMapPointsInCorrectedWorld_,
  Vector<uint32_t> &&c8RecentTriangulatedMapPointIds_,
  Vector<uint32_t> &&c8TenuredTriangulatedMapPointIds_,
  Vector<uint32_t> &&c8RecentGroundMapPointIds_,
  Vector<uint32_t> &&c8TenuredGroundMapPointIds_)
    : camPoints(std::move(camPoints_)),
      intrinsic(intrinsic_),
      measuredExtrinsic(measuredExtrinsic_),
      estimatedExtrinsic(estimatedExtrinsic_),
      c8Correction(c8Correction_),
      frameNumber(frameNumber_),
      c8RecentTriangulatedMapPointsInCorrectedWorld(
        std::move(c8RecentTriangulatedMapPointsInCorrectedWorld_)),
      c8TenuredTriangulatedMapPointsInCorrectedWorld(
        std::move(c8TenuredTriangulatedMapPointsInCorrectedWorld_)),
      c8RecentGroundMapPointsInCorrectedWorld(std::move(c8RecentGroundMapPointsInCorrectedWorld_)),
      c8TenuredGroundMapPointsInCorrectedWorld(
        std::move(c8TenuredGroundMapPointsInCorrectedWorld_)),
      c8RecentTriangulatedMapPointIds(std::move(c8RecentTriangulatedMapPointIds_)),
      c8TenuredTriangulatedMapPointIds(std::move(c8TenuredTriangulatedMapPointIds_)),
      c8RecentGroundMapPointIds(std::move(c8RecentGroundMapPointIds_)),
      c8TenuredGroundMapPointIds(std::move(c8TenuredGroundMapPointIds_)) {}

EvalFrameDelta EvalFrameDelta::compute(const EvalFrame &last, const EvalFrame &now, float scale) {
  auto isPointInFrame = [](auto extrinsic, auto intrinsic, auto pointInCam) -> bool {
    HPoint2 lowerLeft;
    HPoint2 upperRight;
    frameBounds(intrinsic, &lowerLeft, &upperRight);
    // Don't add points that are too close to the camera since they are most probably wrong.
    if (pointInCam.z() < 0.2f) {
      return false;
    }
    auto posInRay = pointInCam.flatten();
    return (
      lowerLeft.x() < posInRay.x() && posInRay.x() < upperRight.x() && lowerLeft.y() < posInRay.y()
      && posInRay.y() < upperRight.y());
  };
  auto intrinsic = HMatrixGen::intrinsic(now.intrinsic);

  // Find the location (in pixel space) of the current world points in the measured camera.
  // These will be used on the next frame to judge the next frame's motion.
  auto camPoints = now.camPoints;
  auto imPoints = flatten<2>(intrinsic * now.camPoints);

  // Only use points that were previously visible.
  Vector<HPoint3> lastCamPoints;
  for (const auto &point : last.camPoints) {
    if (isPointInFrame(last.measuredExtrinsic, last.intrinsic, point)) {
      lastCamPoints.push_back(point);
    }
  }

  // Compute the pixel locations of the world points from the previous frame in the new measured
  // frame.
  auto measuredEgomotion = egomotion(last.measuredExtrinsic, now.measuredExtrinsic);
  auto measuredLastCamPoints = measuredEgomotion.inv() * lastCamPoints;
  auto measuredImPoints = flatten<2>(intrinsic * measuredLastCamPoints);

  // Compute the motion of the estimated camera, with scaling applied to match the measured camera
  // scale.
  auto estimatedEgomotion =
    scaleTranslation(scale, egomotion(last.estimatedExtrinsic, now.estimatedExtrinsic));

  // Compute the pixel locations of the world points from the previous frame in the new (scaled)
  // estimated frame.
  auto estimatedLastCamPoints = estimatedEgomotion.inv() * lastCamPoints;
  auto estimatedImPoints = flatten<2>(intrinsic * estimatedLastCamPoints);
  return EvalFrameDelta(
    std::move(camPoints),
    std::move(imPoints),
    std::move(measuredEgomotion),
    std::move(measuredLastCamPoints),
    std::move(measuredImPoints),
    std::move(estimatedEgomotion),
    std::move(estimatedLastCamPoints),
    std::move(estimatedImPoints));
}

EvalFrameDelta::EvalFrameDelta(
  Vector<HPoint3> &&camPoints_,
  Vector<HPoint2> &&imPoints_,
  HMatrix &&measuredEgomotion_,
  Vector<HPoint3> &&measuredLastCamPoints_,
  Vector<HPoint2> &&measuredImPoints_,
  HMatrix &&estimatedEgomotion_,
  Vector<HPoint3> &&estimatedLastCamPoints_,
  Vector<HPoint2> &&estimatedImPoints_)
    : camPoints(std::move(camPoints_)),
      imPoints(std::move(imPoints_)),
      measuredEgomotion(std::move(measuredEgomotion_)),
      measuredLastCamPoints(std::move(measuredLastCamPoints_)),
      measuredImPoints(std::move(measuredImPoints_)),
      estimatedEgomotion(std::move(estimatedEgomotion_)),
      estimatedLastCamPoints(std::move(estimatedLastCamPoints_)),
      estimatedImPoints(std::move(estimatedImPoints_)) {}

Vector<EvalFrameDelta> EvalFrameDelta::deltas(const Vector<EvalFrame> &frames, float scale, int n) {
  if (frames.empty()) {
    return {};
  }
  Vector<EvalFrameDelta> deltas;
  for (int i = n; i < frames.size(); ++i) {
    deltas.push_back(EvalFrameDelta::compute(frames[i - n], frames[i], scale));
  }
  return deltas;
}

Vector<EvalFrameDelta> EvalFrameDelta::deltas(const Vector<EvalFrame> &frames, float scale) {
  return deltas(frames, scale, 1);
}

Vector<float> anchoredMapPointPixelError(const Vector<EvalFrameDelta> &deltas) {
  return anchoredMapPointPixelErrorInternal(deltas);
}

Vector<EvalMotionLength> EvalFrameDelta::motionLength(const Vector<EvalFrame> &frames) {
  auto deltas = EvalFrameDelta::deltas(frames, 1.0f);
  Vector<EvalMotionLength> s;
  s.reserve(deltas.size());
  for (const auto &d : deltas) {
    s.push_back(
      {translation(d.measuredEgomotion).l2Norm(), translation(d.estimatedEgomotion).l2Norm()});
  }
  return s;
}

float EvalFrameDelta::estimateScale(const Vector<EvalMotionLength> &motionLength) {
  Vector<float> ratios;
  ratios.reserve(motionLength.size());
  for (auto m : motionLength) {
    if (m.measuredMotionLength > 1e-3) {
      ratios.push_back(m.estimatedMotionLength / m.measuredMotionLength);
    }
  }
  if (ratios.empty()) {
    return 1.0f;
  }
  std::nth_element(ratios.begin(), ratios.begin() + ratios.size() / 2, ratios.end());
  return 1.0f / ratios[ratios.size() / 2];
}

float EvalFrameDelta::estimateScale(const Vector<EvalFrame> &frames) { return 0.f; }

MeasuredPoseEval::MeasuredPoseEval() {
  xr_.setDisableSummaryLog(true);
  xr_.setResetLoggingTreeRoot(true);
}

void MeasuredPoseEval::addFrame(RealityRequest::Reader request, RealityResponse::Reader response) {
  EvalFrame *previousFrame = nullptr;
  if (stats_.size() > 0) {
    previousFrame = &stats_[stats_.size() - 1];
  }

  auto evalFrame = EvalFrame::compute(xr_, request, response, previousFrame);

  stats_.push_back(evalFrame);
}

float MeasuredPoseEval::estimateScale() {
  return EvalFrameDelta::estimateScale(EvalFrameDelta::motionLength(stats_));
}

void MeasuredPoseEval::anchoredMapPointPixelError(float scale, String prefix) {
  ScopeTimer rt("benchmark");
  for (auto score : anchoredMapPointPixelErrorInternal(EvalFrameDelta::deltas(stats_, scale))) {
    if (score >= 0.0f) {
      rt.addCounter((prefix + "per-frame-error-1k").c_str(), score);
    }
  }
}

void MeasuredPoseEval::predictedMotionErrorToSummarizer(const String &prefix) {
  ScopeTimer rt("benchmark");
  for (auto score : predictedMotionError(stats_)) {
    if (score >= 0.0f) {
      // Our convention for the logging summarizer is to multiply by 1000 to get 3 digits of
      // accuracy and then truncate to int since floating point values accumulate error as they
      // increase away from zero while integer types don't. If you want precision across a sum of
      // a lot of numbers, integers are your best bet. We divide by 1000 on the other end.
      rt.addCounter((prefix + "per-frame-motion-prediction-cm-error-1k").c_str(), score * 1e3);
    }
  }
}

void MeasuredPoseEval::absoluteTrajectoryErrorToSummarizer(
  const String &prefix, bool scaleTrajectory) {
  ScopeTimer rt("benchmark");
  const auto &ateSummary = absoluteTrajectoryError(stats_, scaleTrajectory);
  for (auto score : ateSummary.errors) {
    rt.addCounter((prefix + "absolute-trajectory-error-1k").c_str(), score * 1e3);
  };
}

// ATE Error is the Root Mean Squared Error of the differences in the trajectories.  Root Mean
// Square Error is the square root of the average of the squared differences between the aligned
// estimated trajectory and the ground truth trajectory.
ATESummary absoluteTrajectoryError(const Vector<EvalFrame> &frames, bool scaleTrajectory) {
  return {};
}

float computeSyntheticToC8Scale(Group *syntheticSceneContent) {
  // Necessary to scale the measured extrinsic
  auto synthLocalScale = trsScale(syntheticSceneContent->local());
  return 3.0f / (synthLocalScale.x() + synthLocalScale.y() + synthLocalScale.z());
}

float normalizeSyntheticSceneContent(Group *syntheticSceneContent) {
  const auto scale = computeSyntheticToC8Scale(syntheticSceneContent);
  // normalize the content to c8 space.
  syntheticSceneContent->setLocal(HMatrixGen::i());
  return scale;
}

Vector<float> predictedMotionError(const Vector<EvalFrame> &frames) {
  return map<EvalFrame, float>(frames, [](const EvalFrame &f) {
    // Originally the distance was in meters.  We multiply by 100 to compute the cm distance between
    // the predicted motion and the measured extrinsic translational component.  These values are
    // typically in the range of 0.1 to 1.0 after being multiplied by 100.
    float tDelta = 0.f;
    // (translation(f.measuredExtrinsic) - translation(f.predictedMotion.pos)).l2Norm() * 100.f;

    // Find the delta, from 0 to 3.14, between the two matrices rotations. We are using quaternion
    // distance instead of the the pattern of converting the two rotations into their axis-angle
    // representations and summing the delta of their components.  The axis-angle pattern reflected
    // the delta between each of the three axes, but the quaternion distance better represents the
    // direct delta between two rotations in 3D space. It's the equivalent of using euclidean
    // distance (quaternion distance) instead of manhattan distance (sum of the axis-angle component
    // deltas).  Also note we are using q1.angle(q2) since it has a linear residual compared to
    // q2.dist(q2).  angle() more harshly punishes smaller residuals than dist().  We are
    // multiplying by 8 because we found that to give roughly an equal weight between the
    // translation and the rotation delta on our representative dataset.
    auto rotationDelta = 0.f;
    // (Quaternion::fromHMatrix(f.measuredExtrinsic)
    //    .radians(Quaternion::fromHMatrix(f.predictedMotion.pos))
    //  * 8.f);

    return tDelta + rotationDelta;
  });
}

void MeasuredPoseEval::percentageTrackingToSummarizer(const String &prefix) {
  ScopeTimer rt("benchmark");
  for (auto score : percentageTracking(stats_)) {
    rt.addCounter((prefix + "percentage-tracking").c_str(), score, 1.f);
  }
}

Vector<float> percentageTracking(const Vector<EvalFrame> &frames) {
  Vector<float> percentages(frames.size(), 0.f);
  return percentages;
}

}  // namespace c8
