// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)

#pragma once

#include <android/native_window.h>

#include "c8/html-shell/android/android/haptics-manager.h"
#include "c8/html-shell/android/sensor-manager.h"
#include "c8/html-shell/shell-app-state-base.h"

namespace c8 {

struct ShellAppState : ShellAppStateBase {
  ANativeWindow *nativeWindow = nullptr;
  SensorManager sensorManager;
  HapticsManager hapticsManager;
};

}  // namespace c8
