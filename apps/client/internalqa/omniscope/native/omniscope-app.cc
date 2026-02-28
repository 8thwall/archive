// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "apps/client/internalqa/omniscope/native/omniscope-app.h"

#include "apps/client/internalqa/omniscope/native/views/features/gravitywarp-view.h"
#include "apps/client/internalqa/omniscope/native/views/features/localmatch-view.h"
#include "apps/client/internalqa/omniscope/native/views/features/pyramid-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetcampyramid-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetfeatures-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetgravitywarp-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetlocal-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetlsh-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetpose-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetproduct-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetpyramid-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetrelative-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetresidual-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetroi-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetsource-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetstability-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetstable-view.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetwarp-view.h"
#include "apps/client/internalqa/omniscope/native/views/pose/eartracker-view.h"
#include "apps/client/internalqa/omniscope/native/views/pose/faceglobal-view.h"
#include "apps/client/internalqa/omniscope/native/views/pose/facelocal-view.h"
#include "apps/client/internalqa/omniscope/native/views/pose/facetracker-view.h"
#include "apps/client/internalqa/omniscope/native/views/pose/selfie-segmentation-view.h"
#include "apps/client/internalqa/omniscope/native/views/semantics/semantics-classes-view.h"
#include "apps/client/internalqa/omniscope/native/views/semantics/semantics-cubemap-view.h"
#include "apps/client/internalqa/omniscope/native/views/semantics/semclassproduct-view.h"
#include "apps/client/internalqa/omniscope/native/views/sensors/camera-view.h"
#include "apps/client/internalqa/omniscope/native/views/sensors/devicepose-view.h"
#include "apps/client/internalqa/omniscope/native/views/sensors/mobile-depth-view.h"
#include "apps/client/internalqa/omniscope/native/views/sensors/rawimu-view.h"
#include "apps/client/internalqa/omniscope/native/views/uitest/demo-view.h"
#include "apps/client/internalqa/omniscope/native/views/uitest/demoworld-view.h"
#include "reality/engine/imagedetection/image-tracking-state.h"

namespace c8 {

OmniscopeApp::OmniscopeApp() { initializeViews(); }

void OmniscopeApp::clearViews() {
  std::for_each(views_.begin(), views_.end(), [](auto &e) { e.second.clear(); });
}

void OmniscopeApp::initializeViews() {
  clearViews();

  // Image target views.
  auto &targetViews = views_[IMAGE_TARGET_VIEW_GROUP];
  ImageTrackingState::AGGRESSIVELY_FREE_MEMORY = false;
  targetViews.emplace_back(new ImageTargetStabilityView());
  targetViews.emplace_back(new ImageTargetProductView());
  targetViews.emplace_back(new ImageTargetCamPyramidView());
  targetViews.emplace_back(new ImageTargetFeaturesView());
  targetViews.emplace_back(new ImageTargetStableView());
  targetViews.emplace_back(new ImageTargetRoiView());
  targetViews.emplace_back(new ImageTargetLocalView());
  targetViews.emplace_back(new ImageTargetPyramidView());
  targetViews.emplace_back(new ImageTargetSourceView());
  targetViews.emplace_back(new ImageTargetLshView());
  targetViews.emplace_back(new ImageTargetRelativeView());
  targetViews.emplace_back(new ImageTargetResidualView());
  targetViews.emplace_back(new ImageTargetPoseView());
  targetViews.emplace_back(new ImageTargetGravityWarpView());
  targetViews.emplace_back(new ImageTargetWarpView());

  // Pose views.
  auto &poseViews = views_[POSE_VIEW_GROUP];
  poseViews.emplace_back(new FaceGlobalView());
  poseViews.emplace_back(new FaceLocalView());
  poseViews.emplace_back(new FaceTrackerView());
  poseViews.emplace_back(new EarTrackerView());
  poseViews.emplace_back(new SelfieSegmentationView());

  // Sensor views.
  auto &sensorsViews = views_[SENSORS_VIEW_GROUP];
  sensorsViews.emplace_back(new CameraView());
  sensorsViews.emplace_back(new DeviceposeView());
  sensorsViews.emplace_back(new MobileDepthView());
  sensorsViews.emplace_back(new RawImuView());

  // Semantics views.
  auto &semanticsViews = views_[SEMANTICS_VIEW_GROUP];
  semanticsViews.emplace_back(new SemanticsClassesView());
  semanticsViews.emplace_back(new SemanticsClassProductView());
  semanticsViews.emplace_back(new SemanticsCubemapView());

  // UI Test views.
  auto &uitestViews = views_[UITEST_VIEW_GROUP];
  uitestViews.emplace_back(new DemoView());
  uitestViews.emplace_back(new DemoWorldView());

  // Features views.
  auto &featuresViews = views_[FEATURES_VIEW_GROUP];
  featuresViews.emplace_back(new PyramidView());
  featuresViews.emplace_back(new LocalmatchView());
  featuresViews.emplace_back(new GravitywarpView());

  if (currentViewGroup_.empty()) {
    setViewGroup(viewGroupNames().front());
  }
}

Vector<String> OmniscopeApp::viewNames() const {
  Vector<String> names;
  for (const auto &view : views()) {
    names.push_back(view->name());
  }
  return names;
}

void OmniscopeApp::setViewGroup(const String &group) {
  if (!views_.contains(group)) {
    C8_THROW("[omniscope-app] The given viewGroup \"%s\" cannot be found", group.c_str());
  }
  if (group == currentViewGroup_) {
    return;
  }
  currentViewGroup_ = group;
  currentView_ = 0;
}

Vector<String> OmniscopeApp::viewGroupNames() const {
  Vector<String> groups;
  std::transform(views_.begin(), views_.end(), std::back_inserter(groups), [](const auto &e) {
    return e.first;
  });
  return groups;
}

}  // namespace c8
