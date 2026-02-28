// Copyright (c) 2023 Niantic Labs
// Original Author: Dat Chu (datchu@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "hand-visible-data-producer.h",
  };
  visibility = {
    "//apps/client/internalqa/omniscope:__subpackages__",
  };
  deps = {
    "//c8/pixels/opengl:gl-error",
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//reality/engine/hands/shaders:hand-visible-shader",
    "//reality/engine/hands:hand-visible-renderer",
  };
}
cc_end(0xad5f8bc3);

#include "c8/pixels/opengl/gl-error.h"
#include "apps/client/internalqa/omniscope/native/lib/producers/hand-visible-data-producer.h"

namespace c8 {
HandVisibleDataProducer::HandVisibleDataProducer(
  AppConfiguration appConfig, HandVisibleShader *shader) {
  renderer_.initialize(shader, appConfig.captureWidth, appConfig.captureHeight);
  checkGLError("[HandVisibleDataProducer] initialize");
}

void HandVisibleDataProducer::drawGl(FrameData &in) {
  ScopeTimer t("hand-visible-data-producer-draw");
  renderer_.draw(in.cameraTexture);
  checkGLError("[HandVisibleDataProducer] drawGl");
}

void HandVisibleDataProducer::readGl() {
  ScopeTimer t("hand-visible-data-producer-read");
  renderer_.readPixels();
  checkGLError("[HandVisibleDataProducer] readGl");
}

}
