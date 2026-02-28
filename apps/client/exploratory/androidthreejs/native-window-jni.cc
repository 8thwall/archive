#ifdef ANDROID
#include <android/native_window_jni.h>
#endif

#include <jni.h>

extern "C" {

JNIEXPORT jlong JNICALL
Java_com_nianticlabs_apps_client_exploratory_androidthreejs_NativeWindowJni_acquireSurface(
  JNIEnv *env, jclass clazz, jobject surface) {
#ifdef ANDROID
  ANativeWindow *nativeWindow = ANativeWindow_fromSurface(env, surface);
#else
  void *nativeWindow = nullptr;
#endif
  return reinterpret_cast<jlong>(nativeWindow);
}

JNIEXPORT void JNICALL
Java_com_nianticlabs_apps_client_exploratory_androidthreejs_NativeWindowJni_releaseSurface(
  JNIEnv *env, jclass clazz, jlong nativeWindow) {
#ifdef ANDROID
  ANativeWindow *nativeWindowPtr = reinterpret_cast<ANativeWindow *>(nativeWindow);
  ANativeWindow_release(nativeWindowPtr);
#endif
}

}  // extern "C"
