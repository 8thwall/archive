// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"overlay-scene-manager.h"};
  deps = {
    ":viewdata",
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//c8/geometry:intrinsics",
    "//c8/pixels/render:object8",
    "//c8/pixels/render:renderer",
  };
}
cc_end(0x1093655a);

#include "apps/client/internalqa/omniscope/native/lib/overlay-scene-manager.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "c8/geometry/intrinsics.h"

namespace c8 {
void OverlaySceneManager::configure(
  const AppConfiguration &appConfig,
  Scene *scene,
  InitOverlaySceneFn &&initScene,
  UpdateOverlaySceneFn &&updateScene,
  ResetOverlaySceneFn &&resetScene) {
  appConfig_ = appConfig;
  scene_ = scene;
  initScene_ = std::move(initScene);
  updateScene_ = std::move(updateScene);
  resetScene_ = std::move(resetScene);
}

void OverlaySceneManager::renderDisplay(OmniscopeViewData *data) {
  ScopeTimer t("render-display");
  initializeScene(data);  // Create the scene if needed.

  // Check if there is a new frame, or if the user input changed the result.
  if (!updateSceneWithUserInput() && lastFrameTime_ == data->timeNanos()) {
    return;  // Nothing to rerender.
  }

  lastFrameTime_ = data->timeNanos();

  // Update the background texture.
  if (!hideImage_) {
    scene_->find<Renderable>("backquad").material().colorTexture()->setNativeId(data->cameraTexture());
  }

  updateScene_(data);

  // Render the scene.
  data->renderer<Object8Renderer>().render(*renderer_, *scene_);
}

void OverlaySceneManager::gotTouches(const Vector<Touch> &touches) {
  if (touches.size() == 2) {
    resetScene_();
    return;
  }
  hideImage_ = !hideImage_;
}

void OverlaySceneManager::initializeScene(OmniscopeViewData *data) {
  if (renderer_ != nullptr) {  // Already initialized.
    return;
  }

  int renderWidth = data->captureWidth();
  int renderHeight = data->captureHeight();

  renderer_ = std::make_unique<Renderer>();
  // Set the default renderSpec on the root scene
  scene_->setRenderSpecs({{renderWidth, renderHeight}});

  // Create a scene camera with field of view matched to the device. For omniscope, this must have
  // flipY() applied.
  auto captureIntrinsics = Intrinsics::getCameraIntrinsics(appConfig_.deviceModel);
  scene_->add(ObGen::perspectiveCamera(captureIntrinsics, renderWidth, renderHeight)).flipY();

  // Create a back quad for the camera feed.
  auto &backQuad =
    scene_->add(ObGen::named(ObGen::backQuad(), "backquad")).setMaterial(MatGen::image());
  backQuad.geometry().setColor(Color::GRAY_05);

  initScene_();
}

bool OverlaySceneManager::updateSceneWithUserInput() {
  auto &backQuad = scene_->find<Renderable>("backquad");
  if (scene_->needsRerender()) {
    scene_->setNeedsRerender(false);
  } else if ((backQuad.material().colorTexture() == nullptr) == hideImage_) {
    return false;  // Only update if needed.
  }
  backQuad.setMaterial(hideImage_ ? MatGen::colorOnly() : MatGen::image());
  return true;
}

}  // namespace c8
