// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#pragma once

#include <stdint.h>

namespace c8 {

class TextureCopier {
public:
  // Default constructor.
  TextureCopier() = default;
  virtual ~TextureCopier() = default;

  virtual void setManagedCameraRGBATexture(void *texHandle, int width, int height) = 0;
  virtual void setFrameForDisplay(
    int height, int width, int yStride, const uint8_t *srcY, int uvStride, const uint8_t *srcUV) = 0;
  virtual void renderFrameForDisplay() = 0;
};

}  // namespace c8
