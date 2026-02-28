// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#include "bzl/inliner/rules2.h"
cc_library {
  hdrs = {
    "qr-renderer.h",
  };
  deps = {
    ":qr-render-result",
    "//c8/pixels/render:object8",
    "//c8/pixels/render:renderer",
    "//c8/pixels:pixel-buffer",
    "//c8/stats:scope-timer",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0x6892ca46);

#include "c8/stats/scope-timer.h"
#include "reality/engine/qr/qr-renderer.h"

namespace c8 {

namespace {

HMatrix renderTransform(int rows, int cols) {
  if (rows < cols) {
    float scale = 256.0f / rows;
    float shift = (256.0f - scale * cols) * 0.5f;
    return HMatrixGen::translateX(shift) * HMatrixGen::scale(scale, scale, 1.0f);
  }

  float scale = 256.0f / cols;
  float shift = (256.0f - scale * rows) * 0.5f;
  return HMatrixGen::translateY(shift) * HMatrixGen::scale(scale, scale, 1.0f);
}

}

// Start processing the camera texture.
void QrRenderer::draw(const QrRendererInput &in) {
  if (needsRead_) {
    C8Log("[qr-renderer] WARNING: draw called on a new frame before result() on a previous frame");
    return;
  }

  if (scene_ == nullptr) {
    scene_ = ObGen::scene(256, 256);
    scene_->add(ObGen::pixelCamera(256, 256));
    scene_->add(ObGen::pixelQuad(0, 0, in.texWidth, in.texHeight))
      .setMaterial(MatGen::image());
  }

  auto &quad = scene_->find<Renderable>("pixel-quad");

  auto transform = renderTransform(in.texHeight, in.texWidth);

  quad.material().colorTexture()->setNativeId(in.texId);
  quad.setLocal(transform);

  pixelTransform_ = transform.inv();

  renderer_.render(*scene_);

  needsRead_ = true;
}

// Get the result from a previous draw command. This reads pending data back from the GPU,
// blocking if needed.
QrRenderResult QrRenderer::result() {
  if (!needsRead_) {
    return {};
  }
  ScopeTimer s("qr-renderer-result");
  needsRead_ = false;
  auto out = output_.pixels();

  const auto &sceneSpec = scene_->renderSpec();
  if (sceneSpec.resolutionWidth != out.cols() || sceneSpec.resolutionHeight != out.rows()) {
    ScopeTimer t("allocate-render-output-buffer");
    output_ = RGBA8888PlanePixelBuffer(sceneSpec.resolutionHeight, sceneSpec.resolutionWidth);
    out = output_.pixels();
  }

  {
    ScopeTimer t("read-gpu");
    renderer_.result(out);
  }

  return {out, pixelTransform_};
}

}  // namespace c8
