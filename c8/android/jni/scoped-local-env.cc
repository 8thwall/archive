// Copyright (c) 2024 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  hdrs = {
    "scoped-local-env.h",
  };
  deps = {
    ":scoped-local-ref",
  };
  target_compatible_with = {
    "@platforms//os:android",
  };
}
cc_end(0xb6efd251);

#include "c8/android/jni/scoped-local-env.h"

namespace c8 {

ScopedLocalRef<jclass> ScopedLocalEnv::FindClass(const char *name) {
  return ScopedLocalRef(env_, env_->FindClass(name));
}

ScopedLocalRef<jclass> ScopedLocalEnv::GetObjectClass(jobject obj) {
  return ScopedLocalRef(env_, env_->GetObjectClass(obj));
}

ScopedLocalRef<jclass> ScopedLocalEnv::GetObjectClass(const ScopedLocalRef<jobject> &ref) {
  return this->GetObjectClass(ref.get());
}

jmethodID ScopedLocalEnv::GetStaticMethodID(jclass clazz, const char *name, const char *sig) {
  return env_->GetStaticMethodID(clazz, name, sig);
}

jmethodID ScopedLocalEnv::GetStaticMethodID(
  const ScopedLocalRef<jclass> &ref, const char *name, const char *sig) {
  return this->GetStaticMethodID(ref.get(), name, sig);
}

jmethodID ScopedLocalEnv::GetMethodID(jclass clazz, const char *name, const char *sig) {
  return env_->GetMethodID(clazz, name, sig);
}

jmethodID ScopedLocalEnv::GetMethodID(
  const ScopedLocalRef<jclass> &ref, const char *name, const char *sig) {
  return this->GetMethodID(ref.get(), name, sig);
}

jfieldID ScopedLocalEnv::GetFieldID(jclass clazz, const char *name, const char *sig) {
  return env_->GetFieldID(clazz, name, sig);
}

jfieldID ScopedLocalEnv::GetFieldID(
  const ScopedLocalRef<jclass> &ref, const char *name, const char *sig) {
  return this->GetFieldID(ref.get(), name, sig);
}

ScopedLocalRef<jstring> ScopedLocalEnv::NewStringUTF(const char *utf) {
  return ScopedLocalRef(env_, env_->NewStringUTF(utf));
}

const char *ScopedLocalEnv::GetStringUTFChars(jstring str, jboolean *isCopy) {
  return env_->GetStringUTFChars(str, isCopy);
}
const char *ScopedLocalEnv::GetStringUTFChars(
  const ScopedLocalRef<jstring> &ref, jboolean *isCopy) {
  return this->GetStringUTFChars(ref.get(), isCopy);
}

void ScopedLocalEnv::ReleaseStringUTFChars(jstring str, const char *utf) {
  env_->ReleaseStringUTFChars(str, utf);
}

void ScopedLocalEnv::ReleaseStringUTFChars(const ScopedLocalRef<jstring> &ref, const char *utf) {
  this->ReleaseStringUTFChars(ref.get(), utf);
}

int ScopedLocalEnv::GetIntField(jobject obj, jfieldID fieldID) {
  return env_->GetIntField(obj, fieldID);
}

float ScopedLocalEnv::GetFloatField(jobject obj, jfieldID fieldID) {
  return env_->GetFloatField(obj, fieldID);
}

ScopedLocalRef<jobject> ScopedLocalEnv::GetObjectField(jobject obj, jfieldID fieldID) {
  return ScopedLocalRef(env_, env_->GetObjectField(obj, fieldID));
}

ScopedLocalRef<jobject> ScopedLocalEnv::GetObjectField(
  const ScopedLocalRef<jobject> &ref, jfieldID fieldID) {
  return this->GetObjectField(ref.get(), fieldID);
}

}  // namespace c8
