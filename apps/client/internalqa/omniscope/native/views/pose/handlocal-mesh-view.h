// Copyright (c) 2023 Niantic Labs
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#pragma once

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/string.h"
#include "reality/engine/faces/face-roi-shader.h"
#include "reality/engine/hands/hand-detector-global.h"
#include "reality/engine/hands/hand-detector-local-mesh.h"
#include "reality/engine/hands/hand-roi-renderer.h"
#include "reality/engine/hands/tracked-hand-state.h"

namespace c8 {

class HandLocalMeshView : public OmniscopeView {
public:
  HandLocalMeshView() : wristMatchesBuffer_({640, 480}){};

  String name() override { return "Hand Local Mesh"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;
  void renderDisplay(OmniscopeViewData *viewData) override;

  // Disallow move constructors.
  HandLocalMeshView(HandLocalMeshView &&) = delete;
  HandLocalMeshView &operator=(HandLocalMeshView &&) = delete;

  // Disallow copying.
  HandLocalMeshView(const HandLocalMeshView &) = delete;
  HandLocalMeshView &operator=(const HandLocalMeshView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<FaceRoiShader> shader_;
  std::unique_ptr<HandDetectorGlobal> handDetector_;
  std::unique_ptr<HandDetectorLocalMesh> handMeshDetector_;
  c8_PixelPinholeCameraModel deviceK_;

  // State for rendering. These should only be accessed / modified in the renderDisplay method.
  std::unique_ptr<Renderer> renderer_;
  Vector<Group *> detections_;
  Vector<Group *> renderedHands_;
  TreeMap<int, TrackedHandState> handsById_;
  int64_t lastFrameTime_ = -1;
  std::shared_ptr<HandRoiRenderer> handRenderer_ = std::make_shared<HandRoiRenderer>();

  void updateScene(OmniscopeViewData *viewData);
  void resetScene();
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();

  int frameNum_;
  bool usingGlobal_;
  int globalDetectionCounter_;

  Vector<int> lostIds_;
  bool forceGlobalNextFrame_;

  RGBA8888PlanePixelBuffer wristMatchesBuffer_;
};

}  // namespace c8
