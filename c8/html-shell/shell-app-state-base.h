// Copyright (c) 2025 Niantic, Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)

#pragma once

#include <thread>

#include "c8/string.h"

namespace c8 {

struct ShellAppStateBase {
  int windowWidth = 0;
  int windowHeight = 0;
  String filesDir;
  bool resumed = false;
  std::thread nodeThread;
  String appUrl;
  String niaEnvironmentAccessCode;
  String encryptedDevCookie;
  String naeBuildMode;
  String systemLocale = "en-US";
  String userAgent;
  int inputEventPipeFd[2] = {-1, -1};
  int sensorEventPipeFd[2] = {-1, -1};
  float devicePixelRatio = 1.f;
  int screenWidth = 0;
  int screenHeight = 0;
};

}  // namespace c8
