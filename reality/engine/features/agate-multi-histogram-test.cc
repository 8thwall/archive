// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Test of the AgateHistogram class functionality. For detailed benchmarking of
// this class, look at //reality/quality/training:agate-benchmark.

#include <random>

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":agate-multi-histogram",
    "//c8:float-vector",
    "//c8:vector",
    "//c8/io:image-io",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels/opengl:gl-error",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//reality/engine/features:feature-detector",
    "//reality/engine/features:gl-reality-frame",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/quality/datasets:benchmark-dataset",
    "@com_google_googletest//:gtest_main",
  };
}
cc_end(0x7f1dd329);

#include "c8/pixels/opengl/gl-error.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "c8/vector.h"
#include "gtest/gtest.h"
#include "reality/engine/features/agate-multi-histogram.h"
#include "reality/engine/features/feature-detector.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/quality/datasets/benchmark-dataset.h"

namespace c8 {

class AgateMultiHistogramTest : public ::testing::Test {
public:
  AgateMultiHistogramTest() : ctx(OffscreenGlContext::createRGBA8888Context()) {
    // Initialize shaders and reality frame.
    shader.initialize();
    gl.initialize(&shader, 640, 480, 0);

    // Preload all of the benchmark images.
    for (int i = 0; i < BenchmarkDataset::size(BenchmarkName::LOBBYTOUR10_480x640); ++i) {
      frames.emplace_back(computeFeatures(
        BenchmarkDataset::loadRGBA(BenchmarkName::LOBBYTOUR10_480x640, i).pixels()));
    }
  }

protected:
  Vector<FrameWithPoints> frames;
  FeatureDetector featureDetector;

private:
  FrameWithPoints computeFeatures(RGBA8888PlanePixels img) {
    ScopeTimer rt("compute-features");

    // Load the source pixels into a gl texture.
    GlTexture2D imTexture = makeNearestRGBA8888Texture2D(img.cols(), img.rows());
    imTexture.bind();
    imTexture.tex().setPixels(img.pixels());
    imTexture.unbind();

    // Compute the features.
    gl.draw(imTexture.id(), GlRealityFrame::Options::DEFER_READ);
    gl.readPixels();

    // Compute and return the features for a requested index.
    c8_PixelPinholeCameraModel m{80, 80, 40.0f, 40.0f, 600.0f, 600.0f};
    FrameWithPoints fwp(m);
    Vector<FrameWithPoints> rois;

    featureDetector.detectFeatures(gl.pyramid(), &fwp, &rois);

    return fwp;
  }

  OffscreenGlContext ctx;
  Gr8FeatureShader shader;
  GlRealityFrame gl;
};

TEST_F(AgateMultiHistogramTest, MultiHistogramExtraction) {
  ScopeTimer rt("test");
  const FrameWithPoints &frame0 = frames[0];

  AgateMultiHistogram32 agate;
  FloatVector vec0 = agate.extract(frame0.store().getFeatures<OrbFeature>()).clone();
  FloatVector vecDup = agate.extract(frame0.store().getFeatures<OrbFeature>()).clone();

  // The same feature extracted twice should have a distance of zero.
  EXPECT_EQ(0.0f, l1Distance(vec0, vecDup));

  auto vec1 = agate.extract(frames[1].store().getFeatures<OrbFeature>()).clone();
  auto vec2 = agate.extract(frames[2].store().getFeatures<OrbFeature>()).clone();
  auto vec3 = agate.extract(frames[3].store().getFeatures<OrbFeature>()).clone();

  float dist1 = l1Distance(vec0, vec1);
  float dist2 = l1Distance(vec0, vec2);
  float dist3 = l1Distance(vec0, vec3);

  // Since the input is a sequence, we expect decreasing distances from the first frame.
  EXPECT_LT(0.0f, dist1);
  EXPECT_LT(dist1, dist2);
  EXPECT_LT(dist2, dist3);
}

}  // namespace c8
