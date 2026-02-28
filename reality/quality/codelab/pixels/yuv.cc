// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

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
cc_end(0x8ffd457d);

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

void yuvToRgbSlow(
  const ConstYPlanePixels &srcY,
  const ConstUVPlanePixels &srcUV,
  RGBA8888PlanePixels *dest) {
  ScopeTimer t("yuv-to-rgb-with-flops");

  for (int r = 0; r < srcY.rows(); ++r) {
    for (int c = 0; c < srcY.cols(); ++c) {
      uint8_t y = srcY.pixels()[r * srcY.rowBytes() + c];
      int u = srcUV.pixels()[(r / 2) * srcY.rowBytes() + 2 * (c / 2) + 0] - 128;
      int v = srcUV.pixels()[(r / 2) * srcY.rowBytes() + 2 * (c / 2) + 1] - 128;

      dest->pixels()[r * dest->rowBytes() + 4 * c + 0] = clip(y + 1.4f * v);                 // r
      dest->pixels()[r * dest->rowBytes() + 4 * c + 1] = clip(y - 0.343f * u - 0.711f * v);  // g
      dest->pixels()[r * dest->rowBytes() + 4 * c + 2] = clip(y + 1.765f * u);               // b
    }
  }
}

void createYuvVisualizations(const String &inputFile) {
  ScopeTimer t("create-yuv-visualization");

  C8Log("Reading image %s", inputFile.c_str());
  RGBA8888PlanePixelBuffer png = readImageToRGBA(inputFile);
  auto pix = png.pixels();

  // Convert RGB to an interleaved yuv format.
  YUVA8888PlanePixelBuffer interleavedYuv(pix.rows(), pix.cols());
  auto interleavedYuvPix = interleavedYuv.pixels();
  rgbToYuv(pix, &interleavedYuvPix);

  // Separate the y/uv single image into two images.
  YPlanePixelBuffer yBuf(pix.rows(), pix.cols());
  auto yPix = yBuf.pixels();

  UVPlanePixelBuffer uvBuf(pix.rows() / 2, pix.cols() / 2);
  auto uvPix = uvBuf.pixels();

  yuvToPlanarYuv(interleavedYuvPix, &yPix, &uvPix);

  // Create an RGB visualization of the y channel using a constant uv channel.
  UVPlanePixelBuffer uv128Buf(pix.rows() / 2, pix.cols() / 2);
  auto uv128Pix = uv128Buf.pixels();
  std::memset(uv128Pix.pixels(), 128, uv128Pix.rows() * uv128Pix.rowBytes());

  RGBA8888PlanePixelBuffer yVizBuf(pix.rows(), pix.cols());
  RGBA8888PlanePixels yVizPix = yVizBuf.pixels();
  yuvToRgb(yPix, uv128Pix, &yVizPix);

  // Create an RGB visualization of the uv channel using a constant y channel.
  YPlanePixelBuffer y128Buf(pix.rows(), pix.cols());
  auto y128Pix = y128Buf.pixels();
  std::memset(y128Pix.pixels(), 128, y128Pix.rows() * y128Pix.rowBytes());

  RGBA8888PlanePixelBuffer uvVizBuf(pix.rows(), pix.cols());
  RGBA8888PlanePixels uvVizPix = uvVizBuf.pixels();
  yuvToRgb(y128Pix, uvPix, &uvVizPix);

  // Recreate RGB image from YUV
  RGBA8888PlanePixelBuffer newRgb(pix.rows(), pix.cols());
  auto newRgbPix = newRgb.pixels();
  yuvToRgb(yPix, uvPix, &newRgbPix);

  // Save the visuzliations.
  String yOutPath = "/tmp/y.jpg";
  String uvOutPath = "/tmp/uv.jpg";
  String rgbOutPath = "/tmp/reconstructedRgb.jpg";

  C8Log("Writing  y image to %s", yOutPath.c_str());
  writePixelsToJpg(yVizPix, yOutPath);

  C8Log("Writing uv image to %s", uvOutPath.c_str());
  writePixelsToJpg(uvVizPix, uvOutPath);

  C8Log("Writing reconstructed rgb image to %s", rgbOutPath.c_str());
  writePixelsToJpg(newRgbPix, rgbOutPath);

  // Benchmark an alternate implementation of yuv to rgb.
  yuvToRgbSlow(yPix, uv128Pix, &yVizPix);
  yuvToRgbSlow(y128Pix, uvPix, &uvVizPix);
}

}  // namespace

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "%s",
      "ERROR: Missing image path.\n"
      "\n"
      "yuv usage:\n"
      "    bazel run //reality/quality/codelab/pixels:yuv -- /path/to/img.png\n");
    return -1;
  }

  createYuvVisualizations(argv[1]);
  ScopeTimer::logDetailedSummary();
}
