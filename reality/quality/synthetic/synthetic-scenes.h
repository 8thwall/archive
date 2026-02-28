// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Nathan Waters (nathan@8thwall.com)
//
// Provides an entrypoint for accessing manually created synthetic scenes which can be used for
// benchmarking purposes.

#pragma once

#include "c8/pixels/render/renderer.h"
#include "c8/vector.h"

namespace c8 {

// Returns the list of synthetic scene names.
const Vector<String> &syntheticSceneNames();

// Returns a Group node which contains the synthetic scene's content.  The dimensions of the
// scene and the perspective camera are managed by the caller.  Used for adding a synthetic scene
// to the world-view in Omniscope.
std::unique_ptr<Group> syntheticSceneContent(const String &sceneName);

// Return the scene of a given synthetic scene name in the specified dimensions.  Used for replacing
// a camera feed with a synthetic scene.
std::unique_ptr<Scene> syntheticScene(
  const String &sceneName, const c8_PixelPinholeCameraModel &intrinsics, int w, int h);

}  // namespace c8
