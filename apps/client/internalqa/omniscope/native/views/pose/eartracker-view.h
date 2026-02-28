// Copyright (c) 2023 Niantic Labs
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/string.h"
#include "reality/engine/faces/face-roi-shader.h"
#include "reality/engine/faces/face-tracker.h"

namespace c8 {

class EarTrackerView : public OmniscopeView {
public:
  EarTrackerView() = default;

  String name() override { return "Ear Tracker"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;
  void renderDisplay(OmniscopeViewData *viewData) override;

  // Disallow move constructors.
  EarTrackerView(EarTrackerView &&) = delete;
  EarTrackerView &operator=(EarTrackerView &&) = delete;

  // Disallow copying.
  EarTrackerView(const EarTrackerView &) = delete;
  EarTrackerView &operator=(const EarTrackerView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<FaceRoiShader> shader_;
  std::unique_ptr<FaceTracker> tracker_;
  c8_PixelPinholeCameraModel deviceK_;

  // State for rendering. These should only be accessed / modified in the renderDisplay method.
  std::unique_ptr<Renderer> renderer_;
  Vector<Group *> renderedFaces_;
  Vector<Group *> detections_;
  Vector<Group *> renderedEars_;
  int64_t lastFrameTime_ = -1;

  Vector<Group *> faceAnchors_;

  void updateScene(OmniscopeViewData *viewData);
  void resetScene();
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();
};

}  // namespace c8
