// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)
//

#include "reality/app/xr/streaming/inmemory-texture-buffers.h"
#include "c8/c8-log.h"

namespace c8 {

static inline uint8_t clip(int x) {
  return x < 0 ? 0 : (x > 255 ? 255 : x);
}

InmemoryTextureBuffers::~InmemoryTextureBuffers() {
  if (textureBuffer_ != nullptr) {
    free(textureBuffer_);
    textureBuffer_ = nullptr;
  }
  if (displayY_ != nullptr) {
    free(displayY_);
    displayY_ = nullptr;
  }
  if (displayUV_ != nullptr) {
    free(displayUV_);
    displayUV_ = nullptr;
  }
}

void InmemoryTextureBuffers::updateYAndUv(const uint8_t* srcY, const uint8_t* srcUV) {
  C8Log("[inmemory-texture-bufferss] %s", "Update Y and UV");
  memcpy(displayY_, srcY, displayHeight_ * displayYStride_);
  memcpy(displayUV_, srcUV, ((displayHeight_ + 1) / 2) * displayUVStride_);
}

void InmemoryTextureBuffers::yAndUvBufferReinit(int width, int height, int yStride, int uvStride) {
  C8Log("[inmemory-texture-buffers] setFrameForDisplay width %d height %d yStride %d uvStride %d", 
    width, height, yStride, uvStride);

  if (
    displayHeight_ != height || displayY_ == nullptr || displayYStride_ != yStride
    || displayUV_ == nullptr || displayUVStride_ != uvStride) {

    if (displayY_ != nullptr) {
      free(displayY_);
    }
    displayHeight_ = height;
    displayWidth_ = width;
    displayYStride_ = yStride;
    displayY_ = static_cast<uint8_t *>(malloc(displayHeight_ * displayYStride_));
    displayUVStride_ = uvStride;
    displayUV_ = static_cast<uint8_t *>(malloc(((displayHeight_ + 1) / 2) * displayUVStride_));
  }
}

void InmemoryTextureBuffers::textureBufferReinit(int width, int height) {
  C8Log("[inmemory-texture-bufferss] Managing texture of width %d, height %d", width, height);
  if (
    textureWidth_ != width || textureHeight_ != height
    || textureBuffer_ == nullptr) {
    if (textureBuffer_ != nullptr) {
      free(textureBuffer_);
    }
    this->textureBuffer_ = static_cast<uint32_t *>(malloc(width * height * 4));
  }
  textureWidth_ = width;
  textureHeight_ = height;
}

void InmemoryTextureBuffers::updateTextureBufferFromYuv() {
  if (displayY_ == nullptr || displayUV_ == nullptr) {
    return;
  }

  // We need to convert a YUV semi-planar source to a BGRA interleaved (textureBuffer_)

  // Parameters of the destination buffer.
  int32_t destStride = textureWidth_;
  uint32_t *destPixels = textureBuffer_;

  // Offset address of the first pixel in a row of the Y plane.
  int srcYRowStart = 0;

  // Offset address of the first pixel in a row of the interleaved UV plane.
  int srcUVRowStart = 0;

  // Offset address of the first pixel in a row of the destination.
  int destRowStart = 0;

  for (int sourceRow = 0; sourceRow < displayHeight_; ++sourceRow) {
    // Set the current pixels to the start of the current row.
    const uint8_t *srcYPix = displayY_ + srcYRowStart;
    const uint8_t *srcUPix = displayUV_ + srcUVRowStart;
    const uint8_t *srcVPix = srcUPix + 1;
    uint32_t *destPix = destPixels + destRowStart;

    for (int sourceCol = 0; sourceCol < displayWidth_; ++sourceCol) {
      // Extract the source YUV values. Note that U and V are signed values
      // stored as offset
      // unsigned values.
      uint8_t y = *srcYPix;
      int u = *srcUPix - 128;
      int v = *srcVPix - 128;

      // Convert YUV to RGB, making sure to clip from 0 to 255.
      uint8_t r = clip(y + 1.4f * v);
      uint8_t g = clip(y - 0.343f * u - 0.711f * v);
      uint8_t b = clip(y + 1.765f * u);

      // Set the destination BGRA_8888 value, accounting for endianness.
      *destPix = (b << 16) + (g << 8) + r;

      // Advance the source row by 1.
      srcYPix++;

      // Interleaved source columns advance by two after every odd column.
      int uvAdvance = (sourceCol % 2) << 1;
      srcUPix += uvAdvance;
      srcVPix += uvAdvance;

      // Advance the destination by 1.
      destPix++;
    }

    // Dest row advences by yStride every time.
    destRowStart += destStride;

    // Source row advances by yStride every time.
    srcYRowStart += displayYStride_;

    // Interleaved source row advances by uStride (equals vStride) after odd
    // rows.
    srcUVRowStart += displayUVStride_ * (sourceRow % 2);
  }
}
}
