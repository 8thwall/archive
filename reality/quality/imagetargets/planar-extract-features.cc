// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:string",
    "//c8/camera:device-infos",
    "//c8/geometry:intrinsics",
    "//c8/io:image-io",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/stats:scope-timer",
    "//reality/engine/imagedetection:detection-image",
    "//reality/engine/imagedetection:detection-image-loader",
  };
}
cc_end(0xe49887f0);

#include <array>
#include <cstdio>
#include <sstream>

#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/image-io.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/string.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/imagedetection/detection-image-loader.h"
#include "reality/engine/imagedetection/detection-image.h"

using namespace c8;

// Extract features using DetectionImageLoader.
DetectionImage extractFeatures(
  ConstRGBA8888PlanePixels pix, c8_PixelPinholeCameraModel k, Gr8FeatureShader *shader) {
  // If the image is landscape, it will get rotated for extraction, but the detection image loader
  // doesn't rotate the intrinsics. It's probably best to fix this in the DetectionImageLoader, but
  // we'd need to make sure that it is safe.
  if (pix.cols() > pix.rows()) {
    k = Intrinsics::rotateCropAndScaleIntrinsics(k, pix.rows(), pix.cols());
  }
  MutableRootMessage<ImageTargetMetadata> imageTargetMetadata;
  imageTargetMetadata.builder().setType(ImageTargetTypeMsg::PLANAR);
  imageTargetMetadata.builder().setImageWidth(pix.cols());
  imageTargetMetadata.builder().setImageHeight(pix.rows());

  DetectionImageLoader loader;
  loader.initialize(shader, imageTargetMetadata.reader(), k);
  loader.imTexture().bind();
  loader.imTexture().setPixels(pix.pixels());
  loader.imTexture().unbind();
  loader.processGpu();
  loader.readDataToCpu();
  return loader.extractFeatures();
}

void runPlanarFeatureExtraction(const String &filename) {
  // Read the image from disk.
  C8Log("Reading image %s", filename.c_str());
  auto img = readImageToRGBA(filename);
  auto pix = img.pixels();

  // Pick a reasonable camera model for the read image.
  auto k = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6), pix.cols(), pix.rows());

  // Initialize the shader that will be used to detect feature points.
  Gr8FeatureShader shader;
  shader.initialize();

  // Extract detection points from the image and print some stats.
  auto detectionImage = extractFeatures(pix, k, &shader);
  C8Log(
    "Extracted %d features at rotation %d from %s",
    detectionImage.framePoints().points().size(),
    detectionImage.rotation(),
    filename.c_str());

  // Convert image target points to 3d points at distance 1.
  Vector<HPoint3> worldPts;
  std::transform(
    detectionImage.framePoints().points().begin(),
    detectionImage.framePoints().points().end(),
    std::back_inserter(worldPts),
    [](const TargetPoint &p) -> HPoint3 { return p.position().extrude(); });

  // If the image was rotated for extracting the points, we need to unrotate them here.
  worldPts = HMatrixGen::zDegrees(detectionImage.rotation()) * worldPts;

  // Convert 3d points to 2d points in the source image pixel space.
  auto imPts = flatten<2>(HMatrixGen::intrinsic(k) * worldPts);

  // Draw the points over the source image.
  drawPoints(imPts, 3, Color::PURPLE, pix);

  // Write the drawn image to disk.
  String outPath = "/tmp/planar-extract-features.jpg";
  C8Log("Writing cropped image to %s", outPath.c_str());
  writePixelsToJpg(pix, outPath);
}

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "%s",
      "ERROR: Missing image path.\n"
      "\n"
      "planar-extract-features usage:\n"
      "    bazel run //reality/quality/imagetargets:planar-extract-features -- /path/to/img.jpg\n");
    return -1;
  }
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  {
    ScopeTimer t("face-detect");
    runPlanarFeatureExtraction(argv[1]);
  }
  ScopeTimer::logDetailedSummary();
}
