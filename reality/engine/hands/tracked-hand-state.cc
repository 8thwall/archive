// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include "bzl/inliner/rules2.h"
cc_library {
  hdrs = {
    "tracked-hand-state.h",
  };
  deps = {
    ":hand-types",
    ":handmesh-data",
    "//c8:filters",
    "//c8:hmatrix",
    "//c8:random-numbers",
    "//c8:vector",
    "//c8/geometry:face-types",
    "//c8/geometry:egomotion",
    "//c8/geometry:line3",
    "//c8/geometry:mesh",
    "//c8/stats:scope-timer",
    "//reality/engine/faces:face-geometry",
    "//reality/engine/geometry:pose-pnp",
    "//reality/engine/tracking:ray-point-filter",
    "@ceres//:ceres",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0xfd1aacfe);

#include <cmath>

#include "c8/filters.h"
#include "c8/geometry/line3.h"
#include "c8/geometry/mesh.h"
#include "c8/parameter-data.h"
#include "c8/random-numbers.h"
#include "c8/stats/scope-timer.h"
#include "ceres/ceres.h"
#include "reality/engine/faces/face-geometry.h"
#include "c8/geometry/egomotion.h"
#include "reality/engine/hands/hand-types.h"
#include "reality/engine/hands/handmesh-data.h"
#include "reality/engine/hands/tracked-hand-state.h"

namespace c8 {

namespace {
#ifdef NDEBUG
constexpr static int debug_ = 0;
#else
constexpr static int debug_ = 1;
#endif

struct Settings {
  float maxTranslationForLost;
  float minIouForLost;
  bool apply2dLandmarkFilter;
  bool apply2dWristLandmarkFilter;
  bool apply3dLandmarkFilter;
  bool liveUpdateFilter;
  bool applyTransformFilter;
  bool applyLocalVertexFilter;
  bool useRecursiveFilter;
  float minAlpha;
  float update90v;
  float vAlpha;
  float transformAlpha;
  float pointAlpha;
  bool usePercentileInliers;
  float inlierPercent;
  bool useStdDevInliers;
  int maxIterations;
  double functionTolerance;
  int maxUnstableFramesInRowForLostTrigger;
  int pnpMinInliers;
  float pnpFailedResidualSqDist;
  float pnpInlierFraction;
};

const Settings &settings() {
  static int paramsVersion_ = -1;
  static Settings settings_;
  if (globalParams().version() == paramsVersion_) {
    return settings_;
  }
  settings_ = {
    globalParams().getOrSet("TrackedHandState.maxTranslationForLost", 0.3f),
    globalParams().getOrSet("TrackedHandState.minIouForLost", 0.4f),
    globalParams().getOrSet("TrackedHandState.apply2dLandmarkFilter", true),
    globalParams().getOrSet("TrackedHandState.apply2dWristLandmarkFilter", true),
    globalParams().getOrSet("TrackedHandState.apply3dLandmarkFilter", true),
    globalParams().getOrSet("TrackedHandState.liveUpdateFilter", false),
    globalParams().getOrSet("TrackedHandState.applyTransformFilter", true),
    globalParams().getOrSet("TrackedHandState.applyLocalVertexFilter", true),
    globalParams().getOrSet("TrackedHandState.useRecursiveFilter", false),
    globalParams().getOrSet("TrackedHandState.minAlpha", 0.001f),
    globalParams().getOrSet("TrackedHandState.update90v", 0.04f),
    globalParams().getOrSet("TrackedHandState.vAlpha", 0.1f),
    globalParams().getOrSet("TrackedHandState.transformAlpha", 0.8f),
    globalParams().getOrSet("TrackedHandState.pointAlpha", 0.6f),
    globalParams().getOrSet("TrackedHandState.usePercentileInliers", false),
    globalParams().getOrSet("TrackedHandState.inlierPercent", 0.5f),
    globalParams().getOrSet("TrackedHandState.useStdDevInliers", false),
    globalParams().getOrSet("TrackedHandState.maxIterations", 10),
    globalParams().getOrSet("TrackedHandState.functionTolerance", 1.e-6),
    globalParams().getOrSet("TrackedHandState.maxUnstableFramesInRowForLostTrigger", 2),
    globalParams().getOrSet("TrackedHandState.pnpMinInliers", 10),
    globalParams().getOrSet("TrackedHandState.pnpFailedResidualSqDist", 0.015f),
    globalParams().getOrSet("TrackedHandState.pnpInlierFraction", 0.3f),
  };
  paramsVersion_ = globalParams().version();
  return settings_;
}

float computeStdDev(const Vector<float> &vec) {
  auto mean = std::accumulate(vec.begin(), vec.end(), 0.0f) / vec.size();
  float sqSum = std::inner_product(
    vec.begin(),
    vec.end(),
    vec.begin(),
    0.0f,
    [](float const &x, float const &y) { return x + y; },
    [mean](float const &x, float const &y) { return (x - mean) * (y - mean); });
  return std::sqrt(sqSum / vec.size());
}

}  // namespace

// Distance between 2 points on z=1 ray space plane
constexpr float RAY_SPACE_PLANE_DISTANCE_THRESHOLD = 0.01f;

HMatrix handAnchorMatrix(const HandAnchorTransform &t) {
  return HMatrixGen::translation(t.position.x(), t.position.y(), t.position.z())
    * t.rotation.toRotationMat() * HMatrixGen::scale(t.scale, t.scale, t.scale);
}

Vector<HPoint3> handWorldToLocal(
  const Vector<HPoint3> &worldPoints, const HandAnchorTransform &anchor) {
  return handAnchorMatrix(anchor).inv() * worldPoints;
}

HandPointsFilter::HandPointsFilter() {
  config_ =
    createRayPointFilterConfig(settings().minAlpha, settings().update90v, settings().vAlpha);
  transformConfig_ =
    createRayPointFilterConfig(settings().transformAlpha, settings().update90v, settings().vAlpha);
}

void HandPointsFilter::apply(DetectedPoints *raySpacePoints) {
  settings().useRecursiveFilter
    ? applyRecursiveFilter(&raySpacePoints->points, &recursiveRayFilters_, settings().pointAlpha)
    : applyFilter(&raySpacePoints->points, &rayFilters_);
}

void HandPointsFilter::apply(Vector<HPoint3> *landmarkPoints) {
  settings().useRecursiveFilter
    ? applyRecursiveFilter(landmarkPoints, &recursivePointFilters_, settings().pointAlpha)
    : applyFilter(landmarkPoints, &pointFilters_);
}

void HandPointsFilter::applyLocalFilter(Vector<HPoint3> *localVertices) {
  settings().useRecursiveFilter
    ? applyRecursiveFilter(localVertices, &recursiveLocalPointsFilter_, settings().pointAlpha)
    : applyFilter(localVertices, &localPointsFilter_);
}

void HandPointsFilter::apply(HPoint3 *rootTranslation, bool isFirstFrame) {
  auto &pt = *rootTranslation;

  if (settings().useRecursiveFilter) {
    Vector<HPoint3> pts = {pt};
    applyRecursiveFilter(&pts, &recursiveTranslationFilter_, settings().transformAlpha);
    pt = pts[0];
  } else {
    if (isFirstFrame) {
      translationFilter_ = std::make_unique<RayPointFilter3a>(pt, transformConfig_);
    } else {
      pt = translationFilter_->filter(pt);
    }
  }
}

void HandPointsFilter::applyWrist(DetectedPoints *wristRaySpacePoints) {
  settings().useRecursiveFilter ? applyRecursiveFilter(
    &wristRaySpacePoints->points, &recursiveWristRayFilters_, settings().pointAlpha)
                                : applyFilter(&wristRaySpacePoints->points, &wristRayFilters_);
}

void HandPointsFilter::updateFilter() {
  config_ =
    createRayPointFilterConfig(settings().minAlpha, settings().update90v, settings().vAlpha);
  transformConfig_ =
    createRayPointFilterConfig(settings().transformAlpha, settings().update90v, settings().vAlpha);
}

void HandPointsFilter::applyFilter(Vector<HPoint3> *points, Vector<RayPointFilter3a> *filterPtr) {
  if (settings().liveUpdateFilter) {
    updateFilter();
  }
  if (filterPtr->empty()) {
    filterPtr->reserve(points->size());
    for (const auto &pt : *points) {
      filterPtr->push_back({pt, config_});
    }
    return;
  }

  for (int i = 0; i < points->size(); ++i) {
    auto &pt = points->at(i);
    pt = filterPtr->at(i).filter(pt);
  }
}

void HandPointsFilter::applyRecursiveFilter(
  Vector<HPoint3> *points, Vector<RecursiveFilterLowPass<float>> *filterPtr, float alpha) {
  auto &filter = *filterPtr;
  if (filter.empty()) {
    filter.reserve(points->size());
    for (size_t k = 0; k < points->size(); ++k) {
      filter.push_back({alpha});
      filter.push_back({alpha});
      filter.push_back({alpha});
    }
  }

  for (int i = 0; i < points->size(); ++i) {
    auto &pt = points->at(i);

    filter[i * 3].setAlphaFactor(alpha);
    filter[i * 3 + 1].setAlphaFactor(alpha);
    filter[i * 3 + 2].setAlphaFactor(alpha);

    auto x = filter[i * 3].filter(pt.x());
    auto y = filter[i * 3 + 1].filter(pt.y());
    auto z = filter[i * 3 + 2].filter(pt.z());
    pt = HPoint3{x, y, z};
  }
}

void TrackedHandState::markFrame() { framesSinceLocated_++; }

Hand3d::HandKind TrackedHandState::getHandKind(const DetectedPoints &localHandDetection) const {
  if (localHandDetection.detectedClass == HANDEDNESS_LEFT) {
    return Hand3d::HandKind::LEFT;
  }
  if (localHandDetection.detectedClass == HANDEDNESS_RIGHT) {
    return Hand3d::HandKind::RIGHT;
  }
  return Hand3d::HandKind::HAND_UNSPECIFIED;
}

HandAnchorTransform computeHandAnchorTransform(const DetectedRayPoints &rayPoints) {
  const float rayCenterX = rayPoints.points[HANDLANDMARK_MIDDLE_FINGER_MCP].x();
  const float rayCenterY = rayPoints.points[HANDLANDMARK_MIDDLE_FINGER_MCP].y();

  // compute the length between index finger mcp to pinky mcp
  // TODO: if the two points align with a ray, may change to other edge for width reference
  const auto &index = rayPoints.points[HANDLANDMARK_INDEX_FINGER_MCP];
  const auto &pinky = rayPoints.points[HANDLANDMARK_PINKY_MCP];
  float diffX = index.x() - pinky.x();
  float diffY = index.y() - pinky.y();
  float diffZ = index.z() - pinky.z();
  float indexToPinky = sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);
  const auto rayDistance = HAND_LENGTH_INDEX_MCP_PINKY_MCP / indexToPinky;
  HPoint3 rayCenter3 = {rayCenterX * rayDistance, rayCenterY * rayDistance, rayDistance};

  return {
    rayCenter3,
    {0, 0, 1, 0},                     // rotated 180 degrees to face the camera
    HAND_LENGTH_INDEX_MCP_PINKY_MCP,  // scale
  };
}

void fillWorldPoints(
  float zScaling,
  const DetectedRayPoints &rayPoints,
  const HandAnchorTransform &handAnchor,
  Vector<HPoint3> &worldPoints) {
  for (int i = 0; i < rayPoints.points.size(); i++) {
    float offset = rayPoints.points[i].z() * zScaling;
    float zDepth = handAnchor.position.z() + offset;
    worldPoints.push_back(
      {rayPoints.points[i].x() * zDepth, rayPoints.points[i].y() * zDepth, zDepth});
  }
}

Vector<HPoint3> handWorldPoints(
  const DetectedRayPoints &rayPoints,
  const HandAnchorTransform &handAnchor,
  const DetectedPoints &pts,
  const DetectedRayPoints &wristRayPoints = DetectedRayPoints()) {
  auto &index = pts.points[HANDLANDMARK_INDEX_FINGER_MCP];
  auto &pinky = pts.points[HANDLANDMARK_PINKY_MCP];
  HVector3 ptDiff = {index.x() - pinky.x(), index.y() - pinky.y(), index.z() - pinky.z()};
  float indexToPinky = ptDiff.l2Norm();
  float zScaling = HAND_LENGTH_INDEX_MCP_PINKY_MCP / indexToPinky;

  // scale the points so the middle finger mcp point is at the hand-Z.
  // Other points' z are computed relative to the middle mcp.
  // This scaling is what converts the points from ray space to world space.
  Vector<HPoint3> worldPoints;
  worldPoints.reserve(rayPoints.points.size() + wristRayPoints.points.size());
  fillWorldPoints(zScaling, rayPoints, handAnchor, worldPoints);
  fillWorldPoints(zScaling, wristRayPoints, handAnchor, worldPoints);

  return worldPoints;
}

Hand3d TrackedHandState::locateHand(const DetectedPoints &localHandDetection) {
  ScopeTimer t("hand-detection-to-control-points");
  ++framesTracked_;
  framesSinceLocated_ = 0;

  // Convert detections to camera ray space.
  auto raySpaceDetection = detectionToRaySpace(localHandDetection);

  // TODO: Apply a filter to raySpaceDetection before computing handTransform.
  // filter_.apply(&raySpaceDetection);

  // Get the reference anchor for this detection result for the detected hand position and size.
  // the anchor will be the middle finger MCP HANDLANDMARK_MIDDLE_FINGER_MCP
  auto referenceTransform = computeHandAnchorTransform(raySpaceDetection);

  // Use the reference anchor to compute the location of the anchor points in 3d relative to the
  // camera.
  auto worldVertices = handWorldPoints(raySpaceDetection, referenceTransform, localHandDetection);

  // Convert world points to the anchor's local space.
  auto vertices = handWorldToLocal(worldVertices, referenceTransform);

  const HVector3 normal = {0.0f, 1.0f, 0.0f};
  Vector<HVector3> normals(vertices.size(), normal);

  // Get hand anchors
  const auto attachmentPoints = getHandAttachmentPoints(vertices, normals);

  return {
    referenceTransform,
    vertices,
    normals,
    status(),
    localHandDetection.roi.faceId,
    getHandKind(localHandDetection),
    attachmentPoints};
}

// First, find the intersection between camera-rayWrist ray and rayWrist-meshVector ray.
// Then we can compute the distance for posing the hand mesh.
HandAnchorTransform computeHandMeshAnchorTransform(
  const DetectedRayPoints &rayPoints, const Vector<HPoint3> &meshJointPts) {
  const float rayCenterX = rayPoints.points[HANDLANDMARK_WRIST].x();
  const float rayCenterY = rayPoints.points[HANDLANDMARK_WRIST].y();

  // distance between joint points from 3D hand mesh
  float meshJointDist = 0.0f;
  // vector from wrist to the selected joint point from 3D hand mesh
  HVector3 extendVec;

  // compute the distance between HANDLANDMARK_WRIST & HANDLANDMARK_MIDDLE_FINGER_MCP on z=1 plane
  const float rayMidX = rayPoints.points[HANDLANDMARK_MIDDLE_FINGER_MCP].x();
  const float rayMidY = rayPoints.points[HANDLANDMARK_MIDDLE_FINGER_MCP].y();
  const float planeDist = sqrt(
    (rayMidX - rayCenterX) * (rayMidX - rayCenterX)
    + (rayMidY - rayCenterY) * (rayMidY - rayCenterY));

  // if the 'planeDist' is too small, which means the ray camera-wrist & the ray camera-mid are very
  // close. Then we will use the ray camera-wrist & the ray camera-index to compute the mesh
  // translation.
  const HPoint3 &ptWrist = meshJointPts[HANDLANDMARK_WRIST];
  int refIndex = HANDLANDMARK_MIDDLE_FINGER_MCP;
  if (planeDist < RAY_SPACE_PLANE_DISTANCE_THRESHOLD) {
    // if the rays for HANDLANDMARK_WRIST & HANDLANDMARK_MIDDLE_FINGER_MCP are almost the same,
    // we use the distance HANDLANDMARK_WRIST & HANDLANDMARK_INDEX_FINGER_MCP to compute.
    refIndex = HANDLANDMARK_INDEX_FINGER_MCP;
  }
  const HPoint3 &refJoint = meshJointPts[refIndex];
  float diffX = refJoint.x() - ptWrist.x();
  float diffY = refJoint.y() - ptWrist.y();
  float diffZ = refJoint.z() - ptWrist.z();
  meshJointDist = sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);
  extendVec = {diffX, diffY, diffZ};

  // Compute the intersection of two rays.
  // The first ray is from (0,0,0) pointing to rayPoints.points[refIndex].
  // The second ray is from (rayCenterX, rayCenterY, rayCenterZ) pointing with vector 'extendVec'
  float extendDist = 100.0f;
  HPoint3 origin = {0.0f, 0.0f, 0.0f};
  HPoint3 refLineEnd = {
    extendDist * rayPoints.points[refIndex].x(),
    extendDist * rayPoints.points[refIndex].y(),
    extendDist};
  Line3 refLine3(origin, refLineEnd);

  HPoint3 wristOnPlane = {
    rayPoints.points[HANDLANDMARK_WRIST].x(), rayPoints.points[HANDLANDMARK_WRIST].y(), 1.0f};
  HPoint3 extendWristToRef = {
    wristOnPlane.x() + extendDist * extendVec.x(),
    wristOnPlane.y() + extendDist * extendVec.y(),
    wristOnPlane.z() + extendDist * extendVec.z()};
  Line3 handLine3(wristOnPlane, extendWristToRef);

  float muThis, muOther;
  HPoint3 ptThis, ptOther;
  // The two rays should intersect as the projected points on the z=1 plane
  // have large enough distance.
  refLine3.intersects(handLine3, &muThis, &muOther, &ptThis, &ptOther);

  // compute the distance between the intersection and (rayCenterX, rayCenterY, rayCenterZ)
  float dx = ptThis.x() - wristOnPlane.x();
  float dy = ptThis.y() - wristOnPlane.y();
  float dz = ptThis.z() - wristOnPlane.z();
  float raySpaceLength = sqrt(dx * dx + dy * dy + dz * dz);

  const float rayDistance = meshJointDist / raySpaceLength;
  HPoint3 rayCenter3 = {rayCenterX * rayDistance, rayCenterY * rayDistance, rayDistance};

  // no rotation and identity scales
  return {
    rayCenter3,
    {1.0f, 0, 0, 0},
    1.0f,
  };
}

class MinimizeTranslationRaySpace {
public:
  MinimizeTranslationRaySpace(const HPoint3 &rayRefPt, const HPoint3 &p3) {
    rayRefPt_ = rayRefPt;
    p3_ = p3;
  }
  virtual ~MinimizeTranslationRaySpace() {}

  template <typename T>
  bool operator()(const T *const t, T *residual) const;

private:
  HPoint3 rayRefPt_;
  HPoint3 p3_;
};

template <typename T>
bool MinimizeTranslationRaySpace::operator()(const T *const t, T *residual) const {
  T x = T(p3_.x()) + t[0];
  T y = T(p3_.y()) + t[1];
  T z = T(p3_.z()) + t[2];
  if (abs(z) < 1.0e-6) {
    residual[0] = T(1.0e6);
    residual[1] = T(1.0e6);
    return true;
  }

  x /= z;
  y /= z;
  T refX = T(rayRefPt_.x());
  T refY = T(rayRefPt_.y());

  residual[0] = x - refX;
  residual[1] = y - refY;

  return true;
}

// optimize the translation by computing the difference of current and reference points in ray space
HPoint3 computeMeshTranslation(
  const Vector<HPoint3> &rayPoints,
  const Vector<HPoint3> &meshPts,
  const HPoint3 &startingPosition,
  Vector<float> *residualOutput) {
  // Create problem
  ceres::Problem problem;

  double t[3];
  t[0] = startingPosition.x();
  t[1] = startingPosition.y();
  t[2] = startingPosition.z();

  Vector<ceres::ResidualBlockId> ptBlockIds;
  ptBlockIds.reserve(meshPts.size());
  for (int i = 0; i < rayPoints.size(); ++i) {
    ceres::CostFunction *minimize_t_cost_function =
      new ceres::AutoDiffCostFunction<MinimizeTranslationRaySpace, 2, 3>(
        new MinimizeTranslationRaySpace(rayPoints[i], meshPts[i]));

    ptBlockIds.push_back(problem.AddResidualBlock(minimize_t_cost_function, nullptr, t));
  }

  ceres::Solver::Options options;
  options.linear_solver_type = ceres::DENSE_NORMAL_CHOLESKY;
  options.max_num_iterations = 10;
  options.max_solver_time_in_seconds = 0.2;
  options.logging_type = ceres::PER_MINIMIZER_ITERATION;
  options.minimizer_progress_to_stdout = false;

  options.max_num_iterations = settings().maxIterations;
  options.function_tolerance = settings().functionTolerance;

  ceres::Solver::Summary summary;
  ceres::Solve(options, &problem, &summary);

  // Get the residuals for each match for determining inliers.
  residualOutput->clear();
  ceres::Problem::EvaluateOptions evalOptions;
  evalOptions.residual_blocks = ptBlockIds;
  Vector<double> residuals;
  problem.Evaluate(evalOptions, NULL, &residuals, NULL, NULL);

  for (int i = 0; i < ptBlockIds.size(); i += 1) {
    residualOutput->push_back(std::abs(residuals[i * 2]) + std::abs(residuals[i * 2 + 1]));
  }

  return {float(t[0]), float(t[1]), float(t[2])};
}

DetectedRayPoints computeLandmarkToRaySpace(
  DetectedPoints &localLandmarks, const DetectedPoints &localHandDetection, int pointOffset) {
  // Convert local landmarks to camera ray space.
  localLandmarks.confidence = localHandDetection.confidence;
  localLandmarks.detectedClass = localHandDetection.detectedClass;
  localLandmarks.viewport = localHandDetection.viewport;
  localLandmarks.roi = localHandDetection.roi;
  localLandmarks.boundingBox = localHandDetection.boundingBox;
  localLandmarks.intrinsics = localHandDetection.intrinsics;
  // get the landmark points that are appended to the 3D mesh data
  for (int i = 0; i < localLandmarks.points.size(); ++i) {
    localLandmarks.points[i] = localHandDetection.points[pointOffset + i];
  }

  return (detectionToRaySpace(localLandmarks));
}

HandAnchorTransform computeHandMeshTranslation(
  const DetectedRayPoints &rayPts,
  const Vector<HPoint3> &localLandmarks,
  Vector<float> *residualOutput,
  Vector<float> *inlierResidualOutput) {
  // First pass with all of the points.
  HPoint3 translation = computeMeshTranslation(
    rayPts.points,
    localLandmarks,
    // TODO(nathan): this should be the previous pose
    {0.f, 0.f, 0.4f},
    residualOutput);

  // Second pass with just the inliers.
  if (settings().usePercentileInliers) {
    Vector<size_t> order(residualOutput->size());
    std::iota(order.begin(), order.end(), 0);
    std::sort(order.begin(), order.end(), [&](size_t a, size_t b) {
      return residualOutput->at(a) < residualOutput->at(b);
    });

    // Use the lowest residuals for tracking.
    size_t numInliers = static_cast<size_t>(localLandmarks.size() * settings().inlierPercent);
    Vector<HPoint3> inlierRayPts;
    inlierRayPts.reserve(numInliers);
    Vector<HPoint3> inlierLocalLandmarks;
    inlierLocalLandmarks.reserve(numInliers);

    for (size_t i = 0; i < numInliers; ++i) {
      inlierRayPts.push_back(rayPts.points[order[i]]);
      inlierLocalLandmarks.push_back(localLandmarks[order[i]]);
    }

    translation =
      computeMeshTranslation(inlierRayPts, inlierLocalLandmarks, translation, inlierResidualOutput);
  }

  // Second pass with just the inliers.
  else if (settings().useStdDevInliers) {
    auto mean = std::accumulate(residualOutput->begin(), residualOutput->end(), 0.0f)
      / residualOutput->size();
    auto stdDev = computeStdDev(*residualOutput);

    // Use the lowest residuals for tracking.
    Vector<HPoint3> inlierRayPts;
    inlierRayPts.reserve(residualOutput->size());
    Vector<HPoint3> inlierLocalLandmarks;
    inlierLocalLandmarks.reserve(residualOutput->size());

    for (size_t i = 0; i < residualOutput->size(); ++i) {
      if (residualOutput->at(i) < (mean + stdDev)) {
        inlierRayPts.push_back(rayPts.points[i]);
        inlierLocalLandmarks.push_back(localLandmarks[i]);
      }
    }

    translation =
      computeMeshTranslation(inlierRayPts, inlierLocalLandmarks, translation, inlierResidualOutput);
  }

  // no rotation and identity scales
  return {
    translation,
    {1.0f, 0.0f, 0.0f, 0.0f},
    1.0f,
  };
}

void TrackedHandState::updateStatus() {
  // Determine if we're in a LOST state based on the translation delta. The hand model doesn't
  // actually know if we are tracking a hand successfully or not.
  auto distanceDelta = trsTranslation(previousPose_).dist(trsTranslation(localPose_));
  // Add the framesTracked check so that we don't instantly go into a LOST state when comparing the
  // first frame against identity matrix.
  auto iou = intersectionOverUnion(previousBBox_, currentBBox_);
  if (
    (distanceDelta > settings().maxTranslationForLost || iou < settings().minIouForLost)
    && framesTracked_ > 1) {
    // Only takes one large translation or one small IOU to get us into a LOST state.
    ++unstableFrames_;
    status_ = unstableFrames_ > settings().maxUnstableFramesInRowForLostTrigger
      ? Hand3d::TrackingStatus::LOST
      : Hand3d::TrackingStatus::UPDATED;
    return;
  }

  // If we're not in a LOST state, then we're tracking and don't need to do further calculations.
  // Either FOUND -> UPDATED / remain UPDATED. Note that we start on frame 1 and not frame 0.
  status_ = framesTracked_ > 1 ? Hand3d::TrackingStatus::UPDATED : Hand3d::TrackingStatus::FOUND;
  unstableFrames_ = 0;
}

void TrackedHandState::locateWrist(DetectedRayPoints raySpaceWristMeshLandmarks, bool isLeftHand) {
  // Compute the PnP for arm mesh to get the 3D points to append wrist vertices.
  Vector<HPoint3> wristMeshKeyPoints;
  Vector<HPoint2> wristCamRays;
  wristMeshKeyPoints.reserve(ARM_KEYPOINT_INDICES.size());
  wristCamRays.reserve(ARM_KEYPOINT_INDICES.size());
  for (size_t i = 0; i < ARM_KEYPOINT_INDICES.size(); ++i) {
    auto camRay = raySpaceWristMeshLandmarks.points[i];
    auto meshPointTransformed = ARMMESH_VERTICES[ARM_KEYPOINT_INDICES[i]];
    if (isLeftHand) {
      meshPointTransformed = wristMeshPose_ * meshPointTransformed;
    } else {
      meshPointTransformed = wristMeshPose_ * HMatrixGen::scaleY(-1.0f) * meshPointTransformed;
    }

    wristMeshKeyPoints.push_back(
      {meshPointTransformed.x(), meshPointTransformed.y(), meshPointTransformed.z()});
    wristCamRays.push_back({camRay.x(), camRay.y()});
  }

  // Initial data prep has already been done so wristMeshKeyPoints is transformed using
  // wristMeshPose_ and accounting for the flipping required for left/right wrist.
  Vector<uint8_t> inliers;
  HMatrix wristPose = HMatrixGen::i();

  // If the wrist has yet to be located, use robustPnP.
  if (!wristLocated_) {
    RandomNumbers random;
    RobustPnPParams params;
    params.minPoseInliers = settings().pnpMinInliers;
    params.poseFailedResidualSqDist = settings().pnpFailedResidualSqDist;
    params.inlierFraction = settings().pnpInlierFraction;

    if (!debug_) {
      wristLocated_ = robustPnP(
        wristMeshKeyPoints,
        wristCamRays,
        HMatrixGen::i(),
        params,
        &wristPose,
        &inliers,
        &random,
        &wristScratchSpace_);
    } else {
      RobustPnPDebugOut debugOut;

      wristLocated_ = robustPnP(
        wristMeshKeyPoints,
        wristCamRays,
        HMatrixGen::i(),
        params,
        &wristPose,
        &inliers,
        &random,
        &wristScratchSpace_,
        &debugOut);
    }
  } else {
    // If the wrist has been located, use posePnP.
    SolvePnPParams params;
    wristLocated_ =
      solvePnP(wristMeshKeyPoints, wristCamRays, params, &wristPose, &inliers, &wristScratchSpace_);
  }

  // Only update the wrist pose if the wrist was successfully located, otherwise keep the old pose.
  if (wristLocated_) {
    wristMeshPose_ = wristPose.inv() * wristMeshPose_;
  }
}

Hand3d TrackedHandState::locateHandMesh(
  const DetectedPoints &localHandDetection, bool doTrackWrist) {
  ScopeTimer t("hand-tracker-locate-mesh");
  ++framesTracked_;
  framesSinceLocated_ = 0;
  previousPose_ = localPose_;
  previousBBox_ = currentBBox_;

  // hand 3D points in local space in meters WRT the wrist point
  const int numKeyPoints = getHandMeshModelKeyPointCount();
  const int numWristKeyPoints = getWristMeshModelKeyPointCount();

  Vector<HPoint3> localLandmarkPts(numKeyPoints);
  for (int i = 0; i < numKeyPoints; ++i) {
    const HPoint3 &p = localHandDetection.points[HANDMESH_R_VERTEX_COUNT + numKeyPoints + i];
    // TODO(nathan): figure out why we need to invert y.
    localLandmarkPts[i] = {p.x(), -p.y(), p.z()};
  }

  // Convert local landmarks to camera ray space.
  meshLocalLandmarks_.points.resize(numKeyPoints);
  auto raySpaceMeshLandmarks =
    computeLandmarkToRaySpace(meshLocalLandmarks_, localHandDetection, HANDMESH_R_VERTEX_COUNT);

  // Convert wrist local landmarks to camera ray space.
  wristMeshLocalLandmarks_.points.resize(numWristKeyPoints);
  auto raySpaceWristMeshLandmarks = computeLandmarkToRaySpace(
    wristMeshLocalLandmarks_, localHandDetection, HANDMESH_R_VERTEX_COUNT + numKeyPoints * 2);

  if (settings().apply2dLandmarkFilter) {
    filter_.apply(&raySpaceMeshLandmarks);
  }
  if (settings().apply2dWristLandmarkFilter) {
    filter_.applyWrist(&raySpaceWristMeshLandmarks);
  }

  if (settings().apply3dLandmarkFilter) {
    filter_.apply(&localLandmarkPts);
  }

  // The referenceTransform should have only translation, and no rotation.
  const bool isLeftHand = (localHandDetection.detectedClass == HANDEDNESS_LEFT);
  auto referenceTransform = computeHandMeshTranslation(
    raySpaceMeshLandmarks, localLandmarkPts, &residuals_, &inlierResiduals_);
  if (settings().applyTransformFilter) {
    filter_.apply(&referenceTransform.position, framesTracked_ == 1);
  }

  localPose_ =
    trsMat(referenceTransform.position, referenceTransform.rotation, referenceTransform.scale);
  currentBBox_ = uprightBBox(localHandDetection.boundingBox);

  updateStatus();

  // Y axis is flipped for left hand
  // TODO(yuyan): if researchers fix this y-flip issue with their new model,
  Vector<HPoint3> vertices;
  vertices.reserve(HANDMESH_R_UV_VERTEX_COUNT + 2 * numKeyPoints);
  for (int i = 0; i < HANDMESH_R_VERTEX_COUNT; ++i) {
    // TODO(yuyan): figure out why we need to flip Y
    const HPoint3 &pt = localHandDetection.points[i];
    vertices.push_back({pt.x(), -pt.y(), pt.z()});
  }

  if (settings().applyLocalVertexFilter) {
    filter_.applyLocalFilter(&vertices);
  }

  if (doTrackWrist) {
    locateWrist(raySpaceWristMeshLandmarks, isLeftHand);
  }

  // landmark points
  auto landmarkWorldVertices = handWorldPoints(
    raySpaceMeshLandmarks, referenceTransform, meshLocalLandmarks_, raySpaceWristMeshLandmarks);

  // Convert world points to the anchor's local space.
  auto landmarkAnchorVertices = handWorldToLocal(landmarkWorldVertices, referenceTransform);

  // compute vertex normals
  Vector<HVector3> normals;
  if (isLeftHand) {
    computeVertexNormals(vertices, HANDMESH_L_INDICES, &normals);
  } else {
    computeVertexNormals(vertices, HANDMESH_R_INDICES, &normals);
  }

  // Append the extra UV points
  // before this appending operation, the size of the vertices should be 778 as
  // the previous computations are done based on the 778 mesh only vertices from the hand mesh
  // model
  Vector<HPoint3> appendVerts;
  Vector<HVector3> appendNormals;
  for (int i = 0; i < (HANDMESH_R_UV_VERTEX_COUNT - HANDMESH_R_VERTEX_COUNT); ++i) {
    auto originIndex = EXTENSION_VERTEX_MAP[i];
    appendVerts.push_back(vertices[originIndex]);
    appendNormals.push_back(normals[originIndex]);
  }
  vertices.insert(vertices.end(), appendVerts.begin(), appendVerts.end());
  normals.insert(normals.end(), appendNormals.begin(), appendNormals.end());

  // append the smoothed 2D landmark points
  for (int i = 0; i < numKeyPoints; ++i) {
    vertices.push_back(landmarkAnchorVertices[i]);
  }
  // append the smoothed 3D joint points to the vertices
  for (int i = 0; i < numKeyPoints; ++i) {
    vertices.push_back(localLandmarkPts[i]);
  }

  // Append the wrist mesh vertices and normals.
  Vector<HPoint3> wristVertices;
  wristVertices.reserve(numWristKeyPoints);

  // Append the smoothed 2D wrist landmark points.
  for (int i = 0; i < numWristKeyPoints; ++i) {
    wristVertices.push_back(landmarkAnchorVertices[numKeyPoints + i]);
  }

  // TODO(yuyan): compute more attachment points
  auto wristTransform = handAnchorMatrix(referenceTransform).inv() * wristMeshPose_;
  if (!isLeftHand) {
    wristTransform = wristTransform * HMatrixGen::scaleY(-1.0f);
  }

  // Get hand anchors
  Vector<HandAttachmentPoint> attachmentPoints =
    getHandAttachmentPoints(vertices, normals, isLeftHand);

  Vector<HandAttachmentPoint> wristAttachmentPoints;
  if (doTrackWrist) {
    auto wristMeshPoints = wristTransform * ARMMESH_VERTICES;
    wristAttachmentPoints = getWristAttachmentPoints(wristMeshPoints, isLeftHand);
  }

  return {
    referenceTransform,
    vertices,
    normals,
    status(),
    localHandDetection.roi.faceId,
    getHandKind(localHandDetection),
    attachmentPoints,
    wristVertices,
    wristTransform,
    wristAttachmentPoints};
}

}  // namespace c8
