// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// Internal-use header for streaming RealityEngine.

#pragma once

#include <stdbool.h>
#include <stdint.h>
#include <memory>
#include <mutex>
#include "c8/c8-log-proto.h"
#include "c8/io/capnp-messages.h"
#include "c8/protolog/api/remote-request.capnp.h"
#include "c8/vector.h"
#include "reality/app/xr/streaming/remote-service-thread.h"
#include "reality/app/xr/streaming/streaming-record-callback.h"
#include "reality/engine/executor/xr-engine.h"

#ifdef _WIN32
#include <d3d11.h>
#include <windows.h>
#include "bzl/unity/PluginAPI/IUnityGraphicsD3D11.h"
#include "reality/app/xr/streaming/win-native-directx-texture.h"
#else
#include "reality/app/xr/streaming/osx-native-metal-texture.h"
#include "reality/app/xr/streaming/osx-native-opengl-texture.h"
#endif

namespace c8 {

class XRStreaming : public StreamingRecordCallback {
public:
  static ConstRootMessage<XrRemoteApp> FALLBACK_REMOTE_APP_DATA;
  // Creates and returns a singleton instance of XRStreaming. Subsequent calls to
  // this will result in an error if the instance is not destroyed through destroyInstance first.
  // Use getInstance to receive a reference of a previously created instance.
  static XRStreaming *createInstance();

  // Returns a reference to a previously created instance of XRStreaming. Results in an error if
  // called before an instance is created.
  static XRStreaming *getInstance();

  // Destroys the instance of XRStreaming, if it exists.
  static void destroyInstance();

#ifdef _WIN32
  // Grab the d3d11 Device for later pipeline execution
  static void setD3D11Device(ID3D11Device *device);
#else
  static TextureCopier *buildOsxTextureCopier();
#endif

  static void setRenderingSystem(int renderingSystem);

  static bool isRenderingOpenGL();

  // Constructor.
  XRStreaming();
  virtual ~XRStreaming();

  // Explicitly delete move constructors. These are already implicitly deleted because the mutex
  // members cannot be moved.
  XRStreaming(XRStreaming &&) = delete;
  XRStreaming &operator=(XRStreaming &&) = delete;

  // Disallow copying.
  XRStreaming(const XRStreaming &) = delete;
  XRStreaming &operator=(const XRStreaming &) = delete;

  void configure(XRConfiguration::Reader config);

  void setManagedCameraRGBATexture(void *texHandle, int width, int height, int renderingSystem);

  void setManagedCameraYTexture(void *texHandle, int width, int height, int renderingSystem);

  void setManagedCameraUVTexture(void *texHandle, int width, int height, int renderingSystem);

  void resume();

  void recenter();

  void pause();

  // Main method to execute a request.
  void processRecord(
    const XrRemoteRequest::Reader &record, XrRemoteResponse::Builder *response) override;

  void updateEnvironment(const RequestSensor::Reader &sensorData);

  void updateRemote(XrRemoteApp::Reader remote);

  void bufferFrameForDisplay(const RequestSensor::Reader &sensorData);

  void setFrameForDisplay();

  void renderFrameForDisplay();

  // Main method to execute a request.
  int32_t pushRealityForward(
    XrAppDeviceInfo::XrScreenOrientation deviceOrientation,
    const RealityRequest::Reader &sensorData,
    XrRemoteResponse::Builder *responseRecord);

  ConstRootMessage<RealityResponse> *getCurrentReality();
  // Matches the last call to getCurrentReality:
  // Call getCurrentReality and then call getRequestForCurrentReality.
  ConstRootMessage<RealityRequest> *getRequestForCurrentReality();
  // Matches the last call to getCurrentReality
  ConstRootMessage<RealityResponse> *getExternalReality();

  static ConstRootMessage<XREnvironment> *getXREnvironment();

  ConstRootMessage<XRAppEnvironment> *getXRAppEnvironment();

  void setXRAppEnvironment(XRAppEnvironment::Reader reader);

  ConstRootMessage<XrRemoteApp> &getXRRemote();

  void setEditorAppInfo(struct c8_NativeByteArray *preview);

  ConstRootMessage<XrQueryResponse> *query(XrQueryRequest::Reader request);

private:
  static ConstRootMessage<XREnvironment> externalXREnvironment_;
  static XRStreaming *xRStreaming_;
#ifdef _WIN32
  static ID3D11Device *d3dDevice_;
#endif
  static int renderingSystem_;

  static std::mutex xrEnvironmentLock_;

  std::unique_ptr<XREngine> engine_;
  ConstRootMessage<RealityRequest> currentXRRealityRequest_;
  ConstRootMessage<RealityRequest> externalXRRealityRequest_;
  ConstRootMessage<RealityResponse> currentXRReality_;
  ConstRootMessage<RealityResponse> externalXRReality_;
  ConstRootMessage<XRConfiguration> xrConfig_;
  ConstRootMessage<XRConfiguration> configForEngine_;
  ConstRootMessage<XRConfiguration> xrRemoteConfig_;
  ConstRootMessage<XRAppEnvironment> appEnvironment_;
  ConstRootMessage<XREnvironment> environment_;
  ConstRootMessage<XrEditorAppInfo> editorAppInfo_;
  ConstRootMessage<XrQueryResponse> lastQueryResponse_;
  bool running_ = false;
  bool needsEngineReset_ = false;
  bool needsXrReconfig_ = false;
  bool initialized_ = false;
  RemoteServiceThread *remoteServiceThread_;
#ifdef _WIN32
  std::unique_ptr<WinNativeDirectxTexture> nativeTexture_;
#else
  std::unique_ptr<TextureCopier> nativeTexture_;
#endif
  Vector<ConstRootMessage<XrRemoteApp>> remotes_;
  ConstRootMessage<XrRemoteApp> remoteExternal_;
  XrAppDeviceInfo::XrScreenOrientation lastScreenOrientation_ =
    XrAppDeviceInfo::XrScreenOrientation::UNSPECIFIED;

  std::unique_ptr<YPlanePixelBuffer> bufferedY_;
  std::unique_ptr<UVPlanePixelBuffer> bufferedUV_;

  std::unique_ptr<YPlanePixelBuffer> externalBufferedY_;
  std::unique_ptr<UVPlanePixelBuffer> externalBufferedUV_;

  std::mutex displayFrameLock_;
  std::mutex realityLock_;
  std::mutex remoteLock_;
  std::mutex configLock_;
  std::mutex editorAppInfoLock_;

  bool configuredForCamera();

  bool configuredForPose();

  void resetEngine();

  static ConstRootMessage<XREnvironment> *getUnspecifiedXREnvironment();

  ConstRootMessage<XREnvironment> *getXREnvironmentImpl();
};  // XRStreaming

}  // namespace c8
