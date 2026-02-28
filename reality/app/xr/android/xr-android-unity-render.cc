// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Alvin Portillo (alvin@8thwall.com)
//
// Implementation of Unity rendering APIs.

#include "bzl/inliner/rules2.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  tags = {"manual"};
  deps = {
    ":xr-gl-android",
    "//bzl/unity:plugin-api",
  };
}
cc_end(0xcd6634ce);

#ifdef ANDROID

#include "bzl/unity/PluginAPI/IUnityGraphics.h"
#include "bzl/unity/PluginAPI/IUnityInterface.h"
#include "reality/app/xr/android/xr-gl-android.h"

extern "C" void UNITY_INTERFACE_API c8XRAndroid_onUnityRenderEvent(int eventId) {
  if (c8::XRGLAndroid::hasInstance()) {
    c8::XRGLAndroid::getInstance()->renderFrameForDisplay();
  }
}

extern "C" UnityRenderingEvent UNITY_INTERFACE_EXPORT UNITY_INTERFACE_API
c8XRAndroid_getRenderEventFunc() {
  return c8XRAndroid_onUnityRenderEvent;
}

#endif  // ANDROID
