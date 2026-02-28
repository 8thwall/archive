// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// Omniscope helper functions related to the scene.

#pragma once

#include "c8/geometry/face-types.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/render/object8.h"
#include "c8/vector.h"
#include "reality/engine/ears/ear-types.h"
#include "reality/engine/hands/hand-types.h"

namespace c8 {

// Initializes the scene to have a left "roi-view" scene and a right "camera-view" scene.
void initRoiAndCameraScene(Scene *scene, c8_PixelPinholeCameraModel deviceK, int viewHeight);

void updateDetections(
  const Vector<DetectedRayPoints> &detections,
  Object8 *root,
  Vector<Group *> *detectionGroups,
  float pixelsSize = 7.0f,
  bool skipPoints = false,
  Color pointColor = Color::MINT);

void updateFaceMeshes(
  const Vector<Face3d> &meshes,
  Object8 *root,
  Vector<Group *> *meshGroups,
  const FaceMeshGeometryConfig &config = {true, false, false, false});

void updateEars(
  const Vector<Ear3d> &ears,
  Object8 *root,
  Vector<Group *> *handGroups,
  const EarGeometryConfig &config = {true, true, 0.01f});

void updateHandMeshes(
  const Vector<Hand3d> &hands,
  Object8 *root,
  Vector<Group *> *handGroups,
  c8_PixelPinholeCameraModel intrinsics,
  RGBA8888PlanePixelBuffer &wristLandmarkMatchesPixBuf);

void updateHandMeshes(
  const Vector<Hand3d> &hands,
  Object8 *root,
  Vector<Group *> *handGroups,
  c8_PixelPinholeCameraModel intrinsics);

void drawWristLandmarkMatches(
  Vector<HPoint3> wristLandmarkVerts,
  Vector<HPoint3> wristMeshLandmarkVerts,
  HMatrix intrinsicsMat,
  RGBA8888PlanePixelBuffer &wristLandmarkMatchesPixBuf);

}  // namespace c8
