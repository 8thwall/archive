// Copyright (c) 2022 8th Wall, LLC
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":hand-detector-global",
    "//c8:string",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "@com_google_googletest//:gtest_main",
  };
  data = {
    "//reality/engine/deepnets/testdata:hand_left_192",
    "//third_party/mediapipe/models:palm-detection",
  };
  linkstatic=1;
}
cc_end(0x431295d9);

#include <cmath>
#include <cstdio>

#include "c8/io/file-io.h"
#include "c8/io/image-io.h"
#include "c8/string.h"
#include "gtest/gtest.h"
#include "reality/engine/hands/hand-detector-global.h"
#include "c8/stats/scope-timer.h"


namespace c8 {

class HandDetectorGlobalTest : public ::testing::Test {};

static constexpr char MODEL_PATH[] = "third_party/mediapipe/models/palm_detection_lite.tflite";
static constexpr char IMAGE_PATH[] = "reality/engine/deepnets/testdata/hand_left_192.jpg";

TEST_F(HandDetectorGlobalTest, TestDetect) {
  // Read in a (slightly too big) image. We need 192x192.
  auto im = readImageToRGBA(IMAGE_PATH);
  auto pix = im.pixels();

  // Take a hardcoded crop of the test image with a well centered hand.
  int cropRowStart = 0;
  int cropColStart = 0;

  RenderedSubImage img{
    {0, 0, 192, 192},
    {192, 192, pix.rowBytes(), pix.pixels() + cropRowStart * pix.rowBytes() + cropColStart * 3},
    {ImageRoi::Source::HAND, 0, "", HMatrixGen::i()},
  };

  // Load a TFLite interpreter with the tensor flow model.
  HandDetectorGlobal detector(readFile(MODEL_PATH));

  ScopeTimer rt("test");
  auto hands = detector.detectHands(img, {});

  EXPECT_EQ(1, hands.size());
}

}  // namespace c8
