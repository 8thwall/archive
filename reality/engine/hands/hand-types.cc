// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"
cc_library {
  hdrs = {
    "hand-types.h",
  };
  deps = {
    "//c8:hpoint",
    "//c8:hmatrix",
    "//c8:hvector",
    "//c8:quaternion",
    "//c8:string",
    "//c8:vector",
    "//c8/geometry:face-types",
    "//c8/geometry:mesh",
    "//c8/geometry:mesh-types",
    "//c8/geometry:pixel-pinhole-camera-model",
    "//c8/pixels:image-roi",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixels",
    "//reality/engine/hands:handmesh-data",
    "//reality/engine/api:hand.capnp-cc",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0xc7621ed9);

#include "c8/geometry/mesh.h"
#include "reality/engine/hands/hand-types.h"
#include "reality/engine/hands/handmesh-data.h"

namespace c8 {

namespace {
static HMatrix matY90 = HMatrixGen::yRadians(M_PI_2);
static HMatrix matY180 = HMatrixGen::yRadians(M_PI);
}  // namespace

// Compute the rotation based on {vUp, vDown, vLeft, vRight} vertex set
// then rotate 90 degrees along the Y axis to align with the right-handed coordinate system,
// where the positive x-axis points to the right, the positive y-axis points up, and the positive
// z-axis points towards the viewer.
// The right-handed coordinate system is consistent with ThreeJS and A-Frame systems.
HMatrix rotationByDirectionVertices(
  const HPoint3 vUp, const HPoint3 vDown, const HPoint3 vLeft, const HPoint3 vRight) {
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
  x = y.cross(z);

  x = x.unit();
  y = y.unit();
  z = z.unit();

  HMatrix rotM = {
    {x.x(), y.x(), z.x(), 0.0f},
    {x.y(), y.y(), z.y(), 0.0f},
    {x.z(), y.z(), z.z(), 0.0f},
    {0.0f, 0.0f, 0.0f, 1.0f},
  };
  return rotM * matY90;
}

Quaternion quaternionByOrientVertices(
  const Vector<HPoint3> &localVertices,
  const Vector<int> &vertIndicesOrientation,
  const bool isLeftHand) {
  Quaternion r;
  int indUp = vertIndicesOrientation[0];
  int indDown = vertIndicesOrientation[1];
  int indLeft = vertIndicesOrientation[2];
  int indRight = vertIndicesOrientation[3];
  if (isLeftHand) {
    std::swap(indUp, indDown);
  }
  HMatrix rotFrame = rotationByDirectionVertices(
    localVertices[indUp], localVertices[indDown], localVertices[indLeft], localVertices[indRight]);
  if (isLeftHand) {
    r = Quaternion::fromHMatrix(rotFrame * matY180);
  } else {
    r = Quaternion::fromHMatrix(rotFrame);
  }
  return r;
}

// Create a hand attachment point for elliptic cylinder objects
// localVertices: 3D mesh vertices in local coordinates
// vertexNormals: vertex normals for mesh vertices
// vertIndicesBottom: vertex indices describe the bottom oval
// vertIndicesTop: vertex indices describe the top oval
// vertIndicesOrientation: {vUp, vDown, vLeft, vRight} vertex indices for rotation computation
// normalVertIndex: get the vertex normal directly at normalVertIndex
// centerToTopWeight: center = (1-centerToTopWeight) * bottomCenter + centerToTopWeight * topCenter
HandAttachmentPoint createHandAttachmentPointByCylinderInfo(
  const HandAttachmentPointMsg::AttachmentName &name,
  const Vector<HPoint3> &localVertices,
  const Vector<HVector3> &vertexNormals,
  const Vector<int> &vertIndicesBottom,
  const Vector<int> &vertIndicesTop,
  const Vector<int> &vertIndicesOrientation,
  const int normalVertIndex,
  const bool isLeftHand,
  const float centerToTopWeight = 0.5f) {

  // compute mid point of top
  HPoint3 cyTopCenter = computeCentroid(localVertices, vertIndicesTop);
  // compute mid point of bottom
  HPoint3 cyBottomCenter = computeCentroid(localVertices, vertIndicesBottom);

  // center is interpolated linearly between cyTopCenter and cyBottomCenter
  float cx = (1.0f - centerToTopWeight) * cyBottomCenter.x() + centerToTopWeight * cyTopCenter.x();
  float cy = (1.0f - centerToTopWeight) * cyBottomCenter.y() + centerToTopWeight * cyTopCenter.y();
  float cz = (1.0f - centerToTopWeight) * cyBottomCenter.z() + centerToTopWeight * cyTopCenter.z();
  HPoint3 center(cx, cy, cz);

  // top min max radius
  float topMinR, topMaxR;
  computeMinMaxDistanceFromPoint(cyTopCenter, localVertices, vertIndicesTop, &topMinR, &topMaxR);
  // bottom min max radius
  float botMinR, botMaxR;
  computeMinMaxDistanceFromPoint(
    cyBottomCenter, localVertices, vertIndicesBottom, &botMinR, &botMaxR);

  // averaged normal
  HVector3 normal = vertexNormals[normalVertIndex];
  // TODO(yuyan): we need to know whether the hand is left or right to get the correct normals
  normal = {-normal.x(), -normal.y(), -normal.z()};

  const float minR = (topMinR + botMinR) / 2.0f;
  HPoint3 innerPt = {
    center.x() - minR * normal.x(), center.y() - minR * normal.y(), center.z() - minR * normal.z()};
  HPoint3 outerPt = {
    center.x() + minR * normal.x(), center.y() + minR * normal.y(), center.z() + minR * normal.z()};

  // Use local vertices to compute the rotation
  Quaternion r;
  if (!vertIndicesOrientation.empty()) {
    r = quaternionByOrientVertices(localVertices, vertIndicesOrientation, isLeftHand);
  }

  return {
    name,
    center,
    r,
    minR,
    (topMaxR + botMaxR) / 2.0f,
    innerPt,
    outerPt,
  };
}

// Create a hand attachment point for knuckles, close to spherical shape
// localVertices: 3D mesh vertices in local coordinates
// vertexNormals: vertex normals for mesh vertices
// knuckleIndex: get knuckle joint position at this index.
//   If the knuckle is not one of the landmark knuckles, use -1 instead.
// pointToKnuckleIndex: the knuckle index the bone is pointing to.
//   If the knuckle is not one of the landmark knuckles, use -1 instead.
// vertIndexPalmSide: vertex index for palm side point
// vertIndexBack: vertex index for hand back point
// vertIndicesOrientation: {vUp, vDown, vLeft, vRight} vertex indices for rotation computation
// normalVertIndex: vertex index for knuckle normal
HandAttachmentPoint createHandAttachmentPointByKnuckleInfo(
  const HandAttachmentPointMsg::AttachmentName &name,
  const Vector<HPoint3> &localVertices,
  const Vector<HVector3> &vertexNormals,
  const int knuckleIndex,
  const int pointToKnuckleIndex,
  const int vertIndexPalmSide,
  const int vertIndexBack,
  const Vector<int> &vertIndicesOrientation,
  const int normalVertIndex,
  const bool isLeftHand) {
  const bool isInternalKnuckle =
    (knuckleIndex >= 0 && knuckleIndex < HAND_LANDMARK_DETECTIONS && pointToKnuckleIndex >= 0
     && pointToKnuckleIndex < HAND_LANDMARK_DETECTIONS);

  HPoint3 innerPt = localVertices[vertIndexPalmSide];
  HPoint3 outerPt = localVertices[vertIndexBack];

  const int numKeyPoints = getHandMeshModelKeyPointCount();

  HPoint3 center;
  if (isInternalKnuckle) {
    center = localVertices[HANDMESH_R_UV_VERTEX_COUNT + numKeyPoints + knuckleIndex];
  } else {
    center = {
      (innerPt.x() + outerPt.x()) / 2.0f,
      (innerPt.y() + outerPt.y()) / 2.0f,
      (innerPt.z() + outerPt.z()) / 2.0f};
  }

  HVector3 knuckleV = {
    outerPt.x() - center.x(), outerPt.y() - center.y(), outerPt.z() - center.z()};
  float radius = knuckleV.l2Norm();
  // special case for palm, the radius is from palm center point to the edge
  if (name == HandAttachmentPointMsg::AttachmentName::PALM) {
    HPoint3 edgePt = localVertices[HANDMESH_R_VERTEX_INDEX_PALM_EDGE];
    HVector3 edgeV = {edgePt.x() - center.x(), edgePt.y() - center.y(), edgePt.z() - center.z()};
    radius = edgeV.l2Norm();
  }

  // rotation
  Quaternion r;
  if (!vertIndicesOrientation.empty()) {
    r = quaternionByOrientVertices(localVertices, vertIndicesOrientation, isLeftHand);
  }

  return {
    name,
    center,
    r,
    radius,
    radius,
    innerPt,
    outerPt,
  };
}

// Gets key anchor positions and rotations
Vector<HandAttachmentPoint> getHandAttachmentPoints(
  const Vector<HPoint3> &localVertices, const Vector<HVector3> &vertexNormals, bool isLeftHand) {
  return {
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::WRIST,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HANDLANDMARK_WRIST],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HANDLANDMARK_WRIST + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_WRIST],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_WRIST],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::THUMB_BASE_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_THUMB_CMC,
      HANDLANDMARK_THUMB_MCP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_THUMB_CMC],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_THUMB_CMC + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_THUMB_CMC],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_THUMB_CMC],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::THUMB_MID_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_THUMB_MCP,
      HANDLANDMARK_THUMB_IP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_THUMB_MCP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_THUMB_MCP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_THUMB_MCP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_THUMB_MCP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::THUMB_TOP_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_THUMB_IP,
      HANDLANDMARK_THUMB_TIP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_THUMB_IP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_THUMB_IP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_THUMB_IP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_THUMB_IP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::THUMB_TIP,
      localVertices,
      vertexNormals,
      -1,
      -1,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_THUMB_TIP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_THUMB_TIP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_THUMB_TIP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_THUMB_TIP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::INDEX_BASE_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_INDEX_FINGER_MCP,
      HANDLANDMARK_INDEX_FINGER_PIP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_INDEX_FINGER_MCP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_INDEX_FINGER_MCP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_INDEX_FINGER_MCP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_INDEX_FINGER_MCP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::INDEX_MID_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_INDEX_FINGER_PIP,
      HANDLANDMARK_INDEX_FINGER_DIP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_INDEX_FINGER_PIP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_INDEX_FINGER_PIP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_INDEX_FINGER_PIP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_INDEX_FINGER_PIP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::INDEX_TOP_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_INDEX_FINGER_DIP,
      HANDLANDMARK_INDEX_FINGER_TIP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_INDEX_FINGER_DIP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_INDEX_FINGER_DIP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_INDEX_FINGER_DIP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_INDEX_FINGER_DIP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::INDEX_TIP,
      localVertices,
      vertexNormals,
      -1,
      -1,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_INDEX_FINGER_TIP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_INDEX_FINGER_TIP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_INDEX_FINGER_TIP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_INDEX_FINGER_TIP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::MIDDLE_BASE_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_MIDDLE_FINGER_MCP,
      HANDLANDMARK_MIDDLE_FINGER_PIP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_MIDDLE_FINGER_MCP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_MIDDLE_FINGER_MCP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_MIDDLE_FINGER_MCP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_MIDDLE_FINGER_MCP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::MIDDLE_MID_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_MIDDLE_FINGER_PIP,
      HANDLANDMARK_MIDDLE_FINGER_DIP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_MIDDLE_FINGER_PIP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_MIDDLE_FINGER_PIP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_MIDDLE_FINGER_PIP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_MIDDLE_FINGER_PIP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::MIDDLE_TOP_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_MIDDLE_FINGER_DIP,
      HANDLANDMARK_MIDDLE_FINGER_TIP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_MIDDLE_FINGER_DIP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_MIDDLE_FINGER_DIP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_MIDDLE_FINGER_DIP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_MIDDLE_FINGER_DIP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::MIDDLE_TIP,
      localVertices,
      vertexNormals,
      -1,
      -1,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_MIDDLE_FINGER_TIP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_MIDDLE_FINGER_TIP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_MIDDLE_FINGER_TIP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_MIDDLE_FINGER_TIP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::RING_BASE_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_RING_FINGER_MCP,
      HANDLANDMARK_RING_FINGER_PIP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_RING_FINGER_MCP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_RING_FINGER_MCP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_RING_FINGER_MCP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_RING_FINGER_MCP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::RING_MID_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_RING_FINGER_PIP,
      HANDLANDMARK_RING_FINGER_DIP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_RING_FINGER_PIP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_RING_FINGER_PIP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_RING_FINGER_PIP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_RING_FINGER_PIP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::RING_TOP_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_RING_FINGER_DIP,
      HANDLANDMARK_RING_FINGER_TIP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_RING_FINGER_DIP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_RING_FINGER_DIP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_RING_FINGER_DIP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_RING_FINGER_DIP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::RING_TIP,
      localVertices,
      vertexNormals,
      -1,
      -1,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_RING_FINGER_TIP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_RING_FINGER_TIP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_RING_FINGER_TIP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_RING_FINGER_TIP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::PINKY_BASE_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_PINKY_MCP,
      HANDLANDMARK_PINKY_PIP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_PINKY_MCP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_PINKY_MCP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_PINKY_MCP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_PINKY_MCP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::PINKY_MID_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_PINKY_PIP,
      HANDLANDMARK_PINKY_DIP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_PINKY_PIP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_PINKY_PIP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_PINKY_PIP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_PINKY_PIP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::PINKY_TOP_JOINT,
      localVertices,
      vertexNormals,
      HANDLANDMARK_PINKY_DIP,
      HANDLANDMARK_PINKY_TIP,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_PINKY_DIP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_PINKY_DIP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_PINKY_DIP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_PINKY_DIP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::PINKY_TIP,
      localVertices,
      vertexNormals,
      -1,
      -1,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_PINKY_TIP],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HANDLANDMARK_PINKY_TIP + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HANDLANDMARK_PINKY_TIP],
      HAND_R_MESH_NORMAL_INDICES[HANDLANDMARK_PINKY_TIP],
      isLeftHand),
    createHandAttachmentPointByKnuckleInfo(
      HandAttachmentPointMsg::AttachmentName::PALM,
      localVertices,
      vertexNormals,
      -1,
      -1,
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HAND_LANDMARK_EXTRA_PALM],
      HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES[2 * HAND_LANDMARK_EXTRA_PALM + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_PALM],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_PALM],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::THUMB_UPPER,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_THUMB_UPPER],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_THUMB_UPPER + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_THUMB_UPPER],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_THUMB_UPPER],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::THUMB_NAIL,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_THUMB_NAIL],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_THUMB_NAIL + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_THUMB_NAIL],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_THUMB_NAIL],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::INDEX_LOWER,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_INDEX_LOWER],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_INDEX_LOWER + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_INDEX_LOWER],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_INDEX_LOWER],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::INDEX_UPPER,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_INDEX_UPPER],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_INDEX_UPPER + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_INDEX_UPPER],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_INDEX_UPPER],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::INDEX_NAIL,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_INDEX_NAIL],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_INDEX_NAIL + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_INDEX_NAIL],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_INDEX_NAIL],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::MIDDLE_LOWER,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_MIDDLE_LOWER],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_MIDDLE_LOWER + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_MIDDLE_LOWER],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_MIDDLE_LOWER],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::MIDDLE_UPPER,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_MIDDLE_UPPER],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_MIDDLE_UPPER + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_MIDDLE_UPPER],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_MIDDLE_UPPER],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::MIDDLE_NAIL,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_MIDDLE_NAIL],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_MIDDLE_NAIL + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_MIDDLE_NAIL],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_MIDDLE_NAIL],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::RING_LOWER,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_RING_LOWER],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_RING_LOWER + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_RING_LOWER],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_RING_LOWER],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::RING_UPPER,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_RING_UPPER],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_RING_UPPER + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_RING_UPPER],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_RING_UPPER],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::RING_NAIL,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_RING_NAIL],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_RING_NAIL + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_RING_NAIL],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_RING_NAIL],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::PINKY_LOWER,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_PINKY_LOWER],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_PINKY_LOWER + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_PINKY_LOWER],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_PINKY_LOWER],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::PINKY_UPPER,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_PINKY_UPPER],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_PINKY_UPPER + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_PINKY_UPPER],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_PINKY_UPPER],
      isLeftHand),
    createHandAttachmentPointByCylinderInfo(
      HandAttachmentPointMsg::AttachmentName::PINKY_NAIL,
      localVertices,
      vertexNormals,
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_PINKY_NAIL],
      HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HAND_LANDMARK_EXTRA_BONE_PINKY_NAIL + 1],
      HAND_R_MESH_ORIENTATION_INDICES[HAND_LANDMARK_EXTRA_BONE_PINKY_NAIL],
      HAND_R_MESH_NORMAL_INDICES[HAND_LANDMARK_EXTRA_BONE_PINKY_NAIL],
      isLeftHand),
  };
}

HandAttachmentPoint createWristAttachmentPoint(
  const HandAttachmentPointMsg::AttachmentName &name,
  const Vector<HPoint3> &localVertices,
  Vector<int> &vertIndicesOrientation,
  int normalVertIndex,
  float minR,
  float maxR,
  const bool isLeftHand) {
  // Use local vertices to compute the rotation
  Quaternion r;
  if (!vertIndicesOrientation.empty()) {
    // The y-flip for wrist is opposite of hand in which the y is flipped for the right hand.
    r = quaternionByOrientVertices(localVertices, vertIndicesOrientation, !isLeftHand);
  }
  return {
    name,
    localVertices[normalVertIndex],
    r,
    minR,
    maxR,
    localVertices[WRIST_MESH_ATTACHMENT_BOTTOM],
    localVertices[WRIST_MESH_ATTACHMENT_TOP],
  };
}

Vector<HandAttachmentPoint> getWristAttachmentPoints(
  const Vector<HPoint3> &localVertices, const bool isLeftHand) {
  Vector<int> vertIndicesOrientation;
  vertIndicesOrientation = {
    WRIST_MESH_ATTACHMENT_TOP,
    WRIST_MESH_ATTACHMENT_BOTTOM,
    WRIST_MESH_ATTACHMENT_OUTER,
    WRIST_MESH_ATTACHMENT_INNER};

  auto center = computeCentroid(localVertices, vertIndicesOrientation);

  // Calculate the inner and outer radius
  float minR, maxR;
  computeMinMaxDistanceFromPoint(center, localVertices, vertIndicesOrientation, &minR, &maxR);

  return {
    createWristAttachmentPoint(
      HandAttachmentPointMsg::AttachmentName::WRIST_TOP,
      localVertices,
      vertIndicesOrientation,
      WRIST_MESH_ATTACHMENT_TOP,
      minR,
      maxR,
      isLeftHand),
    createWristAttachmentPoint(
      HandAttachmentPointMsg::AttachmentName::WRIST_BOTTOM,
      localVertices,
      vertIndicesOrientation,
      WRIST_MESH_ATTACHMENT_BOTTOM,
      minR,
      maxR,
      isLeftHand),
    createWristAttachmentPoint(
      HandAttachmentPointMsg::AttachmentName::WRIST_INNER,
      localVertices,
      vertIndicesOrientation,
      WRIST_MESH_ATTACHMENT_INNER,
      minR,
      maxR,
      isLeftHand),
    createWristAttachmentPoint(
      HandAttachmentPointMsg::AttachmentName::WRIST_OUTER,
      localVertices,
      vertIndicesOrientation,
      WRIST_MESH_ATTACHMENT_OUTER,
      minR,
      maxR,
      isLeftHand)};
}

// Each hand landmark might comprises multiple vertices. We average these vertices' position
// as the landmark's position.
Vector<HPoint3> getHandMeshLandmarkPositions(
  const Vector<HPoint3> &localVertices, const Vector<Vector<int>> &meshVertIndices) {
  Vector<HPoint3> landmarkMeshPts(meshVertIndices.size());
  for (size_t i = 0; i < meshVertIndices.size(); ++i) {
    const Vector<int> &indices = meshVertIndices[i];
    landmarkMeshPts[i] = computeCentroid(localVertices, indices);
  }

  return landmarkMeshPts;
}

}  // namespace c8
