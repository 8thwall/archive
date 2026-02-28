#pragma once

#include <node.h>
#include <stdlib.h>
#include <uv.h>

#include <deque>
#include <functional>

#include "c8/string.h"
#include "c8/string/format.h"
#include "c8/vector.h"

namespace c8 {

struct AnimationFrameCallback {
  uint32_t id;
  std::unique_ptr<v8::Persistent<v8::Function>> callback;
  bool cancelled = false;
};

struct NodeBindingState {
  // Used in the Node UV Thread.
  Vector<String> args;
  node::Environment *env = nullptr;
  uint64_t globalStartTime = 0;
  int nextAnimationFrameId = 1;
  std::deque<AnimationFrameCallback> animationFrameCallbackQueue;
  std::function<void(String, int)> eventListenerUpdateCallback;
  std::function<bool(const Vector<int> &)> vibrationCallback = nullptr;
  uv_async_t renderRequestHandle;
  uv_async_t pauseRequestHandle;
  uv_async_t resumeRequestHandle;
  uv_async_t termRequestHandle;
  uv_async_t initWindowRequestHandle;
  uv_async_t windowResizedRequestHandle;
  void *nativeWindow = nullptr;
  int nativeWindowWidth = 0;
  int nativeWindowHeight = 0;
  int inputEventFd = -1;
  int sensorEventFd = -1;
  v8::Persistent<v8::Symbol> currentWindowSymbol;
  v8::Persistent<v8::Symbol> inputEventTargetSymbol;
  v8::Persistent<v8::Symbol> sensorEventTargetSymbol;
  bool isPaused = false;

  // Used in both the Android UI Thread and Node UV Thread.
  std::atomic<bool> active = false;
  std::atomic<int64_t> atomicNextFrameTimeNanos = 0;

  String toString() const noexcept {
    return format(
      "(nextAnimationFrameId: %d, animationFrameCallbackQueue.size(): %zu, inputEventFd: %d, "
      "sensorEventFd: %d, isPaused: %d, active: %d, atomicNextFrameTimeNanos: %ld)",
      nextAnimationFrameId,
      animationFrameCallbackQueue.size(),
      inputEventFd,
      sensorEventFd,
      isPaused,
      active.load(),
      atomicNextFrameTimeNanos.load());
  }
};

}  // namespace c8
