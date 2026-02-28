// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/io:image-io",
    "//c8/pixels:pixel-buffer",
    "//c8/stats:scope-timer",
    "//c8/string:join",
    "//reality/engine/qr:qr-detector",
  };
}
cc_end(0x505105fe);

#include <array>

#include "c8/c8-log.h"
#include "c8/io/image-io.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/join.h"
#include "reality/engine/qr/qr-detector.h"

using namespace c8;

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "%s",
      "ERROR: Missing image path.\n"
      "\n"
      "qr usage:\n"
      "    bazel run //reality/quality/codelab/qr:qr -- /path/to/img.png\n");
    return -1;
  }

  C8Log("Reading image %s", argv[1]);

  {
    RGBA8888PlanePixelBuffer src;
    ScopeTimer s("qr-cc");
    {
      ScopeTimer t("00-read-image");
      src = readImageToRGBA(argv[1]);
    }

    QrDetector detector;
    ScanResult qr;

    {
      ScopeTimer t("01-detect");
      qr = detector.detectQr({src.pixels(), HMatrixGen::i()});
    }

    {
      ScopeTimer t("02-print-result");
      if (qr.found) {
        C8Log("FOUND:");
        C8Log("text:       '%s'", qr.text.c_str());
        C8Log("pts.size(): %d", qr.pts.size());
        C8Log(
          "pts:        [%s]", strJoin(qr.pts, ", ", [](auto p) { return p.toString(); }).c_str());
      } else {
        C8Log("NOT FOUND");
      }
    }
  }

  ScopeTimer::logBriefSummary();
}
