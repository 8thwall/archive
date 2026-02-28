// Copyright (c) 2024 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#pragma once

#include <jni.h>

/**
 * ScopedLocalRef is a RAII class that manages a local reference to a JNI object.
 * Android JNI functions that return local references must be deleted with DeleteLocalRef when
 * they are created from within the context of a native thread attached with AttachCurrentThread.
 * https://developer.android.com/training/articles/perf-jni#local-and-global-references
 */
namespace c8 {
template <typename T>
class ScopedLocalRef {
public:
  ScopedLocalRef(JNIEnv *env, T localRef) : env_(env), localRef_(localRef) {}

  ~ScopedLocalRef() {
    if (localRef_ != nullptr) {
      env_->DeleteLocalRef(localRef_);
    }
  }

  T get() const { return localRef_; }

private:
  JNIEnv *env_;
  T localRef_;
};
}  // namespace c8
