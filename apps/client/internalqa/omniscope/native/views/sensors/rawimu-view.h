// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#pragma once

#include <deque>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/color.h"
#include "c8/string.h"

namespace c8 {

class RawImuView : public OmniscopeView {
public:
  RawImuView();

  String name() override { return "Raw IMU"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;

  // Disallow move constructors.
  RawImuView(RawImuView &&) = delete;
  RawImuView &operator=(RawImuView &&) = delete;

  // Disallow copying.
  RawImuView(const RawImuView &) = delete;
  RawImuView &operator=(const RawImuView &) = delete;

private:
  AppConfiguration appConfig_;
  TexCopier copyTexture_;

  std::mutex touchMtx_;

  uint32_t currentFrame_ = 0;
  int64_t minSensorTime_ = std::numeric_limits<int64_t>::max();
  int64_t minFrameTimeNanos_ = std::numeric_limits<int64_t>::max();
  int64_t minVideoTimeNanos_ = std::numeric_limits<int64_t>::max();

  // Timing of frames in the c8 engine.
  // The frame that this sensor event was recieved on.
  Vector<float> c8Frame_;
  // The time when the frame was staged.
  Vector<float> c8TimeSecs_;
  // The time when the frame was read.
  Vector<float> c8FrameTimeSecs_;
  // The video playback time shifted to start at zero.
  Vector<float> c8VideoTimeSecsShiftedToZero_;
  // The video playback time shifted to start at frameTime.
  Vector<float> c8VideoTimeSecsShiftedToFrame_;
  // The video playback time shifted to start at frameTime / 2
  Vector<float> c8VideoTimeSecsShiftedToHalfFrame_;
  // Num mag events on this frame.
  Vector<float> numMagnetometer_;
  // Num accel events on this frame.
  Vector<float> numAccelerometer_;
  // Num gyro events on this frame.
  Vector<float> numGyroscope_;
  // Num lin accel events on this frame.
  Vector<float> numLinearAcceleration_;

  // Request sensor values.
  Vector<float> accFrame_;
  Vector<float> accTimeSecs_;
  Vector<float> accX_;
  Vector<float> accY_;
  Vector<float> accZ_;

  Vector<float> gyroFrame_;
  Vector<float> gyroTimeSecs_;
  Vector<float> gyroX_;
  Vector<float> gyroY_;
  Vector<float> gyroZ_;

  Vector<float> magFrame_;
  Vector<float> magTimeSecs_;
  Vector<float> magX_;
  Vector<float> magY_;
  Vector<float> magZ_;

  Vector<float> linaccFrame_;
  Vector<float> linaccTimeSecs_;
  Vector<float> linaccX_;
  Vector<float> linaccY_;
  Vector<float> linaccZ_;

  Vector<float> poseFrame_;
  Vector<float> poseTimeSecs_;
  Vector<float> poseW_;
  Vector<float> poseX_;
  Vector<float> poseY_;
  Vector<float> poseZ_;

  Vector<float> devaccFrame_;
  Vector<float> devaccTimeSecs_;
  Vector<float> devaccX_;
  Vector<float> devaccY_;
  Vector<float> devaccZ_;
};

}  // namespace c8
