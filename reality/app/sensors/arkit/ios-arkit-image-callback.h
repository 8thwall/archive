#pragma once

#include <ARKit/ARKit.h>
#include <CoreVideo/CoreVideo.h>
#include "c8/geometry/pixel-pinhole-camera-model.h"
#include "c8/io/capnp-messages.h"
#include "c8/protolog/api-limits.h"
#include "reality/engine/api/base/camera-intrinsics.capnp.h"
#include "reality/engine/api/request/hit-test.capnp.h"
#include "reality/engine/api/request/sensor.capnp.h"


// The structs in this file are forward-declared in the pure-c header ios-arkit-sensor.h. So, they
// need to be structs in the flat namespace, but otherwise can behave as normal c++ objects, with
// constructors etc.
struct c8_ARKitSensorData {
public:
  int64_t timestampNanos = 0;
  CVPixelBufferRef pixels = nullptr;
  CVPixelBufferRef depthMap = nullptr;
  c8::MutableRootMessage<c8::PixelPinholeCameraModel> intrinsicCameraModel;
  c8::MutableRootMessage<c8::RequestARKit> requestARKit;
  c8::MutableRootMessage<c8::XRHitTestResult> hitTestResult;

  // Default operators and constructors.
  c8_ARKitSensorData() = default;
  c8_ARKitSensorData(c8_ARKitSensorData &&) = default;
  c8_ARKitSensorData &operator=(c8_ARKitSensorData &&) = default;

  c8_ARKitSensorData(const c8_ARKitSensorData &) = delete;
  c8_ARKitSensorData &operator=(const c8_ARKitSensorData &) = delete;
};

struct c8_ARKitImageCallback {
public:
  virtual void processFrame(c8_ARKitSensorData&) = 0;
  virtual ~c8_ARKitImageCallback() noexcept(false) {}
};
