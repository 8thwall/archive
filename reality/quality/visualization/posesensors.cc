// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:hpoint",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//reality/engine/api:reality.capnp-cc",
    "//reality/quality/visualization/protolog:log-record-capture",
    "//reality/quality/visualization/render:imgproc",
    "@opencv//:core",
    "@opencv//:highgui",
    "@opencv//:videoio",
  };
  linkopts = {
    "-framework AVFoundation", "-framework Cocoa",
  };
}
cc_end(0x5cf766f9);

#include <iostream>
#include <opencv2/core.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/videoio.hpp>
#include "c8/c8-log.h"
#include "c8/hpoint.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "reality/engine/api/reality.capnp.h"
#include "c8/stats/scope-timer.h"
#include "reality/quality/visualization/protolog/log-record-capture.h"
#include "reality/quality/visualization/render/imgproc.h"

using namespace c8;

static int64_t TIME_WINDOW = 5000000000;  // 5 s.

struct SensorEvent {
  int64_t t;
  float x;
  float y;
  float z;
  SensorEvent(int64_t t_, float x_, float y_, float z_) : t(t_), x(x_), y(y_), z(z_) {}
};

struct SensorPlot {
  Vector<SensorEvent> events;
  float range = 0.01f;
  int64_t lastT;

  void addEvents(const Vector<SensorEvent> &toAdd) {
    Vector<SensorEvent> newEvents;
    newEvents.reserve(events.size() + toAdd.size());
    for (SensorEvent e : toAdd) {
      if (e.t > lastT) {
        lastT = e.t;
      }
      if (std::abs(e.x) > range) {
        range = std::abs(e.x);
      }
      if (std::abs(e.y) > range) {
        range = std::abs(e.y);
      }
      if (std::abs(e.z) > range) {
        range = std::abs(e.z);
      }
      newEvents.push_back(e);
    }
    for (auto e : events) {
      if (e.t >= (lastT - TIME_WINDOW)) {
        newEvents.push_back(e);
      }
    }
    events = newEvents;
  }

  void draw(cv::Mat *rect) {
    int ar = rect->rows - 40;
    int r = ar / 3;
    int c = rect->cols;
    cv::Mat xm = rect->rowRange(0, r);
    cv::Mat ym = rect->rowRange(2 * ar / 3 - r + 20, 2 * ar / 3 + 20);
    cv::Mat zm = rect->rowRange(ar - r + 40, ar + 40);

    double yScale = -r / (2.0 * range);
    double yOffset = 1.0 * range;
    double xScale = c * 1.0 / TIME_WINDOW;
    double xOffset = TIME_WINDOW - lastT;

    for (auto e : events) {
      float t = (e.t + xOffset) * xScale;
      float x = r + (e.x + yOffset) * yScale;
      float y = r + (e.y + yOffset) * yScale;
      float z = r + (e.z + yOffset) * yScale;
      Imgproc::drawPoint(HPoint2(t, x), 1, cv::Scalar(203, 0, 138), &xm);
      Imgproc::drawPoint(HPoint2(t, y), 1, cv::Scalar(203, 0, 138), &ym);
      Imgproc::drawPoint(HPoint2(t, z), 1, cv::Scalar(203, 0, 138), &zm);
    }

    float top = 1;
    float bottom = r - 2;
    float middle = r + (0 + yOffset) * yScale;

    Imgproc::drawLine(
      HPoint2(0.0f, top), HPoint2(static_cast<float>(c), top), 2, cv::Scalar(0, 26, 151), &xm);
    Imgproc::drawLine(
      HPoint2(0.0f, top), HPoint2(static_cast<float>(c), top), 2, cv::Scalar(0, 26, 151), &ym);
    Imgproc::drawLine(
      HPoint2(0.0f, top), HPoint2(static_cast<float>(c), top), 2, cv::Scalar(0, 26, 151), &zm);
    Imgproc::drawLine(
      HPoint2(0.0f, bottom),
      HPoint2(static_cast<float>(c), bottom),
      2,
      cv::Scalar(0, 26, 151),
      &xm);
    Imgproc::drawLine(
      HPoint2(0.0f, bottom),
      HPoint2(static_cast<float>(c), bottom),
      2,
      cv::Scalar(0, 26, 151),
      &ym);
    Imgproc::drawLine(
      HPoint2(0.0f, bottom),
      HPoint2(static_cast<float>(c), bottom),
      2,
      cv::Scalar(0, 26, 151),
      &zm);
    Imgproc::drawLine(
      HPoint2(0.0f, middle),
      HPoint2(static_cast<float>(c), middle),
      2,
      cv::Scalar(226, 11, 29),
      &xm);
    Imgproc::drawLine(
      HPoint2(0.0f, middle),
      HPoint2(static_cast<float>(c), middle),
      2,
      cv::Scalar(226, 11, 29),
      &ym);
    Imgproc::drawLine(
      HPoint2(0.0f, middle),
      HPoint2(static_cast<float>(c), middle),
      2,
      cv::Scalar(226, 11, 29),
      &zm);
  }
};

int main(int argc, char *argv[]) {
  LatencySummarizer latencySummarizer;
  XRCapnpSensors sensors;
  auto cap = LogRecordCapture::create("");

  SensorPlot accelerometerData;
  SensorPlot gyroData;
  SensorPlot magnetometerData;

  cv::Mat accPlot(640, 1300, CV_8UC3);
  cv::Mat gyroPlot(640, 1300, CV_8UC3);
  cv::Mat magPlot(640, 1300, CV_8UC3);

  cv::Mat colorFrame;
  int f = 0;
  while (true) {
    {
      ScopeTimer t("pose-sensors");
      {
        ScopeTimer t1("read-sensor-frame");
        if (!cap->read(&sensors)) {
          break;
        }
      }

      auto request = sensors.requestMessage->reader();
      auto ts = request.getSensors().getCamera().getCurrentFrame().getTimestampNanos();

      Vector<SensorEvent> newAccEvents;
      Vector<SensorEvent> newGyroEvents;
      Vector<SensorEvent> newMagEvents;
      {
        ScopeTimer t1("extract-sensor-events");
        newAccEvents.reserve(request.getSensors().getPose().getEventQueue().size());
        newGyroEvents.reserve(request.getSensors().getPose().getEventQueue().size());
        newMagEvents.reserve(request.getSensors().getPose().getEventQueue().size());
        for (auto re : request.getSensors().getPose().getEventQueue()) {
          SensorEvent e(
            re.getTimestampNanos(),
            re.getValue().getX(),
            re.getValue().getY(),
            re.getValue().getZ());
          switch (re.getKind()) {
            case RawPositionalSensorValue::PositionalSensorKind::ACCELEROMETER:
              newAccEvents.push_back(e);
              break;
            case RawPositionalSensorValue::PositionalSensorKind::GYROSCOPE:
              newGyroEvents.push_back(e);
              break;
            case RawPositionalSensorValue::PositionalSensorKind::MAGNETOMETER:
              newMagEvents.push_back(e);
              break;
            default:
              break;
          }
        }
      }

      {
        ScopeTimer t1("plot-add-events");
        accelerometerData.addEvents(newAccEvents);
        gyroData.addEvents(newGyroEvents);
        magnetometerData.addEvents(newMagEvents);
      }

      if (!request.getSensors().getCamera().getCurrentFrame().hasImage()) {
        continue;
      }

      {
        ScopeTimer t1("dsiplay-color-frame");
        auto srcY = sensors.yBuffer->pixels();
        auto srcUV = sensors.uvBuffer->pixels();

        colorFrame.create(srcY.rows(), srcY.cols(), CV_8UC3);
        BGR888PlanePixels dst(colorFrame.rows, colorFrame.cols, colorFrame.step, colorFrame.ptr(0));

        yuvToBgr(srcY, srcUV, &dst);

        cv::imshow("frame", colorFrame);
      }

      {
        ScopeTimer t1("plot-clear-canvas");
        accPlot.setTo(cv::Scalar(255, 255, 255));
        gyroPlot.setTo(cv::Scalar(255, 255, 255));
        magPlot.setTo(cv::Scalar(255, 255, 255));
      }

      {
        ScopeTimer t1("plot-draw");
        accelerometerData.draw(&accPlot);
        gyroData.draw(&gyroPlot);
        magnetometerData.draw(&magPlot);
      }

      {
        ScopeTimer t1("plot-imshow");
        cv::imshow("Accelerometer", accPlot);
        cv::imshow("Gyroscope", gyroPlot);
        cv::imshow("Magnetometer", magPlot);
      }

      {
        ScopeTimer t1("update-ui-loop");
        cv::waitKey(1);
      }

      C8Log(
        "Processing frame %d at time %lld -- Ranges: Accelerometer: %f; Gyro: %f; Magnetometer: %f",
        ++f,
        ts,
        accelerometerData.range,
        gyroData.range,
        magnetometerData.range);
    }

    if (f % 100 == 0) {
      ScopeTimer::logBriefSummary();
    }
  }

  return 0;
}
