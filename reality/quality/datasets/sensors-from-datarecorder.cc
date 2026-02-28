// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)
//
// Helper to extract sensor data from datarecorder sequences.

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:string",
    "//c8:c8-log",
    "//c8:color-maps",
    "//c8/geometry:device-pose",
    "//c8/geometry:intrinsics",
    "//c8/io:file-io",
    "//c8/io:video-writer",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/pixels:gpu-pixels-resizer",
    "//c8/protolog:xr-requests",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/engine/tracking:tracking-sensor-event",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "//reality/quality/visualization/xrom/framework:reality-stream-interface",
  };
}
cc_end(0x45286e88);

#include "c8/c8-log.h"
#include "c8/color-maps.h"
#include "c8/geometry/device-pose.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/file-io.h"
#include "c8/io/video-writer.h"
#include "c8/pixels/gpu-pixels-resizer.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/protolog/xr-requests.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "c8/string/join.h"
#include "reality/engine/tracking/tracking-sensor-event.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"

using namespace c8;

const char *APP_NAME = "sensors-from-datarecorder";

static constexpr double NANOS_TO_SECONDS = 1e-9;

class StreamProcessor : public RealityStreamCallback {
public:
  StreamProcessor(const char *inFileName) {
    outFileName_ = format("%s-sensors.csv", inFileName);
    fileContent_.push_back(
      "frame_number,frame_time_secs,event_time_secs,zeroed_event_time_secs,lin_accel_x_cam,lin_"
      "accel_y_cam,lin_accel_z_cam,lin_accel_x_world,lin_accel_y_world,lin_accel_z_world");
  }

  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader request,
    RealityResponse::Reader response) override {
    ScopeTimer t("process");

    auto dp = request.getSensors().getPose().getDevicePose();
    Quaternion devicePose{dp.getW(), dp.getX(), dp.getY(), dp.getZ()};
    TrackingSensorFrame trackerInput;
    {
      MutableRootMessage<RequestSensor> message;
      message.builder().setPose(request.getSensors().getPose());
      auto deviceModel = DeviceInfos::getDeviceModel(request.getDeviceInfo());
      auto intrinsics =
        Intrinsics::getCameraIntrinsics(DeviceInfos::getDeviceModel(request.getDeviceInfo()));
      prepareTrackingSensorFrame(
        deviceModel,
        request.getDeviceInfo().getManufacturer(),
        intrinsics,
        message.reader(),
        &trackerInput);
    }
    for (auto event : trackerInput.sensorEvents) {
      if (minSensorTime_ == std::numeric_limits<int64_t>::max()) {
        minSensorTime_ = event.eventTimeNanos;
      }
      float eventSecs = (event.eventTimeNanos - minSensorTime_) * NANOS_TO_SECONDS;
      switch (event.kind) {
        case TrackingSensorEvent::LINEAR_ACCELERATION: {
          auto accelInCam = event.hvector();
          auto accelInWorld = xrRotationFromDeviceRotation(devicePose).toRotationMat() * accelInCam;
          fileContent_.push_back(format(
            "%d, %f, %f, %f, %f, %f, %f, %f, %f, %f",
            frameNumber_,
            request.getSensors().getCamera().getCurrentFrame().getTimestampNanos()
              * NANOS_TO_SECONDS,
            event.eventTimeNanos * NANOS_TO_SECONDS,
            eventSecs,
            accelInCam.x(),
            accelInCam.y(),
            accelInCam.z(),
            accelInWorld.x(),
            accelInWorld.y(),
            accelInWorld.z()));
        } break;
        default:
          break;
      }
    }
    frameNumber_++;
  }

  void finish() {
    writeTextFile(outFileName_, strJoin(fileContent_.begin(), fileContent_.end(), "\n"));
    C8Log("----------------\nExecution summary:");
    ScopeTimer::logBriefSummary();
    C8Log("----------------\nWrote file:");
    C8Log("%s", outFileName_.c_str());
  }

private:
  String outFileName_;
  Vector<String> fileContent_;
  int frameNumber_ = 0;
  int64_t minSensorTime_ = std::numeric_limits<int64_t>::max();
};

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "ERROR: Missing input path(s).\n"
      "\n"
      "%s usage:\n"
      "    bazel run //reality/quality/datasets:%s -- /path/to/datarecorder/log.123456-600\n",
      APP_NAME,
      APP_NAME);
    return -1;
  }

  // Only allow disk input for reality stream. Since we are writing videos, we need a finite length
  // input that can be cleanly detected to be done. Allowing remote input here would make that more
  // complicated.
  auto rStream = RealityStreamFactory::create(argv[1]);

  StreamProcessor processor(argv[1]);
  rStream->setCallback(&processor);
  rStream->spin();
  processor.finish();
  return 0;
}
