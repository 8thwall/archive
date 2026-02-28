// Copyright (c) 2025 Niantic, Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)

#pragma once

#import <QuartzCore/CAMetalLayer.h>
#import <UIKit/UIKit.h>

#include "c8/html-shell/apple/ios/haptics-manager.h"
#include "c8/html-shell/apple/ios/sensor-manager.h"
#include "c8/html-shell/shell-app-state-base.h"

namespace c8 {

struct ShellAppState : ShellAppStateBase {
  CAMetalLayer *nativeLayer = nullptr;
  UIWindow *nativeWindow = nullptr;
  SensorManager sensorManager;
  HapticsManager hapticsManager;
};

ShellAppState *getShellAppState();

}  // namespace c8
