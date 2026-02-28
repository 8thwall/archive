// Copyright (c) 2023 8th Wall, Inc.
// Original Author: Dat Chu (datchu@nianticlabs.com)

#pragma once

#include "c8/pixels/opengl/gl-program.h"

namespace c8 {

class HandVisibleShader {
public:
  void initialize();

  // Default constructor.
  HandVisibleShader() = default;

  void bind(const GlProgramObject *shader);

  const GlProgramObject *edgeShader() const { return &edgeShader_; }
  const GlProgramObject *smoothShader() const { return &smoothShader_; }
  const GlProgramObject *finalShader() const { return &finalShader_; }

  // Disallow moving.
  HandVisibleShader(HandVisibleShader &&o) = delete;
  HandVisibleShader &operator=(HandVisibleShader &&o) = delete;
  // Disallow copying.
  HandVisibleShader(const HandVisibleShader &) = delete;
  HandVisibleShader &operator=(const HandVisibleShader &) = delete;

private:
  GlProgramObject edgeShader_;
  GlProgramObject smoothShader_;
  GlProgramObject finalShader_;
};

}  // namespace c8
