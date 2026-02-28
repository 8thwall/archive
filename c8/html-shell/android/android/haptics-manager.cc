// Copyright (c) 2025 Niantic Spatial, Inc.
// Original Author: Lucas Reyna (lucas@nianticspatial.com)

#include "c8/html-shell/android/android/haptics-manager.h"

#include "c8/c8-log.h"

static constexpr int DEFAULT_REPEAT = -1;

namespace {
void checkJniReturn(JNIEnv *env, const std::string &name) {
  if (env->ExceptionCheck()) {
    c8::C8Log("[haptics-manager] Exception in %s", name.c_str());
    env->ExceptionDescribe();
    env->ExceptionClear();
  }
}

template <typename T>
void checkJniReturn(JNIEnv *env, const std::string &name, T obj) {
  if (env->ExceptionCheck()) {
    c8::C8Log("[haptics-manager] Exception in %s", name.c_str());
    env->ExceptionDescribe();
    env->ExceptionClear();
    return;
  }
  if (obj == nullptr) {
    c8::C8Log("[haptics-manager] %s returned a nullptr", name.c_str());
    return;
  }
}
}  // namespace

namespace c8 {

void HapticsManager::initializeHapticsManager(struct android_app *app) {
  if (vibrationHelperInitialized_) {
    return;
  }

  if (!app) {
    C8Log("[haptics-manager] HapticsManager initialized with null android_app or JNIEnv");
    return;
  }

  app_ = app;
  vibrationHelperInitialized_ = true;
}

void HapticsManager::setUpVibrationHelperClass(JNIEnv *env) {
  jobject activity = app_->activity->clazz;
  jclass activityClass = env->GetObjectClass(activity);

  jmethodID getClassLoaderMethod =
    env->GetMethodID(activityClass, "getClassLoader", "()Ljava/lang/ClassLoader;");
  checkJniReturn(env, "[haptics-manager] getClassLoaderMethod", getClassLoaderMethod);

  jobject classLoader = env->CallObjectMethod(activity, getClassLoaderMethod);
  checkJniReturn(env, "[haptics-manager] classLoader", classLoader);

  jclass classLoaderClass = env->GetObjectClass(classLoader);
  checkJniReturn(env, "[haptics-manager] classLoaderClass", classLoaderClass);

  jmethodID loadClassMethod =
    env->GetMethodID(classLoaderClass, "loadClass", "(Ljava/lang/String;)Ljava/lang/Class;");
  checkJniReturn(env, "[haptics-manager] loadClassMethod", loadClassMethod);

  jstring className = env->NewStringUTF("com/the8thwall/htmlshell/android/VibrationHelper");
  checkJniReturn(env, "[haptics-manager] NewStringUTF", className);

  jobject vibrationHelperClass = env->CallObjectMethod(classLoader, loadClassMethod, className);
  checkJniReturn(env, "[haptics-manager] vibrationHelperClass", vibrationHelperClass);

  vibrationHelperClass_ = static_cast<jclass>(env->NewGlobalRef(vibrationHelperClass));
  checkJniReturn(env, "[haptics-manager] NewGlobalRef", vibrationHelperClass_);

  jmethodID init =
    env->GetStaticMethodID(vibrationHelperClass_, "init", "(Landroid/content/Context;)V");
  checkJniReturn(env, "[haptics-manager] init", init);

  env->CallStaticVoidMethod(vibrationHelperClass_, init, activity);

  env->DeleteLocalRef(activityClass);
  env->DeleteLocalRef(classLoader);
  env->DeleteLocalRef(classLoaderClass);
  env->DeleteLocalRef(className);
  env->DeleteLocalRef(vibrationHelperClass);
  checkJniReturn(env, "[haptics-manager] DeleteLocalRef");
}

void HapticsManager::playHapticPattern(const Vector<int> &pattern) {
  if (!vibrationHelperInitialized_) {
    C8Log("[haptics-manager] HapticsManager not initialized");
    return;
  }

  JNIEnv *env = nullptr;

  jint attachResult = app_->activity->vm->AttachCurrentThread(&env, nullptr);
  if (attachResult != JNI_OK) {
    C8Log("[haptics-manager] Failed to attach thread to JVM: %d", attachResult);
    return;
  }

  if (!vibrationHelperClass_) {
    setUpVibrationHelperClass(env);
  }

  jmethodID vibratePatternMethod =
    env->GetStaticMethodID(vibrationHelperClass_, "vibratePattern", "([J[II)V");
  checkJniReturn(env, "[haptics-manager] vibratePatternMethod", vibratePatternMethod);

  jsize len = static_cast<jsize>(pattern.size());
  jlongArray jPattern = env->NewLongArray(len);
  Vector<jlong> patternLong(pattern.begin(), pattern.end());
  env->SetLongArrayRegion(jPattern, 0, len, patternLong.data());

  static constexpr int DEFAULT_AMPLITUDE = 128;
  jintArray jAmplitudes = env->NewIntArray(len);
  Vector<jint> amplitudes(len, DEFAULT_AMPLITUDE);
  env->SetIntArrayRegion(jAmplitudes, 0, len, amplitudes.data());

  env->CallStaticVoidMethod(
    vibrationHelperClass_, vibratePatternMethod, jPattern, jAmplitudes, (jint)DEFAULT_REPEAT);

  env->DeleteLocalRef(jPattern);
  env->DeleteLocalRef(jAmplitudes);

  app_->activity->vm->DetachCurrentThread();
}

}  // namespace c8
