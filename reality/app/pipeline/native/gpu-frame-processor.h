// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#pragma once

#include <functional>

#include "c8/pixels/opengl/gl-framebuffer.h"
#include "c8/pixels/opengl/gl-pixel-buffer.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-buffer.h"
#include "reality/app/pipeline/native/pipeline-frame.h"
#include "reality/engine/features/gl-reality-frame.h"

namespace c8 {

class GpuFrameProcessor {
public:
  GpuFrameProcessor(void *sharedContext = nullptr);
  ~GpuFrameProcessor();

  // Disallow moving because of custom destructor.
  GpuFrameProcessor(GpuFrameProcessor &&) = delete;
  GpuFrameProcessor &operator=(GpuFrameProcessor &&) = delete;

  // Disallow copying.
  GpuFrameProcessor(const GpuFrameProcessor &) = delete;
  GpuFrameProcessor &operator=(const GpuFrameProcessor &) = delete;

  // Create the EXTERNAL_OES_TEXTURE source texture and return a handle. If this is called
  // subsequent times, the previous texture will be deleted and a new one allocated. Generally you'd
  // call this once when creating the Android capture pipeline and pass the result to the
  // SurfaceTexture used for capture.
  uint32_t createSourceTexture(int width, int height);

  // Process the new GL frame. The call supplies a 4x4 texture coordinate transform matrix
  // associated with the texture image as described in android.graphics.SurfaceTexture. The matrix
  // is stored in *column-major* order so that it may be passed directly to glUniformMatrix4fv.
  void processGlFrame(const float mtx[16], PipelineFrame &frame, PipelineView *view);

private:
  // OpenGL context.
  OffscreenGlContext ctx_;

  // External OES Texture used externally for capture, of type
  GlTexture2D externalSrcTex_;

  int width_ = 0;
  int height_ = 0;

  // Compiled shader and sharder+cpu methods.
  std::function<void(const float mtx[16], GlTexture src, GlFramebufferObject *dest)>
    copyExternalOesTexture2D;
};

}  // namespace c8
