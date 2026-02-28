// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "reality/app/xr/ios/xr-ios.h"

#import <ARKit/ARKit.h>
#import <AVFoundation/AVFoundation.h>
#import <CoreImage/CoreImage.h>
#import <CoreVideo/CoreVideo.h>
#import <Metal/Metal.h>
#import <UIKit/UIKit.h>
#import <mutex>
#import <vector>

#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/exceptions.h"
#include "c8/io/capnp-messages.h"
#include "c8/pixels/opengl/gl.h"
#include "c8/pixels/opengl/glext.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/protolog/xr-extern.h"
#include "c8/protolog/xr-requests.h"
#include "c8/stats/api/detail.capnp.h"
#include "c8/stats/scope-timer.h"
#include "c8/stats/self-timing-scope-lock.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/app/analytics/ios/xr-analytics-log-header-factory.h"
#include "reality/app/analytics/ios/xr-analytics-upload-controller.h"
#include "reality/app/app/ios-app.h"
#include "reality/app/device/ios-device-info.h"
#include "reality/app/validation/ios/xr-validation-controller.h"
#include "reality/app/xr/ios/xr-ios-arkit.h"
#include "reality/app/xr/ios/xr-ios-c8.h"
#include "reality/app/xr/ios/xr-ios-interface.h"
#include "reality/app/xr/ios/xr-ios-remote-only.h"
#include "reality/engine/logging/xr-log-preparer.h"

using namespace c8;

using MutableLogRecordHeader = MutableRootMessage<LogRecordHeader>;
using MutableRealityRequest = MutableRootMessage<RealityRequest>;
using MutableRealityResponse = MutableRootMessage<RealityResponse>;
using MutableXrRemoteApp = MutableRootMessage<XrRemoteApp>;
using MutableXrServerList = MutableRootMessage<XrServerList>;
using MutableXRConfiguration = MutableRootMessage<XRConfiguration>;
using MutableXRAppEnvironment = MutableRootMessage<XRAppEnvironment>;
using ConstRealityResponse = ConstRootMessage<RealityResponse>;
using ConstXrServerList = ConstRootMessage<XrServerList>;
using ConstXRConfiguration = ConstRootMessage<XRConfiguration>;
using ConstXRAppEnvironment = ConstRootMessage<XRAppEnvironment>;
using ConstXrQueryResponse = ConstRootMessage<XrQueryResponse>;

namespace {

bool isArKitSupported() {
  if (@available(iOS 11.0, *)) {
    return [ARWorldTrackingConfiguration isSupported];
  }
  return false;
}

bool isMetalSupported() {
  id<MTLDevice> device = MTLCreateSystemDefaultDevice();
  return (device);
}

}  // namespace

namespace c8 {

// Creates and returns a singleton instance of XRIos.
// Returns the singleton on subsequent calls.
XRIos *XRIos::createInstance(
  int renderingSystem, void *session, void *sessionConfig, void *sessionDelegate) {
  C8Log("[xr-ios] %s", "create");
  if (xRIos_ != nullptr) {
    return xRIos_;
  }

  xRIos_ = new XRIos(renderingSystem, session, sessionConfig, sessionDelegate);
  return xRIos_;
}

// Returns a reference to a previously created instance of XRIos. Results in an error if
// called before an instance is created.
XRIos *XRIos::getInstance() {
  if (xRIos_ == nullptr) {
    C8_THROW("[xr-ios] Attempting to get engine instance before it's created.");
  }
  return xRIos_;
}

// Destroys the instance of XRIos, if it exists.
void XRIos::destroyInstance() {
  C8Log("[xr-ios] %s", "destroy");
  if (xRIos_ != nullptr) {
    delete xRIos_;
    xRIos_ = nullptr;
  }
}

void XRIos::configure(XRConfiguration::Reader config) {
  ScopeTimer rt("ios-reality-engine-configure");

  if (config.hasEngineConfiguration()) {
    applyEngineConfig(config.getEngineConfiguration());
    return;
  }

  // Whitelist and merge in fields that will get passed to the engine now and whenever it's rebuilt.
  if (config.hasCoordinateConfiguration()) {
    MutableRootMessage<XRConfiguration> configMessageBuilder;
    configMessageBuilder.builder().setCoordinateConfiguration(config.getCoordinateConfiguration());
    configForEngine_ = ConstRootMessage<XRConfiguration>(configMessageBuilder);
    engine_->configure(configForEngine_.reader());
  }

  snprintf(this->mobileAppKey, 100, "%s", config.getMobileAppKey().cStr());
  // Mutable copy to add the app key and disown the detection images.
  MutableXRConfiguration c(config);
  auto cBuilder = c.builder();
  cBuilder.setMobileAppKey(this->mobileAppKey);
  driver_->configure(c.reader());

  // Disown the detection images to avoid saving a copy.
  cBuilder.disownImageDetection();
  if (cBuilder.hasMask()) {
    this->xrConfig_ = ConstXRConfiguration(c);
  }
}

void XRIos::applyEngineConfig(XREngineConfiguration::Reader config) {
  bool needsResume = running_;

  // Initialize driver calls pause() first if needed.
  initializeDriver(config.getMode());

  if (needsResume) {
    resume();
  }
}

void *XRIos::getCustomARSession() { return this->customARSession_; }

void *XRIos::getCustomARSessionConfig() { return this->customARSessionConfig_; }

void *XRIos::getCustomARSessionDelegate() { return this->customARSessionDelegate_; }

void XRIos::setManagedCameraRGBATexture(
  void *texHandle, int width, int height, int renderingSystem) {
  if (renderingSystem == RENDERING_SYSTEM_METAL) {
    C8Log("[xr-ios] setManagedCameraRGBATexture doesn't support Metal texture.");
    return;
  }

  std::lock_guard<std::mutex> lock(displayFrameLock_);
  displayNeeded_ = true;
  if (
    displayCopyRGBA_ == nullptr || displayCopyRGBA_->pixels().cols() != width
    || displayCopyRGBA_->pixels().rows() != height) {
    displayCopyRGBA_.reset(new RGBA8888PlanePixelBuffer(height, width));
    std::memset(
      displayCopyRGBA_->pixels().pixels(),
      0,
      displayCopyRGBA_->pixels().rowBytes() * displayCopyRGBA_->pixels().rows());
  }

  useMetalTextures_ = false;

  oglRGBATexture_ = reinterpret_cast<size_t>(texHandle);
  // Disable mipmaping on the bound texture.
  GLuint boundTexture = 0;
  glGetIntegerv(GL_TEXTURE_BINDING_2D, (GLint *)&boundTexture);
  glBindTexture(GL_TEXTURE_2D, (GLuint)oglRGBATexture_);
  // GL_GENERATE_MIPMAP is not defined on ios
  glHint(GL_GENERATE_MIPMAP_HINT, GL_FASTEST);
  glBindTexture(GL_TEXTURE_2D, boundTexture);
}

void XRIos::setManagedCameraYTexture(void *texHandle, int width, int height, int renderingSystem) {
  std::lock_guard<std::mutex> lock(displayFrameLock_);
  displayNeeded_ = true;
  if (
    displayCopyY_ == nullptr || displayCopyY_->pixels().cols() != width
    || displayCopyY_->pixels().rows() != height) {
    displayCopyY_.reset(new YPlanePixelBuffer(height, width));
    std::memset(
      displayCopyY_->pixels().pixels(),
      0,
      displayCopyY_->pixels().rowBytes() * displayCopyY_->pixels().rows());
  }

  useMetalTextures_ = renderingSystem == RENDERING_SYSTEM_METAL;
  if (useMetalTextures_) {
    this->mtlYTexture_ = (__bridge id<MTLTexture>)texHandle;
  } else {
    this->oglYTexture_ = reinterpret_cast<size_t>(texHandle);
    // Disable mipmaping on the bound texture.
    GLuint boundTexture = 0;
    glGetIntegerv(GL_TEXTURE_BINDING_2D, (GLint *)&boundTexture);
    glBindTexture(GL_TEXTURE_2D, (GLuint)this->oglYTexture_);
    // GL_GENERATE_MIPMAP is not defined on ios
    glHint(GL_GENERATE_MIPMAP_HINT, GL_FASTEST);
    glBindTexture(GL_TEXTURE_2D, boundTexture);
  }
}

void XRIos::setManagedCameraUVTexture(void *texHandle, int width, int height, int renderingSystem) {
  std::lock_guard<std::mutex> lock(displayFrameLock_);
  displayNeeded_ = true;
  if (
    displayCopyUV_ == nullptr || displayCopyUV_->pixels().cols() != width
    || displayCopyUV_->pixels().rows() != height) {
    displayCopyUV_.reset(new UVPlanePixelBuffer(height, width));
    std::memset(
      displayCopyUV_->pixels().pixels(),
      128,
      displayCopyUV_->pixels().rowBytes() * displayCopyUV_->pixels().rows());
  }

  useMetalTextures_ = renderingSystem == RENDERING_SYSTEM_METAL;
  if (useMetalTextures_) {
    this->mtlUVTexture_ = (__bridge id<MTLTexture>)texHandle;
  } else {
    this->oglUVTexture_ = reinterpret_cast<size_t>(texHandle);
    // Disable mipmaping on the bound texture.
    GLuint boundTexture = 0;
    glGetIntegerv(GL_TEXTURE_BINDING_2D, (GLint *)&boundTexture);
    glBindTexture(GL_TEXTURE_2D, (GLuint)this->oglUVTexture_);
    // GL_GENERATE_MIPMAP is not defined on ios
    glHint(GL_GENERATE_MIPMAP_HINT, GL_FASTEST);
    glBindTexture(GL_TEXTURE_2D, boundTexture);
  }
}

void XRIos::setManagedImageView(void *imageView) {
  displayNeeded_ = true;
  this->managedImageView_ = (__bridge UIImageView *)imageView;
  if (isArKitSupported()) {
    C8Log("[xr-ios] %s", "setting 90 degree rotation for arkit");
    this->managedImageView_.transform = CGAffineTransformMakeRotation(1.5707963267950003);

    CGRect bounds = this->managedImageView_.bounds;
    CGPoint center = this->managedImageView_.center;
    C8Log(
      "[xr-ios] requested bounds=%s center=%s",
      [NSStringFromCGRect(bounds) UTF8String],
      [NSStringFromCGPoint(center) UTF8String]);

    // TODO(scott) the rotation requires mixing of the bounding box for proper display
    this->managedImageView_.bounds =
      CGRectMake(0, 0, 50, bounds.size.width + (bounds.size.height / 2 - center.y) / 2);
    C8Log(
      "[xr-ios] setting bounds=%s center=%s",
      [NSStringFromCGRect(this->managedImageView_.bounds) UTF8String],
      [NSStringFromCGPoint(this->managedImageView_.center) UTF8String]);
  }
}

void XRIos::recenter() { needsEngineReset_ = true; }

void XRIos::resume() {
  C8Log("[xr-ios] %s", "resume");
  running_ = true;
  c8ValidationController_validateApplication(this->xrConfig_.reader().getMobileAppKey().cStr());
  if (realityPostprocessor_ != nullptr) {
    realityPostprocessor_->resume();
  }
  if (featureProvider_ != nullptr) {
    featureProvider_->resume();
  }
  driver_->resume();
  logPreparer_.startNewLoggingSession();
}

void XRIos::pause() {
  if (!running_) {
    // Act as a no-op when engine is already paused.
    return;
  }

  C8Log("[xr-ios] %s", "pause");
  if (driver_ != nullptr) {
    driver_->pause();
  }
  if (realityPostprocessor_ != nullptr) {
    realityPostprocessor_->pause();
  }
  if (featureProvider_ != nullptr) {
    featureProvider_->pause();
  }
  logPreparer_.endLoggingSession(ScopeTimer::summarizer());
  running_ = false;
  sendAnalyticsRecordToServer();
}

void XRIos::setFrameForDisplay(CVPixelBufferRef &pixelBuffer) {
  if (managedImageView_ != nullptr) {
    previousFrameImg_ = [UIImage imageWithCIImage:[CIImage imageWithCVPixelBuffer:pixelBuffer]];
  }

  ScopeTimer rt("ios-reality-engine-set-frame-for-display");

  {
    ScopeTimingScopeLock lock("lock-display-buffer", displayFrameLock_);

    int captureHeight = static_cast<int>(CVPixelBufferGetHeight(pixelBuffer));
    int captureWidth = static_cast<int>(CVPixelBufferGetWidth(pixelBuffer));
    int captureYStride = static_cast<int>(CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer, 0));
    uint8_t *captureY = static_cast<uint8_t *>(CVPixelBufferGetBaseAddressOfPlane(pixelBuffer, 0));
    int captureUVStride = static_cast<int>(CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer, 1));
    uint8_t *captureUV = static_cast<uint8_t *>(CVPixelBufferGetBaseAddressOfPlane(pixelBuffer, 1));

    ConstYPlanePixels captureYPixels(captureHeight, captureWidth, captureYStride, captureY);
    ConstUVPlanePixels captureUVPixels(
      (captureHeight + 1) / 2, (captureWidth + 1) / 2, captureUVStride, captureUV);

    int step = 1;
    while (captureHeight / step > 640 || captureWidth / step > 640) {
      ++step;
    }

    int processingHeight = captureHeight / step;
    int processingWidth = captureWidth / step;
    if (processingHeight < processingWidth) {
      std::swap(processingWidth, processingHeight);
    }

    int processingYStride = processingWidth == captureWidth ? captureYStride : processingWidth;
    int processingUVStride = processingWidth == captureWidth ? captureUVStride : processingWidth;

    // Reallocate buffer if needed.
    if (
      engineProcessingY_ == nullptr || engineProcessingUV_ == nullptr
      || engineProcessingY_->pixels().rowBytes() != processingYStride
      || engineProcessingY_->pixels().rows() != processingHeight
      || engineProcessingY_->pixels().cols() != processingWidth) {
      C8Log(
        "[xr-ios] Reallocating yuv buffers: processing %dx%d pix at %dx%d",
        captureHeight,
        captureWidth,
        processingHeight,
        processingWidth);
      ScopeTimer t("allocate-yuv-buffers");

      engineProcessingY_.reset(
        new YPlanePixelBuffer(processingHeight, processingWidth, processingYStride));
      engineProcessingUV_.reset(new UVPlanePixelBuffer(
        (processingHeight + 1) / 2, (processingWidth + 1) / 2, processingUVStride));

      if (processingWidth == captureWidth && processingHeight == captureHeight) {
        displayEngineProcessingPixels_ = true;

        captureCopyY_.reset(nullptr);
        captureCopyUV_.reset(nullptr);

        displayCopyY_.reset(
          new YPlanePixelBuffer(processingHeight, processingWidth, processingYStride));
        displayCopyUV_.reset(new UVPlanePixelBuffer(
          (processingHeight + 1) / 2, (processingWidth + 1) / 2, processingUVStride));
        displayCopyRGBA_.reset(new RGBA8888PlanePixelBuffer(processingHeight, processingWidth));
      } else {
        displayEngineProcessingPixels_ = false;

        captureCopyY_.reset(new YPlanePixelBuffer(captureHeight, captureWidth, captureYStride));
        captureCopyUV_.reset(
          new UVPlanePixelBuffer((captureHeight + 1) / 2, (captureWidth + 1) / 2, captureUVStride));

        displayCopyY_.reset(new YPlanePixelBuffer(captureHeight, captureWidth, captureYStride));
        displayCopyUV_.reset(
          new UVPlanePixelBuffer((captureHeight + 1) / 2, (captureWidth + 1) / 2, captureUVStride));
        displayCopyRGBA_.reset(new RGBA8888PlanePixelBuffer(captureHeight, captureWidth));
      }

      std::memset(
        displayCopyY_->pixels().pixels(),
        0,
        displayCopyY_->pixels().rowBytes() * displayCopyY_->pixels().rows());
      std::memset(
        displayCopyUV_->pixels().pixels(),
        128,
        displayCopyUV_->pixels().rowBytes() * displayCopyUV_->pixels().rows());
      std::memset(
        displayCopyRGBA_->pixels().pixels(),
        0,
        displayCopyRGBA_->pixels().rowBytes() * displayCopyRGBA_->pixels().rows());
    }

    YPlanePixels processingYPixels = engineProcessingY_->pixels();
    UVPlanePixels processingUVPixels = engineProcessingUV_->pixels();

    // Copy the pixels.
    if (displayEngineProcessingPixels_) {
      ScopeTimer t("copy-yuv-buffers");
      copyPixels(captureYPixels, &processingYPixels);
      copyPixels(captureUVPixels, &processingUVPixels);
    } else {
      YPlanePixels captureCopyYPixels = captureCopyY_->pixels();
      UVPlanePixels captureCopyUVPixels = captureCopyUV_->pixels();
      ScopeTimer t("rotate-yuv-buffers");
      downsizeAndRotate90Clockwise(captureYPixels, &processingYPixels);
      downsizeAndRotate90Clockwise(captureUVPixels, &processingUVPixels);
      copyPixels(captureYPixels, &captureCopyYPixels);
      copyPixels(captureUVPixels, &captureCopyUVPixels);
    }
  }
}

void XRIos::setDepthFrameForDisplay(CVPixelBufferRef &depthPixelBuffer) {
  if (managedImageView_ != nullptr) {
    previousDepthFrameImg_ =
      [UIImage imageWithCIImage:[CIImage imageWithCVPixelBuffer:depthPixelBuffer]];
  }

  int captureHeight = static_cast<int>(CVPixelBufferGetHeight(depthPixelBuffer));
  int captureWidth = static_cast<int>(CVPixelBufferGetWidth(depthPixelBuffer));
  float *captureAddress =
    static_cast<float *>(CVPixelBufferGetBaseAddressOfPlane(depthPixelBuffer, 0));

  int processingHeight = captureHeight;
  int processingWidth = captureWidth;
  if (processingHeight < processingWidth) {
    std::swap(processingWidth, processingHeight);
  }
  bool needsRotation = (processingHeight != captureHeight) || (processingWidth != captureWidth);

  ScopeTimer rt("ios-reality-engine-set-depth-frame-for-display");
  {
    ConstDepthFloatPixels captureDepthPixels(
      captureHeight, captureWidth, captureWidth, captureAddress);

    // Reallocate buffers if necessary.
    if (
      engineProcessingDepth_ == nullptr
      || engineProcessingDepth_->pixels().rows() != processingHeight
      || engineProcessingDepth_->pixels().cols() != processingWidth) {
      C8Log(
        "[xr-ios] Reallocating depth buffers: processing %dx%d pix at %dx%d",
        captureHeight,
        captureWidth,
        processingHeight,
        processingWidth);
      engineProcessingDepth_.reset(new DepthFloatPixelBuffer(processingHeight, processingWidth));
    }

    // Copying the depth pixels, rotate if necessary.
    DepthFloatPixels processingDepthPixels = engineProcessingDepth_->pixels();
    if (!needsRotation) {
      ScopeTimer t("copy-depth-buffers");
      copyFloatPixels(captureDepthPixels, &processingDepthPixels);
    } else {
      ScopeTimer t("rotate-depth-buffers");
      rotateFloat90Clockwise(captureDepthPixels, &processingDepthPixels);
    }
  }
}

bool XRIos::hasDisplayManagedTextures() {
  // We have managed Metal textures.
  if ((mtlYTexture_ != nullptr) && (mtlUVTexture_ != nullptr)) {
    return true;
  }
  // We have managed OpenGL textures.
  if (((oglYTexture_ != 0) && (oglUVTexture_ != 0)) || (oglRGBATexture_ != 0)) {
    return true;
  }
  // We have no managed textures.
  return false;
}

void XRIos::renderFrameForDisplay() {
  if (hasDisplayManagedTextures()) {
    renderFrameForDisplayManagedTexture();
    return;
  }
  if (this->managedImageView_ != nullptr) {
    renderFrameForDisplayManagedView();
    return;
  }
}

void XRIos::renderDepthFrameForDisplay() {
  if (hasDisplayManagedTextures()) {
    renderFrameForDisplayManagedTexture();
    return;
  }
  if (this->managedImageView_ != nullptr) {
    renderDepthFrameForDisplayManagedView();
    return;
  }
}

void XRIos::renderFrameForDisplayManagedView() {
  if (this->previousFrameImg_ == nullptr) {
    return;
  }
  [this->managedImageView_ setImage:this->previousFrameImg_];
  [this->managedImageView_ setNeedsDisplay];
}

// If the depth map isn't being read, it'll show a blank.
void XRIos::renderDepthFrameForDisplayManagedView() {
  if (this->previousFrameImg_ == nullptr) {
    return;
  }
  [this->managedImageView_ setImage:this->previousDepthFrameImg_];
  [this->managedImageView_ setNeedsDisplay];
}

void XRIos::renderFrameForDisplayManagedTexture() {
  if (engineProcessingY_ == nullptr || engineProcessingUV_ == nullptr) {
    return;
  }

  ScopeTimer("ios-reality-engine-render-frame-for-display");
  {
    ScopeTimingScopeLock lock("lock-display-buffer", displayFrameLock_);

    if (useMetalTextures_) {
      ScopeTimer t("mtl-texture-replace-region");
      [this->mtlYTexture_ replaceRegion:MTLRegionMake3D(
                                          0 /* x */,
                                          0 /* y */,
                                          0 /* z */,
                                          displayCopyY_->pixels().cols() /* width */,
                                          displayCopyY_->pixels().rows() /* height */,
                                          1 /* depth */)
                            mipmapLevel:0
                              withBytes:displayCopyY_->pixels().pixels()
                            bytesPerRow:displayCopyY_->pixels().rowBytes()];
      [this->mtlUVTexture_ replaceRegion:MTLRegionMake3D(
                                           0 /* x */,
                                           0 /* y */,
                                           0 /* z */,
                                           displayCopyUV_->pixels().cols() /* width */,
                                           displayCopyUV_->pixels().rows() /* height */,
                                           1 /* depth */)
                             mipmapLevel:0
                               withBytes:displayCopyUV_->pixels().pixels()
                             bytesPerRow:displayCopyUV_->pixels().rowBytes()];
    } else {
      ScopeTimer oglTimer("write-to-opengl-texture");

      GLuint boundTexture = 0;
      {
        ScopeTimer t("opengl-get-curr-tex-binding");
        glGetIntegerv(GL_TEXTURE_BINDING_2D, (GLint *)&boundTexture);
      }

      if ((oglYTexture_ != 0) && (oglUVTexture_ != 0)) {
        {
          ScopeTimer t("opengl-set-tex-binding-y");
          glBindTexture(GL_TEXTURE_2D, (GLuint)this->oglYTexture_);
        }
        {
          ScopeTimer t("opengl-draw-sub-image-y");
          glTexSubImage2D(
            GL_TEXTURE_2D,                    // target
            0,                                // level
            0,                                // x-offset
            0,                                // y-offset
            displayCopyY_->pixels().cols(),   // width
            displayCopyY_->pixels().rows(),   // height
            GL_RED,                           // format
            GL_UNSIGNED_BYTE,                 // type
            displayCopyY_->pixels().pixels()  // data
          );
        }

        {
          ScopeTimer t("opengl-set-tex-binding-uv");
          glBindTexture(GL_TEXTURE_2D, (GLuint)this->oglUVTexture_);
        }
        {
          ScopeTimer t("opengl-draw-sub-image-uv");
          glTexSubImage2D(
            GL_TEXTURE_2D,                     // target
            0,                                 // level
            0,                                 // x-offset
            0,                                 // y-offset
            displayCopyUV_->pixels().cols(),   // width
            displayCopyUV_->pixels().rows(),   // height
            GL_RG,                             // format
            GL_UNSIGNED_BYTE,                  // type
            displayCopyUV_->pixels().pixels()  // data
          );
        }
      } else {  // oglRGBATexture_ != 0
        {
          ScopeTimer t("convert-yuv-to-rgba");
          auto displayCopyRGBAPixels = displayCopyRGBA_->pixels();
          yuvToRgb(displayCopyY_->pixels(), displayCopyUV_->pixels(), &displayCopyRGBAPixels);
        }

        {
          ScopeTimer t("opengl-set-tex-binding-rgba");
          glBindTexture(GL_TEXTURE_2D, (GLuint)this->oglRGBATexture_);
        }
        {
          ScopeTimer t("opengl-draw-sub-image-rgba");
          glTexSubImage2D(
            GL_TEXTURE_2D,                       // target
            0,                                   // level
            0,                                   // x-offset
            0,                                   // y-offset
            displayCopyRGBA_->pixels().cols(),   // width
            displayCopyRGBA_->pixels().rows(),   // height
            GL_RGBA,                             // format
            GL_UNSIGNED_BYTE,                    // type
            displayCopyRGBA_->pixels().pixels()  // data
          );
        }
      }

      {
        ScopeTimer t("opengl-restore-tex-binding");
        glBindTexture(GL_TEXTURE_2D, boundTexture);
      }
    }
  }
}

// Main method to execute a request.
int32_t XRIos::pushRealityForward(const RealityRequest::Reader &request) {
  ScopeTimer rt("ios-reality-engine-push-reality-forward");

  MutableRealityRequest realityRequestMessage(request);
  auto requestBuilder = realityRequestMessage.builder();

  MutableRealityResponse realityResponseMessage;
  auto responseBuilder = realityResponseMessage.builder();

  // Copy data to the request.
  {
    ScopeTimer t("construct-request");

    if (needsEngineReset_) {
      resetEngine();
    }

    if (
      xrConfig_.reader().getCameraConfiguration().getCaptureGeometry().getWidth()
      != requestBuilder.getXRConfiguration()
           .getCameraConfiguration()
           .getCaptureGeometry()
           .getWidth()) {
      auto width = requestBuilder.getXRConfiguration()
                     .getCameraConfiguration()
                     .getCaptureGeometry()
                     .getWidth();
      auto height = requestBuilder.getXRConfiguration()
                      .getCameraConfiguration()
                      .getCaptureGeometry()
                      .getHeight();
      MutableRootMessage<XRConfiguration> newConfig(xrConfig_.reader());
      newConfig.builder().getCameraConfiguration().getCaptureGeometry().setWidth(width);
      newConfig.builder().getCameraConfiguration().getCaptureGeometry().setHeight(height);
      xrConfig_ = ConstRootMessage<XRConfiguration>(newConfig);
    }

    requestBuilder.setXRConfiguration(xrConfig_.reader());

    if (engineProcessingY_ != nullptr) {
      RequestCamera::Builder cameraBuilder = requestBuilder.getSensors().getCamera();
      setCameraPixelPointers(
        engineProcessingY_->pixels(), engineProcessingUV_->pixels(), &cameraBuilder);
    }

    if (engineProcessingDepth_ != nullptr) {
      RequestARKit::Builder arkitBuilder = requestBuilder.getSensors().getARKit();
      setDepthMap(engineProcessingDepth_->pixels(), &arkitBuilder);
    }

    // Pose data is set by the driver.

    DeviceInfo::Builder infoBuilder = requestBuilder.getDeviceInfo();
    c8_exportDeviceInfo(infoBuilder);

    exportAppContext(requestBuilder.getAppContext());

    // If the high res original is rotated, specify a rotation to the shader in the app.
    if (
      captureCopyY_ != nullptr && captureCopyY_->pixels().cols() > captureCopyY_->pixels().rows()) {
      auto textureRotation = AppContext::RealityTextureRotation::UNSPECIFIED;
      switch (requestBuilder.getAppContext().getDeviceOrientation()) {
        case AppContext::DeviceOrientation::PORTRAIT:
          textureRotation = AppContext::RealityTextureRotation::R270;
          break;
        case AppContext::DeviceOrientation::LANDSCAPE_LEFT:
          textureRotation = AppContext::RealityTextureRotation::R0;
          break;
        case AppContext::DeviceOrientation::PORTRAIT_UPSIDE_DOWN:
          textureRotation = AppContext::RealityTextureRotation::R90;
          break;
        case AppContext::DeviceOrientation::LANDSCAPE_RIGHT:
          textureRotation = AppContext::RealityTextureRotation::R180;
          break;
        default:
          break;
      }
      requestBuilder.getAppContext().setRealityTextureRotation(textureRotation);
    }
  }

  // Execute the request.
  {
    ScopeTimer t("execute-request");
    engine_->execute(requestBuilder.asReader(), &responseBuilder);
  }

  // If streaming is supported, stream request and response to the remote.
  if (realityPostprocessor_ != nullptr) {
    ScopeTimer t("maybe-stream");

    auto remoteRealityResponse =
      realityPostprocessor_->update(requestBuilder.asReader(), responseBuilder.asReader());

    // TODO(nb): Should we omit the has check here, and set the entire response?
    if (remoteRealityResponse.hasXRResponse()) {
      responseBuilder.setXRResponse(remoteRealityResponse.getXRResponse());
    }
  }

  {
    ScopeTimingScopeLock lock("lock-and-swap-reality", realityLock_);
    currentXRReality_ = ConstRealityResponse(realityResponseMessage);
    {
      ScopeTimingScopeLock lock2("lock-display-buffer", displayFrameLock_);
      if (engineProcessingY_ != nullptr && displayCopyY_ != nullptr) {
        if (displayEngineProcessingPixels_) {
          std::swap(engineProcessingY_, displayCopyY_);
        } else {
          std::swap(captureCopyY_, displayCopyY_);
        }
      }
      if (engineProcessingUV_ != nullptr && displayCopyUV_ != nullptr) {
        if (displayEngineProcessingPixels_) {
          std::swap(engineProcessingUV_, displayCopyUV_);
        } else {
          std::swap(captureCopyUV_, displayCopyUV_);
        }
      }
    }
  }

  return responseBuilder.getStatus().hasError()
    ? (int32_t)responseBuilder.getStatus().getError().getCode()
    : 0;
}

ConstRealityResponse *XRIos::getCurrentReality() {
  std::lock_guard<std::mutex> lock(realityLock_);
  externalXRReality_ = currentXRReality_.clone();
  return &externalXRReality_;
}

ConstRootMessage<XREnvironment> XRIos::getXREnvironment() {
  MutableRootMessage<XREnvironment> me;
  auto builder = me.builder();
  exportXREnvironment(&builder);
  return ConstRootMessage<XREnvironment>(me);
}

ConstXRAppEnvironment *XRIos::getXRAppEnvironment() {
  MutableXRAppEnvironment me(xrAppEnvironment_.reader());
  driver_->getAppEnvironment(me.builder());

  // TODO(alvin): Set any values as needed & save in instance var.

  xrAppEnvironment_ = ConstXRAppEnvironment(me);
  return &xrAppEnvironment_;
}

void XRIos::setXRAppEnvironment(XRAppEnvironment::Reader reader) {
  MutableXRAppEnvironment env(reader);
  xrAppEnvironment_ = ConstXRAppEnvironment(env);
}

void XRIos::setRealityPostprocessor(RealityPostprocessor *realityPostprocessor) {
  realityPostprocessor_ = realityPostprocessor;
}

RealityPostprocessor *XRIos::getRealityPostprocessor() { return realityPostprocessor_; }

void XRIos::setFeatureProvider(std::unique_ptr<FeatureProvider> &&featureProvider) {
  featureProvider_ = std::move(featureProvider);
}

ConstRootMessage<XrQueryResponse> *XRIos::query(XrQueryRequest::Reader request) {
  MutableRootMessage<XrQueryResponse> response;
  auto responseBuilder = response.builder();
  engine_->query(request, &responseBuilder);
  lastQueryResponse_ = ConstRootMessage<XrQueryResponse>(response);
  return &lastQueryResponse_;
}

// Constructor.
XRIos::XRIos(int renderingSystem, void *session, void *sessionConfig, void *sessionDelegate) {
  this->customARSession_ = session;
  this->customARSessionConfig_ = sessionConfig;
  this->customARSessionDelegate_ = sessionDelegate;
  initializeDriver(XREngineConfiguration::SpecialExecutionMode::NORMAL);
  useMetalTextures_ = renderingSystem == RENDERING_SYSTEM_METAL && isMetalSupported();
  resetEngine();
}

void XRIos::initializeDriver(XREngineConfiguration::SpecialExecutionMode mode) {
  if (running_) {
    pause();
  }

  executionMode_ = mode;

  {
    std::lock_guard<std::mutex> lock(realityLock_);
    currentXRReality_ = ConstRootMessage<RealityResponse>();
  }

  if (mode == XREngineConfiguration::SpecialExecutionMode::REMOTE_ONLY) {
    // TODO(nb): createXRIosRemoteOnly.
    driver_.reset(createXRIosRemoteOnly(this));
    return;
  }

  if (mode == XREngineConfiguration::SpecialExecutionMode::DISABLE_NATIVE_AR_ENGINE) {
    driver_.reset(createXRIosC8(this));
    return;
  }

  if (isArKitSupported()) {
    driver_.reset(createXRIosARKit(this));
    return;
  } else {
    driver_.reset(createXRIosC8(this));
    return;
  }
}

void XRIos::resetEngine() {
  needsEngineReset_ = false;
  engine_.reset(new XREngine());
  engine_->setResetLoggingTreeRoot(true);
  engine_->configure(configForEngine_.reader());
}

XRIos::~XRIos() noexcept(false) {
  if (running_) {
    pause();
  }
}

void XRIos::sendAnalyticsRecordToServer() {
  MutableLogRecordHeader logRecordHeaderMessage;
  auto headerBuilder = logRecordHeaderMessage.builder();
  c8_exportLogHeaderInfo(
    driver_->getType(), xrConfig_.reader().getMobileAppKey().cStr(), &headerBuilder);
  auto headerReader = headerBuilder.asReader();
  auto arrayPtr = getAndResetAnalyticsRecord(headerReader);
  c8AnalyticsUploadController_logRecordToServer(arrayPtr);
}

std::unique_ptr<Vector<uint8_t>> XRIos::getAndResetAnalyticsRecord(
  const LogRecordHeader::Reader &headerReader) {
  auto arrayPtr = logPreparer_.prepareLogForUpload(headerReader, ScopeTimer::summarizer());
  ScopeTimer::reset();
  return arrayPtr;
}

void XRIos::exportXREnvironment(XREnvironment::Builder *env) {
  if (
    xRIos_ != nullptr
    && xRIos_->executionMode_
      == XREngineConfiguration::SpecialExecutionMode::DISABLE_NATIVE_AR_ENGINE) {
    C8Log("[xr-ios] %s", "(forced) exportXRIosC8Environment");
    exportXRIosC8Environment(env);
    return;
  }
  if (isArKitSupported()) {
    // C8Log("[xr-ios] %s", "exportXRIosARKitEnvironment");
    exportXRIosARKitEnvironment(env);
  } else {
    // C8Log("[xr-ios] %s", "exportXRIosC8Environment");
    exportXRIosC8Environment(env);
  }
}

// Singleton iOS engine instance used across Unity threads.
XRIos *XRIos::xRIos_ = nullptr;

}  // namespace c8

C8_PUBLIC
void c8XRIos_create(
  int renderingSystem, void *session, void *sessionConfig, void *sessionDelegate) {
  XRIos::createInstance(renderingSystem, session, sessionConfig, sessionDelegate);
}

// Destroy a reality engine.
C8_PUBLIC
void c8XRIos_destroy() { XRIos::destroyInstance(); }

C8_PUBLIC
void c8XRIos_configureXR(struct c8_NativeByteArray *bytes) {
  ConstXRConfiguration config(bytes->bytes, bytes->size);
  XRIos::getInstance()->configure(config.reader());
}

C8_PUBLIC
void c8XRIos_configureXRLegacy(struct c8_XRConfigurationLegacy *config) {
  MutableXRConfiguration configMessage;
  auto configBuilder = configMessage.builder();
  setXRConfigurationLegacy(*config, &configBuilder);
  XRIos::getInstance()->configure(configBuilder.asReader());
}

C8_PUBLIC
void c8XRIos_setManagedCameraRGBATexture(
  void *texHandle, int width, int height, int renderingSystem) {
  XRIos::getInstance()->setManagedCameraRGBATexture(texHandle, width, height, renderingSystem);
}

C8_PUBLIC
void c8XRIos_setManagedCameraYTexture(void *texHandle, int width, int height, int renderingSystem) {
  XRIos::getInstance()->setManagedCameraYTexture(texHandle, width, height, renderingSystem);
}

C8_PUBLIC
void c8XRIos_setManagedCameraUVTexture(
  void *texHandle, int width, int height, int renderingSystem) {
  XRIos::getInstance()->setManagedCameraUVTexture(texHandle, width, height, renderingSystem);
}

C8_PUBLIC
void c8XRIos_renderFrameForDisplay() { XRIos::getInstance()->renderFrameForDisplay(); }

C8_PUBLIC
void c8XRIos_renderDepthFrameForDisplay() { XRIos::getInstance()->renderDepthFrameForDisplay(); }

// Resume a reality engine.
C8_PUBLIC
void c8XRIos_resume() { XRIos::getInstance()->resume(); }

// Resume a reality engine.
C8_PUBLIC
void c8XRIos_recenter() { XRIos::getInstance()->recenter(); }

// Get the most recent reality.
C8_PUBLIC
int c8XRIos_getCurrentRealityXR(struct c8_NativeByteArray *reality) {
  auto *r = XRIos::getInstance()->getCurrentReality();
  *reality = c8_NativeByteArray{
    static_cast<const void *>(r->bytes().begin()), static_cast<int>(r->bytes().size())};
  return 0;
}

C8_PUBLIC
int c8XRIos_getCurrentRealityXRLegacy(struct c8_XRResponseLegacy *reality) {
  auto *r = XRIos::getInstance()->getCurrentReality();
  setXRResponseLegacy(r->reader(), reality);
  return 0;
}

// Get the most recent reality.
namespace {
ConstRootMessage<XREnvironment> externalXREnvironment_;
}

C8_PUBLIC
void c8XRIos_getXREnvironment(struct c8_NativeByteArray *environment) {
  externalXREnvironment_ = XRIos::getXREnvironment();
  *environment = c8_NativeByteArray{
    static_cast<const void *>(externalXREnvironment_.bytes().begin()),
    static_cast<int>(externalXREnvironment_.bytes().size())};
}

C8_PUBLIC
void c8XRIos_getXRAppEnvironment(struct c8_NativeByteArray *environment) {
  auto *env = XRIos::getInstance()->getXRAppEnvironment();
  *environment = c8_NativeByteArray{
    static_cast<const void *>(env->bytes().begin()), static_cast<int>(env->bytes().size())};
}

C8_PUBLIC
void c8XRIos_setXRAppEnvironment(struct c8_NativeByteArray *environment) {
  ConstXRAppEnvironment env(environment->bytes, environment->size);
  XRIos::getInstance()->setXRAppEnvironment(env.reader());
}

// Pause a reality engine.
C8_PUBLIC
void c8XRIos_pause() { XRIos::getInstance()->pause(); }

C8_PUBLIC
void c8XRIos_setManagedImageView(void *imageView) {
  XRIos::getInstance()->setManagedImageView(imageView);
}

C8_PUBLIC
void c8XRIos_query(struct c8_NativeByteArray *request, struct c8_NativeByteArray *response) {
  ConstRootMessage<XrQueryRequest> requestMessage(request->bytes, request->size);
  auto responseMessage = XRIos::getInstance()->query(requestMessage.reader());
  *response = c8_NativeByteArray{
    static_cast<const void *>(responseMessage->bytes().begin()),
    static_cast<int>(responseMessage->bytes().size())};
}
