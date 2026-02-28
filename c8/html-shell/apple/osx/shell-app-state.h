// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

#pragma once

#import <AppKit/AppKit.h>
#import <QuartzCore/CAMetalLayer.h>

#include "c8/html-shell/shell-app-state-base.h"

namespace c8 {

struct ShellAppState : ShellAppStateBase {
  CAMetalLayer *nativeLayer = nullptr;
  NSWindow *nativeWindow = nullptr;
};

ShellAppState *getShellAppState();

}  // namespace c8
