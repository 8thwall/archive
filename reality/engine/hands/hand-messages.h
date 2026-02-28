// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

/**
 * Hand-messages is used to convert the Structs in hand-types.h into their capnp form defined
 * in hand.capnp
 */

#include "c8/vector.h"
#include "reality/engine/api/hand.capnp.h"
#include "reality/engine/hands/hand-types.h"

namespace c8 {

void fillRenderedImage(const HandRenderResult &r, HandDebugResponse::Builder b);

void fillHandDetections(
  const Vector<DetectedPoints> &globalHands,
  const Vector<DetectedPoints> &localHands,
  HandDebugDetections::Builder b);

void fillHandAttachment(HandAttachmentPointMsg::Builder b, const HandAttachmentPoint &attachment);

void fillHand(HandMsg::Builder b, const Hand3d &handData);

void fillHands(HandResponse::Builder b, const Vector<Hand3d> &handData, const bool doFillWrists);

void fillHandMeshAndUvIndices(HandModelGeometryMsg::Builder b);

void fillArmMeshAndUvIndices(ArmModelGeometryMsg::Builder b, const bool isLeftWrist = true);

}  // namespace c8
