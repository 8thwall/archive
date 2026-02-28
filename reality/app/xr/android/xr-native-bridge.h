// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#ifdef ANDROID

#include <jni.h>

#include "c8/io/capnp-messages.h"
#include "reality/engine/api/reality.capnp.h"

namespace c8 {

class XrNativeBridge {
public:
  // Default constructor.
  XrNativeBridge() = default;
  ~XrNativeBridge();

  // Default move constructors.
  XrNativeBridge(XrNativeBridge &&) = default;
  XrNativeBridge &operator=(XrNativeBridge &&) = default;

  // Disallow copying.
  XrNativeBridge(const XrNativeBridge &) = delete;
  XrNativeBridge &operator=(const XrNativeBridge &) = delete;

  void create(JNIEnv *env, jobject context, int renderingSystem);

  void configure(MutableRootMessage<XRConfiguration> &config);

  ConstRootMessage<RealityResponse> currentRealityXR();

  void destroy();

  void pause();

  ConstRootMessage<XrQueryResponse> query(MutableRootMessage<XrQueryRequest> &m);

  void recenter();

  void renderFrameForDisplay();

  void resume();

  ConstRootMessage<XRAppEnvironment> xrAppEnvironment();

  ConstRootMessage<XREnvironment> xrEnvironment();

  // XRAppEnvironment.Builder GetMutableXRAppEnvironment();

  // public void CommitAppEnvironment();

  // void SetManagedCameraRGBATexture(
  //   System.IntPtr texHandle, int width, int height, int renderingSystem);

  // void SetManagedCameraYTexture(
  //   System.IntPtr texHandle, int width, int height, int renderingSystem);

  // void SetManagedCameraUVTexture(
  //   System.IntPtr texHandle, int width, int height, int renderingSystem);

  // XrRemoteApp.Reader GetXRRemote();

  // void SetEditorAppInfo(MessageBuilder message);

  // bool IsStreamingSupported();

  // bool IsRemoteConnected();

  // IntPtr GetRenderEventFunc() { return XRGetRenderEventFunc(); }

private:
  bool destroyed_ = true;
  JNIEnv *env_ = nullptr;
  jobject context_;
  jobject xrAndroid_;
  int renderingSystem_;

  jclass xrAndroidClass_;

  // static methods
  jmethodID createMethod_;
  jmethodID destroyMethod_;
  jmethodID getInstanceMethod_;
  jmethodID getXREnvironmentMethod_;
  jmethodID loadNativeLibraryMethod_;

  // object methods.
  jmethodID configureMethod_;
  jmethodID getCurrentRealityXRMethod_;
  jmethodID getXRAppEnvironmentMethod_;
  jmethodID pauseMethod_;
  jmethodID queryMethod_;
  jmethodID recenterMethod_;
  jmethodID renderFrameForDisplayMethod_;
  jmethodID resumeMethod_;

  void loadXrAndroidClass();
  void loadXrAndroidStaticMethods();
  void loadXrAndroidObjectMethods();
  void createXrAndroidInstance();

  /*
  private MessageBuilder xrAppEnvironment;
  private MessageBuilder xrConfig;

  private bool configured;
  private bool running;
  private RealityResponse.Reader xrResponse;
  private XrQueryResponse.Reader queryResponse;
  private XrRemoteApp.Reader xrRemote;
  */
};

}  // namespace c8

#endif  // ANDROID
