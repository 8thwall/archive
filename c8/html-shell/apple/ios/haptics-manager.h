// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucas@nianticspatial.com)

// A Manager to wrap around the CoreHaptic APIs on iOS, mainly to fit Web Vibration API.

#pragma once

#import <CoreHaptics/CoreHaptics.h>

#include "c8/vector.h"

namespace c8 {

class HapticsManager {
public:
  HapticsManager() noexcept;
  ~HapticsManager() noexcept;

  // Expects a pattern of integers representing the duration / pauses of haptic events in
  // milliseconds.
  // Similar to the Web Vibration API
  void playHapticPattern(const Vector<int> &pattern);

private:
  void playPatternHelper(const Vector<int> &pattern);

  CHHapticEngine *hapticEngine_ = nullptr;
  id<CHHapticPatternPlayer> currentPlayer_;
};

}  // namespace c8
