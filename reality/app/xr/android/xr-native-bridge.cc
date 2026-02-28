// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "reality/app/xr/android/xr-native-bridge.h"

#ifdef ANDROID

#include "c8/c8-log.h"

using namespace c8;

#include <string>

namespace {
// This hardcoded value must match the library name (libxr8.so).
const char *XR_LIBRARY_NAME = "xr8";

void checkJniReturn(JNIEnv *env, const std::string &name) {
  if (env->ExceptionCheck()) {
    C8Log("[xr-native-bridge] Exception in %s", name.c_str());
    env->ExceptionDescribe();
    env->ExceptionClear();
  } else {
    C8Log("[xr-native-bridge] Success: %s", name.c_str());
  }
}

template <typename T>
void checkJniReturn(JNIEnv *env, const std::string &name, T obj) {
  if (env->ExceptionCheck()) {
    C8Log("[xr-native-bridge] Exception in %s", name.c_str());
    env->ExceptionDescribe();
    env->ExceptionClear();
    return;
  }
  if (obj == nullptr) {
    C8Log("[xr-native-bridge] %s returned a nullptr", name.c_str());
    return;
  }
  C8Log("[xr-native-bridge] Success: %s", name.c_str());
}
}  // namespace

void XrNativeBridge::create(JNIEnv *env, jobject context, int renderingSystem) {
  C8Log("[xr-native-bridge] create(%p, %p, %d)", env, context, renderingSystem);
  destroyed_ = false;
  env_ = env;
  context_ = env_->NewGlobalRef(context);
  renderingSystem_ = renderingSystem;

  loadXrAndroidClass();
  loadXrAndroidStaticMethods();
  loadXrAndroidObjectMethods();
  createXrAndroidInstance();
}

void XrNativeBridge::loadXrAndroidClass() {
  jclass contextClass = env_->GetObjectClass(context_);
  checkJniReturn(env_, "contextClass", contextClass);

  jmethodID getClassLoaderMethod =
    env_->GetMethodID(contextClass, "getClassLoader", "()Ljava/lang/ClassLoader;");
  checkJniReturn(env_, "[loadXrAndroidClass] getClassLoaderMethod", getClassLoaderMethod);

  jobject classLoader = env_->CallObjectMethod(context_, getClassLoaderMethod);
  checkJniReturn(env_, "[loadXrAndroidClass] classLoader", classLoader);

  jclass classLoaderClass = env_->GetObjectClass(classLoader);
  checkJniReturn(env_, "[loadXrAndroidClass] classLoaderClass", classLoaderClass);

  jmethodID loadClassMethod =
    env_->GetMethodID(classLoaderClass, "loadClass", "(Ljava/lang/String;)Ljava/lang/Class;");
  checkJniReturn(env_, "[loadXrAndroidClass] loadClassMethod", loadClassMethod);

  jstring classNameString = env_->NewStringUTF("com/the8thwall/reality/app/xr/android/XREngine");
  checkJniReturn(env_, "[loadXrAndroidClass] NewStringUTF");

  jobject xrAndroidClass = env_->CallObjectMethod(classLoader, loadClassMethod, classNameString);
  checkJniReturn(env_, "[loadXrAndroidClass] xrAndroidClass_", xrAndroidClass);

  xrAndroidClass_ = static_cast<jclass>(env_->NewGlobalRef(xrAndroidClass));
  checkJniReturn(env_, "[loadXrAndroidClass] NewGlobalRef", xrAndroidClass_);

  env_->DeleteLocalRef(contextClass);
  env_->DeleteLocalRef(classLoader);
  env_->DeleteLocalRef(classLoaderClass);
  env_->DeleteLocalRef(classNameString);
  env_->DeleteLocalRef(xrAndroidClass);
  checkJniReturn(env_, "[loadXrAndroidClass] DeleteLocalRef");
}

void XrNativeBridge::loadXrAndroidStaticMethods() {
  createMethod_ =
    env_->GetStaticMethodID(xrAndroidClass_, "create", "(Landroid/content/Context;I)V");
  checkJniReturn(env_, "[loadXrAndroidStaticMethods] createMethod_", createMethod_);

  destroyMethod_ = env_->GetStaticMethodID(xrAndroidClass_, "destroy", "()V");
  checkJniReturn(env_, "[loadXrAndroidStaticMethods] destroyMethod_", destroyMethod_);

  getInstanceMethod_ = env_->GetStaticMethodID(
    xrAndroidClass_, "getInstance", "()Lcom/the8thwall/reality/app/xr/android/XREngine;");
  checkJniReturn(env_, "[loadXrAndroidStaticMethods] getInstanceMethod_", getInstanceMethod_);

  getXREnvironmentMethod_ =
    env_->GetStaticMethodID(xrAndroidClass_, "getXREnvironment", "(Landroid/content/Context;)[B");
  checkJniReturn(env_, "[loadXrAndroidStaticMethods] getXREnvironmentMethod_", getXREnvironmentMethod_);

  loadNativeLibraryMethod_ =
    env_->GetStaticMethodID(xrAndroidClass_, "loadNativeLibrary", "(Ljava/lang/String;)V");
  checkJniReturn(env_, "[loadXrAndroidStaticMethods] loadNativeLibraryMethod_", loadNativeLibraryMethod_);
}

void XrNativeBridge::loadXrAndroidObjectMethods() {
  configureMethod_ = env_->GetMethodID(xrAndroidClass_, "configure", "([B)V");
  checkJniReturn(env_, "[loadXrAndroidMethods] configureMethod_", configureMethod_);

  getCurrentRealityXRMethod_ = env_->GetMethodID(xrAndroidClass_, "getCurrentRealityXR", "()[B");
  checkJniReturn(
    env_, "[loadXrAndroidMethods] getCurrentRealityXRMethod_", getCurrentRealityXRMethod_);

  getXRAppEnvironmentMethod_ = env_->GetMethodID(xrAndroidClass_, "getXRAppEnvironment", "()[B");
  checkJniReturn(
    env_, "[loadXrAndroidMethods] getXRAppEnvironmentMethod_", getXRAppEnvironmentMethod_);

  pauseMethod_ = env_->GetMethodID(xrAndroidClass_, "pause", "()V");
  checkJniReturn(env_, "[loadXrAndroidMethods] pauseMethod_", pauseMethod_);

  queryMethod_ = env_->GetMethodID(xrAndroidClass_, "query", "([B)[B");
  checkJniReturn(env_, "[loadXrAndroidMethods] queryMethod_", queryMethod_);

  recenterMethod_ = env_->GetMethodID(xrAndroidClass_, "recenter", "()V");
  checkJniReturn(env_, "[loadXrAndroidMethods] recenterMethod_", recenterMethod_);

  renderFrameForDisplayMethod_ = env_->GetMethodID(xrAndroidClass_, "renderFrameForDisplay", "()V");
  checkJniReturn(
    env_, "[loadXrAndroidMethods] renderFrameForDisplayMethod_", renderFrameForDisplayMethod_);

  resumeMethod_ = env_->GetMethodID(xrAndroidClass_, "resume", "()V");
  checkJniReturn(env_, "[loadXrAndroidMethods] resumeMethod_", resumeMethod_);
}

void XrNativeBridge::createXrAndroidInstance() {
  jstring libraryNameString = env_->NewStringUTF(XR_LIBRARY_NAME);
  checkJniReturn(env_, "[createXrAndroidInstance] NewStringUTF", libraryNameString);

  env_->CallStaticVoidMethod(xrAndroidClass_, loadNativeLibraryMethod_, libraryNameString);
  checkJniReturn(env_, "[createXrAndroidInstance] loadNativeLibraryMethod_");

  env_->CallStaticVoidMethod(xrAndroidClass_, createMethod_, context_, renderingSystem_);
  checkJniReturn(env_, "[createXrAndroidInstance] createMethod_");

  jobject xrAndroid = env_->CallStaticObjectMethod(xrAndroidClass_, getInstanceMethod_);
  checkJniReturn(env_, "[createXrAndroidInstance] xrAndroid", xrAndroid);

  xrAndroid_ = env_->NewGlobalRef(xrAndroid);
  checkJniReturn(env_, "[createXrAndroidInstance] NewGlobalRef", xrAndroid_);

  env_->DeleteLocalRef(libraryNameString);
  env_->DeleteLocalRef(xrAndroid);
  checkJniReturn(env_, "[createXrAndroidInstance] DeleteLocalRef");
}

void XrNativeBridge::configure(MutableRootMessage<XRConfiguration> &config) {
  ConstRootMessage<XRConfiguration> flat(config);
  jbyteArray bytes = env_->NewByteArray(flat.bytes().size());
  checkJniReturn(env_, "[configure] bytes", bytes);

  env_->SetByteArrayRegion(
    bytes, 0, flat.bytes().size(), reinterpret_cast<const jbyte *>(flat.bytes().begin()));
  checkJniReturn(env_, "[configure] SetByteArrayRegion");

  env_->CallVoidMethod(xrAndroid_, configureMethod_, bytes);
  checkJniReturn(env_, "[configure] CallVoidMethod");

  env_->DeleteLocalRef(bytes);
  checkJniReturn(env_, "[configure] DeleteLocalRef");
}

ConstRootMessage<RealityResponse> XrNativeBridge::currentRealityXR() {
  jbyteArray bytes =
    static_cast<jbyteArray>(env_->CallObjectMethod(xrAndroid_, getCurrentRealityXRMethod_));
  checkJniReturn(env_, "[currentRealityXR] CallObjectMethod");

  // Create a heap array to hold the return bytes.
  size_t len = env_->GetArrayLength(bytes);
  kj::Array<capnp::word> arr = kj::heapArray<capnp::word>(len / sizeof(capnp::word));

  // Copy the java bytes into the new buffer.
  env_->GetByteArrayRegion(bytes, 0, len, reinterpret_cast<jbyte *>(arr.begin()));
  checkJniReturn(env_, "[currentRealityXR] GetByteArrayRegion");

  // Mark the java bytes for garbage collection.
  env_->DeleteLocalRef(bytes);
  checkJniReturn(env_, "[currentRealityXR] DeleteLocalRef");

  // Move the allocated array into the return message so we don't have to do yet another copy.
  return ConstRootMessage<RealityResponse>(std::move(arr));
}

void XrNativeBridge::destroy() {
  destroyed_ = true;

  env_->CallStaticVoidMethod(xrAndroidClass_, destroyMethod_);
  checkJniReturn(env_, "[destroy] CallStaticVoidMethod");

  env_->DeleteGlobalRef(context_);
  env_->DeleteGlobalRef(xrAndroid_);
  env_->DeleteGlobalRef(xrAndroidClass_);
  checkJniReturn(env_, "[destroy] DeleteGlobalRef");
}

void XrNativeBridge::pause() {
  env_->CallVoidMethod(xrAndroid_, pauseMethod_);
  checkJniReturn(env_, "[pause] CallVoidMethod");
}

ConstRootMessage<XrQueryResponse> XrNativeBridge::query(
  MutableRootMessage<XrQueryRequest> &m) {
  // Flatten the request message.
  ConstRootMessage<XrQueryRequest> flat(m);

  // Allocate a java array to hold the message.
  jbyteArray queryBytes = env_->NewByteArray(flat.bytes().size());
  checkJniReturn(env_, "[query] NewByteArray", queryBytes);

  // Copy the flatened message to the java array.
  env_->SetByteArrayRegion(
    queryBytes, 0, flat.bytes().size(), reinterpret_cast<const jbyte *>(flat.bytes().begin()));
  checkJniReturn(env_, "[query] SetByteArrayRegion");

  // Call the query method.
  jbyteArray bytes = static_cast<jbyteArray>(
    env_->CallObjectMethod(xrAndroid_, queryMethod_, queryBytes));
  checkJniReturn(env_, "[query] CallObjectMethod");

  // Create a heap array to hold the return bytes.
  size_t len = env_->GetArrayLength(bytes);
  kj::Array<capnp::word> arr = kj::heapArray<capnp::word>(len / sizeof(capnp::word));

  // Copy the java bytes into the new buffer.
  env_->GetByteArrayRegion(bytes, 0, len, reinterpret_cast<jbyte *>(arr.begin()));
  checkJniReturn(env_, "[query] GetByteArrayRegion");

  // Mark the java bytes for garbage collection.
  env_->DeleteLocalRef(queryBytes);
  env_->DeleteLocalRef(bytes);
  checkJniReturn(env_, "[query] DeleteLocalRef");

  // Move the allocated array into the return message so we don't have to do yet another copy.
  return ConstRootMessage<XrQueryResponse>(std::move(arr));
}

void XrNativeBridge::recenter() {
  env_->CallVoidMethod(xrAndroid_, recenterMethod_);
  checkJniReturn(env_, "[recenter] CallVoidMethod");
}

void XrNativeBridge::renderFrameForDisplay() {
  env_->CallVoidMethod(xrAndroid_, renderFrameForDisplayMethod_);
  checkJniReturn(env_, "[renderFrameForDisplay] CallVoidMethod");
}

void XrNativeBridge::resume() {
  env_->CallVoidMethod(xrAndroid_, resumeMethod_);
  checkJniReturn(env_, "[resume] CallVoidMethod");
}

ConstRootMessage<XRAppEnvironment> XrNativeBridge::xrAppEnvironment() {
  jbyteArray bytes =
    static_cast<jbyteArray>(env_->CallObjectMethod(xrAndroid_, getXRAppEnvironmentMethod_));
  checkJniReturn(env_, "[xrAppEnvironment] CallObjectMethod");

  // Create a heap array to hold the return bytes.
  size_t len = env_->GetArrayLength(bytes);
  kj::Array<capnp::word> arr = kj::heapArray<capnp::word>(len / sizeof(capnp::word));

  // Copy the java bytes into the new buffer.
  env_->GetByteArrayRegion(bytes, 0, len, reinterpret_cast<jbyte *>(arr.begin()));
  checkJniReturn(env_, "[xrAppEnvironment] GetByteArrayRegion");

  // Mark the java bytes for garbage collection.
  env_->DeleteLocalRef(bytes);
  checkJniReturn(env_, "[xrAppEnvironment] DeleteLocalRef");

  // Move the allocated array into the return message so we don't have to do yet another copy.
  return ConstRootMessage<XRAppEnvironment>(std::move(arr));
}

ConstRootMessage<XREnvironment> XrNativeBridge::xrEnvironment() {
  jbyteArray bytes = static_cast<jbyteArray>(
    env_->CallStaticObjectMethod(xrAndroidClass_, getXREnvironmentMethod_, context_));
  checkJniReturn(env_, "[xrEnvironment] CallObjectMethod");

  // Create a heap array to hold the return bytes.
  size_t len = env_->GetArrayLength(bytes);
  kj::Array<capnp::word> arr = kj::heapArray<capnp::word>(len / sizeof(capnp::word));

  // Copy the java bytes into the new buffer.
  env_->GetByteArrayRegion(bytes, 0, len, reinterpret_cast<jbyte *>(arr.begin()));
  checkJniReturn(env_, "[xrEnvironment] GetByteArrayRegion");

  // Mark the java bytes for garbage collection.
  env_->DeleteLocalRef(bytes);
  checkJniReturn(env_, "[xrEnvironment] DeleteLocalRef");

  // Move the allocated array into the return message so we don't have to do yet another copy.
  return ConstRootMessage<XREnvironment>(std::move(arr));
}

// XRAppEnvironment.Builder GetMutableXRAppEnvironment();

// public void CommitAppEnvironment();

// void SetManagedCameraRGBATexture(
//   System.IntPtr texHandle, int width, int height, int renderingSystem);

// void SetManagedCameraYTexture(
//   System.IntPtr texHandle, int width, int height, int renderingSystem);

// void SetManagedCameraUVTexture(
//   System.IntPtr texHandle, int width, int height, int renderingSystem);

// XrRemoteApp.Reader GetXRRemote();

// void SetEditorAppInfo(MessageBuilder message);

// bool IsStreamingSupported();

// bool IsRemoteConnected();

// IntPtr GetRenderEventFunc() { return XRGetRenderEventFunc(); }

XrNativeBridge::~XrNativeBridge() {
  if (!destroyed_) {
    destroy();
  }
}

#endif  // ANDROID
