// Original Author: Lynn Dang (lynn@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//reality/engine/depth:depthnet-depth-map",
    "//c8/io:image-io",
    "//c8:c8-log",
    "//c8/pixels:gpu-pixels-resizer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels/opengl:offscreen-gl-context",
  };
  data = {
    "//reality/engine/depth/data:depthnet",
  };

  testonly = 1;
}
cc_end(0xf1d2216a);

#include <algorithm>
#include <cmath>
#include <cstdio>
#include <numeric>

#include "c8/c8-log.h"
#include "c8/io/image-io.h"
#include "c8/pixels/gpu-pixels-resizer.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-transforms.h"
#include "reality/engine/depth/depthnet-depth-map.h"
#include "c8/stats/scope-timer.h"

using namespace c8;

const char *APP_NAME = "depth-map-from-depthnet";

static constexpr char DEPTHNET_PATH[] = "reality/engine/depth/data/depthnet.tflite";

int main(int argc, char *argv[]) {
  if (argc != 3) {
    C8Log(
      "ERROR: Missing input path(s).\n"
      "\n"
      "%s usage:\n"
      "    bazel run //reality/quality/depth:%s -- /path/to/image.jpg /path/to/output.jpg\n",
      APP_NAME,
      APP_NAME);
    return -1;
  }
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();
  ScopeTimer t("depth-map-from-deepthnet");
  GpuPixelsResizer resizer;
  Depthnet depthnet(readFile(DEPTHNET_PATH));

  // Resizing image to fit depthnet
  auto im = readImageToRGBA(argv[1]);
  RGBA8888PlanePixelBuffer resizedImage =
    resizer.resizeOnGpu(im.pixels(), 256, 192);

  // Get the depth map from depthnet and convert to greyscale for display
  DepthFloatPixels floatPixels = depthnet.detectDepth(resizedImage.pixels());
  RGBA8888PlanePixelBuffer grayScaleOutput(256, 192);
  auto grayScalePixels = grayScaleOutput.pixels();

  // Inverse depth range from Depthnet is (0,0.3)
  float minPixel = 0;
  float maxPixel = 0.15;
  floatToRgbaGray(floatPixels, &grayScalePixels, minPixel, maxPixel);
  writeImage(grayScalePixels, argv[2]);
}
