// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <array>
#include <deque>

#include "c8/vector.h"

namespace c8 {

class DetectionImageStats {
public:
  double frameTimeMicros = 0.0f;
  double numMatches = 0.0f;
  std::array<double, 3> targetFound{};
  std::array<double, 3> inlierCount{};
  std::array<double, 256> scoresHistogram{};
  // cosine between two poses. [-1, 1]
  // ratio of image target size in the camera frame, smaller is better
  // small number means the image target get detected even at a smaller scale
  std::array<double, 3> targetRatio{};

  DetectionImageStats &operator+=(const DetectionImageStats &rhs) {
    frameTimeMicros += rhs.frameTimeMicros;
    numMatches += rhs.numMatches;
    for (int i = 0; i < targetFound.size(); ++i) {
      targetFound[i] += rhs.targetFound[i];
      targetRatio[i] += rhs.targetRatio[i];
      inlierCount[i] += rhs.inlierCount[i];
    }
    for (int i = 0; i < scoresHistogram.size(); ++i) {
      scoresHistogram[i] += rhs.scoresHistogram[i];
    }
    return *this;
  }

  DetectionImageStats &operator-=(const DetectionImageStats &rhs) {
    frameTimeMicros -= rhs.frameTimeMicros;
    numMatches -= rhs.numMatches;
    for (int i = 0; i < targetFound.size(); ++i) {
      targetFound[i] -= rhs.targetFound[i];
      targetRatio[i] -= rhs.targetRatio[i];
    }
    for (int i = 0; i < scoresHistogram.size(); ++i) {
      scoresHistogram[i] -= rhs.scoresHistogram[i];
    }
    return *this;
  }

  DetectionImageStats operator/(int rhs) {
    DetectionImageStats ret = *this;
    ret.frameTimeMicros /= rhs;
    ret.numMatches /= rhs;
    for (int i = 0; i < ret.targetFound.size(); ++i) {
      ret.targetFound[i] /= rhs;
      ret.targetRatio[i] /= rhs;
      ret.inlierCount[i] /= rhs;
    }
    for (int i = 0; i < ret.scoresHistogram.size(); ++i) {
      ret.scoresHistogram[i] /= rhs;
    }
    return ret;
  }
};

class DetectionImageStatsTracker {
public:
  DetectionImageStats add(const DetectionImageStats &frameStats) {
    sumStats_ += frameStats;
    stats_.push_back(frameStats);
    if (stats_.size() > 50) {
      sumStats_ -= stats_.front();
      stats_.pop_front();
    }
    return mean();
  }
  DetectionImageStats mean() {
    if (stats_.empty()) {
      return {};
    }
    return sumStats_ / stats_.size();
  }

private:
  std::deque<DetectionImageStats> stats_;
  DetectionImageStats sumStats_;
};
}  // namespace c8
