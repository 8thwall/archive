// Copyright (c) 2024 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#include "c8/html-shell/android/shell-app-manifest.h"

#include "c8/android/jni/scoped-local-env.h"
#include "c8/c8-log.h"

namespace c8 {

constexpr const char APP_URL_META_NAME[] = "app_url";
constexpr const char APP_PASSCODE_META_NAME[] = "nia_env_access_code";
constexpr const char APP_ENCRYPTED_DEV_COOKIE[] = "encrypted_dev_cookie";
constexpr const char APP_COMMIT_ID_AT_BUILD_TIME[] = "commit_id_at_app_build_time";
constexpr const char APP_BUILD_MODE_META_NAME[] = "nae_build_mode";
constexpr const int PACKAGE_MANAGER_GET_META_DATA = 0x00000080;
constexpr const char *VALID_BUILD_MODES[] = {"hot-reload", "static"};

template <typename T>
T getMetaDataValue(ScopedLocalEnv &scopedEnv, jobject metaDataBundle, const char *metaDataKey);

template <>
String getMetaDataValue<String>(
  ScopedLocalEnv &scopedEnv, jobject metaDataBundle, const char *metaDataKey) {
  auto bundleClass = scopedEnv.GetObjectClass(metaDataBundle);
  auto getString =
    scopedEnv.GetMethodID(bundleClass, "getString", "(Ljava/lang/String;)Ljava/lang/String;");

  ScopedLocalRef<jstring> jMetaValue = scopedEnv.CallObjectMethod<jstring>(
    metaDataBundle, getString, scopedEnv.NewStringUTF(metaDataKey));

  if (jMetaValue.get() == nullptr) {
    return String();
  }

  const char *metaValue = scopedEnv.GetStringUTFChars(jMetaValue.get(), nullptr);
  String result(metaValue);
  scopedEnv.ReleaseStringUTFChars(jMetaValue.get(), metaValue);

  return result;
}

template <>
bool getMetaDataValue<bool>(
  ScopedLocalEnv &scopedEnv, jobject metaDataBundle, const char *metaDataKey) {
  auto bundleClass = scopedEnv.GetObjectClass(metaDataBundle);
  auto getBoolean = scopedEnv.GetMethodID(bundleClass, "getBoolean", "(Ljava/lang/String;)Z");
  jboolean value =
    scopedEnv.CallBooleanMethod(metaDataBundle, getBoolean, scopedEnv.NewStringUTF(metaDataKey));
  return value == JNI_TRUE;
}

void loadManifestParams(JNIEnv *env, jobject activity, ShellAppManifestParams *manifestParams) {
  auto scopedEnv = ScopedLocalEnv(env);
  // Get the class of the activity object
  auto activityClass = scopedEnv.GetObjectClass(activity);

  // Get the PackageManager from the activity
  auto getPackageManager = scopedEnv.GetMethodID(
    activityClass, "getPackageManager", "()Landroid/content/pm/PackageManager;");
  auto packageManager = scopedEnv.CallObjectMethod<jobject>(activity, getPackageManager);

  // Get the package name from the activity
  auto getPackageName =
    scopedEnv.GetMethodID(activityClass, "getPackageName", "()Ljava/lang/String;");
  ScopedLocalRef<jstring> packageName =
    scopedEnv.CallObjectMethod<jstring>(activity, getPackageName);

  // Get the ApplicationInfo
  auto pmClass = scopedEnv.GetObjectClass(packageManager);
  auto getApplicationInfo = scopedEnv.GetMethodID(
    pmClass, "getApplicationInfo", "(Ljava/lang/String;I)Landroid/content/pm/ApplicationInfo;");
  auto appInfo = scopedEnv.CallObjectMethod<jobject>(
    packageManager, getApplicationInfo, packageName, PACKAGE_MANAGER_GET_META_DATA);

  // Get the metadata Bundle
  auto appInfoClass = scopedEnv.GetObjectClass(appInfo);
  auto metaDataField = scopedEnv.GetFieldID(appInfoClass, "metaData", "Landroid/os/Bundle;");
  auto metaDataBundle = scopedEnv.GetObjectField(appInfo, metaDataField);

  // Retrieve metadata values
  manifestParams->appUrl =
    getMetaDataValue<String>(scopedEnv, metaDataBundle.get(), APP_URL_META_NAME);
  manifestParams->niaEnvironmentAccessCode =
    getMetaDataValue<String>(scopedEnv, metaDataBundle.get(), APP_PASSCODE_META_NAME);
  manifestParams->encryptedDevCookie =
    getMetaDataValue<String>(scopedEnv, metaDataBundle.get(), APP_ENCRYPTED_DEV_COOKIE);
  manifestParams->commitIdAtAppBuildTime =
    getMetaDataValue<String>(scopedEnv, metaDataBundle.get(), APP_COMMIT_ID_AT_BUILD_TIME);

  String metaBuildModeValue =
    getMetaDataValue<String>(scopedEnv, metaDataBundle.get(), APP_BUILD_MODE_META_NAME);

  // Validate nae build mode and default to "static" if invalid
  bool isValidMode = false;

  if (!metaBuildModeValue.empty()) {
    for (const auto &mode : VALID_BUILD_MODES) {
      if (strcmp(metaBuildModeValue.c_str(), mode) == 0) {
        isValidMode = true;
        break;
      }
    }
  }

  if (isValidMode) {
    manifestParams->naeBuildMode = metaBuildModeValue;
  } else {
    manifestParams->naeBuildMode = "static";
    C8Log(
      "[shell-app-manifest] Warning: Invalid nae build mode in app manifest. Defaulting to "
      "'static'.");
  }

  manifestParams->statusBarVisible =
    getMetaDataValue<bool>(scopedEnv, metaDataBundle.get(), "status_bar_visible");
}
}  // namespace c8
