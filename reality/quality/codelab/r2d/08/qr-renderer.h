// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#pragma once

#include "c8/hmatrix.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/render/object8.h"
#include "c8/pixels/render/renderer.h"
#include "reality/engine/qr/qr-render-result.h"

namespace c8 {

struct QrRendererInput {
  uint32_t texId;
  int texWidth;
  int texHeight;
};

// QrRenderer manages rendering an appropriate input for the QrDetector.
class QrRenderer {
public:
  // Default constructors
  QrRenderer() = default;
  QrRenderer(QrRenderer &&) = default;
  QrRenderer &operator=(QrRenderer &&) = default;

  // Disallow copying.
  QrRenderer(const QrRenderer &) = delete;
  QrRenderer &operator=(const QrRenderer &) = delete;

  // Start processing the camera texture.
  void draw(const QrRendererInput &in);

  // Check whether there is a new result that has not yet been returned.
  bool hasResult() { return needsRead_; }

  // Get the result from a previous draw command. This reads pending data back from the GPU,
  // blocking if needed.
  QrRenderResult result();

private:
  Renderer renderer_;
  bool needsRead_ = false;
  std::unique_ptr<Scene> scene_;
  RGBA8888PlanePixelBuffer output_;
  HMatrix pixelTransform_ = HMatrixGen::i();
};

}  // namespace c8
