// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "reality/app/xr/ios/xr-ios-c8.h"

#import <AVFoundation/AVFoundation.h>
#import <CoreImage/CoreImage.h>
#import <CoreVideo/CoreVideo.h>
#import <Metal/Metal.h>
#import <OpenGLES/ES3/gl.h>
#import <OpenGLES/ES3/glext.h>
#import <UIKit/UIKit.h>

#include <mutex>
#include <vector>
#include "c8/io/capnp-messages.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/protolog/api/log-request.capnp.h"
#include "c8/stats/api/detail.capnp.h"
#include "c8/stats/scope-timer.h"
#include "c8/stats/self-timing-scope-lock.h"
#include "reality/app/device/ios-device-info.h"
#include "reality/app/sensors/camera/ios-camera-image-callback.h"
#include "reality/app/sensors/camera/ios-camera-sensor.h"
#include "reality/app/sensors/pose/ios-pose-sensor.h"
#include "c8/protolog/api-limits.h"
#include "c8/protolog/xr-requests.h"
#include "reality/engine/executor/xr-engine.h"

using MutableRealityRequest = c8::MutableRootMessage<c8::RealityRequest>;

namespace c8 {

struct XRIosC8 : public XRDriverIos, c8_CameraImageCallback {
public:
  // Constructor.
  XRIosC8(XRIos *xr) {
    C8Log("[xr-ios-c8] %s", "create");
    poseSensor = c8PoseSensor_create();
    cameraSensor = c8CameraSensor_create();
    c8CameraSensor_setImageCallback(cameraSensor, this);
    this->xr = xr;
  }

  virtual ~XRIosC8() {
    C8Log("[xr-ios-c8] %s", "destroy");
    c8CameraSensor_destroy(cameraSensor);
    c8PoseSensor_destroy(poseSensor);
  }

  // Default move constructors.
  XRIosC8(XRIosC8 &&) = default;
  XRIosC8 &operator=(XRIosC8 &&) = default;

  // Disallow copying.
  XRIosC8(const XRIosC8 &) = delete;
  XRIosC8 &operator=(const XRIosC8 &) = delete;

  void configure(XRConfiguration::Reader config) override {
    c8CameraSensor_configure(cameraSensor, config.getCameraConfiguration().getAutofocus());
  }

  void resume() override {
    C8Log("[xr-ios-c8] %s", "resume");
    c8PoseSensor_resume(poseSensor);
    c8CameraSensor_resume(cameraSensor);
  }

  void pause() override {
    C8Log("[xr-ios-c8] %s", "pause");
    c8PoseSensor_pause(poseSensor);
    c8CameraSensor_pause(cameraSensor);
  }

  RealityEngineLogRecordHeader::EngineType getType() override {
    return RealityEngineLogRecordHeader::EngineType::C8;
  }

  // Main method to execute a request.
  void processFrame(c8_IosCameraData &d) override {
    xr->setFrameForDisplay(*(d.pixels));
    pushRealityForward(d);
  }

  // Main method to execute a request.
  int32_t pushRealityForward(c8_IosCameraData &cameraData) {
    MutableRealityRequest realityRequestMessage;
    auto requestBuilder = realityRequestMessage.builder();

    // TODO(paris): Look at adding in videoTimeNanos and frameTimeNanos here.
    requestBuilder.getSensors().getCamera().getCurrentFrame().setTimestampNanos(
      cameraData.timestampNanos);

    requestBuilder.getXRConfiguration().getCameraConfiguration().getCaptureGeometry().setWidth(
      static_cast<int>(CVPixelBufferGetHeight(*cameraData.pixels)));
    requestBuilder.getXRConfiguration().getCameraConfiguration().getCaptureGeometry().setHeight(
      static_cast<int>(CVPixelBufferGetWidth(*cameraData.pixels)));

    // Copy pose data to the request; all other request data is added by the top-level xr.
    float ax = 0.0f, ay = 0.0f, az = 0.0f;
    float x = 0.0f, y = 0.0f, z = 0.0f;
    float qw = 0.0f, qx = 0.0f, qy = 0.0f, qz = 0.0f;

    c8PoseSensor_getAcceleration(poseSensor, &ax, &ay, &az);
    c8PoseSensor_getPose(poseSensor, &x, &y, &z, &qw, &qx, &qy, &qz);

    auto devicePose = requestBuilder.getSensors().getPose();
    setDevicePose(ax, ay, az, qw, qx, qy, qz, &devicePose);

    Vector<XRSensorEvent> eventQueue;
    c8PoseSensor_releaseEventQueue(poseSensor, &eventQueue);
    auto rq = devicePose.initEventQueue(static_cast<int>(eventQueue.size()));
    for (int i = 0; i < eventQueue.size(); ++i) {
      XRSensorEvent event = eventQueue[i];
      auto b = rq[i];
      b.setTimestampNanos(event.timestampNanos);
      auto eventPos = b.getValue();
      setPosition32f(event.x, event.y, event.z, &eventPos);
      switch (event.kind) {
        case C8_POSE_SENSOR_ACCELEROMETER:
          b.setKind(RawPositionalSensorValue::PositionalSensorKind::ACCELEROMETER);
          break;
        case C8_POSE_SENSOR_GYROSCOPE:
          b.setKind(RawPositionalSensorValue::PositionalSensorKind::GYROSCOPE);
          break;
        case C8_POSE_SENSOR_MAGNETOMETER:
          b.setKind(RawPositionalSensorValue::PositionalSensorKind::MAGNETOMETER);
          break;
      }
    }

    return xr->pushRealityForward(requestBuilder.asReader());
  }

  void getAppEnvironment(XRAppEnvironment::Builder env) override {
    // Let external callers know what size texture we want.
    env.getManagedCameraTextures().getYTexture().setWidth(C8_API_LIMITS_IMAGE_PROCESSING_WIDTH);
    env.getManagedCameraTextures().getYTexture().setHeight(C8_API_LIMITS_IMAGE_PROCESSING_HEIGHT);
    env.getManagedCameraTextures().getUvTexture().setWidth(
      (C8_API_LIMITS_IMAGE_PROCESSING_WIDTH + 1) / 2);
    env.getManagedCameraTextures().getUvTexture().setHeight(
      (C8_API_LIMITS_IMAGE_PROCESSING_HEIGHT + 1) / 2);
  }

private:
  c8_CameraSensor *cameraSensor;
  c8_PoseSensor *poseSensor;

  // This pointer is not owned by the driver class.
  XRIos *xr;
};

XRDriverIos *createXRIosC8(XRIos *xr) { return new XRIosC8(xr); }

void exportXRIosC8Environment(XREnvironment::Builder *environment) {
  // TODO(mc): Refactor is6DoFTrackingSupported to a common method so the
  // following can choose the appropriate position tracking.
  // environment->capabilityPositionTracking = POSITION_TRACKING_ROTATION_ONLY;
  environment->setRealityImageWidth(C8_API_LIMITS_IMAGE_PROCESSING_WIDTH);
  environment->setRealityImageHeight(C8_API_LIMITS_IMAGE_PROCESSING_HEIGHT);
  environment->getCapabilities().setPositionTracking(
    XRCapabilities::PositionalTrackingKind::ROTATION_AND_POSITION_NO_SCALE);
  environment->getCapabilities().setSurfaceEstimation(
    XRCapabilities::SurfaceEstimationKind::FIXED_SURFACES);
  environment->getCapabilities().setTargetImageDetection(
    XRCapabilities::TargetImageDetectionKind::UNSUPPORTED);
}

}  // namespace c8
