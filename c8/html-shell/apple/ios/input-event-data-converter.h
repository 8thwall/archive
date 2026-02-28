// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

#pragma once

#import <UIKit/UIKit.h>

#include "c8/html-shell/input-event-data.h"
#include "c8/map.h"

namespace c8 {

InputEventData convertFromPlatformTouchEvent(
  UITouch *mainTouch, const TreeMap<UITouch *, int32_t> &touchMap, UIView *view) noexcept;

}  // namespace c8
