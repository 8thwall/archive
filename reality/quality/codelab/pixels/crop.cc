// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/io:image-io",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixels",
  };
}
cc_end(0x6ee3c6ed);

#include <array>
#include "c8/c8-log.h"
#include "c8/io/image-io.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixels.h"

using namespace c8;

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "%s",
      "ERROR: Missing image path.\n"
      "\n"
      "crop usage:\n"
      "    bazel run //reality/quality/codelab/pixels:crop -- /path/to/img.png\n");
    return -1;
  }

  C8Log("Reading image %s", argv[1]);
  RGBA8888PlanePixelBuffer png = readImageToRGBA(argv[1]);
  auto pix = png.pixels();

  String outPath = "/tmp/crop.jpg";
  int cropRows = 225;
  int cropCols = 200;
  int cropRowStart = 75;
  int cropColStart = 175;

  RGBA8888PlanePixels cropPix(
    cropRows,
    cropCols,
    pix.rowBytes(),
    pix.pixels() + cropRowStart * pix.rowBytes() + cropColStart * 4);

  C8Log("Writing cropped image to %s", outPath.c_str());
  writeImage(cropPix, outPath);
}
