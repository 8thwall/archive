// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/io:image-io",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/qr:code-scanner",
    "//c8/string:join",
  };
}
cc_end(0x6947be20);

#include <array>

#include "c8/c8-log.h"
#include "c8/io/image-io.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/qr/code-scanner.h"
#include "c8/string/join.h"

using namespace c8;

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "%s",
      "ERROR: Missing image path.\n"
      "\n"
      "zxing usage:\n"
      "    bazel run //reality/quality/codelab/qr:zxing -- /path/to/img.png\n");
    return -1;
  }

  C8Log("Reading image %s", argv[1]);
  RGBA8888PlanePixelBuffer src = readImageToRGBA(argv[1]);
  auto srcPix = src.pixels();

  YPlanePixelBuffer srcGray(srcPix.rows(), srcPix.cols());
  auto srcGrayPix = srcGray.pixels();

  rgbToGray(srcPix, &srcGrayPix);

  CodeScanner scanner;
  auto qr = scanner.scanQrCode(srcGrayPix);

  if (qr.found) {
    C8Log("FOUND:");
    C8Log("text:       '%s'", qr.text.c_str());
    C8Log("pts.size(): %d", qr.pts.size());
    C8Log("pts:        [%s]", strJoin(qr.pts, ", ", [](auto p) { return p.toString(); }).c_str());
  } else {
    C8Log("NOT FOUND");
  }
}
