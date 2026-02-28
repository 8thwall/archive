// Copyright (c) 2025 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#pragma once

#include <jni.h>

#include "c8/string.h"

namespace c8 {
void startQuestWebTask(JNIEnv *env, jobject activity, const String &url);
};
