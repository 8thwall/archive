// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "hand-messages.h",
  };
  deps = {
    ":hand-types",
    ":handmesh-data",
    "//c8:vector",
    "//c8/geometry:egomotion",
    "//c8/geometry:mesh",
    "//c8/geometry:mesh-types",
    "//c8/protolog:xr-requests",
    "//reality/engine/api:hand.capnp-cc",
    "//reality/engine/api/base:camera-intrinsics.capnp-cc",
    "//reality/engine/faces:face-messages",
  };
  visibility = {
    "//visibility:public",
  };
}

cc_end(0x04d0ffcc);

#include "c8/geometry/egomotion.h"
#include "c8/geometry/mesh-types.h"
#include "c8/geometry/mesh.h"
#include "c8/protolog/xr-requests.h"
#include "c8/vector.h"
#include "reality/engine/api/hand.capnp.h"
#include "reality/engine/faces/face-messages.h"
#include "reality/engine/hands/hand-messages.h"
#include "reality/engine/hands/hand-types.h"
#include "reality/engine/hands/handmesh-data.h"

namespace c8 {

void fillRenderedImage(const HandRenderResult &r, HandDebugResponse::Builder b) {
  auto im = r.rawPixels;
  b.getRenderedImg().setRows(im.rows());
  b.getRenderedImg().setCols(im.cols());
  b.getRenderedImg().setBytesPerRow(im.rowBytes());
  b.getRenderedImg().initUInt8PixelData(im.rows() * im.rowBytes());
  std::memcpy(
    b.getRenderedImg().getUInt8PixelData().begin(), im.pixels(), im.rows() * im.rowBytes());
}

void fillHandDetections(
  const Vector<DetectedPoints> &globalHands,
  const Vector<DetectedPoints> &localHands,
  HandDebugDetections::Builder b) {
  auto gh = b.initGlobalHands(globalHands.size());
  for (int i = 0; i < globalHands.size(); ++i) {
    fillDetection(globalHands[i], gh[i]);
  }
  auto lh = b.initLocalHands(localHands.size());
  for (int i = 0; i < localHands.size(); ++i) {
    fillDetection(localHands[i], lh[i]);
  }
}

void fillHand(HandMsg::Builder b, const Hand3d &handData, bool doFillWrists) {
  b.setId(handData.id);

  switch (handData.status) {
    case Hand3d::TrackingStatus::FOUND: {
      b.setStatus(HandMsg::TrackingStatus::FOUND);
      break;
    }
    case Hand3d::TrackingStatus::UPDATED: {
      b.setStatus(HandMsg::TrackingStatus::UPDATED);
      break;
    }
    case Hand3d::TrackingStatus::LOST: {
      b.setStatus(HandMsg::TrackingStatus::LOST);
      break;
    }
    default:
      // Don't specify status.
      break;
  }

  if (!(handData.status == Hand3d::TrackingStatus::FOUND
        || handData.status == Hand3d::TrackingStatus::UPDATED)) {
    return;
  }

  b.getTransform().getPosition().setX(handData.transform.position.x());
  b.getTransform().getPosition().setY(handData.transform.position.y());
  b.getTransform().getPosition().setZ(handData.transform.position.z());

  b.getTransform().getRotation().setW(handData.transform.rotation.w());
  b.getTransform().getRotation().setX(handData.transform.rotation.x());
  b.getTransform().getRotation().setY(handData.transform.rotation.y());
  b.getTransform().getRotation().setZ(handData.transform.rotation.z());

  b.getTransform().setScale(handData.transform.scale);

  // For debugging purpose, we may append the 2D landmark points and 3D joint points
  // to the handData.vertices vector.
  // These appended points should not be written into the hand message.
  const int vertCount = HANDMESH_R_UV_VERTEX_COUNT;

  auto vertices = b.initVertices(vertCount * 3);
  for (int i = 0; i < vertCount; ++i) {
    vertices.set(3 * i, handData.vertices[i].x());
    vertices.set(3 * i + 1, handData.vertices[i].y());
    vertices.set(3 * i + 2, handData.vertices[i].z());
  }

  auto normals = b.initNormals(vertCount * 3);
  for (int i = 0; i < vertCount; ++i) {
    normals.set(3 * i, handData.normals[i].x());
    normals.set(3 * i + 1, handData.normals[i].y());
    normals.set(3 * i + 2, handData.normals[i].z());
  }

  // Set anchors
  auto attachmentCount = handData.attachmentPoints.size();
  if (doFillWrists) {
    attachmentCount += handData.wristAttachmentPoints.size();
  }
  auto attachmentPoints = b.initAttachmentPoints(attachmentCount);
  for (int i = 0; i < handData.attachmentPoints.size(); ++i) {
    const auto &anchor = handData.attachmentPoints[i];
    fillHandAttachment(attachmentPoints[i], anchor);
  }

  // Set wrist anchors.
  if (doFillWrists) {
    for (int i = 0; i < handData.wristAttachmentPoints.size(); ++i) {
      const auto &anchor = handData.wristAttachmentPoints[i];
      fillHandAttachment(attachmentPoints[handData.attachmentPoints.size() + i], anchor);
    }
  }

  // Set hand kind
  switch (handData.handKind) {
    case Hand3d::HandKind::LEFT: {
      b.setHandKind(HandMsg::HandKind::LEFT);
      break;
    }
    case Hand3d::HandKind::RIGHT: {
      b.setHandKind(HandMsg::HandKind::RIGHT);
      break;
    }
    default:
      // Don't specify status.
      break;
  }

  if (doFillWrists) {
    auto wristTranslation = trsTranslation(handData.wristTransform);
    auto wristRotation = trsRotation(handData.wristTransform);
    b.getWristTransform().getPosition().setX(wristTranslation.x());
    b.getWristTransform().getPosition().setY(wristTranslation.y());
    b.getWristTransform().getPosition().setZ(wristTranslation.z());
    b.getWristTransform().getRotation().setW(wristRotation.w());
    b.getWristTransform().getRotation().setX(wristRotation.x());
    b.getWristTransform().getRotation().setY(wristRotation.y());
    b.getWristTransform().getRotation().setZ(wristRotation.z());
  }
  b.getWristTransform().setScale(1);
}

void fillHandAttachment(
  HandAttachmentPointMsg::Builder attachmentPoint, const HandAttachmentPoint &anchor) {
  setPosition32f(
    anchor.position.x(), anchor.position.y(), anchor.position.z(), attachmentPoint.getPosition());

  attachmentPoint.setName(anchor.name);

  setQuaternion32f(
    anchor.rotation.w(),
    anchor.rotation.x(),
    anchor.rotation.y(),
    anchor.rotation.z(),
    attachmentPoint.getRotation());

  attachmentPoint.setMinorRadius(anchor.minorRadius);
  attachmentPoint.setMajorRadius(anchor.majorRadius);

  setPosition32f(
    anchor.innerPoint.x(),
    anchor.innerPoint.y(),
    anchor.innerPoint.z(),
    attachmentPoint.getInnerPoint());

  setPosition32f(
    anchor.outerPoint.x(),
    anchor.outerPoint.y(),
    anchor.outerPoint.z(),
    attachmentPoint.getOuterPoint());
}

void fillHands(HandResponse::Builder b, const Vector<Hand3d> &handData, const bool doFillWrists) {
  auto hands = b.initHands(handData.size());
  for (int i = 0; i < handData.size(); ++i) {
    fillHand(hands[i], handData[i], doFillWrists);
  }
}

void fillHandMeshAndUvIndices(HandModelGeometryMsg::Builder b) {
  auto fs = b.initRightIndices(HANDMESH_R_VERT_UV_INDICES.size());
  for (int i = 0; i < HANDMESH_R_VERT_UV_INDICES.size(); ++i) {
    fs[i].setA(HANDMESH_R_VERT_UV_INDICES[i].a);
    fs[i].setB(HANDMESH_R_VERT_UV_INDICES[i].b);
    fs[i].setC(HANDMESH_R_VERT_UV_INDICES[i].c);
  }

  auto ls = b.initLeftIndices(HANDMESH_L_VERT_UV_INDICES.size());
  for (int i = 0; i < HANDMESH_L_VERT_UV_INDICES.size(); ++i) {
    ls[i].setA(HANDMESH_L_VERT_UV_INDICES[i].a);
    ls[i].setB(HANDMESH_L_VERT_UV_INDICES[i].b);
    ls[i].setC(HANDMESH_L_VERT_UV_INDICES[i].c);
  }

  auto rUvs = b.initRightUvs(HANDMESH_R_UVS.size());
  for (int i = 0; i < HANDMESH_R_UVS.size(); ++i) {
    rUvs[i].setU(HANDMESH_R_UVS[i].x());
    rUvs[i].setV(HANDMESH_R_UVS[i].y());
  }

  auto lUvs = b.initLeftUvs(HANDMESH_L_UVS.size());
  for (int i = 0; i < HANDMESH_L_UVS.size(); ++i) {
    lUvs[i].setU(HANDMESH_L_UVS[i].x());
    lUvs[i].setV(HANDMESH_L_UVS[i].y());
  }
}

void fillArmMeshAndUvIndices(ArmModelGeometryMsg::Builder b, const bool isLeftWrist) {
  auto vs = b.initVertices(ARMMESH_VERTICES.size());
  for (int i = 0; i < ARMMESH_VERTICES.size(); ++i) {
    if (isLeftWrist) {
      vs[i].setX(-ARMMESH_VERTICES[i].x());
    } else {
      vs[i].setX(ARMMESH_VERTICES[i].x());
    }
    vs[i].setY(ARMMESH_VERTICES[i].y());
    vs[i].setZ(ARMMESH_VERTICES[i].z());
  }

  auto lNs = b.initNormals(ARMMESH_NORMALS.size());
  for (int i = 0; i < ARMMESH_NORMALS.size(); ++i) {
    lNs[i].setX(ARMMESH_NORMALS[i].x());
    lNs[i].setY(ARMMESH_NORMALS[i].y());
    lNs[i].setZ(ARMMESH_NORMALS[i].z());
  }

  auto ids = b.initIndices(ARMMESH_INDICES.size());
  if (isLeftWrist) {
    for (int i = 0; i < ARMMESH_INDICES.size(); ++i) {
      ids[i].setA(ARMMESH_INDICES[i].a);
      ids[i].setB(ARMMESH_INDICES[i].b);
      ids[i].setC(ARMMESH_INDICES[i].c);
    }
  } else {
    for (int i = 0; i < ARMMESH_INDICES.size(); ++i) {
      ids[i].setA(ARMMESH_INDICES[i].a);
      ids[i].setB(ARMMESH_INDICES[i].c);
      ids[i].setC(ARMMESH_INDICES[i].b);
    }
  }

  auto uvs = b.initUvs(ARMMESH_UVS.size());
  for (int i = 0; i < ARMMESH_UVS.size(); ++i) {
    uvs[i].setU(ARMMESH_UVS[i].x());
    uvs[i].setV(ARMMESH_UVS[i].y());
  }
}

}  // namespace c8
