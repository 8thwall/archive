// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "//c8/pixels:gl-pixels",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/stats:export-detail",
    "//c8/stats:scope-timer",
    "//c8/string:join",
    "//reality/engine/qr:qr-renderer",
    "//reality/engine/qr:qr-detector",
  };
}
cc_end(0xbb682b1a);

#include <array>

#include "c8/c8-log.h"
#include "c8/io/file-io.h"
#include "c8/io/image-io.h"
#include "c8/pixels/gl-pixels.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/stats/export-detail.h"
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

    RGBA8888PlanePixelBuffer outImg;
    {
      ScopeTimer t("06-render-output");
      Renderer r;

      int rw = srcTexture.width();
      int rh = srcTexture.height();

      // Create a scene with an image and a point cloud, positioned in pixel space.
      auto sc = ObGen::scene(rw, rh);

      {
        ScopeTimer t1("construct-scene");
        sc->add(ObGen::pixelCamera(rw, rh));
        auto &imgQuad = sc->add(ObGen::positioned(ObGen::backQuad(), HMatrixGen::scaleY(-1.0f)))
                          .setMaterial(MatGen::image());
        auto &ptCloud = sc->add(ObGen::pixelPoints());

        // Use the input image texture.
        imgQuad.material().colorTexture()->setNativeId(srcTexture.id());

        // Set the point cloud locations from the qr code points.
        ObGen::updatePixelPoints(&ptCloud, qr.pts, Color::MINT, rw, rh, std::min(rw, rh) / 20.0f);
      }
      {
        ScopeTimer t1("draw-scene");
        r.render(*sc);
      }
      {
        ScopeTimer t1("read-result");
        outImg = r.result();
      }
    }

    {
      ScopeTimer t("07-write-render");
      C8Log("Writing image /tmp/qr-render.jpg");
      writeImage(renderResult.renderedImg, "/tmp/qr-render.jpg");
      C8Log("Writing image /tmp/qr-detections.jpg");
      writeImage(outImg.pixels(), "/tmp/qr-detections.jpg");
    }
  }

  C8Log("Writing timing info: /tmp/qr.fg");
  writeTextFile("/tmp/qr.fg", flamegraphText());

  ScopeTimer::logBriefSummary();
}
