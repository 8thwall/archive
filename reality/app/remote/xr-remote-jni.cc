// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  deps = {
    ":remote-reality-postprocessor",
    "//c8:c8-log",
    "//c8:exceptions",
    "//reality/app/xr/android:xr-gl-android",
  };
  alwayslink = 1;
}
cc_end(0x2b53cc9b);

#ifdef ANDROID
#include <jni.h>

#include "c8/c8-log.h"
#include "c8/exceptions.h"
#include "reality/app/remote/remote-reality-postprocessor.h"
#include "reality/app/xr/android/xr-gl-android.h"

using namespace c8;

namespace {
static std::unique_ptr<RemoteRealityPostprocessor> staticProc = nullptr;

RemoteRealityPostprocessor *getInstance() {
  if (staticProc != nullptr) {
    return staticProc.get();
  }

  auto *xrGlAndroid = XRGLAndroid::getInstance();
  if (xrGlAndroid == nullptr) {
    C8Log("%s", "getInstance missing for xrandroid and xrglandroid");
    C8_THROW("getInstance missing for xrandroid and xrglandroid");
  }
  auto *proc = dynamic_cast<RemoteRealityPostprocessor *>(xrGlAndroid->getRealityPostprocessor());
  if (proc == nullptr) {
    C8Log("%s", "getInstance missing processor");
    return nullptr;
  }
  return proc;
}

}  // namespace

extern "C" {

JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_remote_XRRemoteJni_createRemote(JNIEnv *env, jclass clazz) {
  C8Log("[xr-remote-jni] %s", "createRemote");
  if (staticProc == nullptr) {
    staticProc.reset(new RemoteRealityPostprocessor());
  }
}

JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_remote_XRRemoteJni_destroyRemote(JNIEnv *env, jclass clazz) {
  C8Log("[xr-remote-jni] %s", "destroyRemote");
  staticProc.reset();
}

JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_remote_XRRemoteJni_enableRemote(JNIEnv *env, jclass clazz) {
  C8Log("[xr-remote-jni] %s", "enableRemote");
  auto *xrGlAndroid = XRGLAndroid::getInstance();
  if (xrGlAndroid == nullptr) {
    throw new RuntimeError("Must call XREngine::createInstance before enabling remote.");
  }
  if (staticProc != nullptr) {
    xrGlAndroid->setRealityPostprocessor(staticProc.get());
  }
  xrGlAndroid->setFeatureProvider(std::unique_ptr<FeatureProvider>(new RemoteFeatureProvider()));
  return;
}

JNIEXPORT void JNICALL Java_com_the8thwall_reality_app_remote_XRRemoteJni_sendRemoteApp(
  JNIEnv *env, jclass clazz, jobject jbytes) {
  ConstRootMessage<XrRemoteApp> server(
    env->GetDirectBufferAddress(jbytes), env->GetDirectBufferCapacity(jbytes));
  getInstance()->sendRemoteApp(server);
}

JNIEXPORT void JNICALL Java_com_the8thwall_reality_app_remote_XRRemoteJni_resumeBrowsingForServers(
  JNIEnv *env, jclass clazz) {
  C8Log("[xr-remote-jni] %s", "resumeBrowsingForServers");
  getInstance()->resumeBrowsingForServers();
}

JNIEXPORT void JNICALL Java_com_the8thwall_reality_app_remote_XRRemoteJni_pauseBrowsingForServers(
  JNIEnv *env, jclass clazz) {
  C8Log("[xr-remote-jni] %s", "pauseBrowsingForServers");
  getInstance()->pauseBrowsingForServers();
}

JNIEXPORT void JNICALL Java_com_the8thwall_reality_app_remote_XRRemoteJni_resumeConnectionToServer(
  JNIEnv *env, jclass clazz, jobject jbytes) {
  C8Log("[xr-remote-jni] %s", "resumeConnectionToServer");
  ConstRootMessage<XrServer> server(
    env->GetDirectBufferAddress(jbytes), env->GetDirectBufferCapacity(jbytes));
  getInstance()->resumeConnectionToServer(server);
}

JNIEXPORT void JNICALL Java_com_the8thwall_reality_app_remote_XRRemoteJni_pauseConnectionToServer(
  JNIEnv *env, jclass clazz) {
  C8Log("[xr-remote-jni] %s", "pauseConnectionToServer");
  getInstance()->pauseConnectionToServer();
}

JNIEXPORT jobject JNICALL
Java_com_the8thwall_reality_app_remote_XRRemoteJni_getRemoteResponse(JNIEnv *env, jclass clazz) {
  auto &m = getInstance()->remoteResponse();
  return env->NewDirectByteBuffer(
    const_cast<void *>(static_cast<const void *>(m.bytes().begin())), m.bytes().size());
}

JNIEXPORT jobject JNICALL
Java_com_the8thwall_reality_app_remote_XRRemoteJni_getRemoteConnection(JNIEnv *env, jclass clazz) {
  auto &m = getInstance()->remoteConnection();
  return env->NewDirectByteBuffer(
    const_cast<void *>(static_cast<const void *>(m.bytes().begin())), m.bytes().size());
}

}  // extern "C"
#endif  // ANDROID
