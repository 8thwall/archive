// Copyright (c) 2022 8th Wall, LLC
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)
//
// Renderer for hand detection and landmarks

#pragma once

#include <memory>

#include "c8/geometry/pixel-pinhole-camera-model.h"
#include "c8/hpoint.h"
#include "c8/pixels/opengl/gl-framebuffer.h"
#include "c8/pixels/opengl/gl-quad.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/opengl/gl.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixels.h"
#include "c8/vector.h"
#include "reality/engine/faces/face-roi-shader.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/hands/hand-types.h"
#include "reality/engine/render/renderers.h"
#include "reality/engine/tracking/ray-point-filter.h"

namespace c8 {

class HandRoiRenderer {
public:
  // Get the most recent rendered image.
  RGBA8888PlanePixels pixels() const { return outpix_.pixels(); }

  HandRenderResult result() const;

  // Check whether any read has yet occured. Once this is true, it's always true.
  bool hasRender() const { return hasRender_; }

  // The texture that the render was drawn to.
  GlTexture dest() const { return dest1_.tex().tex(); }

  // Initialize the renderer to process an input with size specified by srcWidth and srcHeight.
  void initialize(FaceRoiShader *shader, int srcWidth, int srcHeight, int localRoiSize);

  // Enables the use of the WebGL 2 features such as pixel pack buffer.
  void enableWebGl2PixelBuffer();

  // Force a readback of the image render. This is useful to finalize draw calls with DRAW_DEFERRED
  // when there is no imminent next frame to process.
  void readPixels();

  // Configure the renderer to add ROIs for the detected hands on its next draw pass.
  void setDetectedHands(const Vector<DetectedPoints> &hands);

  void setRequireFullHand(bool requireFull) { requireFullHand_ = requireFull; }

  void setRequireHandUpright(bool requireUpright) { requireHandUpright_ = requireUpright; }

  // Begin processing the camera texture. If READ_IMMEDIATELY is set, this blocks on materializing
  // the result from the GPU. If DEFER_READ is set, this does not block on the GPU unless a
  // previously requested call to draw is still pending. In that case, it blocks on the result of
  // the previous call.
  void draw(GLuint cameraTexture, GpuReadPixelsOptions options);

  void flipY(bool doFlip) { flipY_ = doFlip ? 1 : 0; }

  // Default constructor.
  // @param roiWidth render the output into a letter box of this dimension
  explicit HandRoiRenderer(int roiWidth = 224) : roiWidth_(std::min(roiWidth, 224)) {}

  // Default move constructors.
  HandRoiRenderer(HandRoiRenderer &&o) = default;
  HandRoiRenderer &operator=(HandRoiRenderer &&o) = default;

  // Disallow copying.
  HandRoiRenderer(const HandRoiRenderer &) = delete;
  HandRoiRenderer &operator=(const HandRoiRenderer &) = delete;

private:
  DetectionRoi handDetectionRoi(const DetectedPoints &detection, bool doUpright);

  bool hasRender_ = false;
  bool needsRead_ = false;
  GlVertexArray quad_;
  GlFramebufferObject dest1_;
  RGBA8888PlanePixelBuffer outpix_;
  int drawnTex_ = 0;
  int tex_ = 0;

  // If this flag is true, the ROI image is only rendered when most of the hand is visible in camera
  // If false, the ROI image is rendered if part of a hand is detected.
  bool requireFullHand_ = false;

  // If this flag is true, the hand will be rendered straight up with fingers pointing up.
  // If false, the hand ROI is not rotated.
  bool requireHandUpright_ = false;

  // ROIs currently in the pipeline. Next will be applied on the next call to draw. When they are
  // drawn, they move to "drawn" and next is cleared. After they are read back from gpu and they are
  // available in result(), they are moved from "drawn" to handRois_ and "drawn" is cleared.
  Vector<ImageRoi> nextHandRois_;
  Vector<ImageRoi> drawnHandRois_;
  Vector<ImageRoi> handRois_;

  // input image/frame width and height
  int inputWidth_ = 0;
  int inputHeight_ = 0;

  // intermediate upsampled texture
  int upsampleWidth_ = 0;
  int upsampleHeight_ = 0;
  // upsample the camera texture to 1.5x texture using gr8-input
  GlFramebufferObject upsampleFbo_;

  // set ROI letterbox square dimension
  int roiWidth_;

  // local ROI size for sub-rect rendering.
  // for mediapipe local detection, the size is HAND_LANDMARK_DETECTION_INPUT_SIZE,
  // for hand mesh detection, the size is HAND_MESH_DETECTION_INPUT_SIZE.
  int localRoiSize_ = 0;

  int outputWidth_ = 0;
  int outputHeight_ = 0;

  // Texture size for ROI rendering
  // We plan to render 4 sub-rect ROIs into this texture, so the size has to be larger
  // than 2 * maxRoiSize, where maxRoiSize is the maximum of (HAND_DETECTION_INPUT_SIZE,
  // HAND_LANDMARK_DETECTION_INPUT_SIZE, HAND_MESH_DETECTION_INPUT_SIZE)
  int texWidth_ = 512;
  int texHeight_ = 512;

  int flipY_ = 0;

  bool usePixelBuffer_ = false;
#ifdef JAVASCRIPT
  GLuint pixelBuffer_ = 0;
#endif
  FaceRoiShader *shaders_ = nullptr;

  std::unique_ptr<Gr8FeatureShader> gr8Shader_;
  void drawUpsampleTexture(GlTexture src, GlFramebufferObject *dest);

  std::unique_ptr<RayPointFilter2> centerFilter_;
  RayPointFilterConfig centerConfig_;
  std::unique_ptr<RayPointFilter1> lengthFilter_;
  RayPointFilterConfig lengthConfig_;

  void drawTexture(GlTexture cameraTexture);
  void drawStage(GlTexture src, GlFramebufferObject *dest, const GlProgramObject *shader);
};

}  // namespace c8
