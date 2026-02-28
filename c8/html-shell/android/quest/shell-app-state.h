// Copyright (c) 2025 Niantic, Inc.
// Original Author: Paris Morgan (lucasreyna@nianticlabs.com)

#pragma once

#include <android/native_window.h>

#include "c8/html-shell/shell-app-state-base.h"

namespace c8 {

struct ShellAppState : ShellAppStateBase {
  ANativeWindow *nativeWindow = nullptr;
};

}  // namespace c8
