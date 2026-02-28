// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/io:image-io",
    "//c8/stats:scope-timer",
  };
}
cc_end(0xc45008e1);

#include <array>
#include "c8/c8-log.h"
#include "c8/io/image-io.h"
#include "c8/stats/scope-timer.h"

using namespace c8;

namespace {

std::array<float, 4> getMeanPixels(RGBA8888PlanePixels pix) {
  ScopeTimer t("get-mean-pixels");
  std::array<int32_t, 4> spv{{0, 0, 0, 0}};
  const uint8_t *rowStart = pix.pixels();
  for (int i = 0; i < pix.rows(); ++i) {
    const uint8_t *p = rowStart;
    for (int j = 0; j < pix.cols(); ++j) {
      spv[0] += p[0];
      spv[1] += p[1];
      spv[2] += p[2];
      spv[3] += p[3];
      p += 4;
    }
    rowStart += pix.rowBytes();
  }
  float norm = 1.0f / (pix.rows() * pix.cols());
  return std::array<float, 4>{{spv[0] * norm, spv[1] * norm, spv[2] * norm, spv[3] * norm}};
}

void runTimingTest(RGBA8888PlanePixels pix) {
  ScopeTimer t("run-timing-test");
  for (int i = 0; i < 10000; ++i) {
    auto mpv = getMeanPixels(pix);
    C8Log(
      "Got MPV: #%x%x%x%x",
      static_cast<int>(mpv[0]),
      static_cast<int>(mpv[1]),
      static_cast<int>(mpv[2]),
      static_cast<int>(mpv[3]));
  }
}

}  // namespace

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "%s",
      "ERROR: Missing image path.\n"
      "\n"
      "mean-pixel-value usage:\n"
      "    bazel run //reality/quality/codelab/pixels:mean-pixel-value -- /path/to/img.png\n");
    return -1;
  }

  C8Log("Reading image %s", argv[1]);
  RGBA8888PlanePixelBuffer png = readImageToRGBA(argv[1]);

  runTimingTest(png.pixels());
  ScopeTimer::logDetailedSummary();
}
