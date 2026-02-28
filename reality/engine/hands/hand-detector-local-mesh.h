// Copyright (c) 2023 Niantic Labs, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#pragma once

#include <Eigen/Core>

#include "c8/geometry/face-types.h"
#include "c8/vector.h"
#include "reality/engine/deepnets/tflite-interpreter.h"
#include "reality/engine/hands/hand-types.h"
#include "reality/engine/hands/handmesh-data.h"

namespace c8 {
constexpr size_t HAND_MESH_LOCAL_CACHE_SIZE = 20000000;

// HandDetectorLocalMesh provides an abstraction layer above the deep net model
// for analyzing a hand in detail from a high res region of interest.
class HandDetectorLocalMesh {
public:
  // Construct from a tflite model.
  HandDetectorLocalMesh(const uint8_t *modelData, int modelSize)
      : interpreter_(modelData, modelSize, HAND_MESH_LOCAL_CACHE_SIZE, NUM_THREADS) {}
  HandDetectorLocalMesh(const Vector<uint8_t> &modelData)
      : interpreter_(modelData, HAND_MESH_LOCAL_CACHE_SIZE, NUM_THREADS) {}

  // Default move constructors.
  HandDetectorLocalMesh(HandDetectorLocalMesh &&) = default;
  HandDetectorLocalMesh &operator=(HandDetectorLocalMesh &&) = default;

  // Disallow copying.
  HandDetectorLocalMesh(const HandDetectorLocalMesh &) = delete;
  HandDetectorLocalMesh &operator=(const HandDetectorLocalMesh &) = delete;

  // Detect hands in a zoomed in crop of an image. The src should be 128x128.
  Vector<DetectedPoints> analyzeHand(const RenderedSubImage &src, c8_PixelPinholeCameraModel k);

private:
  TFLiteInterpreter interpreter_;
  static constexpr int NUM_THREADS = 1;

  float vertCols_[3][HANDMESH_R_VERTEX_COUNT];
  static Vector<Eigen::VectorXf> jRegressor_;
  Vector<Eigen::VectorXf> &getJRegressor();

  int computeHandedness(Vector<HPoint3> &pts);
};

}  // namespace c8
