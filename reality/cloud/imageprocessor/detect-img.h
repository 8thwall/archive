// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Rishi Parikh (rishi@8thwall.com)
//
// Calculates image target scores and visualizations for each sub category.

#include "c8/hpoint.h"
#include "c8/pixels/pixels.h"
#include "c8/string.h"
#include "c8/vector.h"

namespace c8 {
// Detects an image target in an input scene.
Vector<HPoint2> detectImageInScene(
  RGBA8888PlanePixels targetPix,
  RGBA8888PlanePixels searchPix,
  Vector<String> *outPaths,
  Vector<RGBA8888PlanePixelBuffer> *detectedImages);
}  // namespace c8
