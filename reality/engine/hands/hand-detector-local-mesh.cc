// Copyright (c) 2023 Niantic Labs, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "hand-detector-local-mesh.h",
  };
  deps = {
    "//c8:parameter-data",
    "//c8:vector",
    "//c8/geometry:mesh",
    "//c8/stats:scope-timer",
    "//c8/pixels:pixel-transforms",
    "//reality/engine/deepnets:tflite-interpreter",
    "//reality/engine/faces:face-geometry",
    "//reality/engine/hands:hand-types",
    "//reality/engine/hands:handmesh-data",
    "@eigen3",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0xd302b38e);

#include <cmath>

#include "c8/c8-log.h"
#include "c8/geometry/mesh.h"
#include "c8/parameter-data.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "reality/engine/faces/face-geometry.h"
#include "reality/engine/hands/hand-detector-local-mesh.h"
#include "reality/engine/hands/hand-types.h"
#include "reality/engine/hands/handmesh-data.h"

namespace c8 {

namespace {

struct Settings {
  // ratio for enlarging bounding box
  float bboxExtensionRatio;
  bool useResearchCrop;
  float researchBorderRatio;
  bool useAllLandmarksForBoundingBox;
};

const Settings &settings() {
  static const Settings settings_{
    globalParams().getOrSet("HandDetectorLocalMesh.bboxExtensionRatio", 0.1f),
    globalParams().getOrSet("HandDetectorLocalMesh.useResearchCrop", true),
    globalParams().getOrSet("HandDetectorLocalMesh.researchBorderRatio", 1.7f),
    globalParams().getOrSet("HandDetectorLocalMesh.useAllLandmarksForBoundingBox", true),
  };
  return settings_;
}
}  // namespace

Vector<Eigen::VectorXf> HandDetectorLocalMesh::jRegressor_ = {};

Vector<Eigen::VectorXf> &HandDetectorLocalMesh::getJRegressor() {
  if (jRegressor_.empty()) {
    const int numKeyPoints = getHandMeshModelKeyPointCount();
    jRegressor_.resize(numKeyPoints);

    float *data = const_cast<float *>(HAND_R_MESH_J_REGRESSOR);
    for (int i = 0; i < numKeyPoints; ++i) {
      jRegressor_[i] = Eigen::Map<Eigen::Vector<float, HANDMESH_R_VERTEX_COUNT>>(data);
      data += HANDMESH_R_VERTEX_COUNT;
    }
  }
  return jRegressor_;
}

// following the handedness detection in the research repo -
// def predict_handedness(mesh_vertices:np.ndarray)->Handedness:
int HandDetectorLocalMesh::computeHandedness(Vector<HPoint3> &pts) {
  // Grab some vertices around the knuckle and some vertices around the wrist and average their
  // positions
  Vector<int> knuckleIndices = {270, 220};
  HPoint3 posKnuckle = computeCentroid(pts, knuckleIndices);
  Vector<int> wristIndices = {191, 279};
  HPoint3 posWrist = computeCentroid(pts, wristIndices);

  // Get the wrist to knuckle direction
  HVector3 vWrist2Knuckle = {
    posKnuckle.x() - posWrist.x(),
    posKnuckle.y() - posWrist.y(),
    posKnuckle.z() - posWrist.z(),
  };

  // The hardcoded vertices are obtained by manual inspection of the hand mesh topology,
  // such that the established frame aligns with the frame of the asset.
  HPoint3 vUp = pts[279];
  HPoint3 vDown = pts[117];
  HPoint3 vLeft = pts[92];
  HPoint3 vRight = pts[78];

  // Establish watch frame:
  // x is from palm to back of hand
  // z is from thumb to opposide side across the hand
  // y for RIGHT hand is from wrist to fingers, for LEFT hand is from fingers to wrist
  HVector3 x = {
    vUp.x() - vDown.x(),
    vUp.y() - vDown.y(),
    vUp.z() - vDown.z(),
  };
  HVector3 z = {
    vRight.x() - vLeft.x(),
    vRight.y() - vLeft.y(),
    vRight.z() - vLeft.z(),
  };
  HVector3 y = z.cross(x);

  // establish handedness depending on which side y points
  // if the dot product is less than 0 then its right hand
  if (y.dot(vWrist2Knuckle) > 0.0f) {
    return HANDEDNESS_LEFT;
  }

  return HANDEDNESS_RIGHT;
}

Vector<DetectedPoints> HandDetectorLocalMesh::analyzeHand(
  const RenderedSubImage &src, c8_PixelPinholeCameraModel k) {
  ScopeTimer t("hand-mesh-local-analyze-hand");
  // Normalize input 128x128 RGB image to [-1, 1]
  toLetterboxRGBFloat0To1(src.image, 128, 128, interpreter_->typed_input_tensor<float>(0));

  {
    ScopeTimer t1("hand-mesh-local-model-invoke");
    interpreter_->Invoke();
  }

  // output tensor 0 - 1x25x2 landmark data in 2D
  const float *landmarkData = interpreter_->typed_output_tensor<float>(0);

  // output tensor 1 - 1x778x3 mesh data in 3D
  const float *meshData = interpreter_->typed_output_tensor<float>(1);

  // output tensor 2 - 1x12x2 wrist landmark data in 2D
  const float *wristLandmarkData = interpreter_->typed_output_tensor<float>(2);

  // init the DetectedPoints result
  DetectedPoints d{
    1.0,
    HANDEDNESS_RIGHT,
    src.viewport,
    src.roi,
    {},  // bounding box -- will fill later.
    {},  // points -- will fill later.
    k,
  };

  // There are 3 chunk of data that go into d.points
  const int numKeyPoints = getHandMeshModelKeyPointCount();
  const int numWristKeyPoints = getWristMeshModelKeyPointCount();
  // 1st part - HANDMESH_R_VERTEX_COUNT 3D mesh points strictly from model inference.
  // 2nd part - numKeyPoints ray space (z=1 plane) points as the landmarks
  //            also strictly from model.
  // 3rd part - numKeyPoints 3D joint points computed by jReg_ and mesh data,
  //            and will be used for positioning the hand mesh in world.
  // 4th part - numWristKeyPoints ray space (z=1 plane) points as the wrist landmarks
  //            also strictly from model.
  const int meshNumPoints = HANDMESH_R_VERTEX_COUNT + 2 * numKeyPoints + numWristKeyPoints;
  constexpr int meshDataSize = 3 * HANDMESH_R_VERTEX_COUNT;
  const int landmarkDataSize = 2 * numKeyPoints;
  const int wristLandmarkDataSize = 2 * numWristKeyPoints;

  d.points.reserve(meshNumPoints);

  // see line 57 at
  // https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/niantic-ar/research/hand-mesh-prototype/-/blob/main/src/utils/utils_from_mobrecon.py
  constexpr float scale = 0.2f;
  constexpr float scaleZ = scale * 1.0f;
  // Add the hand 3D mesh data to the detected points.
  // The hand 3D mesh is in local physical 3D space with the wrist at (0.0f, 0.0f, 0.0f)
  // while other points are in meter metric space.
  for (int i = 0; i < meshDataSize; i += 3) {
    d.points.push_back({
      meshData[i] * scale,
      meshData[i + 1] * scale,
      meshData[i + 2] * scaleZ,
    });
  }

  // Append the detected landmark 2D points to the detected point list.
  // The detected landmark 2D points are in local ROI texture space
  // with top-left corner at (0.0f, 0.0f) and bottom-right corner at (1.0f, 1.0f).
  for (int i = 0; i < landmarkDataSize; i += 2) {
    d.points.push_back({
      landmarkData[i],
      landmarkData[i + 1],
      1.0f,
    });
  }

  // Append the 3D joint points to the detected point list.
  // This set of joint data will be used to locate the hand mesh.
  Vector<Eigen::VectorXf> &jreg = getJRegressor();

  float *colXPtr = vertCols_[0];
  float *colYPtr = vertCols_[1];
  float *colZPtr = vertCols_[2];
  for (int i = 0; i < HANDMESH_R_VERTEX_COUNT; ++i) {
    colXPtr[i] = meshData[3 * i] * scale;
    colYPtr[i] = meshData[3 * i + 1] * scale;
    colZPtr[i] = meshData[3 * i + 2] * scaleZ;
  }

  Eigen::VectorXf cols[3];
  cols[0] = Eigen::Map<Eigen::Vector<float, HANDMESH_R_VERTEX_COUNT>>(vertCols_[0]);
  cols[1] = Eigen::Map<Eigen::Vector<float, HANDMESH_R_VERTEX_COUNT>>(vertCols_[1]);
  cols[2] = Eigen::Map<Eigen::Vector<float, HANDMESH_R_VERTEX_COUNT>>(vertCols_[2]);
  Vector<HPoint3> manoJoints;
  for (int i = 0; i < numKeyPoints; ++i) {
    auto rx = jreg[i].dot(cols[0]);
    auto ry = jreg[i].dot(cols[1]);
    auto rz = jreg[i].dot(cols[2]);
    manoJoints.push_back({rx, ry, rz});
  }

  // for the first 21 key points, we need to map them from MANO indices to MPII indices
  for (int i = 0; i < HAND_LANDMARK_DETECTIONS; ++i) {
    auto manoIndex = HAND_R_MESH_MPII_TO_MANO_MAP[i];
    HPoint3 &pt = manoJoints[manoIndex];
    d.points.push_back(pt);
  }

  // for extra key points, simply append them
  for (int i = HAND_LANDMARK_DETECTIONS; i < numKeyPoints; ++i) {
    HPoint3 &pt = manoJoints[i];
    d.points.push_back(pt);
  }

  // Append the detected wrist landmark 2D points to the detected point list.
  // The detected wrist landmark 2D points are in local ROI texture space
  // with top-left corner at (0.0f, 0.0f) and bottom-right corner at (1.0f, 1.0f).
  for (int i = 0; i < wristLandmarkDataSize; i += 2) {
    d.points.push_back({
      wristLandmarkData[i],
      wristLandmarkData[i + 1],
      1.0f,
    });
  }

  // compute handedness
  d.detectedClass = computeHandedness(d.points);

  // Get the bounding box by the 2D landmark data in texture space
  // if settings().useAllLandmarksForBoundingBox is true,
  // use all landmarks for bounding box calculation,
  // otherwise, use the first 21 points for bounding box calculation
  const int numLandmarksForBBox =
    settings().useAllLandmarksForBoundingBox ? numKeyPoints : HAND_LANDMARK_DETECTIONS;
  Vector<HPoint3> pixPts(numLandmarksForBBox);
  for (int t = 0; t < numLandmarksForBBox; ++t) {
    pixPts[t] = {landmarkData[2 * t], landmarkData[2 * t + 1], 1.0f};
  }
  HPoint3 minVal, maxVal;
  calculateBoundingCube(pixPts, &minVal, &maxVal);

  // enlarge the tight landmark bounding box
  float bboxW = maxVal.x() - minVal.x();
  float bboxH = maxVal.y() - minVal.y();

  // fill out extendedBoundingBox for later handDetectionRoi() ROI computation.
  // extended bounding box by settings().researchBorderRatio * longest_edge
  float centerX = (maxVal.x() + minVal.x()) / 2.f;
  float centerY = (maxVal.y() + minVal.y()) / 2.f;
  float largestSide = std::max(bboxW, bboxH);
  float extendedHalf = (largestSide * settings().researchBorderRatio) / 2.f;
  d.extendedBoundingBox = {
    {centerX - extendedHalf, centerY - extendedHalf},  // upper left
    {centerX + extendedHalf, centerY - extendedHalf},  // upper right
    {centerX - extendedHalf, centerY + extendedHalf},  // lower left
    {centerX + extendedHalf, centerY + extendedHalf},  // lower right
  };

  // for debugging purpose, we have a tight bounding box and an extended box to show the crop
  if (settings().useResearchCrop) {
    // Return the tight bounding box from hand landmarks.
    d.boundingBox = {
      {minVal.x(), minVal.y()},  // upper left
      {maxVal.x(), minVal.y()},  // upper right
      {minVal.x(), maxVal.y()},  // lower left
      {maxVal.x(), maxVal.y()},  // lower right
    };
  } else {
    d.boundingBox = {
      {minVal.x() - settings().bboxExtensionRatio * bboxW,
       minVal.y() - settings().bboxExtensionRatio * bboxH},  // upper left
      {maxVal.x() + settings().bboxExtensionRatio * bboxW,
       minVal.y() - settings().bboxExtensionRatio * bboxH},  // upper right
      {minVal.x() - settings().bboxExtensionRatio * bboxW,
       maxVal.y() + settings().bboxExtensionRatio * bboxH},  // lower left
      {maxVal.x() + settings().bboxExtensionRatio * bboxW,
       maxVal.y() + settings().bboxExtensionRatio * bboxH},  // lower right
    };
  }

  return {d};
}

}  // namespace c8
