// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)
//

#include "reality/app/xr/streaming/osx-native-opengl-texture.h"
#include "c8/c8-log.h"
#include <OpenGL/gl.h>
#include <stdint.h>

namespace c8 {

void OsxNativeOpenglTexture::setManagedCameraRGBATexture(void *texHandle, int width, int height) {
  C8Log("[osx-native-opengl-texture] %s", "Set managed camera RGBA texture");
  texBufManager_.textureBufferReinit(width, height);

  glTex_ = (GLuint)(intptr_t) texHandle;
  if (glTex_ <= 0) {
    C8Log("[osx-native-opengl-texture] %s", "texHandle supposes to be >=0!!!!!");
  }
}

void OsxNativeOpenglTexture::setFrameForDisplay(int height, int width, int yStride, const uint8_t *srcY, 
  int uvStride, const uint8_t* srcUV) {
  if (this->glTex_ == -1) {
    return;
  }
  texBufManager_.yAndUvBufferReinit(width, height, yStride, uvStride);
  texBufManager_.updateYAndUv(srcY, srcUV);
}

void OsxNativeOpenglTexture::renderFrameForDisplay() {
  if (glTex_ == -1) {
    return;
  }

  texBufManager_.updateTextureBufferFromYuv();
  
  // Upload texture from memory
  C8Log("[osx-native-opengl-texture] updating textureWidth %d textureHeight %d", 
    texBufManager_.getTextureWidth(), texBufManager_.getTextureHeight());
  glBindTexture(GL_TEXTURE_2D, glTex_);
  glTexSubImage2D(GL_TEXTURE_2D, 0, 0, 0, texBufManager_.getTextureWidth(), texBufManager_.getTextureHeight(), 
    GL_RGBA, GL_UNSIGNED_BYTE, texBufManager_.getTextureBuffer());
  glBindTexture(GL_TEXTURE_2D, 0);
}

}  // namespace c8
