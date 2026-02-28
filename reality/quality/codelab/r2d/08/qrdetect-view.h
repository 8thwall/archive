// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/string.h"
#include "reality/engine/faces/face-detector-global.h"
#include "reality/engine/faces/face-roi-shader.h"

namespace c8 {

class QrDetectView : public OmniscopeView {
public:
  QrDetectView() = default;

  String name() override { return "QR Detect"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;
  void renderDisplay(OmniscopeViewData *viewData) override;

  // Disallow move constructors.
  QrDetectView(QrDetectView &&) = delete;
  QrDetectView &operator=(QrDetectView &&) = delete;

  // Disallow copying.
  QrDetectView(const QrDetectView &) = delete;
  QrDetectView &operator=(const QrDetectView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<FaceRoiShader> shader_;
  std::unique_ptr<FaceDetectorGlobal> faceDetector_;
  c8_PixelPinholeCameraModel deviceK_;

  // State for rendering. These should only be accessed / modified in the renderDisplay method.
  std::unique_ptr<Renderer> renderer_;
  Vector<Group *> detections_;
  int64_t lastFrameTime_ = -1;

  void updateScene(OmniscopeViewData *viewData);
  void resetScene();
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();
};

}  // namespace c8
