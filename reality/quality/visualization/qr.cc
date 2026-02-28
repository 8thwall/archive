// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/io:image-io",
    "//c8/pixels:pixel-buffer",
    "//c8/qr:code-generator",
    "//reality/quality/visualization/render:ui2",
  };
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
  };
}
cc_end(0x41f54215);

#include "c8/c8-log.h"
#include "c8/io/image-io.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/qr/code-generator.h"
#include "reality/quality/visualization/render/ui2.h"

using namespace c8;

int main(int argc, char *argv[]) {
  if (argc < 2) {
    C8Log("usage: %s string-to-qrify", argv[0]);
    exit(2);
  }
  YPlanePixelBuffer qrpb(1024, 1024);
  auto qrpix = qrpb.pixels();
  CodeGenerator::generateQrCode(argv[1], qrpix);
  writeImage(qrpix, "/tmp/code.png");
  show("code", qrpix);

  for (;;) {
    int key = waitKey();
    if (key == 'q' || key == ' ') {
      break;
    }
  }

  return 0;
}
