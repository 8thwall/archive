// Copyright (c) 2025 Niantic Spatial, Inc.
// Original Author: Lucas Reyna (lucas@nianticspatial.com)

#pragma once

#include <jni.h>

namespace c8 {

struct DisplayInfo {
  int screenWidth = 0;
  int insetScreenWidth = 0;
  int screenHeight = 0;
  int insetScreenHeight = 0;
  float devicePixelRatio = 0.0f;
};

DisplayInfo getDisplayInfo(JNIEnv *env, jobject activity);

void toggleSystemInsets(JNIEnv *env, jobject activity, bool show);

}  // namespace c8
