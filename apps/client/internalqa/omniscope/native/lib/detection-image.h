// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <functional>

#include "c8/pixels/opengl/gl-framebuffer.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-buffer.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8gl.h"
#include "reality/engine/features/image-point.h"
#include "reality/engine/features/local-matcher.h"
#include "reality/engine/imagedetection/detection-image-loader.h"
#include "reality/engine/imagedetection/detection-image-matcher.h"
#include "reality/engine/imagedetection/detection-image.h"

namespace c8 {

using TexCopier = std::function<void(GlTexture src, GlFramebufferObject *dest)>;

// An OmniDetectionImage is an omniscope wrapper for a detection image that maintains the
// DetectionImage itself and other resources for loading and visualizing it. This extra data would
// be unnecessary to compute and maintain at runtime. Particularly,
// * the detection image loader used to load the image which has
//   - a full resolution texture of the original loaded image (stored in the laoder)
//   - the pyramid extracted from the source image for computing features and descriptors.
// * A lower resolution texture of the target that's the same size as the pyramid.
// * A lower resolution rgba pixel buffer of the target that's the same size as the pryamid.
// * The detection image itself.
struct OmniDetectionImage {
public:
  GlTexture imTexture() { return loader_.imTexture(); }

  // Allocates GPU and CPU resources for processing the detection image.
  void initialize(
    Gr8FeatureShader *glShader,
    ImageTargetMetadata::Reader imageTargetMetadataReader,
    c8_PixelPinholeCameraModel k);

  // Set up all gpu operations, block until they are read back, and extract feature points.
  // In production, these operations should be spread out.
  void processBlocking();

  // Set up all the gpu operations to start computing features.
  void processGpu();

  // Read data off of the gpu into memory where it can be processed by cpu.
  // Call this after processGpu.
  void readDataToCpu();

  // Extract feature points and descriptors from the pyramid.
  // Call this after readDataToCpu.
  void extractFeatures();

  DetectionImage &detectionImage() { return detectionImage_; }
  const DetectionImage &detectionImage() const { return detectionImage_; }

  TargetWithPoints &framePoints() { return detectionImage_.framePoints(); }
  const TargetWithPoints &framePoints() const { return detectionImage_.framePoints(); }

  DetectionImageMatcher &globalMatcher() { return detectionImage_.globalMatcher(); }
  DetectionImageLocalMatcher &localMatcher() { return detectionImage_.localMatcher(); }

  GlRealityFrame &gl() { return loader_.gl(); }
  const GlRealityFrame &gl() const { return loader_.gl(); }

  ConstRGBA8888PlanePixels previewPix() const { return previewPix_.pixels(); }
  void setGeometry(int cropWidth, int cropHeight, CurvySpec spec);

  bool rotateFeatures() const { return loader_.rotateFeatures(); }

private:
  DetectionImage detectionImage_;
  DetectionImageLoader loader_;

  // preview texture is a smaller image that helpfully matches the pyramid size for point display.
  // We likely don't want this in production.
  GlFramebufferObject previewTexture_;
  TexCopier copyTexture_;
  // For omniscope particularly it's useful to have a downsized color image for drawing.
  // We likely don't want this in production.
  RGBA8888PlanePixelBuffer previewPix_;
};

}  // namespace c8
