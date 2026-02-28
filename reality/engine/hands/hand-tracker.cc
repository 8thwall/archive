// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"
cc_library {
  hdrs = {
    "hand-tracker.h",
  };
  deps = {
    ":hand-detector-global",
    ":hand-detector-local-mediapipe",
    "//c8:map",
    "//c8:vector",
    "//c8/geometry:face-types",
    "//c8/geometry:pixel-pinhole-camera-model",
    "//c8/io:capnp-messages",
    "//c8/stats:scope-timer",
    "//reality/engine/api:hand.capnp-cc",
    "//reality/engine/faces:face-geometry",
    "//reality/engine/faces:tracked-face-state",
    "//reality/engine/hands:hand-types",
    "//reality/engine/hands:tracked-hand-state",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0xbf3683d8);

#include <cmath>

#include "c8/io/capnp-messages.h"
#include "c8/stats/scope-timer.h"
#include "reality/engine/faces/face-geometry.h"
#include "reality/engine/hands/hand-tracker.h"
#include "reality/engine/hands/tracked-hand-state.h"

namespace c8 {

void HandTracker::reset() {
  handsById_.clear();
  globalHands_.clear();
  handData_.clear();
  lostIds_.clear();
}

void HandTracker::setMaxTrackedHands(int n) { maxTrackedHands_ = std::max(0, std::min(n, 3)); }

void HandTracker::setPalmDetectModel(const uint8_t *model, int modelSize) {
  handDetector_.reset(new HandDetectorGlobal(model, modelSize));
}

void HandTracker::setHandDetectModel(const uint8_t *model, int modelSize) {
  meshDetector_.reset(new HandDetectorLocal(model, modelSize));
}

HandTrackingResult HandTracker::track(
  const HandRenderResult &handRenderResult, c8_PixelPinholeCameraModel intrinsics) {
  ConstRootMessage<DebugOptions> opts;
  return track(handRenderResult, intrinsics, opts.reader());
}

HandTrackingResult HandTracker::track(
  const HandRenderResult &handRenderResult,
  c8_PixelPinholeCameraModel intrinsics,
  DebugOptions::Reader opts) {
  ScopeTimer t("track-hands");

  // Do computations
  globalHands_.clear();
  localHands_.clear();
  handData_.clear();
  lostIds_.clear();

  {
    ScopeTimer t1("hand-tracker-global-detectors");
    if (!opts.getOnlyDetectFaces()) {
      if (handRenderResult.handMeshImages.size() > 0 && meshDetector_ != nullptr) {
        for (const auto &im : handRenderResult.handMeshImages) {
          // Mesh detector will return 1 or 0 results.
          auto f = meshDetector_->analyzeHand(im, intrinsics);
          if (!f.empty()) {
            localHands_.push_back(f[0]);
            if (localHands_.size() >= maxTrackedHands_) {
              break;
            }
          }
        }
      }
    }

    // Store the detected hands location so that we only have to look in that area of the frame
    // for a hand in the next frame
    if (localHands_.empty() && handDetector_ != nullptr) {
      globalHands_ = handDetector_->detectHands(handRenderResult.handDetectImage, {});
      if (globalHands_.size() > maxTrackedHands_) {
        globalHands_.resize(maxTrackedHands_);
      }
      for (auto &f : globalHands_) {
        f.intrinsics = intrinsics;
      }
      assignIdsToGlobalDetections(globalHands_);
    }
  }

  {
    ScopeTimer t1("geometry");
    // For all of our existing state, mark that the hand could have been found so that we can find
    // lost ones later.
    for (auto &state : handsById_) {
      state.second.markFrame();
    }

    // Set the hands field for HandResponse if they have mesh data
    handData_.reserve(localHands_.size());
    for (const auto &handDetection : localHands_) {
      auto &handState = handsById_[handDetection.roi.faceId];  // creates if new.
      // Convert the orthographic handDetection information from local detection into 3D space
      handData_.push_back(handState.locateHand(handDetection));
    }

    // Find lost elements and remove them.
    lostIds_.reserve(handsById_.size());
    for (const auto &state : handsById_) {
      if (state.second.status() == Hand3d::TrackingStatus::LOST) {
        lostIds_.push_back(state.first);
      }
    }

    for (auto id : lostIds_) {
      Hand3d lostHand;
      lostHand.id = id;
      lostHand.status = Hand3d::TrackingStatus::LOST;
      handData_.push_back(lostHand);
      handsById_.erase(id);
    }
  }

  return {&globalHands_, &localHands_, &handData_, &lostIds_};
}

void HandTracker::assignIdsToGlobalDetections(Vector<DetectedPoints> &detections) {
  // Workaround for a tricky issue, see below. This workaround is sufficient for cases when the
  // number of tracked faces is at most 1, or for the case of analyzing a stable static image where
  // the global face detector gives a predicable and reliable ordering to the faces in the image.
  // To support dynamic tracking of multiple faces, this needs more work.
  for (int i = 0; i < detections.size(); ++i) {
    detections[i].roi.faceId = i + 1;
  }
  // There is a tricky issue here that can be solved in a mostly good way with some care. We want
  // to provide a stable id for each tracked face, which we do by attaching the id to an ROI.
  // The challenge is that because of data pipeling, we won't see the results from an ROI until
  // some time later.
  //
  // A naive implementation will cause a ping-pong effect between two ids for the same face:
  //
  // Frame 0:
  //   Frame 0 rendered without an roi
  // Frame 1:
  //   Frame 0 read back
  //   Frame 1 rendered without an roi
  //   Frame 0 processed
  //   Global face found, not associated with an roi
  //   Generate new roi id 1 and set roi for global face 1
  // Frame 2:
  //   Frame 1 read back
  //   Frame 2 rendered with an roi for global face 1
  //   Frame 1 processed
  //   Global face found, not associated with an roi
  //   Generate new roi id 2 and set roi for global face 2
  // Frame 3:
  //   Frame 2 read back
  //   Frame 3 rendered with an roi for global face 2
  //   Frame 2 processed
  //   Local face found, associated with roi face 1
  //   Roi set for locally tracked face 1
  // Frame 4:
  //   Frame 3 read back
  //   Frame 4 rendered with an roi for locally tracked face 1
  //   Frame 3 processed
  //   Local face found, associated with roi face 2
  //   Roi set for locally tracked face 2
  // Frame 5:
  //   Frame 4 read back
  //   Frame 5 rendered with an roi for locally tracked face 2
  //   Frame 4 processed
  //   Local face found, associated with roi face 1
  //   Roi set for locally tracked face 1
  // and then 4+5 repeat, switching between roi id 1 and 2 on every frame.
  //
  // The issue arose because Frame 1 was not aware that there was an ROI that should was already
  // being materialized for the same face it found, and it did not know how to associate its locally
  // found face with the id that had been assigned for tracking.
  //
  // A solution would be to remember on frame 1 that an id was assigned to an ROI in frame 0,
  // and to reuse the same id for the roi on frame 1. Once two subsequent frames agree on an ROI's
  // id, the issue goes away.
  //
  // In the case of tracking multiple faces, the issue is somewhat more complex because we need to
  // reliably distinguish which previous frame ROI matches which new frame ROI.
  //
  // Note that this problem exists for faces but not image targets because image targets are
  // inherently identifiable, since they only match to a reference, and never to themselves. Put
  // another way, if we had a way to put a name to the face, we could just use that name for the id
  // and also avoid this issue.
}

}  // namespace c8
