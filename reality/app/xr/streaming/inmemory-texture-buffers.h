// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)
//

#pragma once

#include <stdint.h>

namespace c8 {

class InmemoryTextureBuffers {
public:
  InmemoryTextureBuffers() = default;
  ~InmemoryTextureBuffers();

  void yAndUvBufferReinit(int width, int height, int yStride, int uvStride);
  void textureBufferReinit(int width, int height);
  void updateYAndUv(const uint8_t* srcY, const uint8_t* srcUV);
  void updateTextureBufferFromYuv();

  inline const uint32_t *getTextureBuffer() const { return textureBuffer_; }
  inline int getTextureWidth() const { return textureWidth_; }
  inline int getTextureHeight() const { return textureHeight_; }

  // Disallow copying.
  InmemoryTextureBuffers(InmemoryTextureBuffers&&) = delete;
  InmemoryTextureBuffers& operator=(InmemoryTextureBuffers&&) = delete;
  InmemoryTextureBuffers(const InmemoryTextureBuffers&) = delete;
  InmemoryTextureBuffers& operator=(const InmemoryTextureBuffers&) = delete;
private:
  int textureWidth_ = 0;
  int textureHeight_ = 0;
  uint32_t *textureBuffer_ = nullptr;

  int displayWidth_ = 0;
  int displayHeight_ = 0;
  int displayYStride_ = 0;
  int displayUVStride_ = 0;
  uint8_t *displayY_ = nullptr;
  uint8_t *displayUV_ = nullptr;
};

}
