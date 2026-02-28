// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Rishi Parikh (rishi@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  deps = {
    ":calc-sub-scores",
    ":imageprocessor-shaders",
    "//c8:hpoint",
    "//c8/camera:device-infos",
    "//c8/geometry:intrinsics",
    "//c8/pixels:draw2",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixels",
    "//c8/pixels/render:renderer",
    "//reality/engine/imagedetection:detection-image",
    "//reality/engine/imagedetection:detection-image-loader",
  };
}
cc_end(0x2f5ced8d);

#include "c8/camera/device-infos.h"
#include "c8/geometry/intrinsics.h"
#include "c8/hpoint.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixels.h"
#include "c8/pixels/render/renderer.h"
#include "reality/cloud/imageprocessor/calc-sub-scores.h"
#include "reality/cloud/imageprocessor/imageprocessor-shaders.h"
#include "reality/engine/imagedetection/detection-image-loader.h"
#include "reality/engine/imagedetection/detection-image.h"

// boolean to attach shader to the renderer.
static bool first = true;

namespace c8 {

void featureCoverage(
  const DetectionImage &detectionImage, OneChannelFloatPixels &pixels, int gridRows, int gridCols) {

  // use detection image intrinsics to determine the correct scale of the image width and height.
  int detectionImageWidth = detectionImage.framePoints().intrinsic().pixelsWidth;
  int detectionImageHeight = detectionImage.framePoints().intrinsic().pixelsHeight;
  Vector<int> regionPoints(gridRows * gridCols, 0);

  for (const auto &point : detectionImage.framePoints().pixels()) {
    int x = point.x() / detectionImageWidth * static_cast<float>(gridCols);
    int y = point.y() / detectionImageHeight * static_cast<float>(gridRows);
    regionPoints[x + y * gridRows]++;
  }

  // For each grid box pass the number of feature points into a sigmoid function centered
  // around 10 to calculate the region's feature point score.
  float featureRegionScore = 0;
  for (int y = 0; y < gridRows; y++) {
    for (int x = 0; x < gridCols; x++) {
      featureRegionScore = 1.f / (1.f + exp(-0.3f * (regionPoints[y * gridCols + x] - 10)));
      // modify pixels to store the calculated score.
      pixels.pixels()[y * gridCols + x] = featureRegionScore;
    }
  }
}

float featureCoverageScore(const OneChannelFloatPixelBuffer &featureCoverageGrid) {
  float coverageScore = 0;
  FloatPixels floatPixels = featureCoverageGrid.pixels();
  for (int i = 0; i < floatPixels.rows() * floatPixels.cols(); ++i) {
    coverageScore += floatPixels.pixels()[i];
  }
  // calculate the total number of gridboxes and normalize to a score of 100
  int dimensions = floatPixels.rows() * floatPixels.cols();
  return static_cast<float>(coverageScore) / dimensions * 100;
}

RGBA8888PlanePixelBuffer visualizeFeatureScore(
  const RGBA8888PlanePixels &originalImage, const OneChannelFloatPixelBuffer &featureCoverageGrid) {
  auto k = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_XS),
    originalImage.cols(),
    originalImage.rows());

  Renderer renderer;
  // Register the img-blur shader once.
  if (first) {
    auto vert = embeddedImageBlurVertCStr;
    auto frag = embeddedImageBlurFragCStr;
    renderer.registerShader(
      "img-blur",
      vert,
      frag,
      {Shaders::POSITION, Shaders::UV},
      {{Shaders::RENDERER_MVP}, {Shaders::RENDERER_OPACITY}});
    first = false;
  }

  // initialize scene to render
  auto scene = ObGen::scene(originalImage.cols(), originalImage.rows());
  auto &backQuad = scene->add(ObGen::backQuad()).setMaterial(MatGen::image());
  backQuad.material().colorTexture()->setRgbaPixels(originalImage);
  GeoGen::flipTextureY(&backQuad.geometry());
  scene->add(ObGen::perspectiveCamera(k, originalImage.cols(), originalImage.rows()));

  auto featureGridPixels = featureCoverageGrid.pixels();
  // Generates a texture img from the input feature coverage grid.
  // RGBA values from 0 to 255.
  RGBA8888PlanePixelBuffer mask =
    RGBA8888PlanePixelBuffer(featureGridPixels.rows(), featureGridPixels.cols());
  for (int i = 0; i < featureGridPixels.rows(); ++i) {
    for (int j = 0; j < featureGridPixels.cols(); ++j) {
      uint8_t *p = mask.pixels().pixels() + i * mask.pixels().rowBytes() + j * 4;
      auto color = heatMap(featureGridPixels.pixels()[i * 10 + j] * 255.);
      p[0] = color.r();
      p[1] = color.g();
      p[2] = color.b();
      p[3] = 255;
    }
  }

  // Render the scene by overlaying the texture image over the original image.
  // Sets shader to img-blur which is a 3x3 gaussian kernel filter.
  auto &quad = scene->add(ObGen::backQuad()).setMaterial(MatGen::image());
  quad.material().setShader("img-blur");
  quad.material().setTransparent(true);
  quad.material().setOpacity(0.7);
  quad.material().colorTexture()->setRgbaPixels(mask.pixels());
  GeoGen::flipTextureY(&quad.geometry());
  renderer.render(*scene);
  auto im = renderer.result();
  return im;
}
}  // namespace c8
