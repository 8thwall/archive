// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:color",
    "//reality/quality/visualization/xrom/drawing:components",
    "//reality/quality/visualization/xrom/drawing:widgets",
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
cc_end(0x85566fb5);

#include <memory>
#include "c8/color.h"
#include "reality/quality/visualization/xrom/drawing/components.h"
#include "reality/quality/visualization/xrom/drawing/widgets.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"
#include "reality/quality/visualization/xrom/framework/rpc-xrom-client.h"
#include "reality/quality/visualization/xrom/framework/xrom-client-interface.h"

using namespace c8;

static const c8_PixelPinholeCameraModel camModel = {480, 640, 240.0f, 320.0f, 530.9312f, 530.9312f};

class RenderCallback : public RealityStreamCallback {
public:
  RenderCallback() :
    client_(new RpcXromClient()) {
    client_->update(setAppLayout("app", "TestData", {480 * 3, 640}, {1}, {{2, 1}}))
      ->update(setView3d("view", "Test Data", "app"));
    drawCompass(client_.get(), "compass", "view", 0.0f);
  }

  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader request,
    RealityResponse::Reader response) override {
    auto camPos = response.getXRResponse().getCamera().getExtrinsic();
    client_->update(setView2d("camView", "Camera View", "app", rgbaTexture(request)))
      ->update(
        setComponent3dPlace(
          setCamera("camera", "view", Color::VIBRANT_PINK, camModel, 0.33f, 5.0f), camPos, 1.0f))
      ->flush();
  }

private:
  std::unique_ptr<XromClientInterface> client_;
};

int main(int argc, char *argv[]) {
  RenderCallback callback;
  RealityStreamFactory::setDefault(RealityStreamFactory::REMOTE);

  auto rStream = RealityStreamFactory::createFromFlags(argc, argv);
  rStream->setCallback(&callback);
  rStream->spin();
  return 0;
}
