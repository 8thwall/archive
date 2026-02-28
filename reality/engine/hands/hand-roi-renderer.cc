// Copyright (c) 2022 8th Wall, LLC
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "hand-roi-renderer.h",
  };
  deps = {
    "//c8:c8-log",
    "//c8:exceptions",
    "//c8:hpoint",
    "//c8:parameter-data",
    "//c8:string",
    "//c8:vector",
    "//c8/geometry:pixel-pinhole-camera-model",
    "//c8/pixels/opengl:gl-error",
    "//c8/pixels/opengl:gl-headers",
    "//c8/pixels/opengl:gl-quad",
    "//c8/pixels/opengl:gl-texture",
    "//c8/pixels/opengl:gl-framebuffer",
    "//c8/pixels/opengl:gl-program",
    "//c8/pixels:pixels",
    "//c8/pixels:pixel-buffer",
    "//c8/stats:scope-timer",
    "//reality/engine/faces:face-geometry",
    "//reality/engine/faces:face-roi-shader",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/hands:hand-types",
    "//reality/engine/geometry:image-warp",
    "//reality/engine/render:renderers",
    "//reality/engine/tracking:ray-point-filter",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0xf7baba5f);

#include "c8/c8-log.h"
#include "c8/exceptions.h"
#include "c8/parameter-data.h"
#include "c8/pixels/opengl/client-gl.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/pixels/opengl/gl-version.h"
#include "c8/stats/scope-timer.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/engine/faces/face-geometry.h"
#include "reality/engine/geometry/image-warp.h"
#include "reality/engine/hands/hand-roi-renderer.h"
#include "reality/engine/hands/hand-types.h"

#if C8_OPENGL_VERSION_2
#include "c8/pixels/opengl/glext.h"
#endif

#if JAVASCRIPT
#include <emscripten.h>
#endif

namespace c8 {

namespace {

struct Settings {
  bool useUpsampleTex;
  bool smoothBBoxLength;
  float bboxLengthMinAlpha;
  float bboxLengthUpdate90V;
  float bboxLengthVAlpha;
  bool smoothBBoxCenter;
  float bboxCenterMinAlpha;
  float bboxCenterUpdate90V;
  float bboxCenterVAlpha;
};

const Settings &settings() {
  static int paramsVersion_ = -1;
  static Settings settings_;
  if (globalParams().version() == paramsVersion_) {
    return settings_;
  }
  settings_ = {
    globalParams().getOrSet("HandRoiRenderer.useUpsampleTex", true),
    globalParams().getOrSet("HandRoiRenderer.smoothBBoxLength", true),
    globalParams().getOrSet("HandRoiRenderer.bboxLengthMinAlpha", 0.00001f),
    globalParams().getOrSet("HandRoiRenderer.bboxLengthUpdate90V", 0.96f),
    globalParams().getOrSet("HandRoiRenderer.bboxLengthVAlpha", 0.07f),
    globalParams().getOrSet("HandRoiRenderer.smoothBBoxCenter", true),
    globalParams().getOrSet("HandRoiRenderer.bboxCenterMinAlpha", 0.00001f),
    globalParams().getOrSet("HandRoiRenderer.bboxCenterUpdate90V", 0.5f),
    globalParams().getOrSet("HandRoiRenderer.bboxCenterVAlpha", 0.07f),
  };
  paramsVersion_ = globalParams().version();
  return settings_;
}

#if C8_OPENGL_VERSION_2
static auto glGenVertexArrays =
  (PFNGLGENVERTEXARRAYSOESPROC)clientGlGetProcAddress("glGenVertexArraysOES");
static auto glDeleteVertexArrays =
  (PFNGLDELETEVERTEXARRAYSOESPROC)clientGlGetProcAddress("glDeleteVertexArraysOES");
static auto glBindVertexArray =
  (PFNGLBINDVERTEXARRAYOESPROC)clientGlGetProcAddress("glBindVertexArrayOES");
static auto GL_VERTEX_ARRAY_BINDING = GL_VERTEX_ARRAY_BINDING_OES;
#endif

ImageViewport viewportForFullImage(int videoWidth, int videoHeight, int roiWidth) {
  // Construct a viewport which is a sub-region of the 192x192 letterbox geometry that
  // hand detection wants, or 224x224 letterbox geometry that hand landmark detection wants.
  // This 192x192 or 224x224 region is in the upper right of the destination texture.
  int targetWidth = videoWidth * roiWidth / videoHeight;
  int targetHeight = roiWidth;
  if (targetWidth > roiWidth) {
    targetWidth = roiWidth;
    targetHeight = videoHeight * roiWidth / videoWidth;
  }

  // For example, if videoHeight is 960, and videoWidth is 720, then
  // {
  //   offsetX: 24,
  //   offsetY: 0,
  //   width: 144,
  //   hieght: 192,
  // }
  int halfRoiWidth = roiWidth / 2;

  return {
    static_cast<float>(halfRoiWidth - targetWidth / 2),
    static_cast<float>(halfRoiWidth - targetHeight / 2),
    static_cast<float>(targetWidth),
    static_cast<float>(targetHeight),
  };
}

ImageViewport viewportForCrop(int i, int roiSize) {
  // Select out a HAND_ROI_SUBIMAGE_SIZE * HAND_ROI_SUBIMAGE_SIZE sub-region of the destination
  // texture.
  float offsetX = 0;
  float offsetY = 0;

  // ROI 0 gets drawn to the upper right with offset (HAND_ROI_SUBIMAGE_SIZE, 0)
  if (i == 0) {
    offsetX = HAND_ROI_SUBIMAGE_SIZE;
  }

  // ROI 1 gets drawn to the lower left with offset (0, HAND_ROI_SUBIMAGE_SIZE)
  if (i == 1) {
    offsetY = HAND_ROI_SUBIMAGE_SIZE;
  }

  // ROI 2 gets drawn to the lower right
  // with offset (HAND_ROI_SUBIMAGE_SIZE, HAND_ROI_SUBIMAGE_SIZE)
  if (i == 2) {
    offsetX = HAND_ROI_SUBIMAGE_SIZE;
    offsetY = HAND_ROI_SUBIMAGE_SIZE;
  }

  // i == 3 and greater go where the letterbox crop normally goes, at (0, 0)

  // All ROIs get drawn with width/heigh 192, 192.
  return {
    offsetX,
    offsetY,
    static_cast<float>(roiSize),
    static_cast<float>(roiSize),
  };
}

// find out the center and the radius of the hand and see if the majority of the hand is visible.
bool isFullHandInImageSpace(const DetectedPoints &detection) {
  // bounding area in image space for full hand testing
  float xLo = -0.35f;
  float xHi = 1.35f;
  float yLo = -0.35f;
  float yHi = 1.35f;

  BoundingBox bbox = detectionBoundingBoxToImageSpace(detection.boundingBox, detection.roi);

  HPoint2 center = bbox.center();
  float radius = 0.5f * std::max(bbox.width(), bbox.height());

  // global hand detection
  if (detection.points.size() == HAND_DETECTION_MARKS) {
    Vector<HPoint3> pts = {
      {detection.points[HANDDETECTION_MIDDLE_MCP].x(),
       detection.points[HANDDETECTION_MIDDLE_MCP].y(),
       1.0f},
    };
    auto tpts = truncate<2>(renderTexToImageTex(detection.roi) * pts);
    center = tpts[0];

    // detection only covers palm, so use the portion of the edge length as the radius
    radius *= 1.46f;
  }

  // test if the hand detection is in bound
  const bool isFullHand = (center.x() - radius > xLo) && (center.x() + radius < xHi)
    && (center.y() - radius > yLo) && (center.y() + radius < yHi);

  return isFullHand;
}

}  // namespace

DetectionRoi HandRoiRenderer::handDetectionRoi(const DetectedPoints &detection, bool doUpright) {
  const BoundingBox imgBbox =
    detectionBoundingBoxToImageSpace(detection.boundingBox, detection.roi);

  const BoundingBox extBBox =
    detectionBoundingBoxToImageSpace(detection.extendedBoundingBox, detection.roi);

  // move bounding box to the center of the clip space
  float cx = .25f
    * (imgBbox.lowerLeft.x() + imgBbox.lowerRight.x() + imgBbox.upperLeft.x()
       + imgBbox.upperRight.x());
  float cy = .25f
    * (imgBbox.lowerLeft.y() + imgBbox.lowerRight.y() + imgBbox.upperLeft.y()
       + imgBbox.upperRight.y());
  cx = (cx - 0.5f) * 2.0f;
  cy = (cy - 0.5f) * 2.0f;

  HPoint2 centerPoint = {cx, cy};

  if (settings().smoothBBoxCenter) {
    centerConfig_ = createRayPointFilterConfig(
      settings().bboxCenterMinAlpha, settings().bboxCenterUpdate90V, settings().bboxCenterVAlpha);
    if (!centerFilter_) {
      centerFilter_ = std::make_unique<RayPointFilter2>(centerPoint, centerConfig_);
    } else {
      centerPoint = centerFilter_->filter(centerPoint);
    }
  }

  auto center = HMatrixGen::translation(-centerPoint.x(), -centerPoint.y(), 0);

  // restore aspect ratio
  auto dimMax = std::max(detection.intrinsics.pixelsWidth, detection.intrinsics.pixelsHeight);
  auto dimMaxF = static_cast<float>(dimMax);
  auto xScale = static_cast<float>(detection.intrinsics.pixelsWidth) / dimMaxF;
  auto yScale = static_cast<float>(detection.intrinsics.pixelsHeight) / dimMaxF;

  auto xyScale = HMatrixGen::scale(xScale, yScale, 1.0f);

  // compute image space rotation
  HPoint2 lowerLeft = {imgBbox.lowerLeft.x() * xScale, imgBbox.lowerLeft.y()};
  HPoint2 upperLeft = {imgBbox.upperLeft.x() * xScale, imgBbox.upperLeft.y()};
  HPoint2 upperRight = {imgBbox.upperRight.x() * xScale, imgBbox.upperRight.y()};
  float dy = lowerLeft.y() - upperLeft.y();
  float dx = lowerLeft.x() - upperLeft.x();

  // make hand upright
  auto rotate = HMatrixGen::i();
  if (doUpright) {
    auto zRotRad = std::atan2(dy, dx);
    rotate = HMatrixGen::zRadians(M_PI_2 - zRotRad);
  }

  // If the detection has extended bounding box, simply fill the extended bounding box to the ROI.
  // Otherwise, compute the scale using bounding box.
  HMatrix scale = HMatrixGen::i();
  if (extBBox.width() > 0 && extBBox.height() > 0) {
    float scX = 1.0f / extBBox.width();
    float scY = 1.0f / extBBox.height();
    float sc = std::max(scX, scY);

    if (settings().smoothBBoxLength) {
      lengthConfig_ = createRayPointFilterConfig(
        settings().bboxLengthMinAlpha, settings().bboxLengthUpdate90V, settings().bboxLengthVAlpha);
      if (!lengthFilter_) {
        lengthFilter_ = std::make_unique<RayPointFilter1>(sc, lengthConfig_);
      } else {
        sc = lengthFilter_->filter(sc);
      }
    }

    scale = HMatrixGen::scale(sc, sc, 1.0f);
  } else {
    // pixel space scale by stretching the bounding box to fill the rect
    float xSize = sqrt(dx * dx + dy * dy);
    float yDx = upperRight.x() - upperLeft.x();
    float yDy = upperRight.y() - upperLeft.y();
    float ySize = sqrt(yDx * yDx + yDy * yDy);
    // add margin to current bounding box
    constexpr float paddingFactor = 1.5f;
    xSize *= paddingFactor;
    ySize *= paddingFactor;
    float bgSize = std::max(xSize, ySize);

    auto sizeScale = std::max(1.0f, 1.0f / bgSize);
    sizeScale = std::min(sizeScale, 3.0f);
    // sometime big frame-by-frame scaling factor changes can put the detection in an oscillation
    // state.
    // limiting the frame-by-frame scaling factor changes to make the detection more stable.
    static float lastScale = 1.0f;
    if (detection.points.size() <= HAND_DETECTION_MARKS) {
    } else if (sizeScale / lastScale > 1.6f) {
      sizeScale = lastScale;
    }
    lastScale = sizeScale;

    scale = HMatrixGen::scale(sizeScale, sizeScale, 1.0f);
  }

  DetectionRoi roi = {
    ImageRoi::Source::HAND,
    0,
    "",
    scale * rotate * xyScale * center,
  };

  return roi;
}

void HandRoiRenderer::initialize(
  FaceRoiShader *shader, int srcWidth, int srcHeight, int localRoiSize) {
  C8Log("[hand-roi-renderer] initialize(%p, %d, %d)", shader, srcWidth, srcHeight);
  inputWidth_ = srcWidth;
  inputHeight_ = srcHeight;

  roiWidth_ = HAND_DETECTION_INPUT_SIZE;

  localRoiSize_ = localRoiSize;

  outputWidth_ = HAND_ROI_SUBIMAGE_SIZE + localRoiSize_;
  outputHeight_ = HAND_ROI_SUBIMAGE_SIZE + localRoiSize_;

  // Clear previous memory before allocating a new image.
  outpix_ = RGBA8888PlanePixelBuffer(0, 0);
  outpix_ = RGBA8888PlanePixelBuffer(outputHeight_, outputWidth_);
  quad_ = makeVertexArrayRect();
  dest1_ = makeNearestRGBA8888Framebuffer(texWidth_, texHeight_);

  gr8Shader_.reset(new Gr8FeatureShader());
  gr8Shader_->initialize();

  upsampleWidth_ = srcWidth * 3 / 2;
  upsampleHeight_ = srcHeight * 3 / 2;
  upsampleFbo_ = makeLinearRGBA8888Framebuffer(upsampleWidth_, upsampleHeight_);

  // Manage gr8shader init/cleanup externally.
  shaders_ = shader;
}

void HandRoiRenderer::enableWebGl2PixelBuffer() {
#ifdef JAVASCRIPT
  usePixelBuffer_ = true;
  glGenBuffers(1, &pixelBuffer_);
  EM_ASM_(
    {
      Module.ctx.bindBuffer(Module.ctx.PIXEL_PACK_BUFFER, GL.buffers[$0]);
      bufferInit = new Uint8Array($1);
      Module.ctx.bufferData(Module.ctx.PIXEL_PACK_BUFFER, bufferInit, Module.ctx.DYNAMIC_READ, 0);
      Module.ctx.bindBuffer(Module.ctx.PIXEL_PACK_BUFFER, null);
    },
    pixelBuffer_,
    outputWidth_ * outputHeight_ * 4);
#else
  C8_THROW("Using pixel buffer outside of JavaScript not implemented");
#endif
}

// Configure the renderer to add ROIs for the detected hands on its next draw pass.
void HandRoiRenderer::setDetectedHands(const Vector<DetectedPoints> &hands) {
  if (hands.empty()) {
    centerFilter_.reset();
    lengthFilter_.reset();
    return;
  }

  nextHandRois_.clear();

  for (const auto &hand : hands) {
    if (requireFullHand_ && !isFullHandInImageSpace(hand)) {
      continue;
    }

    nextHandRois_.push_back(handDetectionRoi(hand, requireHandUpright_));

    // Preserve the ROI id.
    nextHandRois_.back().faceId = hand.roi.faceId;
  }
}

void HandRoiRenderer::drawUpsampleTexture(GlTexture src, GlFramebufferObject *dest) {
  const GlProgramObject *shader = gr8Shader_->shaderInput();
  src.bind();

  gr8Shader_->bindAndSetParams(shader);

  dest->bind();
  checkGLError("[hand-roi-renderer] bind framebuffer");

  // Load vertex data
  quad_.bind();
  glFrontFace(GL_CCW);
  checkGLError("[hand-roi-renderer] bind quad");

  glUniform2f(shader->location("scale"), 1.0 / inputWidth_, 1.0 / inputHeight_);

  // Draw the filtered input.
  glViewport(0, 0, upsampleWidth_, upsampleHeight_);
  quad_.drawElements();
  checkGLError("[hand-roi-renderer] draw elements (input filter)");

  quad_.unbind();
  checkGLError("[hand-roi-renderer] quadToDraw unbind");
}

void HandRoiRenderer::drawStage(
  GlTexture src, GlFramebufferObject *dest, const GlProgramObject *shader) {
  src.bind();

  shaders_->bind(shader);

  dest->bind();
  checkGLError("[hand-roi-renderer] bind framebuffer");

  glViewport(0, 0, texWidth_, texHeight_);
  glClearColor(0, 0, 0, 1);
  glClear(GL_COLOR_BUFFER_BIT);
  GlVertexArray &quadToDraw = quad_;

  // Load vertex data
  quadToDraw.bind();
  glFrontFace(GL_CCW);
  checkGLError("[hand-roi-renderer] bind quad");

  // Set shader warp back to identity.

  // Always draw the main image.
  HMatrix imat = HMatrixGen::i();
  glUniformMatrix4fv(shader->location("mvp"), 1, GL_FALSE, imat.data().data());
  glUniform1i(shader->location("flipY"), flipY_);
  glUniform1i(shader->location("rotation"), 0);
  auto v = viewportForFullImage(inputWidth_, inputHeight_, roiWidth_);
  glViewport(v.x, v.y, v.w, v.h);
  quadToDraw.drawElements();
  checkGLError("[hand-roi-renderer] draw elements (full)");

  for (int i = 0; i < nextHandRois_.size(); ++i) {
    const auto *mvp = nextHandRois_[i].warp.data().begin();
    glUniformMatrix4fv(shader->location("mvp"), 1, GL_FALSE, mvp);
    glUniform1i(shader->location("rotation"), 0);
    auto v = viewportForCrop(i, localRoiSize_);
    glViewport(v.x, v.y, v.w, v.h);
    quadToDraw.drawElements();
    checkGLError("[hand-roi-renderer] draw elements (full)");
  }

  quadToDraw.unbind();
  checkGLError("[hand-roi-renderer] quadToDraw unbind");
}

void HandRoiRenderer::readPixels() {
  if (!needsRead_) {
    return;
  }
  ScopeTimer t("hand-renderer-read-pixels");

  needsRead_ = false;

#ifdef JAVASCRIPT
  if (usePixelBuffer_) {
    EM_ASM_({
      if (Module.ctx.fenceSync && Module.ctx.__glSync_) {
        // NOTE(christoph): This was causing a lag too frequently so we will continue depending on
        // Chrome to guard the getBufferSubData itself.
        // Sometimes chrome seems to spin forever here, so add a 300ms timeout as a safety valve.
        // Module.ctx.__then_ = Date.now() + 300;

        // Spin and wait on the fence to prevent chrome from printing a warning to the console
        // 'READ-usage buffer was read back without waiting on a fence.'
        // while (Module.ctx.clientWaitSync(Module.ctx.__glSync_, 0, 0) ==
        // Module.ctx.TIMEOUT_EXPIRED
        //    && Date.now() < Module.ctx.__then_) {
        //   // continue
        // }

        Module.ctx.clientWaitSync(Module.ctx.__glSync_, 0, 0);
        Module.ctx.deleteSync(Module.ctx.__glSync_);
        Module.ctx.__glSync_ = undefined;
        // Module.ctx.__then_ = undefined;
      }
    });
  }
#endif

  // Copy data to byte array
  glActiveTexture(GL_TEXTURE0);
  dest1_.bind();
  dest1_.tex().bind();

  auto o = outpix_.pixels();

  if (usePixelBuffer_) {
#ifdef JAVASCRIPT
    EM_ASM_(
      {
        Module.ctx.bindBuffer(Module.ctx.PIXEL_PACK_BUFFER, GL.buffers[$2]);
        Module.ctx.getBufferSubData(Module.ctx.PIXEL_PACK_BUFFER, 0, HEAPU8.subarray($0, $0 + $1));
        Module.ctx.bindBuffer(Module.ctx.PIXEL_PACK_BUFFER, null);
      },
      o.pixels(),
      o.rows() * o.rowBytes(),
      pixelBuffer_);
#else
    C8_THROW("Using pixel buffer outside of JavaScript not implemented");
#endif
  } else {
    glReadPixels(0, 0, o.cols(), o.rows(), GL_RGBA, GL_UNSIGNED_BYTE, o.pixels());
  }

  checkGLError("[hand-roi-renderer] read pixels");
  hasRender_ = true;
  handRois_ = drawnHandRois_;
  tex_ = drawnTex_;
  drawnHandRois_.clear();
  drawnTex_ = 0;
}

void HandRoiRenderer::drawTexture(GlTexture cameraTexture) {
  ScopeTimer t("hand-renderer-draw-tex");

  if (settings().useUpsampleTex) {
    drawUpsampleTexture(cameraTexture, &upsampleFbo_);
    drawStage(upsampleFbo_.tex().tex(), &dest1_, shaders_->shader1());
  } else {
    drawStage(cameraTexture, &dest1_, shaders_->shader1());
  }

  // Copy data to byte array
  if (usePixelBuffer_) {
#ifdef JAVASCRIPT
    dest1_.bind();
    glActiveTexture(GL_TEXTURE0);
    dest1_.tex().bind();

    EM_ASM_(
      {
        Module.ctx.bindBuffer(Module.ctx.PIXEL_PACK_BUFFER, GL.buffers[$0]);
        Module.ctx.readPixels(0, 0, $1, $2, Module.ctx.RGBA, Module.ctx.UNSIGNED_BYTE, 0);
        Module.ctx.bindBuffer(Module.ctx.PIXEL_PACK_BUFFER, null);
      },
      pixelBuffer_,
      outputWidth_,
      outputHeight_);
#else
    C8_THROW("Using pixel buffer outside of JavaScript not implemented");
#endif
  }

#ifdef JAVASCRIPT
  if (usePixelBuffer_) {
    EM_ASM_({
      if (Module.ctx.fenceSync) {
        Module.ctx.__glSync_ = Module.ctx.fenceSync(Module.ctx.SYNC_GPU_COMMANDS_COMPLETE, 0);
      }
    });
  }
#endif

  glFlush();

  needsRead_ = true;
  drawnHandRois_ = nextHandRois_;
  drawnTex_ = cameraTexture.texture;
  nextHandRois_.clear();
}

HandRenderResult HandRoiRenderer::result() const {
  auto fvp = viewportForFullImage(inputWidth_, inputHeight_, roiWidth_);
  auto op = outpix_.pixels();

  HandRenderResult r{
    tex_,  // srcTex
    op,    // rawPixels,
    {fvp,
     imageForViewport(op, fvp),
     {ImageRoi::Source::HAND, 0, "", HMatrixGen::i()}},  // handDetectImage
    {},                                                  // handMeshImages
  };

  for (int i = 0; i < handRois_.size(); ++i) {
    auto vp = viewportForCrop(i, localRoiSize_);
    r.handMeshImages.push_back({vp, imageForViewport(op, vp), handRois_[i]});
  }

  return r;
}

void HandRoiRenderer::draw(GLuint cameraTexture, GpuReadPixelsOptions options) {
  GLint restoreActiveTexture = 0;
  GLint restoreTexture = 0;
  GLint restoreProgram = 0;
  GLint restoreElementBuffer = 0;
  GLint restoreVertexArray = 0;
  GLint restoreArrayBuffer = 0;
  GLint restoreFrameBuffer = 0;
  GLint restoreViewport[4];
  GLfloat restoreClearColor[4];

  if (isRestoreStateGpuReadPixels(options)) {
    ScopeTimer t("set-restore-bindings-gl");
    glGetIntegerv(GL_VIEWPORT, restoreViewport);
    glGetFloatv(GL_COLOR_CLEAR_VALUE, restoreClearColor);
    glGetIntegerv(GL_FRAMEBUFFER_BINDING, &restoreFrameBuffer);
    glGetIntegerv(GL_CURRENT_PROGRAM, &restoreProgram);
    glGetIntegerv(GL_ELEMENT_ARRAY_BUFFER_BINDING, &restoreElementBuffer);
    glGetIntegerv(GL_VERTEX_ARRAY_BINDING, &restoreVertexArray);
    glGetIntegerv(GL_ARRAY_BUFFER_BINDING, &restoreArrayBuffer);
    glGetIntegerv(GL_ACTIVE_TEXTURE, &restoreActiveTexture);
    glGetIntegerv(GL_TEXTURE_BINDING_2D, &restoreTexture);
    checkGLError("[hand-roi-renderer] cache gl state");
  }

  auto ct = wrapRGBA8888Texture(cameraTexture, inputWidth_, inputHeight_);

  if (isDeferredGpuReadPixels(options)) {
    readPixels();
    drawTexture(ct);
  } else {
    drawTexture(ct);
    readPixels();
  }

  if (isRestoreStateGpuReadPixels(options)) {
    ScopeTimer t("restore-bindings");
    glActiveTexture(restoreActiveTexture);
    glBindBuffer(GL_ARRAY_BUFFER, restoreArrayBuffer);
    glBindFramebuffer(GL_FRAMEBUFFER, restoreFrameBuffer);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, restoreElementBuffer);
    glBindVertexArray(restoreVertexArray);
    glUseProgram(restoreProgram);
    glBindTexture(GL_TEXTURE_2D, restoreTexture);
    glViewport(restoreViewport[0], restoreViewport[1], restoreViewport[2], restoreViewport[3]);
    glClearColor(
      restoreClearColor[0], restoreClearColor[1], restoreClearColor[2], restoreClearColor[3]);
    checkGLError("[hand-roi-renderer] restore bindings");
  }
}

}  // namespace c8
