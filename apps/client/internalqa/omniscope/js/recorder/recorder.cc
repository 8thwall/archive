// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)
// The recorder.cc and recorder.js were copied from engine.cc and engine.js
// and trim in order to expose only the minimum required functionalities.
// This way we process data similar to the engine but only capture it for
// recording.

#ifdef JAVASCRIPT

#include <emscripten.h>
#include <emscripten/fetch.h>

#include <array>
#include <cstdint>
#include <cstring>
#include <deque>
#include <memory>

#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/geometry/device-pose.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/capnp-messages.h"
#include "c8/io/image-io.h"
#include "c8/pixels/pipeline/gl-texture-pipeline.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/protolog/api/remote-request.capnp.h"
#include "c8/protolog/xr-requests.h"
#include "c8/string.h"
#include "c8/symbol-visibility.h"
#include "c8/time/now.h"
#include "reality/engine/api/base/image-types.capnp.h"
#include "reality/engine/api/request/app.capnp.h"
#include "reality/engine/api/request/sensor.capnp.h"
#include "reality/engine/executor/xr-engine.h"
#include "reality/engine/features/gl-reality-frame.h"

using namespace c8;

namespace {

// Set a single rgba image on the camera frame
void setJpgCompressedImageData(
  CompressedImageData::Builder imageBuilder,
  ConstYPlanePixels yPixels,
  ConstUVPlanePixels uvPixels) {
  // Store these values ready for the decoded value
  imageBuilder.setHeight(yPixels.rows());
  imageBuilder.setWidth(yPixels.cols());
  imageBuilder.setEncoding(CompressedImageData::Encoding::JPG_RGBA);

  // Deinterleave uv image into u and v plane pixels
  UPlanePixelBuffer uBuf{uvPixels.rows(), uvPixels.cols()};
  VPlanePixelBuffer vBuf{uvPixels.rows(), uvPixels.cols()};
  splitPixels(uvPixels, uBuf.pixels(), vBuf.pixels());

  // Encode our the image prior to storing the blob. Since JPG is internally in YUV, this
  // skips extra conversions.
  Vector<uint8_t> encodedBuf = writePixelsToJpg(yPixels, uBuf.pixels(), vBuf.pixels());
  imageBuilder.initData(encodedBuf.size());
  std::memcpy(imageBuilder.getData().begin(), encodedBuf.data(), encodedBuf.size());
}

struct XrwebEnvironment {
  ConstRootMessage<DeviceInfo> deviceInfo;

  int displayWidth;
  int displayHeight;

  bool isWebGl2;
};

struct Orientation {
  float alpha;
  float beta;
  float gamma;
};

struct PipelineData {
  GLuint realityTextureId = 0;
  Quaternion devicePose{1, 0, 0, 0};
  Orientation deviceWebOrientation;
  ConstRootMessage<RealityResponse> realityResponse;
  int captureWidth = 0;
  int captureHeight = 0;
  int captureRotation = 0;
  // The video playback time.
  int64_t videoTimeNanos = 0;
  // The time when the frame was read.
  int64_t frameTimeNanos = 0;
  // The time when the frame was staged.
  int64_t timeNanos = 0;
  ConstRootMessage<RequestPose> eventQueue;
  ConstRootMessage<LogRecord> logRecord;

  double latitude = 0.0;
  double longitude = 0.0;
  // The accuracy, with a 95% confidence level, of the latitude and longitude properties expressed
  // in meters: https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/accuracy
  double accuracy = 0.0;
};

// If you need to add a field here that needs to eventually be on PipelineData, just add it directly
// to the PipelineData object when you call c8EmAsm_stageFrame().
struct EngineData {
  std::unique_ptr<XREngine> xr;
  ConstRootMessage<CoordinateSystemConfiguration> configuredCoordinateSystem;
  // Holds IMU data before it is set on PipelineData. Do not access it from here directly except to
  // set on PipelineData in c8EmAsm_stageFrame.
  ConstRootMessage<RequestPose> eventQueue;

  float nearClip = 0.01f;
  float farClip = 1000.0f;

  ConstRootMessage<XRConfiguration> xrConfig;

  std::deque<PipelineData> pipeline;
  PipelineData active;

  int frameTick = 0;

  bool disableVio = true;

  // The latest available YUV of the camera feed
  YPlanePixelBuffer yBuffer;
  UVPlanePixelBuffer uvBuffer;
  // What encoding to use on our image data prior to sending them on the wire.
  // Default to pushing frames in RAW
  CompressedImageData::Encoding encodingMode = CompressedImageData::Encoding::JPG_RGBA;
  bool includeCameraImage = false;
};

std::unique_ptr<EngineData> &data() {
  static std::unique_ptr<EngineData> d(nullptr);
  if (d == nullptr) {
    d.reset(new EngineData());
  }
  return d;
}

XrwebEnvironment &xrwebEnvironment() {
  static XrwebEnvironment e;
  return e;
}

void rebuildRecorder() {
  data()->xr.reset(nullptr);
  data()->xr.reset(new XREngine());
  data()->xr->setDisableSummaryLog(true);

  data()->pipeline.clear();
  data()->frameTick = 0;

  // Set the last externally configured coordinate system (or a default one if none was set).
  MutableRootMessage<XRConfiguration> configMessageBuilder;
  configMessageBuilder.builder().setCoordinateConfiguration(
    data()->configuredCoordinateSystem.reader());
  data()->xr->configure(configMessageBuilder.reader());
  // TODO(dat): Remove the ability to configure from Typescript.
  //            Directly hardcode the configuration here
  data()->xr->configure(data()->xrConfig.reader());
}

AppContext::DeviceOrientation rotationToDeviceOrientation(int rotation) {
  switch (rotation) {
    case 0:
      return AppContext::DeviceOrientation::PORTRAIT;
    case 90:
    case -270:
      return AppContext::DeviceOrientation::LANDSCAPE_LEFT;
    case 180:
    case -180:
      return AppContext::DeviceOrientation::PORTRAIT_UPSIDE_DOWN;
    case 270:
    case -90:
      return AppContext::DeviceOrientation::LANDSCAPE_RIGHT;
    default:
      return AppContext::DeviceOrientation::UNSPECIFIED;
  }
}

void buildXrRequest(RealityRequest::Builder request, PipelineData &p) {
  // Request mean-pixel-value and pose procesing.
  // TODO(nb): enable external callers to set sensortest.
  // request.getMask().setSensorTest(true);

  // TODO(nb): should xrConfig be on PipelineData?
  if (data()->xrConfig.reader().hasMask()) {
    request.setXRConfiguration(data()->xrConfig.reader());
  } else {
    request.getXRConfiguration().getMask().setCamera(true);

    auto graphicsIntrinsics = request.getXRConfiguration().getGraphicsIntrinsics();
    graphicsIntrinsics.setTextureWidth(xrwebEnvironment().displayWidth);
    graphicsIntrinsics.setTextureHeight(xrwebEnvironment().displayHeight);
    graphicsIntrinsics.setNearClip(data()->nearClip);
    graphicsIntrinsics.setFarClip(data()->farClip);
  }

  request.setDeviceInfo(xrwebEnvironment().deviceInfo.reader());

  auto captureGeometry = request.getXRConfiguration().getCameraConfiguration().getCaptureGeometry();

  // Engine expects a portrait capture size to properly calculate intrinsics from
  // pre-calibrated devices.
  if (p.captureWidth > p.captureHeight) {
    captureGeometry.setWidth(p.captureHeight);
    captureGeometry.setHeight(p.captureWidth);
  } else {
    captureGeometry.setWidth(p.captureWidth);
    captureGeometry.setHeight(p.captureHeight);
  }

  // Set the image pixel pointers.
  auto reqCam = request.getSensors().getCamera();
  reqCam.getCurrentFrame().setVideoTimestampNanos(p.videoTimeNanos);
  reqCam.getCurrentFrame().setFrameTimestampNanos(p.frameTimeNanos);
  reqCam.getCurrentFrame().setTimestampNanos(p.timeNanos);

  // Set device pose and IMU data.
  auto devicePose = request.getSensors().getPose();
  auto dr = p.devicePose;
  setDevicePose(0.0f, 0.0f, 0.0f, dr.w(), dr.x(), dr.y(), dr.z(), &devicePose);
  devicePose.setEventQueue(p.eventQueue.reader().getEventQueue());

  auto webOrientation = devicePose.getDeviceWebOrientation();
  webOrientation.setAlpha(p.deviceWebOrientation.alpha);
  webOrientation.setBeta(p.deviceWebOrientation.beta);
  webOrientation.setGamma(p.deviceWebOrientation.gamma);

  // Set GPS data.
  request.getSensors().getGps().setLatitude(p.latitude);
  request.getSensors().getGps().setLongitude(p.longitude);
  request.getSensors().getGps().setHorizontalAccuracy(p.accuracy);

  auto appContext = request.getAppContext();
  appContext.setDeviceOrientation(rotationToDeviceOrientation(p.captureRotation));
}

void setYuvOnRealityRequest(
  const YPlanePixels &yPixels,
  const UVPlanePixels &uvPixels,
  RealityRequest::Builder requestBuilder) {
  // copy planar yuv into capnp message
  auto currentFrame = requestBuilder.getSensors().getCamera().getCurrentFrame();

  MutableRootMessage<CameraFrame> imgmsg;
  CameraFrame::Builder frame = imgmsg.builder();
  frame.setVideoTimestampNanos(currentFrame.getVideoTimestampNanos());
  frame.setFrameTimestampNanos(currentFrame.getFrameTimestampNanos());
  frame.setTimestampNanos(currentFrame.getTimestampNanos());

  // TODO(dat): Support PNG / lossless
  // TODO(dat): We previous had to convert RGBA to YUV using yuv-pixels-array module but we can
  // just compress our encoding directly in a lossless format like PNG instead.

  // NOTE(dat): LogRecordCapture will automatically expand either format into Y and UV channel
  //            for later consumption downstream (see *-from-datarecorder.cc).
  if (data()->encodingMode == CompressedImageData::Encoding::JPG_RGBA) {
    auto rgbImage = frame.initRGBAImage();
    setJpgCompressedImageData(rgbImage.getOneOf().initCompressedImageData(), yPixels, uvPixels);
  } else {
    // Default unsupported mode to RAW
    setRawYImageData(yPixels, frame.getImage().getOneOf().initGrayImageData());
    setRawUvImageData(uvPixels, frame.getUvImage().getOneOf().initGrayImageData());
  }

  requestBuilder.getSensors().getCamera().initCurrentFrame();
  requestBuilder.getSensors().getCamera().setCurrentFrame(frame);
}

void processPipelineData(PipelineData &p) {
  ScopeTimer t0("recorder");
  MutableRootMessage<RealityRequest> requestMsg;
  auto request = requestMsg.builder();
  buildXrRequest(request, p);

  MutableRootMessage<RealityResponse> responseMsg;
  auto response = responseMsg.builder();
  {
    ScopeTimer t("xr-engine");
    data()->xr->execute(requestMsg.reader(), &response);
  }
  p.realityResponse = ConstRootMessage<RealityResponse>(response);

  if (data()->includeCameraImage) {
    setYuvOnRealityRequest(data()->yBuffer.pixels(), data()->uvBuffer.pixels(), request);
  }

  // prepare the message for logging
  MutableRootMessage<LogRecord> logRecordMsg;
  LogRecord::Builder record = logRecordMsg.builder();
  record.getRealityEngine().setRequest(request);
  record.getRealityEngine().setResponse(response);

  p.logRecord = ConstRootMessage<LogRecord>(logRecordMsg);

  EM_ASM_(
    {
      _recorder8.recorderRecord = $0;
      _recorder8.recorderRecordSize = $1;
    },
    p.logRecord.bytes().begin(),
    p.logRecord.bytes().size());
}

// Process using ONE_STAGE strategy
bool processPipeline() {
  if (data()->pipeline.size() < 2) {
    return false;
  }
  processPipelineData(data()->pipeline[0]);
  return true;
}

}  // namespace

extern "C" {

C8_PUBLIC
void c8EmAsm_configureXr(uint8_t *config, int configSize) {
  ConstRootMessage<XRConfiguration> cm(config, configSize);
  auto c = cm.reader();

  if (c.hasMask()) {  // Typically this is sent with the graphics config as well.
    data()->xrConfig = ConstRootMessage<XRConfiguration>(c);
    data()->disableVio = c.getMask().getDisableVio();
  }
  if (c.hasCoordinateConfiguration()) {  // Typically this is sent separately from mask/graphics.
    // Save the user-specified coordinate configuration for future calls to recenter.
    auto coords = c.getCoordinateConfiguration();
    data()->configuredCoordinateSystem = ConstRootMessage<CoordinateSystemConfiguration>(coords);
  }

  // This check is a protective measure in case the user calls configureXr before onAttach.
  // onAttach() calls rebuild() which initializes data()->xr
  if (data()->xr != nullptr) {
    data()->xr->configure(c);
  }
}

C8_PUBLIC
void c8EmAsm_recorderCleanup() { data().reset(nullptr); }

C8_PUBLIC
void c8EmAsm_recorderInit(
  int captureWidth,
  int captureHeight,
  int rotation,
  const char *os,
  const char *osVersion,
  const char *manufacturer,
  const char *model) {
  xrwebEnvironment().displayWidth = captureWidth;
  xrwebEnvironment().displayHeight = captureHeight;

  {
    MutableRootMessage<DeviceInfo> deviceInfoMsg;
    auto deviceInfoBuilder = deviceInfoMsg.builder();
    deviceInfoBuilder.setOs(os);
    deviceInfoBuilder.setOsVersion(osVersion);
    deviceInfoBuilder.setManufacturer(manufacturer);
    deviceInfoBuilder.setModel(model);
    xrwebEnvironment().deviceInfo = deviceInfoMsg;
  }

  rebuildRecorder();
  C8Log(
    "[recorder] Initialized to pipeline strategy ONE_STAGE width %d x height %d",
    captureWidth,
    captureHeight);
}

// Called by onProcessGpu. Saves IMU data to be read by c8EmAsm_stageFrame().
// TODO(paris): We could actually pass this data in c8EmAsm_stageFrame and remove data()->eventQueue
C8_PUBLIC
void c8EmAsm_setEventQueue(uint8_t *ptr, int size) {
  data()->eventQueue = ConstRootMessage<RequestPose>(ptr, size);
}

C8_PUBLIC
void c8EmAsm_stageFrame(
  GLuint cameraTexture,
  int captureWidth,
  int captureHeight,
  int rotation,
  float alpha,
  float beta,
  float gamma,
  float qw,
  float qx,
  float qy,
  float qz,
  double videoTimeSeconds,
  double frameTimeSeconds,
  double timeNanos,
  double latitude,
  double longitude,
  double accuracy) {
  data()->frameTick++;

  // We don't implement stage transition, staging frame into the pipeline
  data()->pipeline.emplace_back();
  auto &p = data()->pipeline.back();
  p.realityTextureId = cameraTexture;
  p.devicePose = Quaternion(qw, qx, qy, qz);
  p.deviceWebOrientation = {alpha, beta, gamma};
  p.videoTimeNanos = static_cast<int64_t>(videoTimeSeconds * 1e9);
  p.frameTimeNanos = static_cast<int64_t>(frameTimeSeconds * 1e9);
  p.timeNanos = static_cast<int64_t>(timeNanos);
  p.captureWidth = captureWidth;
  p.captureHeight = captureHeight;
  p.captureRotation = rotation;
  p.eventQueue = ConstRootMessage<RequestPose>(data()->eventQueue.reader());
  p.latitude = latitude;
  p.longitude = longitude;
  p.accuracy = accuracy;
}  // end stageFrame()

// @return true if pipeline has been processed and data is available at
//              window._recorder8.recorderRecord for this frame.
C8_PUBLIC
bool c8EmAsm_processStagedFrame() {
  bool pipelineProcessed = processPipeline();
  if (pipelineProcessed) {
    data()->active = std::move(data()->pipeline[0]);
    data()->pipeline.pop_front();
  }

  if (data()->pipeline.empty()) {
    data()->frameTick = 0;
  }
  return pipelineProcessed;
}  // end processStagedFrame()

// You should call this method before calling c8EmAsm_processStagedFrame so processPipeline()
// can use the latest available YUV data
C8_PUBLIC
void c8EmAsm_cpuYuvConversion(int rows, int cols, int bytesPerRow, uint8_t *pixels) {
  ScopeTimer t("recorder");
  auto yuvPixels = ConstYUVA8888PlanePixels(rows, cols, bytesPerRow, pixels);

  // TODO(dat): can we optimize this so we can ping pong between two frames
  if (data()->yBuffer.pixels().rows() != rows || data()->yBuffer.pixels().cols() != cols) {
    data()->yBuffer = YPlanePixelBuffer(rows, cols);
    data()->uvBuffer = UVPlanePixelBuffer(rows / 2, cols / 2);
  }
  auto yPixels = data()->yBuffer.pixels();
  auto uvPixels = data()->uvBuffer.pixels();
  yuvToPlanarYuv(yuvPixels, &yPixels, &uvPixels);
}

// Set format on the wire. Default to 0. See recorder.ts setDataCompression method.
// @param encoding See definition in code8/reality/app/xr/js/src/types/recorder.ts
C8_PUBLIC
void c8EmAsm_setCompressedFormat(int encoding) {
  // Use int instead of CompressedImageData::Encoding to avoid coupling + not sure if WASM can
  // correctly pass an int from JS into capnp enum (uint16_t)
  if (encoding == 3) {
    data()->encodingMode = CompressedImageData::Encoding::JPG_RGBA;
  } else {
    data()->encodingMode = CompressedImageData::Encoding::UNSPECIFIED;
  }
}

// Set whether to include camera image on the wire. Default to false.
C8_PUBLIC
void c8EmAsm_setIncludeCameraImage(bool includeCameraImage) {
  C8Log("[recorder] Setting includeCameraImage=%d", includeCameraImage);
  data()->includeCameraImage = includeCameraImage;
}

C8_PUBLIC
void c8EmAsm_clearPipeline() {
  C8Log("[recorder] Pipeline data cleared");
  data()->pipeline.clear();
}

}  // EXTERN "C"
#endif
