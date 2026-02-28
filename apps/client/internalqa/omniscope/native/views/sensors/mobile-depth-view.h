// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Lynn Dang (lynn@8thwall.com)
//
// Mobile Depth View is used for visualizing and analyzing depthnet models on JS, to see how it
// performs on the phone.

#pragma once

#include <memory>
#include <mutex>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/string.h"
#include "c8/time/rolling-framerate.h"
#include "reality/engine/depth/depthnet-depth-map.h"

namespace c8 {

class MobileDepthView : public OmniscopeView {
public:
  MobileDepthView();

  String name() override { return "Mobile Depth"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;
  void renderDisplay(OmniscopeViewData *viewData) override;

  // Disallow move constructors.
  MobileDepthView(MobileDepthView &&) = delete;
  MobileDepthView &operator=(MobileDepthView &&) = delete;

  // Disallow copying.
  MobileDepthView(const MobileDepthView &) = delete;
  MobileDepthView &operator=(const MobileDepthView &) = delete;

private:
  TexCopier copyTexture_;
  uint32_t frameNumber_ = 0;
  RollingFramerate rollingFramerate_;
  // The id of the active map.
  AppConfiguration appConfig_;
  std::mutex touchMtx_;
  std::unique_ptr<Renderer> renderer_;
  int64_t lastUpdateTime_ = -1;

  // Depthnet
  std::unique_ptr<Depthnet> depthnet_;
  bool hideDepth_;

  void updateScene(OmniscopeViewData *viewData);
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();
  void resetScene();
};

}  // namespace c8
