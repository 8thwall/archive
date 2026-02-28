// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

#pragma once

#import <AppKit/AppKit.h>

#include "c8/html-shell/input-event-data.h"

namespace c8 {

InputEventData convertFromPlatformEvent(const NSEvent *ev) noexcept;

}  // namespace c8
