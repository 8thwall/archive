// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8/pixels:pixel-buffer",
    "//c8/protolog:xr-requests",
    "//reality/quality/visualization/xrom/drawing:components",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "//reality/quality/visualization/xrom/framework:reality-stream-interface",
    "//reality/quality/visualization/xrom/framework:rpc-xrom-client",
    "//reality/quality/visualization/xrom/framework:xrom-client-interface",
  };
  // TODO(nb): break logrecord reality stream dependence on @opencv and remove these.
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
    "-framework Accelerate",
    "-framework CoreGraphics",
    "-framework CoreMedia",
    "-framework CoreVideo",
  };
}
cc_end(0xe694d755);

#include <memory>
#include "c8/pixels/pixel-buffer.h"
#include "c8/protolog/xr-requests.h"
#include "reality/quality/visualization/xrom/drawing/components.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"
#include "reality/quality/visualization/xrom/framework/rpc-xrom-client.h"
#include "reality/quality/visualization/xrom/framework/xrom-client-interface.h"

using namespace c8;

class RenderCallback : public RealityStreamCallback {
public:
  RenderCallback() :
    client_(new RpcXromClient()) {
  }

  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader request,
    RealityResponse::Reader response) override {
    auto frame = request.getSensors().getCamera().getCurrentFrame();
    auto ypix = constFrameYPixels(frame);
    auto uvpix = constFrameUVPixels(frame);

    float h = ypix.rows();
    float w = ypix.cols();

    YPlanePixelBuffer yFlatBuf(h, w);
    UVPlanePixelBuffer uvFlatBuf(uvpix.rows(), uvpix.cols());
    auto yFlat = yFlatBuf.pixels();
    auto uvFlat = uvFlatBuf.pixels();

    std::memset(yFlat.pixels(), 128, yFlat.rows() * yFlat.rowBytes());
    std::memset(uvFlat.pixels(), 128, uvFlat.rows() * uvFlat.rowBytes());

    if (firstFrame_) {
      client_->update(setAppLayout("app", "Yuv Frames", {w * 3, h}, {1}, {{1, 1, 1}}));
    }

    firstFrame_ = false;

    client_->update(setView2d("colorView", "Color", "app", rgbaTexture(ypix, uvpix)))
      ->update(setView2d("yView", "Y", "app", rgbaTexture(ypix, uvFlat)))
      ->update(setView2d("uvView", "UV", "app", rgbaTexture(yFlat, uvpix)))
      ->flush();
  }

private:
  std::unique_ptr<XromClientInterface> client_;
  bool firstFrame_ = true;
};

int main(int argc, char *argv[]) {
  RenderCallback callback;
  RealityStreamFactory::setDefault(RealityStreamFactory::REMOTE);

  auto rStream = RealityStreamFactory::createFromFlags(argc, argv);
  rStream->setCallback(&callback);
  rStream->spin();
  return 0;
}
