// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Nathan Waters (nathan@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":synthetic-scenes",
    "//c8/camera:device-infos",
    "//c8/geometry:intrinsics",
    "//c8/io:image-io",
    "//c8/pixels/opengl:offscreen-gl-context",
    "@com_google_googletest//:gtest_main",
  };
}
cc_end(0x8d7415dd);

#include <gmock/gmock.h>
#include <gtest/gtest.h>

#include "c8/camera/device-infos.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/image-io.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "reality/quality/synthetic/synthetic-scenes.h"

using testing::Eq;
using testing::FloatNear;
using testing::Pointwise;

namespace c8 {

bool WRITE_IMAGE = false;

class SyntheticScenesTest : public ::testing::Test {};

TEST_F(SyntheticScenesTest, TestSyntheticScenes) {
  // Create an offscreen context.
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();
  auto names = syntheticSceneNames();
  EXPECT_TRUE(names.size() > 0);
  Renderer renderer;
  const auto K = Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_XS);

  for (auto name : names) {
    auto scene = syntheticScene(name, K, 640, 480);
    renderer.render(*scene);
    auto img = renderer.result();
    EXPECT_EQ(640, img.pixels().cols());
    EXPECT_EQ(480, img.pixels().rows());

    if (WRITE_IMAGE) {
      String filename = format("/tmp/synthetic-scene-test-%s.png", scene->name().c_str());
      writeImage(img.pixels(), filename);
    }
  }

  // Make sure that if the scene does not exist, it fails gracefully.
  EXPECT_TRUE(syntheticScene("asdf1234", K, 200, 200)
                ->find<Group>("synthetic-scene-content")
                .children()
                .empty());
}

}  // namespace c8
