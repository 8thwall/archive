// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "c8/geometry/face-types.h"
#include "c8/geometry/mesh-types.h"
#include "c8/geometry/pixel-pinhole-camera-model.h"
#include "c8/hmatrix.h"
#include "c8/hpoint.h"
#include "c8/hvector.h"
#include "c8/pixels/image-roi.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixels.h"
#include "c8/quaternion.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/engine/api/hand.capnp.h"

namespace c8 {

// Hand joint abbreviations --
// MCP - MetaCarpoPhalangeal
// PIP - Proximal InterPhalangeal
// DIP - Distal InterPhalangeal
// CMC - CarpoMetaCarpal

////////////////////////////////////////// Hand ROI Renderer //////////////////////////////////////

// This is the max value among
// (HAND_DETECTION_INPUT_SIZE=192,
//  HAND_LANDMARK_DETECTION_INPUT_SIZE=224,
//  HAND_MESH_DETECTION_INPUT_SIZE=128).
constexpr int HAND_ROI_SUBIMAGE_SIZE = 224;

////////////////////////////////////////// Hand Detection /////////////////////////////////////////

// The hand detection mediapipe model "third_party/mediapipe/models/palm_detection_lite.tflite"
// input tensor is float32[1, 192, 192, 3].

// This input width will be used to do letterbox rendering from captured frames into 192x192
// textures.
constexpr int HAND_DETECTION_INPUT_SIZE = 192;

constexpr int HAND_DETECTION_MARKS = 7;

// Hand detection marks
constexpr int HANDDETECTION_WRIST = 0;
constexpr int HANDDETECTION_INDEX_MCP = 1;
constexpr int HANDDETECTION_MIDDLE_MCP = 2;
constexpr int HANDDETECTION_RING_MCP = 3;
constexpr int HANDDETECTION_PINKY_MCP = 4;
constexpr int HANDDETECTION_CMC = 5;
constexpr int HANDDETECTION_THUMB_MCP = 6;

////////////////////////////////////////// Hand Landmarks /////////////////////////////////////////

// The hand landmark mediapipe model "third_party/mediapipe/models/hand_landmark_lite.tflite"
// input tensor is float32[1, 224, 224, 3].

// This input width will be used to do zoom-in rendering of the whole hand into 224x224 textures.
constexpr int HAND_LANDMARK_DETECTION_INPUT_SIZE = 224;

// Number of hand landmarks that can be tracked at a time.
constexpr int HAND_LANDMARK_DETECTIONS = 21;

// Number of wrist landmarks that can be tracked at a time.
constexpr int WRIST_LANDMARK_DETECTIONS = 12;

// Handedness
constexpr int HANDEDNESS_LEFT = 0;
constexpr int HANDEDNESS_RIGHT = 1;

// Hand landmarks.
// For developer facing names, please refer to this doc -
// https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/wiki/spaces/AR/pages/2046919404/Hand+Tracking
constexpr int HANDLANDMARK_WRIST = 0;
constexpr int HANDLANDMARK_THUMB_CMC = 1;           // thumb base joint
constexpr int HANDLANDMARK_THUMB_MCP = 2;           // thumb mid joint
constexpr int HANDLANDMARK_THUMB_IP = 3;            // thumb top joint
constexpr int HANDLANDMARK_THUMB_TIP = 4;           // thumb tip
constexpr int HANDLANDMARK_INDEX_FINGER_MCP = 5;    // index base joint
constexpr int HANDLANDMARK_INDEX_FINGER_PIP = 6;    // index mid joint
constexpr int HANDLANDMARK_INDEX_FINGER_DIP = 7;    // index top joint
constexpr int HANDLANDMARK_INDEX_FINGER_TIP = 8;    // index tip
constexpr int HANDLANDMARK_MIDDLE_FINGER_MCP = 9;   // middle base joint
constexpr int HANDLANDMARK_MIDDLE_FINGER_PIP = 10;  // middle mid joint
constexpr int HANDLANDMARK_MIDDLE_FINGER_DIP = 11;  // middle top joint
constexpr int HANDLANDMARK_MIDDLE_FINGER_TIP = 12;  // middle tip
constexpr int HANDLANDMARK_RING_FINGER_MCP = 13;    // ring base joint
constexpr int HANDLANDMARK_RING_FINGER_PIP = 14;    // ring mid joint
constexpr int HANDLANDMARK_RING_FINGER_DIP = 15;    // ring top joint
constexpr int HANDLANDMARK_RING_FINGER_TIP = 16;    // ring tip
constexpr int HANDLANDMARK_PINKY_MCP = 17;          // pinky base joint
constexpr int HANDLANDMARK_PINKY_PIP = 18;          // pinky mid joint
constexpr int HANDLANDMARK_PINKY_DIP = 19;          // pinky top joint
constexpr int HANDLANDMARK_PINKY_TIP = 20;          // pinky tip

// extra hand attachment points
constexpr int HAND_LANDMARK_EXTRA_PALM = 21;               // palm center
constexpr int HAND_LANDMARK_EXTRA_BONE_THUMB_UPPER = 22;   // mid-top bone on thumb finger
constexpr int HAND_LANDMARK_EXTRA_BONE_THUMB_NAIL = 23;    // top-tip bone on thumb finger
constexpr int HAND_LANDMARK_EXTRA_BONE_INDEX_LOWER = 24;   // base-mid bone on index finger
constexpr int HAND_LANDMARK_EXTRA_BONE_INDEX_UPPER = 25;   // mid-top bone on index finger
constexpr int HAND_LANDMARK_EXTRA_BONE_INDEX_NAIL = 26;    // top-tip bone on index finger
constexpr int HAND_LANDMARK_EXTRA_BONE_MIDDLE_LOWER = 27;  // base-mid bone on middle finger
constexpr int HAND_LANDMARK_EXTRA_BONE_MIDDLE_UPPER = 28;  // mid-top bone on middle finger
constexpr int HAND_LANDMARK_EXTRA_BONE_MIDDLE_NAIL = 29;   // top-tip bone on middle finger
constexpr int HAND_LANDMARK_EXTRA_BONE_RING_LOWER = 30;    // base-mid bone on ring finger
constexpr int HAND_LANDMARK_EXTRA_BONE_RING_UPPER = 31;    // mid-top bone on ring finger
constexpr int HAND_LANDMARK_EXTRA_BONE_RING_NAIL = 32;     // top-tip bone on ring finger
constexpr int HAND_LANDMARK_EXTRA_BONE_PINKY_LOWER = 33;   // base-mid bone on pinky finger
constexpr int HAND_LANDMARK_EXTRA_BONE_PINKY_UPPER = 34;   // mid-top bone on pinky finger
constexpr int HAND_LANDMARK_EXTRA_BONE_PINKY_NAIL = 35;    // top-tip bone on pinky finger

// wrist attachment points.
constexpr int WRIST_LANDMARK_TOP = 36;     // top of wrist
constexpr int WRIST_LANDMARK_BOTTOM = 37;  // bottom of wrist
constexpr int WRIST_LANDMARK_INNER = 38;   // inner of wrist
constexpr int WRIST_LANDMARK_OUTER = 39;   // outer of wrist

///////////////////////////////////////// Hand Mesh ///////////////////////////////////////////////

// The hand mesh model "//reality/engine/hands/data/hand_mesh_*.tflite"
// input tensor is float32[1, 128, 128, 3].

// This input width will be used to do zoom-in rendering of the whole hand into 128x128 textures.
constexpr int HAND_MESH_DETECTION_INPUT_SIZE = 128;

////////////////////////////////////////// Hand Types /////////////////////////////////////////////

struct HandRenderResult {
  int srcTex;
  ConstRGBA8888PlanePixels rawPixels;
  RenderedSubImage handDetectImage;
  Vector<RenderedSubImage> handMeshImages;
};

// Contains world transformation information about the hand
struct HandAnchorTransform {
  HPoint3 position;
  Quaternion rotation;
  float scale;
};

// name : attachment point's name.
// position : Position of this attachment point in local mesh.
// rotation : the rotation quaternion that rotate positive-Y vector to this bone vector
// minorRadius : shortest radius from hand surface to the attachment position.
// majorRadius : longest radius from hand surface to the attachment position.
// innerPoint : inner point for the attachment point, e.g. palm side points on top of knuckles.
//   For wrist, inner point is similar to the inner gate point.
// outerPoint : outer point for the attachment point, e.g. on back of the hand on top of knuckles.
//   For wrist, outer point is similar to the outer gate point.
struct HandAttachmentPoint {
  HandAttachmentPointMsg::AttachmentName name;
  HPoint3 position;
  Quaternion rotation;
  float minorRadius;
  float majorRadius;
  HPoint3 innerPoint;
  HPoint3 outerPoint;
};

// Hand geometry measurement in meters
// TODO(yuyan): get more accurate measurements
constexpr float HAND_LENGTH_INDEX_MCP_PINKY_MCP = 0.08f;
constexpr float HAND_LENGTH_WRIST_INDEX_MCP = 0.13f;
constexpr float HAND_LENGTH_WRIST_PINKY_MCP = 0.11f;

// This contains the hand information that we provide to the user
struct Hand3d {
  enum TrackingStatus {
    UNSPECIFIED = 0,
    FOUND = 1,
    UPDATED = 2,
    LOST = 3,
  };

  enum HandKind {
    HAND_UNSPECIFIED = 0,
    LEFT = 1,
    RIGHT = 2,
  };

  HandAnchorTransform transform;
  // vertices are in local space w.r.t. the head transform
  Vector<HPoint3> vertices;
  // vertex normals are also in local space
  Vector<HVector3> normals;

  Hand3d::TrackingStatus status = Hand3d::TrackingStatus::UNSPECIFIED;
  int id = -1;
  Hand3d::HandKind handKind = Hand3d::HandKind::HAND_UNSPECIFIED;

  // Key points for the user to attach objects to easily
  Vector<HandAttachmentPoint> attachmentPoints;

  // wrist vertices are in local space w.r.t. the head transform
  Vector<HPoint3> wristVertices;

  // Wrist mesh transformation to the anchor's local space.
  HMatrix wristTransform = HMatrixGen::i();

  // Key wrist points for the user to attach objects to easily.
  Vector<HandAttachmentPoint> wristAttachmentPoints;
};

// This constant represents the max number of hands that can be tracked at a time
constexpr int MAX_HAND_DETECTIONS = 1;

// This is a sample of hand joint vertices locations in world space on Z plane.
// clang-format off
const c8::Vector<c8::HPoint3> HANDMESH_SAMPLE_VERTICES = {
  {0.527f, 0.933f, 0.0f},
  {0.363f, 0.827f, 0.0f},
  {0.283f, 0.687f, 0.0f},
  {0.210f, 0.573f, 0.0f},
  {0.113f, 0.473f, 0.0f},
  {0.393f, 0.467f, 0.0f},
  {0.360f, 0.343f, 0.0f},
  {0.327f, 0.240f, 0.0f},
  {0.297f, 0.137f, 0.0f},
  {0.507f, 0.460f, 0.0f},
  {0.510f, 0.317f, 0.0f},
  {0.510f, 0.187f, 0.0f},
  {0.517f, 0.073f, 0.0f},
  {0.600f, 0.480f, 0.0f},
  {0.630f, 0.360f, 0.0f},
  {0.640f, 0.247f, 0.0f},
  {0.650f, 0.133f, 0.0f},
  {0.703f, 0.560f, 0.0f},
  {0.770f, 0.480f, 0.0f},
  {0.817f, 0.430f, 0.0f},
  {0.870f, 0.340f, 0.0f},
};

const c8::Vector<std::pair<int, int>> HANDMESH_FINGER_INDICES = {
  {0, 1},
  {0, 5},
  {0, 17},
  {1, 2},
  {2, 3},
  {3, 4},
  {5, 6},
  {6, 7},
  {7, 8},
  {9, 10},
  {10, 11},
  {11, 12},
  {13, 14},
  {14, 15},
  {15, 16},
  {17, 18},
  {18, 19},
  {19, 20},
};

// clang-format on

// Gets key anchor positions and rotations
Vector<HandAttachmentPoint> getHandAttachmentPoints(
  const Vector<HPoint3> &localVertices,
  const Vector<HVector3> &vertexNormals,
  bool isLeftHand = false);

Vector<HandAttachmentPoint> getWristAttachmentPoints(
  const Vector<HPoint3> &localVertices, const bool isLeftHand);

// Each hand landmark might comprises multiple vertices. We average these vertices' position
// as the landmark's position.
Vector<HPoint3> getHandMeshLandmarkPositions(
  const Vector<HPoint3> &localVertices, const Vector<Vector<int>> &meshVertIndices);

Vector<HPoint3> getWristMeshLandmarkPositions(
  const Vector<HPoint3> &localVertices, const Vector<Vector<int>> &meshVertIndices);
}  // namespace c8
