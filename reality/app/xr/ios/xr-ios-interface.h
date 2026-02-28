// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// Internal c++ interface for xr-ios.

#pragma once

#import <CoreVideo/CoreVideo.h>
#import <UIKit/UIKit.h>

#include "c8/io/capnp-messages.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/protolog/api/log-request.capnp.h"
#include "c8/protolog/api/remote-request.capnp.h"
#include "c8/protolog/xr-extern.h"
#include "reality/app/xr/common/camera-framework.h"
#include "reality/engine/api/reality.capnp.h"
#include "reality/engine/executor/xr-engine.h"
#include "reality/engine/logging/xr-log-preparer.h"

namespace c8 {

// Abstract base class for different xr implementations.
class XRDriverIos {
public:
  // Configure a reality engine.

  // Configure through XR public interface.
  virtual void configure(XRConfiguration::Reader config) = 0;

  // Resume a reality engine driver.
  virtual void resume() = 0;

  // Pause a reality engine driver.
  virtual void pause() = 0;

  // The type of driver implemention used by the running device.
  virtual RealityEngineLogRecordHeader::EngineType getType() = 0;

  virtual void getAppEnvironment(XRAppEnvironment::Builder env) = 0;

  virtual inline ~XRDriverIos() noexcept(false) {}
};

class XRIos {
public:
  static XRIos *createInstance(
    int renderingSystem, void *session, void *sessionConfig, void *sessionDelegate);
  static XRIos *getInstance();
  static void destroyInstance();
  static ConstRootMessage<XREnvironment> getXREnvironment();

  static void exportXREnvironment(XREnvironment::Builder *env);

  // Methods called by the driver (XRDriverIos).
  void setFrameForDisplay(CVPixelBufferRef &pixelBuffer);
  void setDepthFrameForDisplay(CVPixelBufferRef &depthPixelBuffer);
  int32_t pushRealityForward(const RealityRequest::Reader &request);

  // Configure through the XR public interface.
  ConstRootMessage<RealityResponse> *getCurrentReality();
  void renderFrameForDisplay();
  void renderDepthFrameForDisplay();
  void configure(XRConfiguration::Reader config);
  ConstRootMessage<XRAppEnvironment> *getXRAppEnvironment();
  void setXRAppEnvironment(XRAppEnvironment::Reader reader);
  void setManagedCameraRGBATexture(void *texHandle, int width, int height, int renderingSystem);
  void setManagedCameraYTexture(void *texHandle, int width, int height, int renderingSystem);
  void setManagedCameraUVTexture(void *texHandle, int width, int height, int renderingSystem);
  void setManagedImageView(void *imageView);
  void *getCustomARSession();
  void *getCustomARSessionConfig();
  void *getCustomARSessionDelegate();
  void recenter();
  void resume();
  void pause();

  void setRealityPostprocessor(RealityPostprocessor *processor);
  RealityPostprocessor *getRealityPostprocessor();
  void setFeatureProvider(std::unique_ptr<FeatureProvider> &&featureProvider);
  ConstRootMessage<XrQueryResponse> *query(XrQueryRequest::Reader request);

  ~XRIos() noexcept(false);
  // Disallow move constructors.
  XRIos(XRIos &&) = delete;
  XRIos &operator=(XRIos &&) = delete;

  // Disallow copying.
  XRIos(const XRIos &) = delete;
  XRIos &operator=(const XRIos &) = delete;

private:
  static XRIos *xRIos_;

  std::unique_ptr<XREngine> engine_;
  ConstRootMessage<RealityResponse> currentXRReality_;
  ConstRootMessage<RealityResponse> externalXRReality_;
  ConstRootMessage<XRConfiguration> xrConfig_;
  ConstRootMessage<XRConfiguration> configForEngine_;
  ConstRootMessage<XRAppEnvironment> xrAppEnvironment_;
  ConstRootMessage<XrQueryResponse> lastQueryResponse_;
  bool running_ = false;
  bool needsEngineReset_ = false;
  bool useMetalTextures_ = false;
  id<MTLTexture> mtlYTexture_ = nil;
  id<MTLTexture> mtlUVTexture_ = nil;
  size_t oglYTexture_ = 0;
  size_t oglUVTexture_ = 0;
  size_t oglRGBATexture_ = 0;
  std::mutex displayFrameLock_;
  std::mutex depthFrameLock_;
  std::mutex realityLock_;
  UIImageView *managedImageView_;
  UIImage *previousFrameImg_;
  UIImage *previousDepthFrameImg_;
  bool displayNeeded_ = false;
  std::unique_ptr<XRDriverIos> driver_;
  XRLogPreparer logPreparer_;
  char mobileAppKey[100];
  RealityPostprocessor *realityPostprocessor_ = nullptr;
  std::unique_ptr<FeatureProvider> featureProvider_;
  XREngineConfiguration::SpecialExecutionMode executionMode_ =
    XREngineConfiguration::SpecialExecutionMode::NORMAL;
  void *customARSession_;
  void *customARSessionConfig_;
  void *customARSessionDelegate_;

  std::unique_ptr<YPlanePixelBuffer> engineProcessingY_;
  std::unique_ptr<UVPlanePixelBuffer> engineProcessingUV_;
  std::unique_ptr<YPlanePixelBuffer> captureCopyY_;
  std::unique_ptr<UVPlanePixelBuffer> captureCopyUV_;
  std::unique_ptr<YPlanePixelBuffer> displayCopyY_;
  std::unique_ptr<UVPlanePixelBuffer> displayCopyUV_;
  std::unique_ptr<RGBA8888PlanePixelBuffer> displayCopyRGBA_;
  bool displayEngineProcessingPixels_ = false;

  // Holds the depth map that will be stored in the capnp file (with rotations if necessary).
  std::unique_ptr<DepthFloatPixelBuffer> engineProcessingDepth_;

  // Constructor.
  XRIos(int renderingSystem, void *session, void *sessionConfig, void *sessionDelegate);

  void applyEngineConfig(XREngineConfiguration::Reader config);
  bool hasDisplayManagedTextures();
  void initializeDriver(XREngineConfiguration::SpecialExecutionMode mode);
  void renderFrameForDisplayManagedView();
  void renderDepthFrameForDisplayManagedView();
  void renderFrameForDisplayManagedTexture();
  void resetEngine();
  void sendAnalyticsRecordToServer();
  std::unique_ptr<Vector<uint8_t>> getAndResetAnalyticsRecord(
    const LogRecordHeader::Reader &headerReader);
};

}  // namespace c8
