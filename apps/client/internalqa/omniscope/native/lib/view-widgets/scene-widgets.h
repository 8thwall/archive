// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)
//
// Omniscope helper functions related to the scene.

#pragma once

#include "c8/camera/device-infos.h"
#include "c8/pixels/render/object8.h"
#include "reality/engine/features/frame-point.h"

namespace c8 {

// Set the virtual camera to start off facing the same direction as the real camera.
// @param transform an optional transform to apply to the extrinsic
void initializeCameraExtrinsic(
  const HMatrix &extrinsic,
  Camera *camera,
  bool *shouldInitWorldSceneCameraExtrinsic,
  const HMatrix &transform = HMatrixGen::translation(0, 0, -2));

// Initialize a scene with a positioned perspectiveCamera, quadrantLights, a background environment,
// an axis visualization, and a floor visualization.
// @param extraWideIntrinsics If true increase scene FOV so the entire frustum is visible.
void initWorldScene(
  Scene *worldScene,
  DeviceInfos::DeviceModel deviceModel,
  int viewportWidth,
  int viewportHeight,
  bool extraWideIntrinsics = true);

// Initialize a scene with a perspectiveCamera, quadrantLights, a background environment, and an
// axis visualization.
void initCameraScene(
  Scene *cameraScene, DeviceInfos::DeviceModel deviceModel, int viewportWidth, int viewportHeight);

// Initialize multiple point clouds, all combination of
// (recent, tenured) x (ground, sky, depth, triangulated) and one for undead points
// @param parent the parent object8 to put the point clouds under
// @param prefix naming the point cloud in the format `prefix-state-source`,
//               e.g. prefix-recent-ground
void initWorldPoints(Object8 *parent, const String &prefix = "");

}  // namespace c8
