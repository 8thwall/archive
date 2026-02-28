// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Rishi Parikh (rishi@8thwall.com)

#include "bzl/inliner/rules2.h"
cc_test {
  deps = {
    ":calc-detection-score",
    ":calc-feature-point-score",
    ":calc-similarity-score",
    ":extract-features",
    "//c8:hpoint",
    "//c8:c8-log",
    "//c8/camera:device-infos",
    "//c8/geometry:intrinsics",
    "//c8/io:image-io",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixels",
    "//c8/pixels/render:renderer",
    "//c8/stats:scope-timer",
    "//reality/engine/imagedetection:detection-image",
    "//reality/engine/imagedetection:detection-image-loader",
    "@com_google_googletest//:gtest_main",
  };
  data = {
    ":img-src",
    ":test-img-src",
  };
}

cc_end(0x41ac2ac5);

#include <gtest/gtest.h>

#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/geometry/intrinsics.h"
#include "c8/hpoint.h"
#include "c8/io/image-io.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixels.h"
#include "c8/pixels/render/renderer.h"
#include "reality/cloud/imageprocessor/calc-sub-scores.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/imagedetection/detection-image-loader.h"
#include "reality/engine/imagedetection/detection-image.h"

bool WRITE_IMAGE = false;
constexpr int GRID_ROWS = 10;
constexpr int GRID_COLS = 10;
class RendererTest : public ::testing::Test {};

TEST_F(RendererTest, TestCalcScores) {
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();
  {
    ScopeTimer t("test-calc-scores");
    Gr8FeatureShader shader;
    shader.initialize();

    auto filename = "reality/cloud/imageprocessor/images/target_horizontal.png";
    // auto filename = "reality/cloud/imageprocessor/images/target_bad.png";
    // auto filename = "reality/cloud/imageprocessor/images/target_good.png";

    // load the target image (img , pix = img.pixels)
    // load the patch for similarity score.
    // load the background for detection in scene.
    RGBA8888PlanePixelBuffer img = readImageToRGBA(filename);
    auto pix = img.pixels();
    auto patch = readImageToRGBA("reality/cloud/imageprocessor/images/black.png");
    auto background = readImageToRGBA("reality/cloud/imageprocessor/images/background.png");

    // Pick a reasonable camera model for the read image.
    auto k = Intrinsics::rotateCropAndScaleIntrinsics(
      Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_XS), pix.cols(), pix.rows());

    // Extract detection points from the image.
    auto detectionImage = extractFeatures(pix, k, &shader);

    // create a gridRow x gridCol OneChannelFloatPixelBuffer
    auto featureCoverageGrid = OneChannelFloatPixelBuffer(GRID_ROWS, GRID_COLS);
    auto pixels = featureCoverageGrid.pixels();

    // Fill in featureCoverageGrid values for feature coverage by gridbox. for the given
    // detectionImage.
    featureCoverage(detectionImage, pixels, GRID_ROWS, GRID_COLS);
    // Calculate a score based off the featureCoverage grid.
    auto featureScore = featureCoverageScore(featureCoverageGrid);
    // Generate a heatmap visualization based off the feature coverage grid.
    auto p = visualizeFeatureScore(img.pixels(), featureCoverageGrid);

    Vector<RGBA8888PlanePixelBuffer> detectedImages;

    // find the detection score of the image.
    float detectionScore = 0;
    calcDetectionScore(img.pixels(), background.pixels(), &detectedImages, &detectionScore);
    // generate the list of poor descriptors based off similarity score.
    auto poorSimiliarityFeatureLocations = computeSimiliarFeaturePoints(detectionImage);
    // calculate a score based off the list of poor descriptors.
    float simScore = similarityScore(detectionImage, poorSimiliarityFeatureLocations);
    // generate a visualization of the similarity score.
    auto p1 =
      visualizeSimilarityScore(img.pixels(), patch.pixels(), poorSimiliarityFeatureLocations);

    if (WRITE_IMAGE) {
      C8Log(
        "feature score: %f\nsimilarity score: %f\ndetection score: %f",
        featureScore,
        simScore,
        detectionScore);
      writeImage(p.pixels(), "/tmp/featurepoints.png");  // write descriptor image to file
      writeImage(p1.pixels(), "/tmp/similarity.png");    // write similarity image to file
      // write detection images to file
      for (int i = 0; i < detectedImages.size(); i++) {
        writeImage(detectedImages[i].pixels(), format("/tmp/detection_%d.png", i));
      }
    }
  }
}
