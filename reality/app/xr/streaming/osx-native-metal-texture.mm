// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "reality/app/xr/streaming/osx-native-metal-texture.h"

#import <Metal/Metal.h>

namespace c8 {

struct ObjCDataHolder {
  id<MTLTexture> mtlTexture = nil;
};

void OsxNativeMetalTexture::setManagedCameraRGBATexture(void *texHandle, int width, int height) {
  texBufManager_.textureBufferReinit(width, height);

  if (this->objcData == nullptr) {
    this->objcData = new ObjCDataHolder();
  }
  this->objcData->mtlTexture = (__bridge id<MTLTexture>)texHandle;
}

void OsxNativeMetalTexture::setFrameForDisplay(
  int height, int width, int yStride, const uint8_t *srcY, int uvStride, const uint8_t *srcUV) {
  if (this->objcData == nullptr || this->objcData->mtlTexture == nullptr) {
    return;
  }
  texBufManager_.yAndUvBufferReinit(width, height, yStride, uvStride);
  texBufManager_.updateYAndUv(srcY, srcUV);
}

void OsxNativeMetalTexture::renderFrameForDisplay() {
  if (this->objcData->mtlTexture == nullptr) {
    return;
  }

  texBufManager_.updateTextureBufferFromYuv();

  // Upload texture from memory
  int width = texBufManager_.getTextureWidth();
  int height = texBufManager_.getTextureHeight();
  const uint32_t *buf = texBufManager_.getTextureBuffer();
  [this->objcData->mtlTexture replaceRegion:MTLRegionMake3D(
                                    0,  // x
                                    0,  // y
                                    0,  // z
                                    width,
                                    height,
                                    1)  // depth
                      mipmapLevel:0
                      withBytes:buf
                      bytesPerRow:width * 4
  ];
}
}  // namespace c8
