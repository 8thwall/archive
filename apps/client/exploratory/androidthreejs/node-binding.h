#pragma once

#include <cstdint>

namespace c8 {

class NodeBinding {
public:
  static int onCreate(
    int argc, char *argv[], const char *nodePath, void *nativeWindow, int width, int height);

  static int setNativeWindow(void *nativeWindow);

  static void onDestroy();

  static void processAnimationFrames(int64_t frameTimeNanos);
};

}  // namespace c8
