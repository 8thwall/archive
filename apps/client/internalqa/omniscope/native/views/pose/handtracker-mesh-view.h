// Copyright (c) 2023 Niantic Labs
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/string.h"
#include "reality/engine/faces/face-roi-shader.h"
#include "reality/engine/hands/hand-mesh-tracker.h"
#include "reality/engine/hands/hand-roi-renderer.h"

namespace c8 {

class HandTrackerMeshView : public OmniscopeView {
public:
  HandTrackerMeshView() = default;

  String name() override { return "Hand Tracker Mesh"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;
  void renderDisplay(OmniscopeViewData *viewData) override;

  // Disallow move constructors.
  HandTrackerMeshView(HandTrackerMeshView &&) = delete;
  HandTrackerMeshView &operator=(HandTrackerMeshView &&) = delete;

  // Disallow copying.
  HandTrackerMeshView(const HandTrackerMeshView &) = delete;
  HandTrackerMeshView &operator=(const HandTrackerMeshView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<FaceRoiShader> shader_;
  std::unique_ptr<HandMeshTracker> tracker_;
  c8_PixelPinholeCameraModel deviceK_;

  // State for rendering. These should only be accessed / modified in the renderDisplay method.
  std::unique_ptr<Renderer> renderer_;
  Vector<Group *> renderedHands_;
  Vector<Group *> detections_;
  int64_t lastFrameTime_ = -1;

  int frameNum_ = 0;
  Vector<float> translationDeltas_;
  Vector<float> rotationDeltas_;
  Vector<float> iouDeltas_;
  Vector<float> distanceDeltas_;

  float minAlpha_ = 0.f;
  float update90v_ = 0.f;
  float vAlpha_ = 0.f;
  float pointAlpha_ = 0.f;
  float transformAlpha_ = 0.f;
  bool landmark2dFilter_ = false;
  bool landmark3dFilter_ = false;
  bool transformFilter_ = false;
  bool localVertexFilter_ = false;
  bool useRecursiveFilter_ = false;

  bool roiSmoothBBoxLength_ = false;
  float roiLengthMinAlpha_ = 0.f;
  float roiLengthUpdate90V_ = 0.f;
  float roiLengthVAlpha_ = 0.f;

  bool roiSmoothBBoxCenter_ = false;
  float roiCenterMinAlpha_ = 0.f;
  float roiCenterUpdate90V_ = 0.f;
  float roiCenterVAlpha_ = 0.f;

  Vector<HPoint3> handTranslations_;
  Vector<HPoint3> palmTranslations_;
  Vector<float> cropCenterX_;
  Vector<float> cropCenterY_;
  Vector<float> cropLength_;
  Vector<float> extendedCropCenterX_;
  Vector<float> extendedCropCenterY_;
  Vector<float> extendedCropLength_;
  Hand3d::TrackingStatus previousHandStatus_ = Hand3d::TrackingStatus::UNSPECIFIED;
  TreeMap<Hand3d::TrackingStatus, int> statusCounts_;
  int globalDetectionCounter_;

  HMatrix previousPose_ = HMatrixGen::i();
  BoundingBox previousLocalBBox_;
  std::shared_ptr<HandRoiRenderer> handRenderer_ = std::make_shared<HandRoiRenderer>();

  void updateScene(OmniscopeViewData *viewData);
  void resetScene();
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();
};

}  // namespace c8
