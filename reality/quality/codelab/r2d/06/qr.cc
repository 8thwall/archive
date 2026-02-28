// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/io:image-io",
    "//c8/pixels:gl-pixels",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/stats:scope-timer",
    "//c8/string:join",
    "//reality/engine/qr:qr-renderer",
    "//reality/engine/qr:qr-detector",
  };
}
cc_end(0x81ba54a5);

#include <array>

#include "c8/c8-log.h"
#include "c8/io/image-io.h"
#include "c8/pixels/gl-pixels.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/join.h"
#include "reality/engine/qr/qr-detector.h"
#include "reality/engine/qr/qr-renderer.h"

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

  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  C8Log("Reading image %s", argv[1]);

  {
    RGBA8888PlanePixelBuffer src;
    ScopeTimer s("qr-cc");
    {
      ScopeTimer t("00-read-image");
      src = readImageToRGBA(argv[1]);
    }

    GlTexture2D srcTexture;
    {
      ScopeTimer t("01-load-image-to-gpu");
      srcTexture = readImageToLinearTexture(src.pixels());
    }

    QrRenderer renderer;
    {
      ScopeTimer t("02-gpu-draw");
      renderer.draw({srcTexture.id(), srcTexture.width(), srcTexture.height()});
    }

    QrRenderResult renderResult;
    {
      ScopeTimer t("03-gpu-read");
      renderResult = renderer.result();
    }

    QrDetector detector;
    ScanResult qr;

    {
      ScopeTimer t("04-detect");
      qr = detector.detectQr(renderResult);
    }

    {
      ScopeTimer t("05-print-result");
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

    {
      ScopeTimer t("06-write-render");
      C8Log("Writing image /tmp/qr-render.jpg");
      writeImage(renderResult.renderedImg, "/tmp/qr-render.jpg");
    }
  }

  ScopeTimer::logBriefSummary();
}
