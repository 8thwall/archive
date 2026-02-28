// Copyright (c) 2022 Niantic Inc
// Original Author: Dat Chu (datchu@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/io:image-io",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/stats:scope-timer",
  };
}
cc_end(0x03b35555);

#include <array>

#include "c8/c8-log.h"
#include "c8/io/image-io.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/stats/scope-timer.h"

using namespace c8;

namespace {
static inline uint8_t clip(int x) { return x < 0 ? 0 : (x > 255 ? 255 : x); }

RGBA8888PlanePixelBuffer withConstantY(int yVal, ConstUVPlanePixels uvPixels) {
  YPlanePixelBuffer fixedYBuf(uvPixels.rows() * 2, uvPixels.cols() * 2);
  auto fixedYPix = fixedYBuf.pixels();
  std::memset(fixedYPix.pixels(), yVal, fixedYPix.rows() * fixedYPix.rowBytes());
  RGBA8888PlanePixelBuffer uvVizBuf(fixedYPix.rows(), fixedYPix.cols());
  auto uvVizPix = uvVizBuf.pixels();
  yuvToRgb(fixedYPix, uvPixels, &uvVizPix);
  return uvVizBuf;
}

void readThenWrite(const String &inputFile, const String &outputFilePrefix) {
  // read into YUV planar
  auto rgba = readJpgToRGBA(inputFile);
  int nRows = rgba.pixels().rows();
  int nCols = rgba.pixels().cols();
  YUVA8888PlanePixelBuffer yuva{nRows, nCols};
  auto yuvaPixels = yuva.pixels();
  rgbToYuv(rgba.pixels(), &yuvaPixels);

  YPlanePixelBuffer yBuf{nRows, nCols};
  UVPlanePixelBuffer uvBuf{nRows / 2, nCols / 2};
  auto yPixels = yBuf.pixels();
  auto uvPixels = uvBuf.pixels();
  yuvToPlanarYuv(yuva.pixels(), &yPixels, &uvPixels);

  {
    RGBA8888PlanePixelBuffer newRgbBuf{nRows, nCols};
    auto newRgbPixels = newRgbBuf.pixels();
    yuvToRgb(yPixels, uvPixels, &newRgbPixels);
    writePixelsToJpg(newRgbPixels, outputFilePrefix + "-1-interleaved-reconstructed.jpg");
  }

  int nUvRows = uvPixels.rows();
  int nUvCols = uvPixels.cols();
  UPlanePixelBuffer uBuf{nUvRows, nUvCols};
  VPlanePixelBuffer vBuf{nUvRows, nUvCols};
  splitPixels(uvPixels, uBuf.pixels(), vBuf.pixels());
  // Ok, we now have three separate planes of y, u, v

  {
    // Combine separate planar YUV into interleaved YUV and write out to the new file
    RGBA8888PlanePixelBuffer newRgbBuf{nRows, nCols};
    auto newRgbPixels = newRgbBuf.pixels();
    UVPlanePixelBuffer newUvBuf{nUvRows, nUvCols};
    auto newUvPixels = newUvBuf.pixels();
    mergePixels(uBuf.pixels(), vBuf.pixels(), &newUvPixels);
    yuvToRgb(yBuf.pixels(), newUvPixels, &newRgbPixels);
    writePixelsToJpg(newRgbBuf.pixels(), outputFilePrefix + "-2-merged-planar-reconstructed.jpg");
  }

  {
    // Combine directly from planar YUV and write out to the new file
    RGBA8888PlanePixelBuffer newRgbBuf{nRows, nCols};
    auto newRgbPixels = newRgbBuf.pixels();
    yuvToRgb(yBuf.pixels(), uBuf.pixels(), vBuf.pixels(), &newRgbPixels);
    writePixelsToJpg(newRgbBuf.pixels(), outputFilePrefix + "-3-direct-planar-reconstructed.jpg");
  }

  Vector<uint8_t> encodedBuf = writePixelsToJpg(yBuf.pixels(), uBuf.pixels(), vBuf.pixels());
  {
    // Reconstruct from the encoded data
    YPlanePixelBuffer newYBuf;
    UPlanePixelBuffer newUBuf;
    VPlanePixelBuffer newVBuf;
    readJpgToPixelsAllocate(encodedBuf.data(), encodedBuf.size(), &newYBuf, &newUBuf, &newVBuf);
    readJpgToPixels(
      encodedBuf.data(), encodedBuf.size(), newYBuf.pixels(), newUBuf.pixels(), newVBuf.pixels());

    RGBA8888PlanePixelBuffer newRgbBuf{nRows, nCols};
    auto newRgbPixels = newRgbBuf.pixels();
    yuvToRgb(newYBuf.pixels(), newUBuf.pixels(), newVBuf.pixels(), &newRgbPixels);
    writePixelsToJpg(newRgbBuf.pixels(), outputFilePrefix + "-3-encoded-reconstructed.jpg");
  }
}
}  // namespace

int main(int argc, char *argv[]) {
  if (argc != 3) {
    C8Log(
      "%s",
      "ERROR: Missing image path.\n"
      "\n"
      "yuv-planar usage:\n"
      "    bazel run //reality/quality/codelab/pixels:yuv-planar -- /path/to/input.jpg "
      "/path/to/output-prefix\n");
    return -1;
  }

  readThenWrite(argv[1], argv[2]);
  ScopeTimer::logDetailedSummary();
  return 0;
}
