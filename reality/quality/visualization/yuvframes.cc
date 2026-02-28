// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/protolog:xr-requests",
    "//reality/quality/visualization/render:ui2",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "//reality/quality/visualization/xrom/framework:reality-stream-interface",
  };
  linkopts = {
    "-framework AVFoundation", "-framework Cocoa",
  };
}
cc_end(0x79d5a0a3);

#include "c8/c8-log.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/protolog/xr-requests.h"
#include "c8/stats/scope-timer.h"
#include "reality/quality/visualization/render/ui2.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"

using namespace c8;

class RenderCallback : public RealityStreamCallback {
public:
  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader request,
    RealityResponse::Reader response) override {
    ScopeTimer t("render-callback-process-reality");

    auto frame = request.getSensors().getCamera().getCurrentFrame();
    auto y = constFrameYPixels(frame);
    auto uv = constFrameUVPixels(frame);

    YPlanePixelBuffer yFlat(y.rows(), y.cols());
    auto yf = yFlat.pixels();
    fill(128, &yf);

    UVPlanePixelBuffer uvFlat(uv.rows(), uv.cols());
    auto uvf = uvFlat.pixels();
    fill(128, 128, &uvf);

    RGBA8888PlanePixelBuffer colordisp(y.rows(), y.cols());
    RGBA8888PlanePixelBuffer ydisp(y.rows(), y.cols());
    RGBA8888PlanePixelBuffer uvdisp(y.rows(), y.cols());

    auto cpix = colordisp.pixels();
    auto ypix = ydisp.pixels();
    auto uvpix = uvdisp.pixels();

    yuvToRgb(y, uv, &cpix);
    yuvToRgb(y, uvf, &ypix);
    yuvToRgb(yf, uv, &uvpix);

    show("Color", cpix);
    show("Y", ypix);
    show("UV", uvpix);

    // If frame-by-frame is enabled, step through the frames with each keypress.
    if (FRAME_BY_FRAME) {
      for (;;) {
        int key = waitKey();
        if (key > 0 && key < 255) {
          break;
        }
      }
    }

    int key = waitKey();
    if (key > 0 && key < 255) {
      C8Log("[yuvframes] %s", "stream->stop()");
      stream->stop();
    }
  }

private:
  static constexpr bool FRAME_BY_FRAME = false;
};

int main(int argc, char *argv[]) {
  RealityStreamFactory::setDefault(RealityStreamFactory::REMOTE);
  auto rStream = RealityStreamFactory::createFromFlags(argc, argv);

  RenderCallback callback;
  rStream->setCallback(&callback);
  rStream->spin();
  return 0;
}
