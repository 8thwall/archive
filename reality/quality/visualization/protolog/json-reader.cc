// Copyright (c) 2022 Niantic, Inc.
// Original Author: Riyaan Bakhda (riyaanbakhda@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "json-reader.h",
  };
  deps = {
    "//reality/quality/visualization/protolog:log-record-reader",
    "//c8/geometry:device-pose",
    "//c8/geometry:egomotion",
    "//c8/geometry:intrinsics",
    "//c8/geometry:vectors",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "//c8/pixels:pixel-transforms",
    "//c8/protolog:xr-requests",
  };
}
cc_end(0x1f67785b);

#include "c8/geometry/device-pose.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/vectors.h"
#include "c8/protolog/xr-requests.h"
#include "reality/quality/visualization/protolog/json-reader.h"

namespace c8 {

Quaternion getQuaternionFromJson(const nlohmann::json &captureJson, int frameNumber) {
  const auto &frameJson = captureJson["frames"][frameNumber];
  return Quaternion(
    frameJson["pose"][6].get<float>(),
    frameJson["pose"][3].get<float>(),
    frameJson["pose"][4].get<float>(),
    frameJson["pose"][5].get<float>());
}

HVector3 getTranslationFromJson(const nlohmann::json &captureJson, int frameNumber) {
  const auto &frameJson = captureJson["frames"][frameNumber];
  // Note(Riyaan): Possible overflow during conversion from double to float
  return HVector3{
    frameJson["pose"][0].get<float>(),
    frameJson["pose"][1].get<float>(),
    frameJson["pose"][2].get<float>()};
}

HMatrix getPoseFromJson(const nlohmann::json &captureJson, int frameNumber) {
  auto q = getQuaternionFromJson(captureJson, frameNumber);
  auto p = getTranslationFromJson(captureJson, frameNumber);
  const auto &coordinates = captureJson["coordinates"].get<String>();
  auto pose = HMatrixGen::i();
  if (coordinates.compare("opengl") == 0) {
    pose = portraitDeviceFromLandscapeMassf(p, q);
  } else {
    C8Log("[json-reader] Conversion from %s coordinates is untested", coordinates.c_str());
  }
  return pose;
}

Quaternion getDeviceQuaternionFromJson(const nlohmann::json &captureJson, int frameNumber) {
  return rotation(getPoseFromJson(captureJson, frameNumber));
}

HVector3 getDeviceTranslationFromJson(const nlohmann::json &captureJson, int frameNumber) {
  return translation(getPoseFromJson(captureJson, frameNumber));
}

bool JsonReader::read(MutableRootMessage<LogRecord> *message) {
  if (currentFrame_ >= totalFrameCount_) {  // there is no other message
    return false;
  }
  const auto &frameJson = captureJson_["frames"][currentFrame_];

  // MASSF resolution is always [bigger, smaller] because it is always landscape.
  auto resolutionWidth = captureJson_["resolution"][0];
  auto resolutionHeight = captureJson_["resolution"][1];

  auto record = message->builder();

  // buildHeader
  record.getHeader().getDevice().getDeviceInfo().setManufacturer(captureJson_["manufacturer"]);
  record.getHeader().getDevice().getDeviceInfo().setModel(captureJson_["model"]);

  auto realityEngineBuilder = record.getRealityEngine();
  auto requestBuilder = realityEngineBuilder.getRequest();

  // buildGPS
  // Location is missing for some frames (usually the beginning of the sequence)
  if (
    frameJson.contains("location") && frameJson["location"].contains("latitude")
    && frameJson["location"].contains("longitude")
    && frameJson["location"].contains("positionAccuracy")) {
    auto gpsBuilder = requestBuilder.getSensors().getGps();
    gpsBuilder.setLatitude(frameJson["location"]["latitude"]);
    gpsBuilder.setLongitude(frameJson["location"]["longitude"]);
    gpsBuilder.setHorizontalAccuracy(frameJson["location"]["positionAccuracy"]);
  }

  // buildDeviceInfo
  requestBuilder.getDeviceInfo().setManufacturer(captureJson_["manufacturer"]);
  requestBuilder.getDeviceInfo().setModel(captureJson_["model"]);

  // buildCamera
  MutableRootMessage<CameraFrame> imgmsg;
  auto currentFrame = imgmsg.builder();
  auto timestampNanos = static_cast<int64_t>(1e9 * frameJson["timestamp"].get<double>());
  currentFrame.setFrameTimestampNanos(timestampNanos);
  currentFrame.setTimestampNanos(timestampNanos);

  auto filename = logfilePath_ + frameJson["image"].get<String>();
  RGBA8888PlanePixelBuffer png = readJpgToRGBA(filename);

  auto pngPixels = png.pixels();
  auto pixBuffer = RGBA8888PlanePixelBuffer(pngPixels.cols(), pngPixels.rows());
  auto pix = pixBuffer.pixels();
  rotate90Clockwise(pngPixels, &pix);

  // Convert RGB to an interleaved yuv format.
  YUVA8888PlanePixelBuffer interleavedYuv(pix.rows(), pix.cols());
  auto interleavedYuvPix = interleavedYuv.pixels();
  rgbToYuv(pix, &interleavedYuvPix);

  // Separate the y/uv single image into two images.
  YPlanePixelBuffer yBuf(pix.rows(), pix.cols());
  auto yPix = yBuf.pixels();

  UVPlanePixelBuffer uvBuf(pix.rows() / 2, pix.cols() / 2);
  auto uvPix = uvBuf.pixels();

  yuvToPlanarYuv(interleavedYuvPix, &yPix, &uvPix);

  auto yImageBuilder = currentFrame.getImage().getOneOf().initGrayImageData();
  yImageBuilder.setRows(yPix.rows());
  yImageBuilder.setCols(yPix.cols());
  yImageBuilder.setBytesPerRow(yPix.rowBytes());

  yImageBuilder.initUInt8PixelData(yPix.rows() * yPix.rowBytes());
  std::memcpy(
    yImageBuilder.getUInt8PixelData().begin(), yPix.pixels(), yPix.rows() * yPix.rowBytes());

  auto uvImageBuilder = currentFrame.getUvImage().getOneOf().initGrayImageData();
  uvImageBuilder.setRows(uvPix.rows());
  uvImageBuilder.setCols(uvPix.cols());
  uvImageBuilder.setBytesPerRow(uvPix.rowBytes());

  uvImageBuilder.initUInt8PixelData(uvPix.rows() * uvPix.rowBytes());
  std::memcpy(
    uvImageBuilder.getUInt8PixelData().begin(), uvPix.pixels(), uvPix.rows() * uvPix.rowBytes());

  requestBuilder.getSensors().getCamera().initCurrentFrame();
  requestBuilder.getSensors().getCamera().setCurrentFrame(currentFrame);

  // Building original intrinsic object
  c8_PixelPinholeCameraModel originalK = {
    resolutionWidth,
    resolutionHeight,
    frameJson["intrinsics"][2].get<float>(),
    frameJson["intrinsics"][3].get<float>(),
    frameJson["intrinsics"][0].get<float>(),
    frameJson["intrinsics"][1].get<float>()};

  // Build new intrinsic object for rotated image
  auto newK = Intrinsics::rotateCropAndScaleIntrinsics(originalK, pix.cols(), pix.rows());

  // buildRealityEngineEnvironment
  auto environmentBuilder = realityEngineBuilder.getEnvironment();
  environmentBuilder.setRealityImageWidth(newK.pixelsWidth);
  environmentBuilder.setRealityImageHeight(newK.pixelsHeight);

  // buildXrConfiguration
  auto xrConfiguration = requestBuilder.getXRConfiguration();

  xrConfiguration.getMask().setLighting(true);
  xrConfiguration.getMask().setCamera(true);
  xrConfiguration.getMask().setSurfaces(true);
  xrConfiguration.getMask().setVerticalSurfaces(false);
  xrConfiguration.getMask().setFeatureSet(false);
  xrConfiguration.getMask().setEstimateScale(false);
  xrConfiguration.getMask().setDisableVio(false);
  xrConfiguration.getMask().setDisableImageTargets(false);

  auto graphicsIntrinsicsBuilder = xrConfiguration.getGraphicsIntrinsics();
  graphicsIntrinsicsBuilder.setTextureWidth(newK.pixelsWidth);
  graphicsIntrinsicsBuilder.setTextureHeight(newK.pixelsHeight);
  // See https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/wiki/spaces/AR/pages/360712457/ for
  // near/far
  graphicsIntrinsicsBuilder.setNearClip(0.001f);
  graphicsIntrinsicsBuilder.setFarClip(1000.0f);

  xrConfiguration.getCameraConfiguration().setAutofocus(captureJson_["autofocus"] > 0);
  auto captureGeometry = xrConfiguration.getCameraConfiguration().getCaptureGeometry();
  // Engine expects a portrait capture size to properly calculate intrinsics from
  // pre-calibrated devices.
  captureGeometry.setWidth(newK.pixelsWidth);
  captureGeometry.setHeight(newK.pixelsHeight);

  // buildPixelIntrinsics
  auto pixelIntrinsicsBuilder = requestBuilder.getSensors().getCamera().getPixelIntrinsics();
  pixelIntrinsicsBuilder.setPixelsWidth(newK.pixelsWidth);
  pixelIntrinsicsBuilder.setPixelsHeight(newK.pixelsHeight);
  pixelIntrinsicsBuilder.setFocalLengthHorizontal(newK.focalLengthHorizontal);
  pixelIntrinsicsBuilder.setFocalLengthVertical(newK.focalLengthVertical);
  pixelIntrinsicsBuilder.setCenterPointX(newK.centerPointX);
  pixelIntrinsicsBuilder.setCenterPointY(newK.centerPointY);

  // buildPose
  auto devicePoseQuaternion = getDeviceQuaternionFromJson(captureJson_, currentFrame_);
  auto poseBuilder = requestBuilder.getSensors().getPose();

  auto devicePoseRotation = poseBuilder.getDevicePose();
  devicePoseRotation.setW(devicePoseQuaternion.w());
  devicePoseRotation.setX(devicePoseQuaternion.x());
  devicePoseRotation.setY(devicePoseQuaternion.y());
  devicePoseRotation.setZ(devicePoseQuaternion.z());

  auto currTimestampSecs = frameJson["timestamp"].get<double>();  // timestamp of current frame
  Vector<RawPositionalSensorValue::Builder> events;
  MutableRootMessage<RawPositionalSensorValue> linAccEvent;

  // Check whether neighbouring frames exist to compute acceleration
  if (currentFrame_ > 0 && currentFrame_ + 1 < totalFrameCount_) {
    // frame dicts for prev and next frames
    const auto &prevJson = captureJson_["frames"][currentFrame_ - 1];
    const auto &nextJson = captureJson_["frames"][currentFrame_ + 1];

    // Vectors for prev, curr, and next frames
    auto prevPos = getDeviceTranslationFromJson(captureJson_, currentFrame_ - 1);
    auto currPos = getDeviceTranslationFromJson(captureJson_, currentFrame_);
    auto nextPos = getDeviceTranslationFromJson(captureJson_, currentFrame_ + 1);

    // time intervals between curr and prev, and next and curr
    auto prevDt = (currTimestampSecs - prevJson["timestamp"].get<double>());
    auto currDt = (nextJson["timestamp"].get<double>() - currTimestampSecs);

    auto linearAcceleration = accelVerlet(prevPos, currPos, nextPos, prevDt, currDt);

    auto eventBuilder = linAccEvent.builder();
    eventBuilder.setTimestampNanos(currTimestampSecs * 1e9);
    eventBuilder.setKind(RawPositionalSensorValue::PositionalSensorKind::LINEAR_ACCELERATION);
    setPosition32f(
      linearAcceleration.x(),
      linearAcceleration.y(),
      linearAcceleration.z(),
      eventBuilder.getValue());
    events.push_back(eventBuilder);
  }

  MutableRootMessage<RawPositionalSensorValue> gyroscopeEvent;

  // Check whether previous frame exists to compute velocity
  if (currentFrame_ > 0) {
    // Quaternions for prev and curr frames
    auto prevPos = getDeviceQuaternionFromJson(captureJson_, currentFrame_ - 1);
    auto currPos = devicePoseQuaternion;

    // Frame dict for prev frame
    const auto &prevFrameJson = captureJson_["frames"][currentFrame_ - 1];
    auto dt = (currTimestampSecs - prevFrameJson["timestamp"].get<double>());

    auto angVelRadPerSec = angularVelocity(prevPos, currPos, dt);

    auto eventBuilder = gyroscopeEvent.builder();
    eventBuilder.setTimestampNanos(currTimestampSecs * 1e9);
    eventBuilder.setKind(RawPositionalSensorValue::PositionalSensorKind::GYROSCOPE);
    setPosition32f(
      angVelRadPerSec.x() * 180 / M_PI,
      angVelRadPerSec.y() * 180 / M_PI,
      angVelRadPerSec.z() * 180 / M_PI,
      eventBuilder.getValue());
    events.push_back(eventBuilder);
  }

  MutableRootMessage<RequestPose> allSensorEvents;
  int numEvents = events.size();
  auto eventQueue = allSensorEvents.builder().initEventQueue(numEvents);
  for (int index = 0; index < numEvents; index++) {
    eventQueue.setWithCaveats(index, events.at(index));
  }
  poseBuilder.setEventQueue(allSensorEvents.reader().getEventQueue());

  auto deviceManufacturer = captureJson_["manufacturer"].get<String>();
  // Make manufacturer uppercase for comparison
  std::transform(
    deviceManufacturer.begin(),
    deviceManufacturer.end(),
    deviceManufacturer.begin(),
    [](unsigned char c) { return std::toupper(c); });
  // Set Ios true if manufacturer is "APPLE"
  auto isIos = std::strcmp(deviceManufacturer.c_str(), "APPLE") == 0;
  // Used reality/quality/benchmark/benchmark-xr-6dof-chesspose.cc for reference
  auto arxPoseBuilder = isIos ? requestBuilder.getSensors().getARKit().getPose()
                              : requestBuilder.getSensors().getARCore().getPose();

  auto t = getTranslationFromJson(captureJson_, currentFrame_);
  auto r = getQuaternionFromJson(captureJson_, currentFrame_);
  if (!isIos) {
    r = r.times(Quaternion::zDegrees(90.f));
  }
  arxPoseBuilder.getTranslation().setX(t.x());
  arxPoseBuilder.getTranslation().setY(t.y());
  arxPoseBuilder.getTranslation().setZ(t.z());
  arxPoseBuilder.getRotation().setX(r.x());
  arxPoseBuilder.getRotation().setY(r.y());
  arxPoseBuilder.getRotation().setZ(r.z());
  arxPoseBuilder.getRotation().setW(r.w());

  // Note(Riyaan): We don't have AR Kit/Core's external points, so we cannot fill Reality Request.
  // MASSF does, however, sometimes provide .pcd files containing pointclouds for every frame

  auto engineTypeValue = isIos ? RealityEngineLogRecordHeader::EngineType::ARKIT
                               : RealityEngineLogRecordHeader::EngineType::ARCORE;
  record.getHeader().getReality().setEngineId(engineTypeValue);
  record.getHeader().getReality().getFrameId().setFrameId(currentFrame_);

  // Note(Riyaan): lightIntensity not set here since it's not present in Capnp LogRecords either

  currentFrame_++;
  return true;
};

}  // namespace c8
