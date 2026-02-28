// Copyright (c) 2025 Niantic, Inc.
// Original Author: Xiaokai Li (xiaokaili@nianticlabs.com)

#include <android/input.h>

#include "c8/html-shell/input-event-data.h"

namespace c8 {
InputEventData convertFromPlatformEvent(
  const AInputEvent *ev, float devicePixelRatio = 1.0f) noexcept;
}
