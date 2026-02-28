// Copyright (c) 2024 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#pragma once

#include <jni.h>

#include "c8/string.h"

namespace c8 {

struct ShellAppManifestParams {
  String appUrl;
  String niaEnvironmentAccessCode;
  String encryptedDevCookie;
  String naeBuildMode;
  String commitIdAtAppBuildTime;
  bool statusBarVisible = false;
};

void loadManifestParams(JNIEnv *env, jobject activity, ShellAppManifestParams *manifestParams);

}  // namespace c8
