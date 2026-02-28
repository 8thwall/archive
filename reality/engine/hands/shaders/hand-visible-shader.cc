// Copyright (c) 2023 8th Wall, Inc.
// Original Author: Dat Chu (datchu@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "hand-visible-shader.h",
  };
  deps = {
    "//c8:c8-log",
    "//c8/pixels/opengl:gl-headers",
    "//c8/pixels/opengl:gl-program",
    "//c8/pixels/render:renderer",
    "//reality/engine/hands/shaders:render-shaders",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0x0d639290);

#include "c8/pixels/render/renderer.h"
#include "reality/engine/hands/shaders/hand-visible-shader.h"
#include "reality/engine/hands/shaders/render-shaders.h"

namespace c8 {

void HandVisibleShader::initialize() {
  auto vert = embeddedHandVisibleVertCStr;
  auto edgeFrag = embeddedHandVisibleFragCStr;
  auto smoothFrag = embeddedHandSmoothFragCStr;
  auto finalFrag = embeddedHandSmoothNotEdgeFragCStr;
#ifdef __EMSCRIPTEN__
  if (isWebGL2()) {
    vert = embeddedHandVisibleWebgl2VertCStr;
    edgeFrag = embeddedHandVisibleWebgl2FragCStr;
    smoothFrag = embeddedHandSmoothWebgl2FragCStr;
    finalFrag = embeddedHandSmoothNotEdgeWebgl2FragCStr;
  }
#endif

  edgeShader_.initialize(
    vert,
    edgeFrag,
    {{"position", GlVertexAttrib::SLOT_0}, {"uv", GlVertexAttrib::SLOT_2}},
    {
      {"colorSampler"},
      {"scale"},
      {"intensity"},
    });

  smoothShader_.initialize(
    vert,
    smoothFrag,
    {{"position", GlVertexAttrib::SLOT_0}, {"uv", GlVertexAttrib::SLOT_2}},
    {
      {"colorSampler"}, {"scale"}, {"smoothIntensity"},  // sigma in gaussian filter
    });

  finalShader_.initialize(
    vert,
    finalFrag,
    {{"position", GlVertexAttrib::SLOT_0}, {"uv", GlVertexAttrib::SLOT_2}},
    {
      {"colorSampler"},
      {"scale"},
      {"intensity"},
      {"edgeThreshold"},
      {"smoothIntensity"},  // sigma in gaussian filter
    });
}

void HandVisibleShader::bind(const GlProgramObject *shader) { glUseProgram(shader->id()); }

}  // namespace c8
