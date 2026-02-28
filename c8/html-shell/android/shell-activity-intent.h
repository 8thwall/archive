// Copyright (c) 2024 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#pragma once

#include <jni.h>

#include <optional>

#include "c8/string.h"

namespace c8 {
std::optional<String> loadUrlFromActivityIntent(JNIEnv *env, jobject activity);
}  // namespace c8
