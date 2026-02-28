// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Rishi Parikh (rishi@8thwall.com)
#include "bzl/inliner/rules2.h"
cc_binary {
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
    "//c8/stats:scope-timer",
    "//reality/engine/imagedetection:detection-image",
    "//reality/engine/imagedetection:detection-image-loader",
    "@cli11",
    "@json",
  };
  data = {
    ":img-src",
  };
}
cc_end(0x31e35ecd);

#include <CLI/CLI.hpp>
#include <nlohmann/json.hpp>

#include "c8/camera/device-infos.h"
#include "c8/c8-log.h"
#include "c8/geometry/intrinsics.h"
#include "c8/hpoint.h"
#include "c8/io/image-io.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixels.h"
#include "reality/cloud/imageprocessor/calc-sub-scores.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/imagedetection/detection-image-loader.h"
#include "reality/engine/imagedetection/detection-image.h"

constexpr int GRID_ROWS = 10;
constexpr int GRID_COLS = 10;
namespace c8 {
String calculateImageScore(const String &filename) {
  // initialization for shader and images needed for calculating score
  nlohmann::json outputJSON;
  Gr8FeatureShader shader;
  shader.initialize();
  RGBA8888PlanePixelBuffer img = readImageToRGBA(filename);
  auto pix = img.pixels();
  auto patch = readImageToRGBA("reality/cloud/imageprocessor/images/black.png");
  auto background = readImageToRGBA("reality/cloud/imageprocessor/images/background.png");
  // Pick a reasonable camera model for the read image.
  auto k = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_XS), pix.cols(), pix.rows());
  // Extract detection points from the image.
  auto detectionImage = extractFeatures(pix, k, &shader);

  // calc feature score
  // create a gridRow x gridCol OneChannelFloatPixelBuffer
  auto featureCoverageGrid = OneChannelFloatPixelBuffer(GRID_ROWS, GRID_COLS);
  auto pixels = featureCoverageGrid.pixels();
  featureCoverage(detectionImage, pixels, GRID_ROWS, GRID_COLS);
  auto featureScore = featureCoverageScore(featureCoverageGrid);
  outputJSON["feature-point-score"] = featureScore;

  // calc similarity score
  auto poorSimiliarityFeatureLocations = computeSimiliarFeaturePoints(detectionImage);
  auto featureSimilarityScore = similarityScore(detectionImage, poorSimiliarityFeatureLocations);
  outputJSON["similarity-score"] = featureSimilarityScore;

  // calc detection score
  float detectionScore = 0;
  Vector<RGBA8888PlanePixelBuffer> detectedImages;
  calcDetectionScore(pix, background.pixels(), &detectedImages, &detectionScore);
  outputJSON["detection-score"] = detectionScore;

  // create an overall score that is the average of the three scores
  outputJSON["overall-score"] = (detectionScore + featureSimilarityScore + featureScore) / 3;
  // Output the JSON as a string for the JS file to read
  return outputJSON.dump();
}
}  // namespace c8

/*
 * Input: JSON input to determine how to run the file.
 * Output: A scoring system with a breakdown of image target scores.
 */
int main(int argc, char *argv[]) {
  CLI::App app{"calc-score"};
  String jsonString = "invalid input";
  app.add_option("-j, --json", jsonString, "JSON string to select image target.");
  CLI11_PARSE(app, argc, argv);
  auto path = nlohmann::json::parse(jsonString)["filename"];
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();
  {
    ScopeTimer t("feature detect");
    auto outputJSONString = calculateImageScore(path);
    C8Log(outputJSONString.c_str());
  }
  return 0;
}
