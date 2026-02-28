// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  deps = {
    ":disk-reality-postprocessor",
    "//c8:c8-log",
    "//c8:exceptions",
    "//reality/app/xr/android:xr-gl-android",
  };
  alwayslink = 1;
}
cc_end(0x62229a00);

#ifdef ANDROID
#include <jni.h>

#include "c8/c8-log.h"
#include "c8/exceptions.h"
#include "reality/app/disk/disk-reality-postprocessor.h"
#include "reality/app/xr/android/xr-gl-android.h"

using namespace c8;

namespace {
static std::unique_ptr<DiskRealityPostprocessor> staticProc = nullptr;

DiskRealityPostprocessor *getInstance() {
  if (staticProc != nullptr) {
    return staticProc.get();
  }

  auto *xrAndroid = XRGLAndroid::getInstance();
  if (xrAndroid == nullptr) {
    C8Log("[xr-disk-jni] %s", "getInstance missing xrAndroid");
    return nullptr;
  }

  auto *proc = dynamic_cast<DiskRealityPostprocessor *>(xrAndroid->getRealityPostprocessor());
  if (proc == nullptr) {
    C8Log("[xr-disk-jni] %s", "getInstance missing processor");
    return nullptr;
  }

  return proc;
}

}  // namespace

extern "C" {

JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_disk_XRDiskJni_create(JNIEnv *env, jclass clazz) {
  C8Log("[xr-disk-jni] %s", "create");
  auto *xrAndroid = XRGLAndroid::getInstance();
  if (xrAndroid == nullptr) {
    throw new RuntimeError(
      "Must call XRAndroid::createInstance before creating DiskRealityPostprocessor.");
  }
  if (staticProc == nullptr) {
    staticProc.reset(new DiskRealityPostprocessor());
    staticProc->setEncodeJpg(true);
  }
  xrAndroid->setRealityPostprocessor(staticProc.get());
  xrAndroid->setFeatureProvider(std::unique_ptr<FeatureProvider>(new RemoteFeatureProvider()));
}

JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_disk_XRDiskJni_destroy(JNIEnv *env, jclass clazz) {
  C8Log("[xr-disk-jni] %s", "destroy");
  staticProc.reset();
}

JNIEXPORT bool JNICALL
Java_com_the8thwall_reality_app_disk_XRDiskJni_isLogging(JNIEnv *env, jclass clazz) {
  return getInstance()->isLogging();
}

JNIEXPORT int JNICALL
Java_com_the8thwall_reality_app_disk_XRDiskJni_framesLogged(JNIEnv *env, jclass clazz) {
  return getInstance()->framesLogged();
}

JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_disk_XRDiskJni_logToDisk(JNIEnv *env, jclass clazz, int numFrames) {
  getInstance()->logToDisk(numFrames);
}

}  // extern "C"
#endif  // ANDROID
