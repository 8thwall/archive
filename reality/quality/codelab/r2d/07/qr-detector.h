// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#pragma once

#include "c8/pixels/pixel-buffer.h"
#include "c8/qr/code-scanner.h"
#include "reality/engine/qr/qr-render-result.h"

namespace c8 {

// QrDetector manages
class QrDetector {
public:
  // Default constructors
  QrDetector() = default;
  QrDetector(QrDetector &&) = default;
  QrDetector &operator=(QrDetector &&) = default;

  // Disallow copying.
  QrDetector(const QrDetector &) = delete;
  QrDetector &operator=(const QrDetector &) = delete;

  // Detect a qr code in a low resolution render of an image. If found, the resulting detection will
  // have locations returned in the space of the original image.
  ScanResult detectQr(const QrRenderResult &input);

private:
  CodeScanner scanner_;
  YPlanePixelBuffer renderedImgGray_;
};

}  // namespace c8
