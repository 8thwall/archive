// Copyright (c) 2025 Niantic Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)

#include "c8/html-shell/sensor-event-data.h"

#include "gtest/gtest.h"

namespace c8 {

class SensorEventDataTest : public ::testing::Test {};

TEST_F(SensorEventDataTest, NoCrash) {
  SensorEventData sensorEventData;

  EXPECT_EQ(sensorEventData.timestamp, 0);
  EXPECT_FALSE(sensorEventData.hasGyroscope);
  EXPECT_FALSE(sensorEventData.hasOrientation);
  EXPECT_FALSE(sensorEventData.hasAcceleration);

  EXPECT_FLOAT_EQ(sensorEventData.gyroscopeVector.x, 0.0f);
  EXPECT_FLOAT_EQ(sensorEventData.gyroscopeVector.y, 0.0f);
  EXPECT_FLOAT_EQ(sensorEventData.gyroscopeVector.z, 0.0f);

  EXPECT_FLOAT_EQ(sensorEventData.orientation.x, 0.0f);
  EXPECT_FLOAT_EQ(sensorEventData.orientation.y, 0.0f);
  EXPECT_FLOAT_EQ(sensorEventData.orientation.z, 0.0f);

  EXPECT_FLOAT_EQ(sensorEventData.accelerationVector.x, 0.0f);
  EXPECT_FLOAT_EQ(sensorEventData.accelerationVector.y, 0.0f);
  EXPECT_FLOAT_EQ(sensorEventData.accelerationVector.z, 0.0f);
}

}  // namespace c8
