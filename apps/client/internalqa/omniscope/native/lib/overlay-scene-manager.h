// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/pixels/render/renderer.h"

namespace c8 {

// Callback for view-specific scene intiialization.
using InitOverlaySceneFn = std::function<void()>;

// Callback to update the scene on each frame.
using UpdateOverlaySceneFn = std::function<void(OmniscopeViewData *frame)>;

// Callback for when a user gesture indicates that state should be reset (e.g. tracking state).
using ResetOverlaySceneFn = std::function<void()>;

// Configures a renderer and scene for displaying 3D content on top of an omniscope camera feed.
// This omniscope scenes that use this manager a similar look and feel and similar UI gestures.
// Views should pass callbacks for initializing and updating the scene on every frame, and then
// should delegate their renderDisplay and gotTouches methods to the scene manager.
class OverlaySceneManager {
public:
  // Call this method from a view's "configure" method.
  void configure(
    const AppConfiguration &appConfig,
    Scene *scene,
    InitOverlaySceneFn &&initScene = [](){},
    UpdateOverlaySceneFn &&updateScene = [](OmniscopeViewData *frame){},
    ResetOverlaySceneFn &&resetScene = [](){});
  // Call this method from a views's "renderDisplay" method.
  void renderDisplay(OmniscopeViewData *data);

  // Call this method from a view's "gotTouches" method.
  void gotTouches(const Vector<Touch> &touches);
private:
  AppConfiguration appConfig_;
  InitOverlaySceneFn initScene_;
  UpdateOverlaySceneFn updateScene_;
  ResetOverlaySceneFn resetScene_;
  bool hideImage_ = false;

  // State for rendering. These should only be accessed / modified in the renderDisplay method.
  std::unique_ptr<Renderer> renderer_;
  Scene *scene_;  // Owned by OmniscopeView, set by the view in configure().
  int64_t lastFrameTime_ = -1;
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();
};

}  // namespace c8
