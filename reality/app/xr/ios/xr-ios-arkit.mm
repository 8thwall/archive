// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "reality/app/xr/ios/xr-ios-arkit.h"

#import <ARKit/ARKit.h>
#import <AVFoundation/AVFoundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <CoreImage/CoreImage.h>
#import <CoreVideo/CoreVideo.h>
#import <Metal/Metal.h>
#import <UIKit/UIKit.h>

#include <mutex>
#include <vector>
#include "c8/io/capnp-messages.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/protolog/api/log-request.capnp.h"
#include "c8/release-config.h"
#include "c8/stats/api/detail.capnp.h"
#include "c8/stats/scope-timer.h"
#include "c8/stats/self-timing-scope-lock.h"
#include "reality/app/device/ios-device-info.h"
#include "reality/app/sensors/arkit/ios-arkit-image-callback.h"
#include "reality/app/sensors/arkit/ios-arkit-sensor.h"
#include "reality/app/sensors/gps/core-location-controller.h"
#include "reality/app/sensors/pose/ios-pose-sensor.h"
#include "c8/protolog/api-limits.h"
#include "c8/protolog/xr-requests.h"
#include "reality/app/xr/ios/c8-helpers.h"
#include "reality/engine/executor/xr-engine.h"

using MutableRealityRequest = c8::MutableRootMessage<c8::RealityRequest>;
using ConstXRHitTestResult = c8::ConstRootMessage<c8::XRHitTestResult>;

namespace c8 {
namespace {
  constexpr static bool debug_ = false;
}

struct XRIosARKit : public XRDriverIos, c8_ARKitImageCallback {
public:
  // Constructor.
  XRIosARKit(XRIos *xr) {
    C8Log("[xr-ios-arkit] %s", "create");
    poseSensor = c8PoseSensor_create();
    coreLocation = c8CoreLocation_create();
    arkitSensor = c8ARKitSensor_create(
      xr->getCustomARSession(), xr->getCustomARSessionConfig(), xr->getCustomARSessionDelegate());
    c8ARKitSensor_setImageCallback(arkitSensor, this);
    this->xr = xr;
  }

  ~XRIosARKit() {
    C8Log("[xr-ios-arkit] %s", "destroy");
    c8ARKitSensor_destroy(arkitSensor);
    c8PoseSensor_destroy(poseSensor);
    c8CoreLocation_destroy(coreLocation);
  }

  // Default move constructors.
  XRIosARKit(XRIosARKit &&) = default;
  XRIosARKit &operator=(XRIosARKit &&) = default;

  // Disallow copying.
  XRIosARKit(const XRIosARKit &) = delete;
  XRIosARKit &operator=(const XRIosARKit &) = delete;

  void configure(c8::XRConfiguration::Reader config) override {
    c8ARKitSensor_configure(arkitSensor, config);
  }

  void resume() override {
    C8Log("[xr-ios-arkit] %s", "resume");
    c8ARKitSensor_resume(arkitSensor);
    c8PoseSensor_resume(poseSensor);
    c8CoreLocation_resume(coreLocation);
  }

  void pause() override {
    C8Log("[xr-ios-arkit] %s", "pause");
    c8ARKitSensor_pause(arkitSensor);
    c8PoseSensor_pause(poseSensor);
    c8CoreLocation_pause(coreLocation);
  }

  RealityEngineLogRecordHeader::EngineType getType() override {
    return RealityEngineLogRecordHeader::EngineType::ARKIT;
  }

  // Main method to execute a request.
  void processFrame(c8_ARKitSensorData &data) override {
    xr->setFrameForDisplay(data.pixels);

    if (data.depthMap != nil) {
      xr->setDepthFrameForDisplay(data.depthMap);
    }
    pushRealityForward(data);
  }

  // Main method to execute a request.
  int32_t pushRealityForward(c8_ARKitSensorData &data) {
    MutableRealityRequest realityRequestMessage;
    auto requestBuilder = realityRequestMessage.builder();

    // TODO(paris): Look at adding in videoTimeNanos and frameTimeNanos here.
    requestBuilder.getSensors().getCamera().getCurrentFrame().setTimestampNanos(
      data.timestampNanos);

    // Extract the camera intrinsic parameters, accounting for rotation.
    requestBuilder.getSensors().getCamera().setPixelIntrinsics(data.intrinsicCameraModel.reader());
    requestBuilder.getSensors().setARKit(data.requestARKit.reader());

    requestBuilder.getXRConfiguration().getCameraConfiguration().getCaptureGeometry().setWidth(
      data.intrinsicCameraModel.reader().getPixelsHeight());
    requestBuilder.getXRConfiguration().getCameraConfiguration().getCaptureGeometry().setHeight(
      data.intrinsicCameraModel.reader().getPixelsWidth());

    if (poseSensor != nullptr) {
      float ax = 0.0f, ay = 0.0f, az = 0.0f;
      float x = 0.0f, y = 0.0f, z = 0.0f;
      float qw = 0.0f, qx = 0.0f, qy = 0.0f, qz = 0.0f;
      // Get the device orientation from the gyros to find the correct gravity direction.
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
    }

    if (coreLocation != nullptr) {
      double latitude = 0.0, longitude = 0.0, horizontalAccuracy = 0.0;
      bool hasLocation;
      c8CoreLocation_getLastLocation(
        coreLocation, &hasLocation, &latitude, &longitude, &horizontalAccuracy);
      if (hasLocation) {
        if (debug_) {
          C8Log("[xr-ios-arkit] lat: %f, long:%f, acc: %f", latitude, longitude, horizontalAccuracy);
        }
        auto gps = requestBuilder.getSensors().getGps();
        setGps(latitude, longitude, horizontalAccuracy, &gps);
      }
    }

    if (releaseConfigIsRequestDebugDataEnabled()) {
      auto hitTestResult = ConstXRHitTestResult(data.hitTestResult);
      auto hitTestDataBytes = hitTestResult.bytes();
      auto debugDataBuilder = requestBuilder.initDebugData(1);

      debugDataBuilder[0].initData((unsigned int)hitTestDataBytes.size());
      memcpy(
        debugDataBuilder[0].getData().begin(), hitTestDataBytes.begin(), hitTestDataBytes.size());
      debugDataBuilder[0].setTag("DEBUG_HIT_TEST");
    }

    return xr->pushRealityForward(requestBuilder.asReader());
  }

  void getAppEnvironment(XRAppEnvironment::Builder env) override {
    MutableRootMessage<XREnvironment> xrenv;
    auto xreb = xrenv.builder();
    exportXRIosARKitEnvironment(&xreb);
    // Let external callers know what size texture we want.
    env.getManagedCameraTextures().getYTexture().setWidth(xreb.getRealityImageWidth());
    env.getManagedCameraTextures().getYTexture().setHeight(xreb.getRealityImageHeight());
    env.getManagedCameraTextures().getUvTexture().setWidth((xreb.getRealityImageWidth() + 1) / 2);
    env.getManagedCameraTextures().getUvTexture().setHeight((xreb.getRealityImageHeight() + 1) / 2);
  }

private:
  c8_ARKitSensor *arkitSensor;
  c8_PoseSensor *poseSensor;
  c8_CoreLocation *coreLocation;

  // This pointer is not owned by the driver class.
  XRIos *xr;
};

XRDriverIos *createXRIosARKit(XRIos *xr) { return new XRIosARKit(xr); }

void exportXRIosARKitEnvironment(XREnvironment::Builder *environment) {
  float ver = [[[UIDevice currentDevice] systemVersion] floatValue];

  // For ARKit, we get a rotated texture. We'll upload it rotated and rotate it later in the shader.
  if (ver >= 11.3) {
    // Use the highest supported resolution specified by ARKit 1.5+ api.
    auto formats = [ARWorldTrackingConfiguration supportedVideoFormats];
    auto highestResFormat = formats[0];
    environment->setRealityImageHeight(highestResFormat.imageResolution.height);
    environment->setRealityImageWidth(highestResFormat.imageResolution.width);
  } else {
    // ARKit 1.0 only supports 720p.
    environment->setRealityImageHeight(720);
    environment->setRealityImageWidth(1280);
  }

  // Tell our user what capabilities are available
  // This is different from what capabilities they have configured to enable.
  environment->getCapabilities().setPositionTracking(
    XRCapabilities::PositionalTrackingKind::ROTATION_AND_POSITION);
  auto surfaceEstimationKind = ver >= 11.3
    ? XRCapabilities::SurfaceEstimationKind::HORIZONTAL_AND_VERTICAL
    : XRCapabilities::SurfaceEstimationKind::HORIZONTAL_ONLY;
  environment->getCapabilities().setSurfaceEstimation(surfaceEstimationKind);
  auto imageDetectionKind = ver >= 11.3
    ? XRCapabilities::TargetImageDetectionKind::FIXED_SIZE_IMAGE_TARGET
    : XRCapabilities::TargetImageDetectionKind::UNSUPPORTED;
  environment->getCapabilities().setTargetImageDetection(imageDetectionKind);
}

}  // namespace c8
