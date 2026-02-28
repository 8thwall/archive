// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Rishi Parikh (rishi@8thwall.com)
#include "bzl/inliner/rules2.h"
cc_library {
  visibility = {
    "//visibility:public",
  };
  deps = {
    ":calc-sub-scores",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixels",
    "//reality/engine/imagedetection:detection-image",
    "//reality/engine/imagedetection:detection-image-loader",
    "//reality/engine/features:gr8-feature-shader",
  };
}
cc_end(0xd6885513);

#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixels.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/imagedetection/detection-image-loader.h"
#include "reality/engine/imagedetection/detection-image.h"

// Extract features using DetectionImageLoader.
DetectionImage extractFeatures(
  ConstRGBA8888PlanePixels pix, c8_PixelPinholeCameraModel k, Gr8FeatureShader *shader) {
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
