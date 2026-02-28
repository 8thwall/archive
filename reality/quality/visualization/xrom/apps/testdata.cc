// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log-proto",
    "//c8:hpoint",
    "//c8:quaternion",
    "//c8:color",
    "//c8:vector",
    "//c8/geometry:egomotion",
    "//c8/io:capnp-messages",
    "//reality/quality/visualization/xrom/api:xrom.capnp-cc",
    "//reality/quality/visualization/xrom/api:xrom-components.capnp-cc",
    "//reality/quality/visualization/xrom/drawing:components",
    "//reality/quality/visualization/xrom/drawing:widgets",
    "//reality/quality/visualization/xrom/framework:rpc-xrom-client",
    "//reality/quality/visualization/xrom/framework:xrom-client-interface",
  };
}
cc_end(0x96936b88);

#include <chrono>
#include <memory>
#include <thread>
#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/hpoint.h"
#include "c8/io/capnp-messages.h"
#include "c8/quaternion.h"
#include "c8/vector.h"
#include "c8/geometry/egomotion.h"
#include "reality/quality/visualization/xrom/api/xrom-components.capnp.h"
#include "reality/quality/visualization/xrom/api/xrom.capnp.h"
#include "reality/quality/visualization/xrom/drawing/components.h"
#include "reality/quality/visualization/xrom/drawing/widgets.h"
#include "reality/quality/visualization/xrom/framework/rpc-xrom-client.h"
#include "reality/quality/visualization/xrom/framework/xrom-client-interface.h"

using namespace c8;
using namespace std::chrono_literals;

static const Vector<HPoint3> PREFAB_ELLIPSE_POINTS{
  HPoint3((0.00f - 0.5f) * 2, 0.0f, (0.50f - 0.5f) * 2),   // 0
  HPoint3((0.15f - 0.5f) * 2, 0.0f, (0.15f - 0.5f) * 2),   // 1
  HPoint3((0.15f - 0.5f) * 2, 0.0f, (0.85f - 0.5f) * 2),   // 2
  HPoint3((0.31f - 0.5f) * 2, 0.0f, (0.55f - 0.5f) * 2),   // 3
  HPoint3((0.50f - 0.5f) * 2, 0.0f, (0.00f - 0.5f) * 2),   // 4
  HPoint3((0.50f - 0.5f) * 2, 0.0f, (1.00f - 0.5f) * 2),   // 5
  HPoint3((0.55f - 0.5f) * 2, 0.0f, (0.31f - 0.5f) * 2),   // 6
  HPoint3((0.64f - 0.5f) * 2, 0.0f, (0.64f - 0.5f) * 2),   // 7
  HPoint3((0.85f - 0.5f) * 2, 0.0f, (0.15f - 0.5f) * 2),   // 8
  HPoint3((0.85f - 0.5f) * 2, 0.0f, (0.85f - 0.5f) * 2),   // 9
  HPoint3((1.00f - 0.5f) * 2, 0.0f, (0.50f - 0.5f) * 2)};  // 10

static const HMatrix camPos =
  cameraMotion(HPoint3(0.4f, 0.5f, -2.0f), Quaternion(0.9848078f, 0.17364816f, 0, 0));

static const c8_PixelPinholeCameraModel camModel = {480, 640, 240.0f, 320.0f, 530.9312f, 530.9312f};

int main(int argc, char *argv[]) {
  std::unique_ptr<XromClientInterface> client(new RpcXromClient());

  // Construct an initial view hierarchy.
  client->update(setAppLayout("app", "TestData", {2560, 1600}, {3, 1}, {{2, 1}, {1}}))
    ->update(setView3d("view", "Test Data", "app"))
    ->update(setView2d("view2", "Test Data 2", "app", testTexture(480, 640)))
    ->update(setView3d("view3", "Test Data 3", "app"))
    ->update(setOrigin("origin", "view"))
    ->update(setComponent3dPlace(
      setCamera("camera", "view", Color::VIBRANT_BLUE, camModel, 0.33f, 5.0f), camPos, 1.0f))
    ->update(setOrigin("origin3", "view3"))
    ->update(setComponent3dPlace(
      setCamera("camera3", "view3", Color::VIBRANT_BLUE, camModel, 0.33f, 5.0f), camPos, 1.0f));

  drawCompass(client.get(), "compass", "view", -1.0f);
  drawCompass(client.get(), "compass3", "view3", -1.0f);

  int i = 1;
  while (++i > 0) {
    auto r1 = Quaternion::fromEulerAngleDegrees(0, 0, i * 3.0f).toRotationMat();
    auto r2 = Quaternion::fromEulerAngleDegrees(i * 2.0f, 0, 0).toRotationMat();
    auto r3 = Quaternion::fromEulerAngleDegrees(0, 0, i).toRotationMat();

    client
      ->update(setComponent3dPlace(
        setPointSet("points", "view", PREFAB_ELLIPSE_POINTS, Color::PURPLE), r1, 0.5f))
      ->update(setComponent3dPlace(
        setPointSet("points2", "points", PREFAB_ELLIPSE_POINTS, Color::GREEN), r2, 2.0f))
      ->update(setComponent3dPlace(
        setPointSet("points3", "points2", PREFAB_ELLIPSE_POINTS, Color::VIBRANT_YELLOW), r3, 2.0f))
      ->flush();

    std::this_thread::sleep_for(30ms);
  }

  return 0;
}
