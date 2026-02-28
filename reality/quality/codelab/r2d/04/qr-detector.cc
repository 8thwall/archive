// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#include "bzl/inliner/rules2.h"
cc_library {
  hdrs = {
    "qr-detector.h",
  };
  deps = {
    "//c8:hmatrix",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixels",
    "//c8/qr:code-scanner",
    "//c8/stats:scope-timer",
    "//c8/pixels:pixel-transforms",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0x3bcb9f83);

#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "reality/engine/qr/qr-detector.h"

namespace c8 {

ScanResult QrDetector::detectQr(const QrRenderResult &input) {
  ScopeTimer s("detect-qr");

  auto inputPix = input.renderedImg;
  auto grayPix = renderedImgGray_.pixels();

  // Reallocate the gray image buffer if needed.
  if (grayPix.rows() != inputPix.rows() || grayPix.cols() != inputPix.cols()) {
    ScopeTimer t("allocate-gray-image-buffer");
    renderedImgGray_ = YPlanePixelBuffer(inputPix.rows(), inputPix.cols());
    grayPix = renderedImgGray_.pixels();
  }

  // Convert image to gray.
  rgbToGray(inputPix, &grayPix);

  // Compute scan result on rendered image.
  ScanResult qr;
  {
    ScopeTimer t("scan-qr-code");
    qr = scanner_.scanQrCode(grayPix);
  }

  // Transform back to original image pixels.
  if (qr.found) {
    ScopeTimer t("transform-pts");
    for (auto &pt : qr.pts) {
      pt = (input.renderPixToSourcePix * pt.extrude()).flatten();
    }
  }

  return qr;
}

}  // namespace c8
