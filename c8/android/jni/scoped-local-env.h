// Copyright (c) 2024 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#pragma once

#include <jni.h>

#include <type_traits>

#include "c8/android/jni/scoped-local-ref.h"

namespace c8 {
class ScopedLocalEnv {
public:
  explicit ScopedLocalEnv(JNIEnv *env) : env_(env) {}

  template <typename... Args>
  ScopedLocalRef<jobject> NewObject(jclass clazz, jmethodID methodID, Args &&...args) {
    jobject result =
      env_->NewObject(clazz, methodID, this->processArg(std::forward<Args>(args))...);
    return ScopedLocalRef(env_, result);
  }

  template <typename... Args>
  ScopedLocalRef<jobject> NewObject(
    const ScopedLocalRef<jclass> &ref, jmethodID methodID, Args &&...args) {
    return this->NewObject(ref.get(), methodID, std::forward<Args>(args)...);
  }

  ScopedLocalRef<jclass> FindClass(const char *name);

  ScopedLocalRef<jclass> GetObjectClass(jobject obj);
  ScopedLocalRef<jclass> GetObjectClass(const ScopedLocalRef<jobject> &ref);

  jmethodID GetStaticMethodID(jclass clazz, const char *name, const char *sig);
  jmethodID GetStaticMethodID(const ScopedLocalRef<jclass> &ref, const char *name, const char *sig);

  jmethodID GetMethodID(jclass clazz, const char *name, const char *sig);
  jmethodID GetMethodID(const ScopedLocalRef<jclass> &ref, const char *name, const char *sig);

  jfieldID GetFieldID(jclass clazz, const char *name, const char *sig);
  jfieldID GetFieldID(const ScopedLocalRef<jclass> &ref, const char *name, const char *sig);

  template <typename RefType, typename... Args>
  ScopedLocalRef<RefType> CallStaticObjectMethod(jclass clazz, jmethodID methodID, Args &&...args) {
    RefType result = static_cast<RefType>(
      env_->CallStaticObjectMethod(clazz, methodID, this->processArg(std::forward<Args>(args))...));
    return ScopedLocalRef(env_, result);
  }

  template <typename RefType, typename... Args>
  ScopedLocalRef<RefType> CallStaticObjectMethod(
    const ScopedLocalRef<jclass> &ref, jmethodID methodID, Args &&...args) {
    return this->CallStaticObjectMethod<RefType>(ref.get(), methodID, std::forward<Args>(args)...);
  }

  template <typename RefType, typename... Args>
  ScopedLocalRef<RefType> CallObjectMethod(jobject obj, jmethodID methodID, Args &&...args) {
    RefType result = static_cast<RefType>(
      env_->CallObjectMethod(obj, methodID, this->processArg(std::forward<Args>(args))...));
    return ScopedLocalRef(env_, result);
  }

  template <typename RefType, typename... Args>
  ScopedLocalRef<RefType> CallObjectMethod(
    const ScopedLocalRef<jobject> &ref, jmethodID methodID, Args &&...args) {
    return this->CallObjectMethod<RefType>(ref.get(), methodID, std::forward<Args>(args)...);
  }

  template <typename... Args>
  void CallVoidMethod(jobject obj, jmethodID methodID, Args &&...args) {
    env_->CallVoidMethod(obj, methodID, this->processArg(std::forward<Args>(args))...);
  }

  template <typename... Args>
  void CallVoidMethod(const ScopedLocalRef<jobject> &ref, jmethodID methodID, Args &&...args) {
    this->CallVoidMethod(ref.get(), methodID, std::forward<Args>(args)...);
  }

  template <typename... Args>
  jboolean CallBooleanMethod(jobject obj, jmethodID methodID, Args &&...args) {
    return env_->CallBooleanMethod(obj, methodID, this->processArg(std::forward<Args>(args))...);
  }

  template <typename... Args>
  jboolean CallBooleanMethod(
    const ScopedLocalRef<jobject> &ref, jmethodID methodID, Args &&...args) {
    return this->CallBooleanMethod(ref.get(), methodID, std::forward<Args>(args)...);
  }

  template <typename... Args>
  jint CallIntMethod(jobject obj, jmethodID methodID, Args &&...args) {
    return env_->CallIntMethod(obj, methodID, this->processArg(std::forward<Args>(args))...);
  }

  template <typename... Args>
  jint CallIntMethod(const ScopedLocalRef<jobject> &ref, jmethodID methodID, Args &&...args) {
    return this->CallIntMethod(ref.get(), methodID, std::forward<Args>(args)...);
  }

  template <typename... Args>
  jint CallStaticIntMethod(jclass clazz, jmethodID methodID, Args &&...args) {
    return env_->CallStaticIntMethod(
      clazz, methodID, this->processArg(std::forward<Args>(args))...);
  }

  template <typename... Args>
  jint CallStaticIntMethod(const ScopedLocalRef<jclass> &ref, jmethodID methodID, Args &&...args) {
    return this->CallStaticIntMethod(ref.get(), methodID, std::forward<Args>(args)...);
  }

  ScopedLocalRef<jstring> NewStringUTF(const char *utf);

  const char *GetStringUTFChars(jstring str, jboolean *isCopy);
  const char *GetStringUTFChars(const ScopedLocalRef<jstring> &ref, jboolean *isCopy);

  void ReleaseStringUTFChars(jstring str, const char *utf);
  void ReleaseStringUTFChars(const ScopedLocalRef<jstring> &ref, const char *utf);

  template <typename RefType>
  ScopedLocalRef<RefType> GetObjectArrayElement(jobjectArray array, jsize index) {
    return ScopedLocalRef(env_, env_->GetObjectArrayElement(array, index));
  }

  template <typename RefType>
  ScopedLocalRef<RefType> GetObjectArrayElement(
    const ScopedLocalRef<jobjectArray> &ref, jsize index) {
    return this->GetObjectArrayElement<RefType>(ref.get(), index);
  }

  int GetIntField(jobject obj, jfieldID fieldID);
  float GetFloatField(jobject obj, jfieldID fieldID);

  ScopedLocalRef<jobject> GetObjectField(jobject obj, jfieldID fieldID);
  ScopedLocalRef<jobject> GetObjectField(const ScopedLocalRef<jobject> &ref, jfieldID fieldID);

  // TODO(alvinp): Add other JNI functions as needed.

  JNIEnv *get() const { return env_; }

private:
  JNIEnv *env_;

  template <typename T>
  struct isScopedLocalRef : std::false_type {};

  template <typename U>
  struct isScopedLocalRef<ScopedLocalRef<U>> : std::true_type {};

  template <typename T>
  decltype(auto) processArg(T &&arg) {
    if constexpr (isScopedLocalRef<std::remove_cvref_t<T>>::value) {
      return arg.get();
    } else {
      return std::forward<T>(arg);
    }
  }
};
}  // namespace c8
