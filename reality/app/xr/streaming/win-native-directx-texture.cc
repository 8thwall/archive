// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)
//

#include "reality/app/xr/streaming/win-native-directx-texture.h"
#include "c8/c8-log.h"
#include <stdint.h>

namespace c8 {

WinNativeDirectxTexture::WinNativeDirectxTexture(ID3D11Device* device) {
  d3dDeviceContext_ = device;
}

void WinNativeDirectxTexture::setManagedCameraRGBATexture(void *texHandle, int width, int height) {
  C8Log("[win-native-directx-texture] %s", "Set managed camera RGBA texture");
  texBufManager_.textureBufferReinit(width, height);

  d3dTex_ = (ID3D11Texture2D*) texHandle;
  if (d3dTex_ == nullptr) {
    C8Log("[win-native-directx-texture] %s", "texHandle is NULL!!!!!");
  }
}

void WinNativeDirectxTexture::setFrameForDisplay(int height, int width, int yStride, const uint8_t *srcY, 
  int uvStride, const uint8_t* srcUV) {
  if (this->d3dTex_ == nullptr) {
    return;
  }
  texBufManager_.yAndUvBufferReinit(width, height, yStride, uvStride);
  texBufManager_.updateYAndUv(srcY, srcUV);
}

void WinNativeDirectxTexture::renderFrameForDisplay() {
  if (d3dTex_ == nullptr) {
    return;
  }

  if (d3dDeviceContext_ == nullptr) {
    C8Log("[win-native-directx-texture] %s", "The Direct3D device context is unavailable. Cannot update");
    return;
  }

  texBufManager_.updateTextureBufferFromYuv();
  
  // Upload texture from memory
  ID3D11DeviceContext* ctx = NULL;
  d3dDeviceContext_->GetImmediateContext(&ctx);
  C8Log("[win-native-directx-texture] updating subresource textureWidth %d textureHeight", 
    texBufManager_.getTextureWidth(), texBufManager_.getTextureHeight()); 
  ctx->UpdateSubresource(d3dTex_, 0, NULL, texBufManager_.getTextureBuffer(), 
    4 * texBufManager_.getTextureWidth(), 4 * texBufManager_.getTextureWidth() * texBufManager_.getTextureHeight());
}

}  // namespace c8
