// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Riyaan Bakhda (riyaanbakhda@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":json-reader",
    "@com_google_googletest//:gtest_main",
  };
  data = {
    "//reality/quality/visualization/protolog/data:reader-test-data",
  };
}
cc_end(0xa00088f1);

#include "gmock/gmock.h"
#include "gtest/gtest.h"
#include "reality/quality/visualization/protolog/json-reader.h"

using MutableLogRecord = c8::MutableRootMessage<c8::LogRecord>;

namespace c8 {

auto file = "reality/quality/visualization/protolog/data/capture.json";

class JsonReaderTest : public ::testing::Test {};

TEST_F(JsonReaderTest, ReadMoreThanAvailableReturnFalse) {
  JsonReader *reader = JsonReader::open(file);

  MutableLogRecord loggedMessage;

  // 3 times True then False
  EXPECT_TRUE(reader->read(&loggedMessage));
  EXPECT_TRUE(reader->read(&loggedMessage));
  EXPECT_TRUE(reader->read(&loggedMessage));
  EXPECT_FALSE(reader->read(&loggedMessage));
}

TEST_F(JsonReaderTest, ReadJsonFileTest) {
  JsonReader *reader = JsonReader::open(file);
  MutableLogRecord loggedMessage;

  EXPECT_TRUE(reader->read(&loggedMessage));

  auto header = loggedMessage.reader().getHeader();
  EXPECT_EQ(header.getDevice().getDeviceInfo().getManufacturer(), "samsung");
  EXPECT_EQ(header.getDevice().getDeviceInfo().getModel(), "SM-G9860");

  auto camera = loggedMessage.reader().getRealityEngine().getRequest().getSensors().getCamera();
  auto grayImageData = camera.getCurrentFrame().getImage().getOneOf().getGrayImageData();
  EXPECT_EQ(grayImageData.getRows(), 960);
  EXPECT_EQ(grayImageData.getCols(), 540);
  EXPECT_EQ(grayImageData.getBytesPerRow(), 540);

  auto uvGrayImageData = camera.getCurrentFrame().getUvImage().getOneOf().getGrayImageData();
  EXPECT_EQ(uvGrayImageData.getRows(), 480);
  EXPECT_EQ(uvGrayImageData.getCols(), 270);
  EXPECT_EQ(uvGrayImageData.getBytesPerRow(), 540);

  auto currentFrame = camera.getCurrentFrame();
  EXPECT_EQ(currentFrame.getTimestampNanos(), 1606298302000000000);
  EXPECT_EQ(currentFrame.getFrameTimestampNanos(), 1606298302000000000);

  auto pixelIntrinsics = camera.getPixelIntrinsics();
  EXPECT_EQ(pixelIntrinsics.getPixelsWidth(), 540);
  EXPECT_EQ(pixelIntrinsics.getPixelsHeight(), 960);
  EXPECT_EQ(pixelIntrinsics.getCenterPointX(), 270);
  EXPECT_EQ(pixelIntrinsics.getCenterPointY(), 484);
  EXPECT_EQ(pixelIntrinsics.getFocalLengthHorizontal(), 712);
  EXPECT_EQ(pixelIntrinsics.getFocalLengthVertical(), 711);

  auto realityEngineRequest = loggedMessage.reader().getRealityEngine().getRequest();
  auto sensors = realityEngineRequest.getSensors();

  EXPECT_FLOAT_EQ(sensors.getGps().getLatitude(), 22.44);
  EXPECT_FLOAT_EQ(sensors.getGps().getLongitude(), 114.00);
  EXPECT_FLOAT_EQ(sensors.getGps().getHorizontalAccuracy(), 3.79);

  auto xrConfiguration = realityEngineRequest.getXRConfiguration();

  auto mask = xrConfiguration.getMask();
  EXPECT_TRUE(mask.getLighting());
  EXPECT_TRUE(mask.getCamera());
  EXPECT_TRUE(mask.getSurfaces());
  EXPECT_FALSE(mask.getVerticalSurfaces());
  EXPECT_FALSE(mask.getFeatureSet());
  EXPECT_FALSE(mask.getEstimateScale());
  EXPECT_FALSE(mask.getDisableVio());
  EXPECT_FALSE(mask.getDisableImageTargets());
  EXPECT_EQ(mask.getVpsMode(), XRRequestMask::VpsMode::OFF);

  auto graphicsIntrinsics = xrConfiguration.getGraphicsIntrinsics();
  EXPECT_EQ(graphicsIntrinsics.getTextureWidth(), 540);
  EXPECT_EQ(graphicsIntrinsics.getTextureHeight(), 960);
  EXPECT_FLOAT_EQ(graphicsIntrinsics.getNearClip(), 0.001);
  EXPECT_FLOAT_EQ(graphicsIntrinsics.getFarClip(), 1000);

  auto cameraConfiguration = xrConfiguration.getCameraConfiguration();
  EXPECT_FALSE(cameraConfiguration.getAutofocus());

  // Always portrait
  auto captureGeometry = cameraConfiguration.getCaptureGeometry();
  EXPECT_EQ(captureGeometry.getWidth(), 540);
  EXPECT_EQ(captureGeometry.getHeight(), 960);

  auto arxPose = realityEngineRequest.getSensors().getARCore().getPose();
  EXPECT_FLOAT_EQ(arxPose.getTranslation().getX(), -0.55);
  EXPECT_FLOAT_EQ(arxPose.getTranslation().getY(), -0.32);
  EXPECT_FLOAT_EQ(arxPose.getTranslation().getZ(), -3.93);
  EXPECT_FLOAT_EQ(arxPose.getRotation().getX(), 0);
  EXPECT_FLOAT_EQ(arxPose.getRotation().getY(), 0);
  EXPECT_FLOAT_EQ(arxPose.getRotation().getZ(), 0.70710683);
  EXPECT_FLOAT_EQ(arxPose.getRotation().getW(), 0.70710683);

  EXPECT_EQ(header.getReality().getEngineId(), RealityEngineLogRecordHeader::EngineType::ARCORE);
  EXPECT_EQ(header.getReality().getFrameId().getFrameId(), 0);
}

TEST_F(JsonReaderTest, PoseTest) {
  JsonReader *reader = JsonReader::open(file);
  MutableLogRecord loggedMessage;

  reader->read(&loggedMessage);
  auto devicePose =
    loggedMessage.reader().getRealityEngine().getRequest().getSensors().getPose().getDevicePose();
  EXPECT_NEAR(devicePose.getW(), 0.5f, 1e-4);
  EXPECT_NEAR(devicePose.getX(), 0.5f, 1e-4);
  EXPECT_NEAR(devicePose.getY(), -0.5f, 1e-4);
  EXPECT_NEAR(devicePose.getZ(), 0.5f, 1e-4);

  reader->read(&loggedMessage);
  devicePose =
    loggedMessage.reader().getRealityEngine().getRequest().getSensors().getPose().getDevicePose();
  EXPECT_NEAR(devicePose.getW(), 0.5f, 1e-4);
  EXPECT_NEAR(devicePose.getX(), -0.5f, 1e-4);
  EXPECT_NEAR(devicePose.getY(), 0.5f, 1e-4);
  EXPECT_NEAR(devicePose.getZ(), 0.5f, 1e-4);

  reader->read(&loggedMessage);
  devicePose =
    loggedMessage.reader().getRealityEngine().getRequest().getSensors().getPose().getDevicePose();
  EXPECT_NEAR(devicePose.getW(), 0.5f, 1e-4);
  EXPECT_NEAR(devicePose.getX(), -0.5f, 1e-4);
  EXPECT_NEAR(devicePose.getY(), -0.5f, 1e-4);
  EXPECT_NEAR(devicePose.getZ(), -0.5f, 1e-4);
}

TEST_F(JsonReaderTest, LinearAccelerationTest) {
  JsonReader *reader = JsonReader::open(file);
  MutableLogRecord loggedMessage;

  reader->read(&loggedMessage);
  auto eventQueue =
    loggedMessage.reader().getRealityEngine().getRequest().getSensors().getPose().getEventQueue();
  EXPECT_EQ(eventQueue.size(), 0);

  reader->read(&loggedMessage);
  eventQueue =
    loggedMessage.reader().getRealityEngine().getRequest().getSensors().getPose().getEventQueue();
  auto eventKind = eventQueue[0].getKind();
  auto eventTimestampNanos = eventQueue[0].getTimestampNanos();
  auto linAcc = eventQueue[0].getValue();
  EXPECT_EQ(eventKind, RawPositionalSensorValue::PositionalSensorKind::LINEAR_ACCELERATION);
  EXPECT_EQ(eventTimestampNanos, static_cast<int64_t>(1606298302.133 * 1e9));
  EXPECT_NEAR(linAcc.getX(), 0.f, 1e-4);       // constant position, so 0 acceleration
  EXPECT_NEAR(linAcc.getY(), 0.f, 1e-4);       // positions -0.32, -0.32, -0.35, so deceleration
  EXPECT_NEAR(linAcc.getZ(), -1.6959f, 1e-4);  // constant velocity, so 0 acceleration

  reader->read(&loggedMessage);
  eventQueue =
    loggedMessage.reader().getRealityEngine().getRequest().getSensors().getPose().getEventQueue();
  EXPECT_EQ(eventQueue.size(), 1);
}

TEST_F(JsonReaderTest, GyroscopeTest) {
  JsonReader *reader = JsonReader::open(file);
  MutableLogRecord loggedMessage;

  reader->read(&loggedMessage);
  auto eventQueue =
    loggedMessage.reader().getRealityEngine().getRequest().getSensors().getPose().getEventQueue();
  EXPECT_EQ(eventQueue.size(), 0);

  reader->read(&loggedMessage);
  eventQueue =
    loggedMessage.reader().getRealityEngine().getRequest().getSensors().getPose().getEventQueue();
  EXPECT_EQ(eventQueue[1].getTimestampNanos(), static_cast<int64_t>(1606298302.133 * 1e9));
  EXPECT_EQ(eventQueue[1].getKind(), RawPositionalSensorValue::PositionalSensorKind::GYROSCOPE);

  reader->read(&loggedMessage);
  eventQueue =
    loggedMessage.reader().getRealityEngine().getRequest().getSensors().getPose().getEventQueue();
  EXPECT_EQ(eventQueue[0].getTimestampNanos(), static_cast<int64_t>(1606298302.266 * 1e9));
  EXPECT_EQ(eventQueue[0].getKind(), RawPositionalSensorValue::PositionalSensorKind::GYROSCOPE);
}

}  // namespace c8
