// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)

#include "c8/html-shell/sensor-event-data-conversion.h"

constexpr float RAD_TO_DEG = 180.0f / M_PI;
constexpr double EPSILON = 0.000001;

namespace c8 {

void getWebOrientation(Quaternion &quat, float &alpha, float &beta, float &gamma) {
  // Best effort if w isn't given by sensor.
  if (std::fabs(quat.w()) < EPSILON) {
    float newW = 1 - quat.x() * quat.x() - quat.y() * quat.y() - quat.z() * quat.z();
    newW = (newW > 0) ? sqrt(newW) : 0;
    quat = Quaternion(newW, quat.x(), quat.y(), quat.z());
  }

  float xx = 2 * quat.x() * quat.x();
  float yy = 2 * quat.y() * quat.y();
  float zz = 2 * quat.z() * quat.z();
  float xy = 2 * quat.x() * quat.y();
  float zw = 2 * quat.z() * quat.w();
  float xz = 2 * quat.x() * quat.z();
  float yw = 2 * quat.y() * quat.w();
  float yz = 2 * quat.y() * quat.z();
  float xw = 2 * quat.x() * quat.w();

  // Only use needed rotation matrix elements.
  float mm01 = xy - zw;
  float mm11 = 1 - xx - zz;
  float mm20 = xz - yw;
  float mm21 = yz + xw;
  float mm22 = 1 - xx - yy;

  alpha = atan2(mm01, mm11) * RAD_TO_DEG;
  alpha *= -1;  // Invert to match Web API. Which flips the heading angle.
  if (alpha < 0) {
    alpha += 360;
  }

  beta = atan2(mm21, mm22) * RAD_TO_DEG;

  gamma = asin(-mm20) * RAD_TO_DEG;
}

}  // namespace c8
