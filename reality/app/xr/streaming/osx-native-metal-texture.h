// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <stdint.h>

#include "reality/app/xr/streaming/inmemory-texture-buffers.h"
#include "reality/app/xr/streaming/texture-copier.h"

namespace c8 {

struct ObjCDataHolder;

class OsxNativeMetalTexture : public TextureCopier {
public:
  // Default constructor.
  OsxNativeMetalTexture() = default;
  ~OsxNativeMetalTexture() = default;

  void setManagedCameraRGBATexture(void *texHandle, int width, int height);

  // NOTE: Because we need to compile this OSX code with special build rules, it's hard to share the
  // normal interfaces like pixels.h / pixel-transforms.h.
  void setFrameForDisplay(
    int height, int width, int yStride, const uint8_t *srcY, int uvStride, const uint8_t *srcUV);
  void renderFrameForDisplay();

  // Disallow copying.
  OsxNativeMetalTexture(OsxNativeMetalTexture &&) = delete;
  OsxNativeMetalTexture &operator=(OsxNativeMetalTexture &&) = delete;
  OsxNativeMetalTexture(const OsxNativeMetalTexture &) = delete;
  OsxNativeMetalTexture &operator=(const OsxNativeMetalTexture &) = delete;

private:
  InmemoryTextureBuffers texBufManager_;
  ObjCDataHolder *objcData = nullptr;
};

}  // namespace c8
