// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  deps = {
    ":xr-gl-android",
    ":xr-gl-android-processor",
    "//c8:release-config",
    "//c8:string",
    "//c8:vector",
    "//c8/io:capnp-messages",
  };
  alwayslink = 1;
}
cc_end(0x5ae830eb);

#include "reality/app/xr/android/xr-gl-android.h"

#ifdef ANDROID
#include <capnp/serialize.h>
#include <jni.h>

#include "c8/io/capnp-messages.h"
#include "c8/release-config.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/app/xr/android/xr-gl-android-processor.h"

using namespace c8;

extern "C" {

JNIEXPORT void JNICALL Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_deleteXRAndroid(
  JNIEnv *env, jclass clazz) {
  XRGLAndroid::destroyInstance();
}

JNIEXPORT jobject JNICALL Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_query(
  JNIEnv *env, jclass clazz, jobject jrequest) {
  XRGLAndroid *engine = XRGLAndroid::getInstance();

  ConstRootMessage<XrQueryRequest> request(
    env->GetDirectBufferAddress(jrequest), env->GetDirectBufferCapacity(jrequest));

  auto responsePtr = engine->query(request.reader());

  // jni can't protect const memory from being modified through direct byte buffers
  // but we know callers shouldn't modify this memory.
  jobject jresponse = env->NewDirectByteBuffer(
    const_cast<void *>(static_cast<const void *>(responsePtr.begin())), responsePtr.size());
  return jresponse;
}

JNIEXPORT void JNICALL Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_configure(
  JNIEnv *env, jclass clazz, jobject jrequest) {
  XRGLAndroid *engine = XRGLAndroid::getInstance();

  ConstRootMessage<XRConfiguration> config(
    env->GetDirectBufferAddress(jrequest), env->GetDirectBufferCapacity(jrequest));

  engine->configure(config.reader());
}

JNIEXPORT jobject JNICALL
Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_executeStagedRealityRequest(
  JNIEnv *env, jclass clazz) {
  XRGLAndroid *engine = XRGLAndroid::getInstance();

  // Run the request and get back a pointer to a serialized response; the memory for the response
  // itself is owned by the engine.
  kj::ArrayPtr<const uint8_t> serializedResponsePtr =
    engine->executeStagedRequestAndGetSerializedResponsePtr();

  // Wrap the response pointer in a java byte buffer to return through JNI.
  // jni can't protect const memory from being modified through direct byte buffers
  // but we know callers shouldn't modify this memory.
  jobject jresponse = env->NewDirectByteBuffer(
    const_cast<void *>(static_cast<const void *>(serializedResponsePtr.begin())),
    serializedResponsePtr.size());
  return jresponse;
}

JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_newXRAndroid(JNIEnv *env, jclass clazz) {
  XRGLAndroid::createInstance();
}

// Render one frame.
JNIEXPORT jobject JNICALL
Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_renderFrameForDisplay(
  JNIEnv *env, jclass clazz) {
  XRGLAndroid *engine = XRGLAndroid::getInstance();

  // Run the request and get back a pointer to a serialized response; the memory for the response
  // itself is owned by the engine.
  kj::ArrayPtr<const uint8_t> serializedResponsePtr = engine->renderFrameForDisplay();

  // Wrap the response pointer in a java byte buffer to return through JNI.
  // jni can't protect const memory from being modified through direct byte buffers
  // but we know callers shouldn't modify this memory.
  jobject jresponse = env->NewDirectByteBuffer(
    const_cast<void *>(static_cast<const void *>(serializedResponsePtr.begin())),
    serializedResponsePtr.size());
  return jresponse;
}

// Initialize OpenGL Context.
JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_createCaptureContext(
  JNIEnv *env, jclass clazz, jlong sharedContext) {
  XRGLAndroid *engine = XRGLAndroid::getInstance();
  engine->createCaptureContext(reinterpret_cast<void *>(sharedContext));
}

JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_initializeCameraPipeline(
  JNIEnv *env, jclass clazz, int captureWidth, int captureHeight) {
  XRGLAndroid *engine = XRGLAndroid::getInstance();
  engine->initializeCameraPipeline(captureWidth, captureHeight);
}

// Get the OpenGL OES_EXTERNAL_TEXTURE for writing capture frames. Must be called after context is
// initialized.
JNIEXPORT jint JNICALL Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_getSourceTexture(
  JNIEnv *env, jclass clazz) {
  XRGLAndroid *engine = XRGLAndroid::getInstance();
  return engine->getSourceTexture();
}

// Destroy OpenGL Context.
JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_destroyCaptureContext(
  JNIEnv *env, jclass clazz, jlong glProcessor) {
  XRGLAndroid *engine = XRGLAndroid::getInstance();
  engine->destroyCaptureContext();
}

// Process opengl frame.
JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_processGlFrameAndStageRequest(
  JNIEnv *env, jclass clazz, jfloatArray mtxArray, jobject jrequest) {
  jfloat *jMtx = env->GetFloatArrayElements(mtxArray, 0);
  float mtx[16];

  for (int i = 0; i < 16; ++i) {
    mtx[i] = jMtx[i];
  }

  env->ReleaseFloatArrayElements(mtxArray, jMtx, 0);

  ConstRootMessage<RealityRequest> request(
    env->GetDirectBufferAddress(jrequest), env->GetDirectBufferCapacity(jrequest));

  XRGLAndroid *engine = XRGLAndroid::getInstance();
  engine->processGlFrameAndStageRequest(mtx, request);
}

// Pause.
JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_pause(JNIEnv *env, jclass clazz) {
  XRGLAndroid *engine = XRGLAndroid::getInstance();
  engine->pause();
}

// Resume.
JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_resume(JNIEnv *env, jclass clazz) {
  XRGLAndroid *engine = XRGLAndroid::getInstance();
  engine->resume();
}

// Recenter.
JNIEXPORT void JNICALL
Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_recenter(JNIEnv *env, jclass clazz) {
  XRGLAndroid *engine = XRGLAndroid::getInstance();
  engine->recenter();
}

JNIEXPORT jbyteArray JNICALL
Java_com_the8thwall_reality_app_xr_android_XRGLAndroidJni_getAndResetAnalyticsRecord(
  JNIEnv *env, jclass clazz, jobject jrecordheader) {
  XRGLAndroid *engine = XRGLAndroid::getInstance();

  ConstRootMessage<LogRecordHeader> recordHeader(
    env->GetDirectBufferAddress(jrecordheader), env->GetDirectBufferCapacity(jrecordheader));

  auto serializedRecord = engine->getAndResetAnalyticsRecord(recordHeader.reader());

  jbyteArray jrecord = env->NewByteArray(serializedRecord->size());
  env->SetByteArrayRegion(
    jrecord,
    0,
    serializedRecord->size(),
    reinterpret_cast<const jbyte *>(serializedRecord->data()));

  return jrecord;
}

}  // extern "C"
#endif  // ANDROID
