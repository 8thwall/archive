// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)
#pragma once

#include <stdint.h>
#include "reality/app/xr/streaming/inmemory-texture-buffers.h"
#include "reality/app/xr/streaming/texture-copier.h"

namespace c8 {

class OsxNativeOpenglTexture : public TextureCopier {
public:
  // Default constructor.
  OsxNativeOpenglTexture() = default;
  ~OsxNativeOpenglTexture() = default;

  void setManagedCameraRGBATexture(void *texHandle, int width, int height) override;

  // NOTE: Because we need to compile this OSX code with special build rules, it's hard to share the
  // normal interfaces like pixels.h / pixel-transforms.h.
  void setFrameForDisplay( 
    int height, int width, int yStride, const uint8_t *srcY, int uvStride, const uint8_t *srcUV) override;
  void renderFrameForDisplay() override;

  // Disallow copying.
  OsxNativeOpenglTexture(OsxNativeOpenglTexture &&) = delete;
  OsxNativeOpenglTexture &operator=(OsxNativeOpenglTexture &&) = delete;
  OsxNativeOpenglTexture(const OsxNativeOpenglTexture &) = delete;
  OsxNativeOpenglTexture &operator=(const OsxNativeOpenglTexture &) = delete;

private:
  InmemoryTextureBuffers texBufManager_;  
  int glTex_;
};

}  // namespace c8
