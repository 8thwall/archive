// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#pragma once

#include "c8/hmatrix.h"
#include "c8/pixels/pixels.h"

namespace c8 {

struct QrRenderResult {
public:
  RGBA8888PlanePixels renderedImg = {};
  HMatrix renderPixToSourcePix = HMatrixGen::i();
};

}  // namespace c8
