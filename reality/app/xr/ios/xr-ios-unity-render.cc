// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Alvin Portillo (alvin@8thwall.com)
//
// Implementation of Unity rendering APIs.

#include "bzl/unity/PluginAPI/IUnityGraphics.h"
#include "bzl/unity/PluginAPI/IUnityInterface.h"
#include "reality/app/xr/ios/xr-ios.h"

extern "C" void UNITY_INTERFACE_API c8XRIos_onUnityRenderEvent(int eventId) {
  c8XRIos_renderFrameForDisplay();
}

extern "C" UnityRenderingEvent UNITY_INTERFACE_EXPORT UNITY_INTERFACE_API
c8XRIos_getRenderEventFunc() {
  return c8XRIos_onUnityRenderEvent;
}
