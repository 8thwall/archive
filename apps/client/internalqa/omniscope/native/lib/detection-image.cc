// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "detection-image.h",
  };
  deps = {
    "//c8/pixels/opengl:gl-framebuffer",
    "//c8/pixels/opengl:gl-texture",
    "//c8/pixels/opengl:texture-transforms",
    "//c8/pixels:pixel-buffer",
    "//reality/engine/features:frame-point",
    "//reality/engine/features:local-matcher",
    "//reality/engine/features:gl-reality-frame",
    "//reality/engine/features:gr8gl",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/imagedetection:detection-image",
    "//reality/engine/imagedetection:detection-image-loader",
  };
  visibility = {
    "//apps/client/internalqa/omniscope:__subpackages__",
  };
}
cc_end(0xcaf4382a);

#include "apps/client/internalqa/omniscope/native/lib/detection-image.h"

namespace c8 {

void OmniDetectionImage::initialize(
  Gr8FeatureShader *glShader,
  ImageTargetMetadata::Reader imageTargetMetadataReader,
  c8_PixelPinholeCameraModel k) {
  loader_.initialize(glShader, imageTargetMetadataReader, k);

  // preview texture is a smaller image that helpfully matches the pyramid size for point display.
  // We likely don't want this in production.
  auto l0 = loader_.gl().pyramid().levels[0];
  previewTexture_ = makeLinearRGBA8888Framebuffer(l0.w, l0.h);
  copyTexture_ = loader_.rotation() == 0 ? compileCopyTexture2D() : compileRotate90Texture2D();
  previewPix_ = RGBA8888PlanePixelBuffer(l0.h, l0.w);
}

// Set up all gpu operations, block until they are read back, and extract feature points.
// In production, these operations should be spread out.
void OmniDetectionImage::processBlocking() {
  processGpu();
  readDataToCpu();
  extractFeatures();
}

void OmniDetectionImage::processGpu() {
  // Process the image to extract GPU features.
  loader_.processGpu();

  // Copy the texture to a lower-res preview. In production, we shouldn't be doing this at all.
  copyTexture_(loader_.imTexture(), &previewTexture_);
}

void OmniDetectionImage::readDataToCpu() {
  loader_.readDataToCpu();
  // Block until the lower-res preview is finished and then read that preview into pixels. In
  // production, we shouldn't be doing this at all.
  readFramebufferRGBA8888Pixels(previewTexture_, previewPix_.pixels());
}

void OmniDetectionImage::setGeometry(int cropWidth, int cropHeight, CurvySpec spec) {
  loader_.setGeometry(cropWidth, cropHeight, spec);
}

void OmniDetectionImage::extractFeatures() { detectionImage_ = loader_.extractFeatures(); }

}  // namespace c8
