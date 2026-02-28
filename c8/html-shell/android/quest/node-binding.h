#pragma once

#include <android_native_app_glue.h>

#include <cstdint>
#include <vector>

namespace c8 {

class NodeBinding {
public:
  static int onCreate(
    int argc,
    char *argv[],
    const char *nodePath,
    void *nativeWindow,
    int width,
    int height,
    int inputEventFd,
    const char *url,
    const char *stagingPasscode,
    const char *systemLocale,
    struct android_app *appPointer);

  static int setNativeWindow(void *nativeWindow);

  static void onPause();
  static void onResume();
  static void onDestroy();
};

}  // namespace c8
