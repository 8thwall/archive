// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)

#include "c8/html-shell/sensor-event-data-conversion.h"

#include "c8/quaternion.h"
#include "gtest/gtest.h"

namespace {

constexpr double EPSILON = 0.001;

struct WebVector {
  float alpha;
  float beta;
  float gamma;
};

}  // namespace

namespace c8 {

class SensorEventDataTest : public ::testing::Test {};

// See Example: https://w3c.github.io/deviceorientation/#device-orientation-model
/* Reminder:
 * - Alpha: rotation around the z-axis in degrees [0, 360]
 * - Beta:  rotation around the x-axis in degrees [-180, 180]
 * - Gamma: rotation around the y-axis in degrees [-90, 90]
 */
TEST_F(SensorEventDataTest, TestGetWebOrientationWithIdentity) {
  Quaternion quat(1.0, 0.0, 0.0, 0.0);
  WebVector values;

  getWebOrientation(quat, values.alpha, values.beta, values.gamma);

  EXPECT_NEAR(values.alpha, 0.0, EPSILON);
  EXPECT_NEAR(values.beta, 0.0, EPSILON);
  EXPECT_NEAR(values.gamma, 0.0, EPSILON);
}

TEST_F(SensorEventDataTest, TestGetWebOrientationWithZeroW) {
  Quaternion quat(0.0, 1.0, 0.0, 0.0);
  WebVector values;

  getWebOrientation(quat, values.alpha, values.beta, values.gamma);

  EXPECT_NEAR(values.alpha, 180.0, EPSILON);  // + 360 to match Web API.
  EXPECT_NEAR(values.beta, 180.0, EPSILON);   // Inverted to match Web API.
  EXPECT_NEAR(values.gamma, 0.0, EPSILON);
}

TEST_F(SensorEventDataTest, TestGetWebOrientationWest) {
  Quaternion quat(0.70710678, 0.0, 0.0, 0.70710678);
  WebVector values;

  getWebOrientation(quat, values.alpha, values.beta, values.gamma);

  EXPECT_NEAR(values.alpha, 90.0, EPSILON);
  EXPECT_NEAR(values.beta, 0.0, EPSILON);
  EXPECT_NEAR(values.gamma, 0.0, EPSILON);
}

TEST_F(SensorEventDataTest, TestGetWebOrientationEast) {
  Quaternion quat(0.70710678, 0.0, 0.0, -0.70710678);
  WebVector values;

  getWebOrientation(quat, values.alpha, values.beta, values.gamma);

  EXPECT_NEAR(values.alpha, 270.0, EPSILON);
  EXPECT_NEAR(values.beta, 0.0, EPSILON);
  EXPECT_NEAR(values.gamma, 0.0, EPSILON);
}

TEST_F(SensorEventDataTest, TestGetWebOrientationUp) {
  Quaternion quat(0.70710678, 0.70710678, 0.0, 0.0);
  WebVector values;

  getWebOrientation(quat, values.alpha, values.beta, values.gamma);

  EXPECT_NEAR(values.alpha, 0.0, EPSILON);
  EXPECT_NEAR(values.beta, 90.0, EPSILON);
  EXPECT_NEAR(values.gamma, 0.0, EPSILON);
}

TEST_F(SensorEventDataTest, TestGetWebOrientationRight) {
  Quaternion quat(0.70710678, 0.0, 0.70710678, 0.0);
  WebVector values;

  getWebOrientation(quat, values.alpha, values.beta, values.gamma);

  EXPECT_NEAR(values.alpha, 0.0, EPSILON);
  EXPECT_NEAR(values.beta, 0.0, EPSILON);
  EXPECT_NEAR(values.gamma, 89.98, EPSILON);
}

TEST_F(SensorEventDataTest, TestGetWebOrientationSouthRight) {
  Quaternion quat(0.0, 0.383, 0.0, -0.924);
  WebVector values;

  getWebOrientation(quat, values.alpha, values.beta, values.gamma);

  EXPECT_NEAR(values.alpha, 180.0, EPSILON);
  EXPECT_NEAR(values.beta, 0.0, EPSILON);
  EXPECT_NEAR(values.gamma, 45.055, EPSILON);
}

TEST_F(SensorEventDataTest, TestGetWebOrientationWestUp) {
  Quaternion quat(0.500005, 0.499995, 0.499995, 0.500005);
  WebVector values;

  getWebOrientation(quat, values.alpha, values.beta, values.gamma);

  EXPECT_NEAR(values.alpha, 90.0, EPSILON);
  EXPECT_NEAR(values.beta, 89.998, EPSILON);
  EXPECT_NEAR(values.gamma, 0.0, EPSILON);
}

TEST_F(SensorEventDataTest, TestGetWebOrientationEastDown) {
  Quaternion quat(0.500005, -0.499995, 0.499995, -0.500005);
  WebVector values;

  getWebOrientation(quat, values.alpha, values.beta, values.gamma);

  EXPECT_NEAR(values.alpha, 270.0, EPSILON);
  EXPECT_NEAR(values.beta, -89.998, EPSILON);
  EXPECT_NEAR(values.gamma, 0.0, EPSILON);
}

}  // namespace c8
