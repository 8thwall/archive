// Copyright (c) 2023 Niantic Labs
// Original Author: Dat Chu (datchu@nianticlabs.com)

#pragma once


#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/string.h"
#include "reality/engine/faces/face-roi-shader.h"
#include "reality/engine/hands/hand-detector-global.h"
#include "reality/engine/hands/hand-detector-local-mesh.h"
#include "reality/engine/hands/shaders/hand-visible-shader.h"
#include "reality/engine/hands/tracked-hand-state.h"

namespace c8 {

class HandShaderView : public OmniscopeView {
public:
  HandShaderView() = default;

  String name() override { return "Hand Shader"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;
  void renderDisplay(OmniscopeViewData *viewData) override;

  // Disallow move constructors.
  HandShaderView(HandShaderView &&) = delete;
  HandShaderView &operator=(HandShaderView &&) = delete;

  // Disallow copying.
  HandShaderView(const HandShaderView &) = delete;
  HandShaderView &operator=(const HandShaderView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<HandVisibleShader> shader_;
  c8_PixelPinholeCameraModel deviceK_;

  // State for rendering. These should only be accessed / modified in the renderDisplay method.
  std::unique_ptr<Renderer> renderer_;
  int64_t lastFrameTime_ = -1;

  // Parameters that we can tune
  float edgeSoftness_;
  float edgeThreshold_;
  float smoothIntensity_;

  void updateScene(OmniscopeViewData *viewData);
  void resetScene();
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();
};

}  // namespace c8
