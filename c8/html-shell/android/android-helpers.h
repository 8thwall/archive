// Copyright (c) 2025 8th Wall, Inc.
// Original Author: Lucas Reyna (lucas@8thwall.com)
//
// Helpers for misc operations on Android.

#pragma once

#include "c8/string.h"

namespace c8 {

// Gets the user agent as a string, e.g. Mozilla/5.0 (Linux; Android 10; K) ..."
String getUserAgent();

}  // namespace c8
