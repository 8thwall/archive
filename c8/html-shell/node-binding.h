// Copyright (c) 2025 Niantic, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)

#pragma once

#include <cstdint>
#include <functional>

#include "c8/map.h"
#include "c8/string.h"
#include "c8/vector.h"

namespace c8 {

// A container for the native values that need to be passed to the running Node instance.
struct NodeBindingData {
  void *nativeWindow = nullptr;
  int width = 0;
  int height = 0;
  int inputEventFd = -1;
  int sensorEventFd = -1;
  std::function<void(String, int)> eventListenerUpdateCallback = nullptr;
  std::function<bool(const Vector<int> &)> vibrationCallback = nullptr;
  const char *url = nullptr;
  const char *internalStoragePath = nullptr;
  const char *environmentAccessCode = nullptr;
  const char *encryptedDevCookie = nullptr;
  const char *systemLocale = nullptr;
  const char *naeBuildMode = nullptr;
  const char *userAgent = nullptr;
  float devicePixelRatio = 1.f;
  int screenWidth = 0;
  int screenHeight = 0;
  TreeMap<String, String> environmentVariables = {{}};
};

class NodeBinding {
public:
  static int onCreate(int argc, char *argv[], NodeBindingData &values);

  static int setNativeWindow(void *nativeWindow);

  static void onPause();
  static void onTermWindow();
  static void onResume();
  static void onInitWindow(void *nativeWindow);
  static void onWindowResized(int width, int height);
  static void onDestroy();

  static void notifyAnimationFrame(int64_t frameTimeNanos);
};

}  // namespace c8
