// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucas@nianticspatial.com)

// A Manager to wrap around the Vibration APIs on Android, mainly to fit Web Vibration API.

#pragma once

#include <android_native_app_glue.h>

#include "c8/vector.h"

namespace c8 {

class HapticsManager {
public:
  HapticsManager() noexcept = default;

  void initializeHapticsManager(struct android_app *app);

  // Expects a pattern of integers representing the duration / pauses of haptic events in
  // milliseconds.
  // Similar to the Web Vibration API
  void playHapticPattern(const Vector<int> &pattern);

private:
  void setUpVibrationHelperClass(JNIEnv *env);

  struct android_app *app_ = nullptr;

  // Want to keep the vibration helper class as a global reference
  jclass vibrationHelperClass_ = nullptr;

  bool vibrationHelperInitialized_ = false;
};

}  // namespace c8
