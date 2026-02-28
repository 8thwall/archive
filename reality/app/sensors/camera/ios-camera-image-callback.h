#pragma once

#include <CoreVideo/CoreVideo.h>

// The structs in this file are forward-declared in the pure-c header ios-arkit-sensor.h. So, they
// need to be structs in the flat namespace, but otherwise can behave as normal c++ objects, with
// constructors etc.
struct c8_IosCameraData {
public:
  int64_t timestampNanos = 0;
  CVPixelBufferRef *pixels = nullptr;

  // Default operators and constructors.
  c8_IosCameraData() noexcept = default;
  c8_IosCameraData(c8_IosCameraData &&) noexcept = default;
  c8_IosCameraData &operator=(c8_IosCameraData &&) noexcept = default;
  c8_IosCameraData(const c8_IosCameraData &) noexcept = default;
  c8_IosCameraData &operator=(const c8_IosCameraData &) noexcept = default;
};

struct c8_CameraImageCallback {
  virtual void processFrame(c8_IosCameraData &) = 0;
  virtual ~c8_CameraImageCallback() noexcept(false) {}
};
