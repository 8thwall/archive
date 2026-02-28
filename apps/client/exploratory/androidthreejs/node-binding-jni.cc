
#include <jni.h>

#include "apps/client/exploratory/androidthreejs/node-binding.h"
#include "c8/string.h"
#include "c8/vector.h"

using c8::NodeBinding;
using c8::String;
using c8::Vector;

extern "C" JNIEXPORT jint JNICALL
Java_com_nianticlabs_apps_client_exploratory_androidthreejs_NodeBindingJni_onCreate(
  JNIEnv *env,
  jobject /* this */,
  jobjectArray arguments,
  jstring nodePathJni,
  jlong nativeWindow,
  jint width,
  jint height) {

  int argc = env->GetArrayLength(arguments);

  const char *nodePathPtr = env->GetStringUTFChars(nodePathJni, 0);
  String nodePath = nodePathPtr;
  env->ReleaseStringUTFChars(nodePathJni, nodePathPtr);

  Vector<char> argsBuffer;
  Vector<size_t> offsets(argc);

  for (int i = 0; i < argc; ++i) {
    jstring jstr = static_cast<jstring>(env->GetObjectArrayElement(arguments, i));
    const char *utf = env->GetStringUTFChars(jstr, 0);

    offsets[i] = argsBuffer.size();
    argsBuffer.insert(argsBuffer.end(), utf, utf + strlen(utf) + 1);

    env->ReleaseStringUTFChars(jstr, utf);
  }

  Vector<char *> argv(argc);
  for (int i = 0; i < argc; ++i) {
    argv[i] = argsBuffer.data() + offsets[i];
  }

  return static_cast<jint>(NodeBinding::onCreate(
    argc,
    argv.data(),
    nodePath.c_str(),
    reinterpret_cast<void *>(nativeWindow),
    static_cast<int>(width),
    static_cast<int>(height)));
}

extern "C" JNIEXPORT jint JNICALL
Java_com_nianticlabs_apps_client_exploratory_androidthreejs_NodeBindingJni_setNativeWindow(
  JNIEnv *env, jobject /* this */, jlong nativeWindow) {
  return jint(NodeBinding::setNativeWindow(reinterpret_cast<void *>(nativeWindow)));
}

extern "C" JNIEXPORT void JNICALL
Java_com_nianticlabs_apps_client_exploratory_androidthreejs_NodeBindingJni_onDestroy(
  JNIEnv *env, jclass clazz) {
  NodeBinding::onDestroy();
}

extern "C" JNIEXPORT void JNICALL
Java_com_nianticlabs_apps_client_exploratory_androidthreejs_NodeBindingJni_processAnimationFrames(
  JNIEnv *env, jobject /* this */, jlong frameTimeNanos) {
  NodeBinding::processAnimationFrames(static_cast<int64_t>(frameTimeNanos));
}
