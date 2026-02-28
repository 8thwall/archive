// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:color",
    "//c8/pixels:draw2",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/protolog:xr-requests",
    "//c8/qr:code-generator",
    "//c8/qr:code-scanner",
    "//reality/quality/visualization/render:ui2",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "//reality/quality/visualization/xrom/framework:reality-stream-interface",
  };
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
  };
}
cc_end(0xeaa84784);

#include <iostream>
#include <memory>
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/protolog/xr-requests.h"
#include "c8/qr/code-generator.h"
#include "c8/qr/code-scanner.h"
#include "c8/stats/scope-timer.h"
#include "reality/quality/visualization/render/ui2.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"
#include "third_party/zxing/zxing/common/Counted.h"

using namespace c8;

void drawScanResult(RGBA8888PlanePixels im, const ScanResult &r) {
  if (!r.found) {
    return;
  }
  Color lineColor(0, 220, 110);
  Color textColor(220, 0, 110);

  for (auto pt : r.pts) {
    drawPoint({pt.x(), pt.y()}, 10, 2, lineColor, im);
  }

  // Draw boundary on image
  if (r.pts.size() > 1) {
    for (int j = 0; j < r.pts.size(); j++) {
      auto p1 = (j > 0) ? r.pts[j - 1] : r.pts.back();
      auto p2 = r.pts[j];
      drawLine({p1.x(), p1.y()}, {p2.x(), p2.y()}, 2, lineColor, im);
    }
  }

  if (!r.pts.empty()) {
    auto p = r.pts[0];
    // Draw text: draw a black shadow first.
    putText(r.text, {p.x(), p.y()}, textColor, Color::BLACK, im);
  }
}

class RenderCallback : public RealityStreamCallback {
public:
  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader request,
    RealityResponse::Reader response) override {
    auto frame = request.getSensors().getCamera().getCurrentFrame();
    auto ypix = constFrameYPixels(frame);
    auto uvpix = constFrameUVPixels(frame);

    // Create luminance  source
    ScopeTimer t("render-callback-process-reality");
    RGBA8888PlanePixelBuffer rgbpixbuf(ypix.rows(), ypix.cols());
    auto p = rgbpixbuf.pixels();
    yuvToRgb(ypix, uvpix, &p);

    auto result = scanner_.scanQrCode(ypix);
    if (result.found) {
      drawScanResult(p, result);
    }

    if (++i_ % 50 == 0) {
      C8Log(
        "Global obj count: %d (%d new, %d delete);  Global ref count: %d (%d retain, %d release)",
        zxing::Counted::globalObjects,
        zxing::Counted::globalNew,
        zxing::Counted::globalDelete,
        zxing::Counted::globalCount,
        zxing::Counted::globalRetainCount,
        zxing::Counted::globalReleaseCount);
    }

    show("im", p);
    waitKey();
  }

private:
  CodeScanner scanner_;
  int i_ = 0;
};

int main(int argc, char *argv[]) {
  YPlanePixelBuffer qrpb(1024, 1024);
  auto qrpix = qrpb.pixels();
  CodeGenerator::generateQrCode("https://www.8thwall.com", qrpix);
  show("code", qrpix);
  waitKey();

  RenderCallback callback;
  RealityStreamFactory::setDefault(RealityStreamFactory::REMOTE);

  auto rStream = RealityStreamFactory::createFromFlags(argc, argv);
  rStream->setCallback(&callback);
  rStream->spin();
  return 0;
}
