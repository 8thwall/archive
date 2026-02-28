// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "rawimu-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//apps/client/internalqa/omniscope/native/lib/view-widgets:sensors-widgets",
    "//c8:c8-log",
    "//c8:color",
    "//c8:string",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//c8/string:join",
    "//c8:vector",
    "//c8/geometry:intrinsics",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/pixels:draw-figure",
    "//c8/string:format",
    "//reality/engine/api/request:precomputed.capnp-cc",
  };
}
cc_end(0xa5e3bf39);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/sensors-widgets.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/sensors/rawimu-view.h"
#include "c8/c8-log.h"
#include "c8/geometry/intrinsics.h"
#include "c8/pixels/draw-figure.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/string/format.h"
#include "c8/string/join.h"

namespace {
String trackingSensorEventKindString(TrackingSensorEvent::TrackingSensorEventKind kind) {
  switch (kind) {
    case TrackingSensorEvent::TrackingSensorEventKind::TRACKING_SENSOR_EVENT_KIND_UNSPECIFIED:
      return "TRACKING_SENSOR_EVENT_KIND_UNSPECIFIED";
      break;
    case TrackingSensorEvent::TrackingSensorEventKind::ACCELEROMETER:
      return "ACCELEROMETER";
      break;
    case TrackingSensorEvent::TrackingSensorEventKind::MAGNETOMETER:
      return "MAGNETOMETER";
      break;
    case TrackingSensorEvent::TrackingSensorEventKind::GYROSCOPE:
      return "GYROSCOPE";
      break;
    case TrackingSensorEvent::TrackingSensorEventKind::LINEAR_ACCELERATION:
      return "LINEAR_ACCELERATION";
      break;
    default:
      return "NEED ENUM STRING";
      break;
  }
}
}  // namespace

namespace c8 {

RawImuView::RawImuView() { copyTexture_ = compileCopyTexture2D(); }

void RawImuView::configure(const AppConfiguration &appConfig) { appConfig_ = appConfig; }

void RawImuView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::cameraOnlyCanvas(appConfig_, 480, 640, &copyTexture_);
};

void RawImuView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");

  auto cpp = data->producer<CameraPreviewDataProducer>().cameraPreview();
  auto dp = data->renderer<PixelBufferTextureRenderer>().displayBuf();
  fill(Color::BLACK, dp);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Prepare sensor data in format for trackers.
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  MutableRootMessage<RequestSensor> requestSensor;
  fillRequestSensorMessage(*data, requestSensor.builder());

  auto intrinsics = Intrinsics::getProcessingIntrinsics(appConfig_.deviceModel, 480, 640);

  TrackingSensorFrame trackingSensorFrame;
  prepareTrackingSensorFrame(
    appConfig_.deviceModel,
    appConfig_.deviceManufacturer,
    intrinsics,
    requestSensor.reader(),
    &trackingSensorFrame);
  trackingSensorFrame.devicePose = data->devicePose();
  trackingSensorFrame.timeNanos = data->timeNanos();

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Extract raw sensor data and visualize it.
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  auto numMagnetometer = 0;
  auto numAccelerometer = 0;
  auto numGyroscope = 0;
  auto numLinearAcceleration = 0;
  Vector<String> events = {
    format("frame %d, timeNanos: %lld\n", currentFrame_, trackingSensorFrame.timeNanos)};
  for (auto event : trackingSensorFrame.sensorEvents) {
    if (minSensorTime_ == std::numeric_limits<int64_t>::max()) {
      minSensorTime_ = event.eventTimeNanos;
    }
    float eventSecs = static_cast<float>((event.eventTimeNanos - minSensorTime_) * 1e-9);
    events.push_back(format(
      "kind: %19s, eventTimeNanos: %lld -> (eventSecs: %f), intervalNanos: %lld, values: %s",
      trackingSensorEventKindString(event.kind).c_str(),
      event.eventTimeNanos,
      eventSecs,
      event.intervalNanos,
      event.hpoint().toString().c_str()));
    switch (event.kind) {
      case TrackingSensorEvent::MAGNETOMETER:
        magFrame_.push_back(currentFrame_);
        magTimeSecs_.push_back(eventSecs);
        magX_.push_back(event.x);
        magY_.push_back(event.y);
        magZ_.push_back(event.z);
        numMagnetometer++;
        break;
      case TrackingSensorEvent::ACCELEROMETER:
        accFrame_.push_back(currentFrame_);
        accTimeSecs_.push_back(eventSecs);
        accX_.push_back(event.x);
        accY_.push_back(event.y);
        accZ_.push_back(event.z);
        numAccelerometer++;
        break;
      case TrackingSensorEvent::GYROSCOPE:
        gyroFrame_.push_back(currentFrame_);
        gyroTimeSecs_.push_back(eventSecs);
        gyroX_.push_back(event.x);
        gyroY_.push_back(event.y);
        gyroZ_.push_back(event.z);
        numGyroscope++;
        break;
      case TrackingSensorEvent::LINEAR_ACCELERATION:
        linaccFrame_.push_back(currentFrame_);
        linaccTimeSecs_.push_back(eventSecs);
        linaccX_.push_back(event.x);
        linaccY_.push_back(event.y);
        linaccZ_.push_back(event.z);
        numLinearAcceleration++;
        break;
      default:
        break;
    }
  }
  numMagnetometer_.push_back(numMagnetometer);
  numAccelerometer_.push_back(numAccelerometer);
  numGyroscope_.push_back(numGyroscope);
  numLinearAcceleration_.push_back(numLinearAcceleration);

  if (minFrameTimeNanos_ == std::numeric_limits<int64_t>::max()) {
    minFrameTimeNanos_ = data->frameTimeNanos();
  }
  if (minVideoTimeNanos_ == std::numeric_limits<int64_t>::max()) {
    minVideoTimeNanos_ = data->videoTimeNanos();
  }

  c8Frame_.push_back(currentFrame_);
  auto minSensorTime =
    minSensorTime_ == std::numeric_limits<int64_t>::max() ? minFrameTimeNanos_ : minSensorTime_;
  c8TimeSecs_.push_back(static_cast<float>((trackingSensorFrame.timeNanos - minSensorTime) * 1e-9));
  c8FrameTimeSecs_.push_back(static_cast<float>((data->frameTimeNanos() - minSensorTime) * 1e-9));
  auto videoTimeNanosShiftedToZero = data->videoTimeNanos() - minVideoTimeNanos_;
  c8VideoTimeSecsShiftedToZero_.push_back(static_cast<float>(videoTimeNanosShiftedToZero * 1e-9));
  c8VideoTimeSecsShiftedToFrame_.push_back(
    static_cast<float>(
      (videoTimeNanosShiftedToZero + (minFrameTimeNanos_ - minSensorTime)) * 1e-9));
  c8VideoTimeSecsShiftedToHalfFrame_.push_back(
    static_cast<float>(
      (videoTimeNanosShiftedToZero + (minFrameTimeNanos_ - minSensorTime) / 2.f) * 1e-9));

  poseFrame_.push_back(currentFrame_);
  poseTimeSecs_.push_back(
    static_cast<float>((trackingSensorFrame.timeNanos - minSensorTime) * 1e-9));
  poseW_.push_back(trackingSensorFrame.devicePose.w());
  poseX_.push_back(trackingSensorFrame.devicePose.x());
  poseY_.push_back(trackingSensorFrame.devicePose.y());
  poseZ_.push_back(trackingSensorFrame.devicePose.z());

  auto deviceAcceleration = requestSensor.reader().getPose().getDeviceAcceleration();
  devaccFrame_.push_back(currentFrame_);
  devaccTimeSecs_.push_back(
    static_cast<float>((trackingSensorFrame.timeNanos - minSensorTime) * 1e-9));
  devaccX_.push_back(deviceAcceleration.getX());
  devaccY_.push_back(deviceAcceleration.getY());
  devaccZ_.push_back(deviceAcceleration.getZ());

  data->setText("Events this frame", strJoin(events.begin(), events.end(), "\n"));

  {
    auto &p = seriesPlot(data, "raw-imu-1", "Acceleration", {"Seconds"}, {"Value"});
    addLine(p, "x", accTimeSecs_, accX_, Color::CHERRY);
    addLine(p, "y", accTimeSecs_, accY_, Color::MANGO);
    addLine(p, "z", accTimeSecs_, accZ_, Color::MINT);
  }

  {
    auto &p = seriesPlot(data, "raw-imu-2", "Gyroscope", {"Seconds"}, {"Value"});
    addLine(p, "x", gyroTimeSecs_, gyroX_, Color::CHERRY);
    addLine(p, "y", gyroTimeSecs_, gyroY_, Color::MANGO);
    addLine(p, "z", gyroTimeSecs_, gyroZ_, Color::MINT);
  }

  {
    auto &p = seriesPlot(data, "raw-imu-3", "Magnetometer", {"Seconds"}, {"Value"});
    addLine(p, "x", magTimeSecs_, magX_, Color::CHERRY);
    addLine(p, "y", magTimeSecs_, magY_, Color::MANGO);
    addLine(p, "z", magTimeSecs_, magZ_, Color::MINT);
  }

  {
    auto &p = seriesPlot(data, "raw-imu-4", "Linear Acceleration", {"Seconds"}, {"Value"});
    addLine(p, "x", linaccTimeSecs_, linaccX_, Color::CHERRY);
    addLine(p, "y", linaccTimeSecs_, linaccY_, Color::MANGO);
    addLine(p, "z", linaccTimeSecs_, linaccZ_, Color::MINT);
  }

  {
    auto &p = seriesPlot(data, "raw-imu-5", "Device Pose", {"Seconds"}, {"Value"});
    addLine(p, "w", poseTimeSecs_, poseW_, Color::PURPLE);
    addLine(p, "x", poseTimeSecs_, poseX_, Color::CHERRY);
    addLine(p, "y", poseTimeSecs_, poseY_, Color::MANGO);
    addLine(p, "z", poseTimeSecs_, poseZ_, Color::MINT);
  }

  {
    auto &p = seriesPlot(data, "raw-imu-6", "Device Acceleration", {"Seconds"}, {"Value"});
    addLine(p, "x", devaccTimeSecs_, devaccX_, Color::CHERRY);
    addLine(p, "y", devaccTimeSecs_, devaccY_, Color::MANGO);
    addLine(p, "z", devaccTimeSecs_, devaccZ_, Color::MINT);
  }

  {
    auto &p = seriesPlot(
      data, "Event Timings", "Event Timings From Each Sensor", {"Seconds"}, {"Frame Number"});
    addLine(p, "C8 - timeNanos", c8TimeSecs_, c8Frame_, Color::DARK_GREEN, SeriesPlotType::SCATTER);
    addLine(
      p, "C8 - frameTimeNanos", c8FrameTimeSecs_, c8Frame_, Color::MINT, SeriesPlotType::SCATTER);
    addLine(
      p,
      "C8 - videoTimeNanos shifted to zero",
      c8VideoTimeSecsShiftedToZero_,
      c8Frame_,
      Color::MATCHA,
      SeriesPlotType::SCATTER);
    addLine(
      p,
      "C8 - videoTimeNanos shifted to frame time",
      c8VideoTimeSecsShiftedToFrame_,
      c8Frame_,
      Color::DARK_MATCHA,
      SeriesPlotType::SCATTER);
    addLine(
      p,
      "C8 - videoTimeNanos shifted to frame time / 2",
      c8VideoTimeSecsShiftedToHalfFrame_,
      c8Frame_,
      Color::DARK_MATCHA,
      SeriesPlotType::SCATTER);
    addLine(p, "Acceleration", accTimeSecs_, accFrame_, Color::WHITE, SeriesPlotType::SCATTER);
    addLine(p, "Gyroscope", gyroTimeSecs_, gyroFrame_, Color::BLUE, SeriesPlotType::SCATTER);
    addLine(p, "Magnetometer", magTimeSecs_, magFrame_, Color::PURPLE, SeriesPlotType::SCATTER);
    addLine(
      p,
      "Linear Acceleration",
      linaccTimeSecs_,
      linaccFrame_,
      Color::MINT,
      SeriesPlotType::SCATTER);
    addLine(p, "Device Pose", poseTimeSecs_, poseFrame_, Color::MANGO, SeriesPlotType::SCATTER);
    addLine(
      p,
      "Device Acceleration",
      devaccTimeSecs_,
      devaccFrame_,
      Color::CHERRY,
      SeriesPlotType::SCATTER);
  }

  {
    auto &p = seriesPlot(
      data,
      "Num Sensor Events",
      "Number of Sensor Events Per Frame",
      {"Frame Number"},
      {"Sensor Event Count"});
    addLine(p, "Magnetometer", c8Frame_, numMagnetometer_, Color::PURPLE, SeriesPlotType::LINE);
    addLine(p, "Acceleration", c8Frame_, numAccelerometer_, Color::WHITE, SeriesPlotType::LINE);
    addLine(p, "Gyroscope", c8Frame_, numGyroscope_, Color::BLUE, SeriesPlotType::LINE);
    addLine(
      p,
      "Linear Acceleration",
      c8Frame_,
      numLinearAcceleration_,
      Color::MINT,
      SeriesPlotType::LINE);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Plot image.
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  copyPixels(cpp, &dp);

  currentFrame_++;
}

}  // namespace c8
