// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "log-bytes-capture.h",
  };
  deps = {
    "//reality/quality/visualization/protolog:capnp-bytes-reader",
    "//c8:c8-log",
    "//c8/io:capnp-messages",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/protolog:xr-extern",
    "//c8/protolog:xr-requests",
    "//c8/protolog/api:log-request.capnp-cc",
    "//reality/app/xr/capnp:xr-capnp",
    "@capnproto//:capnp-lib",
  };
}
cc_end(0x62da38c3);

#include "c8/c8-log.h"
#include "c8/io/capnp-messages.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/protolog/xr-requests.h"
#include "c8/protolog/api/log-request.capnp.h"
#include "reality/quality/visualization/protolog/log-bytes-capture.h"

using MutableLogRecord = c8::MutableRootMessage<c8::LogRecord>;
using MutableRealityRequest = c8::MutableRootMessage<c8::RealityRequest>;

namespace c8 {

LogBytesCapture *LogBytesCapture::create(c8_NativeByteArray data) {
  CapnpBytesReader *reader = CapnpBytesReader::wrap(data);
  if (reader == nullptr) {
    return nullptr;
  }
  // Take ownership of the created reader.
  return new LogBytesCapture(reader);
}

LogBytesCapture::LogBytesCapture(CapnpBytesReader *reader_) : reader(reader_) {}

bool LogBytesCapture::isOpened() const { return true; }

bool LogBytesCapture::read(XRCapnpSensors *sensors) {
  ScopeTimer t("log-bytes-capture-read");

  while (true) {

    MutableLogRecord loggedMessage;
    if (!reader->read<LogRecord>(&loggedMessage)) {
      // No frame found. Clear the image.
      *sensors = XRCapnpSensors();
      return false;
    }

    auto record = loggedMessage.reader();

    auto loggedRequest = record.getRealityEngine().getRequest();

    // Copy the request that was logged.
    sensors->requestMessage.reset(new MutableRealityRequest(loggedRequest));
    auto requestBuilder = sensors->requestMessage->builder();

    auto loggedFrame = loggedRequest.getSensors().getCamera().getCurrentFrame();
    if (!loggedFrame.getImage().getOneOf().hasGrayImageData()) {
      return true;
    }

    // Copy image data into buffers owned by the sensor struct.
    auto ly = loggedFrame.getImage().getOneOf().getGrayImageData();
    auto luv = loggedFrame.getUvImage().getOneOf().getGrayImageData();

    int lyr = ly.getRows();
    int lyc = ly.getCols();
    int luvr = luv.getRows();
    int luvc = luv.getCols();
    bool swapDims = lyr < lyc;
    if (swapDims) {
      std::swap(lyr, lyc);
      std::swap(luvr, luvc);
    }

    ConstYPlanePixels ySrc(
      ly.getRows(), ly.getCols(), ly.getBytesPerRow(), ly.getUInt8PixelData().begin());
    ConstUVPlanePixels uvSrc(
      luv.getRows(), luv.getCols(), luv.getBytesPerRow(), luv.getUInt8PixelData().begin());

    if (
      sensors->yBuffer == nullptr || sensors->yBuffer->pixels().rows() != lyr
      || sensors->yBuffer->pixels().cols() != lyc) {
      sensors->yBuffer.reset(new YPlanePixelBuffer(lyr, lyc));
      sensors->uvBuffer.reset(new UVPlanePixelBuffer(luvr, luvc));
    }

    auto dy = sensors->yBuffer->pixels();
    auto duv = sensors->uvBuffer->pixels();
    if (swapDims) {
      downsizeAndRotate90Clockwise(ySrc, &dy);
      downsizeAndRotate90Clockwise(uvSrc, &duv);
    } else {
      copyPixels(ySrc, &dy);
      copyPixels(uvSrc, &duv);
    }

    // Replace the camera data with pointers to the buffers.
    auto cameraBuilder = requestBuilder.getSensors().getCamera();
    cameraBuilder.setCurrentFrame(capnp::defaultValue<CameraFrame>());
    cameraBuilder.getCurrentFrame().setVideoTimestampNanos(loggedFrame.getVideoTimestampNanos());
    cameraBuilder.getCurrentFrame().setFrameTimestampNanos(loggedFrame.getFrameTimestampNanos());
    cameraBuilder.getCurrentFrame().setTimestampNanos(loggedFrame.getTimestampNanos());
    setCameraPixelPointers(sensors->yBuffer->pixels(), sensors->uvBuffer->pixels(), &cameraBuilder);

    return true;
  }

  // Unreachable.
  return false;
}

void LogBytesCapture::release() {}

LogBytesCapture::~LogBytesCapture() noexcept { release(); }

}  // namespace c8
