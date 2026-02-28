// Copyright (c) 2023 Niantic, Inc.
// Original Author: Dat Chu (datchu@nianticlabs.com)

#pragma once
#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "reality/engine/hands/shaders/hand-visible-shader.h"
#include "reality/engine/hands/hand-visible-renderer.h"

namespace c8 {

class HandVisibleDataProducer : public GlDataProducer {
public:
  HandVisibleDataProducer(AppConfiguration appConfig, HandVisibleShader *HandVisibleShader);
  void drawGl(FrameData &in) override;
  void readGl() override;

  HandVisibleRenderer &renderer() { return renderer_; }

private:
  HandVisibleRenderer renderer_;
};

namespace ViewDataGen {

// ViewData that produces hand ROIs and can be used to render a c8::Scene. Views that use this view
// data should collect data for scene updates in the processCpu stage, and then perform all scene
// updates in their own renderDisplay method. Data is passed to renderDisplay through a user defined
// CpuData type. At least once a frame, the Object8Renderer's render method should be called,
// although if playback is paused but user actions need to trigger a re-render, render should be
// called again. Views that use this viewdata will need their own renderer and scene, and those
// should only be accessed from their renderDisplay method.
template <typename CpuData>
std::unique_ptr<OmniscopeViewData> handVisibleObject8Renderer(
  const AppConfiguration &appConfig,
  int width,
  int height,
  HandVisibleShader *shader) {
  auto viewData = std::make_unique<OmniscopeViewData>(appConfig);
  viewData->setRenderer(std::make_unique<Object8Renderer>(width, height))
    ->setCpuProcessingResult(std::make_unique<CpuData>())
    ->addProducer(std::make_unique<HandVisibleDataProducer>(appConfig, shader));
  return viewData;
}

}
}
