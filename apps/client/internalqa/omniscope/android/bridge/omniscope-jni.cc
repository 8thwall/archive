// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "apps/client/internalqa/omniscope/native/pipeline/omniscope-pipeline.h"

#ifdef ANDROID
#include <capnp/serialize.h>
#include <jni.h>

#include "c8/io/capnp-messages.h"
#include "c8/release-config.h"
#include "c8/string.h"
#include "c8/vector.h"

using namespace c8;

extern "C" {
JNIEXPORT void JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_deleteXRAndroid(
  JNIEnv *env, jclass clazz) {
  OmniscopePipeline::destroyInstance();
}

JNIEXPORT jobject JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_executeStagedRealityRequest(
  JNIEnv *env, jclass clazz) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();

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
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_newXRAndroid(
  JNIEnv *env, jclass clazz) {
  OmniscopePipeline::createInstance();
}

// Render one frame.
JNIEXPORT void JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_renderFrameForDisplay(
  JNIEnv *env, jclass clazz) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();
  engine->renderFrameForDisplay();
}

// Initialize OpenGL Context.
JNIEXPORT void JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_createCaptureContext(
  JNIEnv *env, jclass clazz, jlong sharedContext) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();
  engine->createCaptureContext(reinterpret_cast<void *>(sharedContext));
}

JNIEXPORT void JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_initializeCameraPipeline(
  JNIEnv *env, jclass clazz, int captureWidth, int captureHeight) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();
  engine->initializeCameraPipeline(captureWidth, captureHeight);
}

// Get the OpenGL OES_EXTERNAL_TEXTURE for writing capture frames. Must be called after context is
// initialized.
JNIEXPORT jint JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_getSourceTexture(
  JNIEnv *env, jclass clazz) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();
  return engine->getSourceTexture();
}

JNIEXPORT jint JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_currentView(
  JNIEnv *env, jclass clazz) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();
  return engine->currentView();
}

JNIEXPORT void JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_setView(
  JNIEnv *env, jclass clazz, jint num) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();
  return engine->setView(num);
}

JNIEXPORT void JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_gotTouches(
  JNIEnv *env, jclass clazz, jint count) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();
  return engine->gotTouches(count);
}

JNIEXPORT void JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_goNext(
  JNIEnv *env, jclass clazz) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();
  engine->goNext();
}

JNIEXPORT void JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_goPrev(
  JNIEnv *env, jclass clazz) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();
  return engine->goPrev();
}

// Destroy OpenGL Context.
JNIEXPORT void JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_destroyCaptureContext(
  JNIEnv *env, jclass clazz, jlong glProcessor) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();
  engine->destroyCaptureContext();
}

// Process opengl frame.
JNIEXPORT void JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_processGlFrameAndStageRequest(
  JNIEnv *env, jclass clazz, jfloatArray mtxArray, jobject jrequest) {
  jfloat *jMtx = env->GetFloatArrayElements(mtxArray, 0);
  float mtx[16];

  for (int i = 0; i < 16; ++i) {
    mtx[i] = jMtx[i];
  }

  env->ReleaseFloatArrayElements(mtxArray, jMtx, 0);

  ConstRootMessage<RealityRequest> request(
    env->GetDirectBufferAddress(jrequest), env->GetDirectBufferCapacity(jrequest));

  OmniscopePipeline *engine = OmniscopePipeline::getInstance();
  engine->processGlFrameAndStageRequest(mtx, request);
}

// Pause.
JNIEXPORT void JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_pause(
  JNIEnv *env, jclass clazz) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();
  engine->pause();
}

// Resume.
JNIEXPORT void JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_resume(
  JNIEnv *env, jclass clazz) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();
  engine->resume();
}

JNIEXPORT void JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_configure(
  JNIEnv *env, jclass clazz, jobject jrecordheader) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();

  ConstRootMessage<XRConfiguration> config(
    env->GetDirectBufferAddress(jrecordheader), env->GetDirectBufferCapacity(jrecordheader));

  engine->configure(config.reader());
}

JNIEXPORT jbyteArray JNICALL
Java_com_the8thwall_apps_client_internalqa_omniscope_android_bridge_OmniscopeJni_getAndResetAnalyticsRecord(
  JNIEnv *env, jclass clazz, jobject jrecordheader) {
  OmniscopePipeline *engine = OmniscopePipeline::getInstance();

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
