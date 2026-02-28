// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)
//

#pragma once

#include <stdint.h>
#include <d3d11.h>
#include "reality/app/xr/streaming/inmemory-texture-buffers.h"

namespace c8 {

/**
 * This class has the same interface as the osx version (see osx-native-metal-texture)
 * This class implements the 3 step rendering process.
 * Step 1: Initialization. We are given a managed texture. We can perform neccessary start up
 *         for our rendering pipeline. We hold onto the managed texture pointer so we render
 *         to it later.
 * Step 2: Frame update. We are given a new texture data. We can perform light-weight 
 *         conversion or processing here if needed.
 * Step 3: Render. We need to perform all processing required to display the texture data 
 *         received in step 2 and put it into the texture pointer given to us in step 1.
 * 
 * Step 2 and 3 will be called multiple times. Step 1 is unlikely to change.
 * There is no guarantee that the textureData provided in step 2 stay until step 3. We generally
 * have to make a copy of the data in step 2.
 */
class WinNativeDirectxTexture {
public:
  WinNativeDirectxTexture(ID3D11Device* device);
  ~WinNativeDirectxTexture() = default;

  /**
   * We are given a texture that is managed externally. When renderFrameForDisplay()
   * is called, we will replace this texture with the frame data
   * 
   * This is the initialization step (step 1) of our 3 step rendering process
   * @param texHandle The handle to a texture managed externally
   */
  void setManagedCameraRGBATexture(void *texHandle, int width, int height);

  /**
   * We are given new texture data. We will need to copy this texture data internally
   * so we have access to it later. This is step 2 of our rendering process.
   */
  void setFrameForDisplay(int height, int width, int yStride, const uint8_t *srcY, int uvStride, const uint8_t* srcUV);

  /**
   * We need to render our frame received earlier (and hopefully have a copy of) into
   * the texture mentioned in step 1.
   */
  void renderFrameForDisplay();

  // Disallow copying.
  WinNativeDirectxTexture(WinNativeDirectxTexture&&) = delete;
  WinNativeDirectxTexture& operator=(WinNativeDirectxTexture&&) = delete;
  WinNativeDirectxTexture(const WinNativeDirectxTexture&) = delete;
  WinNativeDirectxTexture& operator=(const WinNativeDirectxTexture&) = delete;

private:
  InmemoryTextureBuffers texBufManager_;  
  ID3D11Texture2D* d3dTex_ = nullptr;
  ID3D11Device* d3dDeviceContext_;
};

}  // namespace c8
