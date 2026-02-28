// Copyright (c) 2024 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#include "c8/html-shell/android/shell-activity-intent.h"

#include "c8/android/jni/scoped-local-env.h"

namespace c8 {

std::optional<String> loadUrlFromActivityIntent(JNIEnv *env, jobject activity) {
  auto scopedEnv = ScopedLocalEnv(env);
  // Get the class of the activity object
  auto activityClass = scopedEnv.GetObjectClass(activity);
  auto getIntentMethod =
    scopedEnv.GetMethodID(activityClass, "getIntent", "()Landroid/content/Intent;");
  auto jIntent = scopedEnv.CallObjectMethod<jobject>(activity, getIntentMethod);

  auto intentClass = scopedEnv.GetObjectClass(jIntent);
  auto getStringExtraMethod =
    scopedEnv.GetMethodID(intentClass, "getStringExtra", "(Ljava/lang/String;)Ljava/lang/String;");
  auto jExtraData = scopedEnv.CallObjectMethod<jstring>(
    jIntent, getStringExtraMethod, scopedEnv.NewStringUTF("app_url_key").get());

  if (jExtraData.get() == nullptr) {
    // No extra data found
    return std::nullopt;
  }

  // // Convert the jstring to a C++ string
  const char *extraData = scopedEnv.GetStringUTFChars(jExtraData, nullptr);

  auto returnString = String(extraData);
  scopedEnv.ReleaseStringUTFChars(jExtraData, extraData);

  return returnString;
}

}  // namespace c8
