// Copyright (c) 2025 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  hdrs = {
    "quest-webtask.h",
  };
  deps = {
    "//c8:string",
    "//c8/android/jni:scoped-local-env",
  };
  target_compatible_with = {
    "@platforms//os:android",
  };
}
cc_end(0x9a8f8104);

#include "c8/android/jni/scoped-local-env.h"
#include "c8/html-shell/android/quest/webtask/quest-webtask.h"

namespace c8 {

constexpr const char ACTION_LAUNCH[] = "com.oculus.vrshell.intent.action.LAUNCH";
constexpr const char PACKAGE[] = "com.oculus.vrshell";

/**
 * Starts a Quest Web Task with the given URL. The equivalent Java code looks something like this:
 *
 *  static void startQuestWebTask(Context context, String url) {
 *    Intent intent = new Intent("com.oculus.vrshell.intent.action.LAUNCH");
 *    intent.setPackage("com.oculus.vrshell");
 *    intent.putExtra("uri", "ovrweb://webtask?uri=" + Uri.encode(url));
 *    intent.putExtra("intent_data", Uri.parse("systemux://browser"));
 *    context.sendBroadcast(intent);
 *  }
 */
void startQuestWebTask(JNIEnv *env, jobject activity, const String &url) {
  auto scopedEnv = ScopedLocalEnv(env);

  // Step 1: Create the Intent
  auto intentClass = scopedEnv.FindClass("android/content/Intent");
  auto intentConstructor = scopedEnv.GetMethodID(intentClass, "<init>", "(Ljava/lang/String;)V");
  auto actionString = scopedEnv.NewStringUTF(ACTION_LAUNCH);
  auto intent = scopedEnv.NewObject(intentClass, intentConstructor, actionString);

  // Step 2: Set the package for the Intent
  auto setPackageMethod = scopedEnv.GetMethodID(
    intentClass, "setPackage", "(Ljava/lang/String;)Landroid/content/Intent;");
  auto packageString = scopedEnv.NewStringUTF(PACKAGE);
  scopedEnv.CallObjectMethod<jobject>(intent, setPackageMethod, packageString);

  // Step 3: Add the "uri" extra with the encoded URL
  auto uriClass = scopedEnv.FindClass("android/net/Uri");
  auto encodeMethod =
    scopedEnv.GetStaticMethodID(uriClass, "encode", "(Ljava/lang/String;)Ljava/lang/String;");
  auto urlString = scopedEnv.NewStringUTF(url.c_str());
  ScopedLocalRef<jstring> encodedUrl =
    scopedEnv.CallStaticObjectMethod<jstring>(uriClass, encodeMethod, urlString);
  auto encodedUrlCharPtr = scopedEnv.GetStringUTFChars(encodedUrl, nullptr);
  String uriValue = "ovrweb://webtask?uri=" + String(encodedUrlCharPtr);
  auto uriString = scopedEnv.NewStringUTF(uriValue.c_str());
  auto putExtraUriMethod = scopedEnv.GetMethodID(
    intentClass, "putExtra", "(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;");
  auto uriTypeString = scopedEnv.NewStringUTF("uri");
  scopedEnv.CallObjectMethod<jobject>(intent, putExtraUriMethod, uriTypeString, uriString);
  scopedEnv.ReleaseStringUTFChars(encodedUrl, encodedUrlCharPtr);

  // Step 4: Add the "intent_data" extra with a parsed Uri
  auto parseMethod =
    scopedEnv.GetStaticMethodID(uriClass, "parse", "(Ljava/lang/String;)Landroid/net/Uri;");
  auto systemBrowserString = scopedEnv.NewStringUTF("systemux://browser");
  auto systemBrowserUri =
    scopedEnv.CallStaticObjectMethod<jobject>(uriClass, parseMethod, systemBrowserString);
  auto intentDataTypeString = scopedEnv.NewStringUTF("intent_data");
  scopedEnv.CallObjectMethod<jobject>(
    intent, putExtraUriMethod, intentDataTypeString, systemBrowserUri);

  // Step 5: Send intent broadcast
  auto activityClass = scopedEnv.GetObjectClass(activity);
  auto sendBroadcastMethod =
    scopedEnv.GetMethodID(activityClass, "sendBroadcast", "(Landroid/content/Intent;)V");
  scopedEnv.CallVoidMethod(activity, sendBroadcastMethod, intent);
}

}  // namespace c8
