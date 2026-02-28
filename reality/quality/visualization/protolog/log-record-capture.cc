// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "log-record-capture.h",
  };
  deps = {
    "//c8:c8-log",
    "//c8/io:capnp-messages",
    "//c8/io:image-io",
    "//c8/pixels/opengl:gl-headers",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/protolog:xr-requests",
    "//c8/protolog/api:log-request.capnp-cc",
    "//c8/string:contains",
    "//reality/app/xr/capnp:xr-capnp",
    "//reality/engine/features:gl-reality-frame",
    "//reality/quality/visualization/protolog:capnpbin-reader",
    "//reality/quality/visualization/protolog:json-reader",
    "//reality/quality/visualization/protolog:log-record-reader",
    "@capnproto//:capnp-lib",
    "//c8/string:contains",
  };
}
cc_end(0x429149ac);

#include "c8/c8-log.h"
#include "c8/io/capnp-messages.h"
#include "c8/io/image-io.h"
#include "c8/pixels/opengl/gl-version.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/protolog/api/log-request.capnp.h"
#include "c8/protolog/xr-requests.h"
#include "c8/string/contains.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/quality/visualization/protolog/log-record-capture.h"

#if C8_HAS_CGL
#include <OpenGL/OpenGL.h>
#endif

using MutableLogRecord = c8::MutableRootMessage<c8::LogRecord>;
using MutableRealityRequest = c8::MutableRootMessage<c8::RealityRequest>;

namespace c8 {
namespace {
#if C8_HAS_CGL
CGLContextObj currcontext;
#endif

struct DecodedImageInfo {
  bool hasData = false;
  CompressedImageData::Encoding encoding = CompressedImageData::Encoding::UNSPECIFIED;
  int yRows = 0;
  int yCols = 0;
  int uvRows = 0;
  int uvCols = 0;
  bool swapDims = false;
};

DecodedImageInfo getImageInfoFromFrame(CameraFrame::Reader loggedFrame) {
  if (!loggedFrame.hasRGBAImage() && !loggedFrame.getImage().getOneOf().hasGrayImageData()) {
    return {false};
  }

  int yRows, yCols, uvRows, uvCols;
  CompressedImageData::Encoding encoding = CompressedImageData::Encoding::UNSPECIFIED;
  if (loggedFrame.hasRGBAImage()) {
    auto compressedImageData = loggedFrame.getRGBAImage().getOneOf().getCompressedImageData();
    if (compressedImageData.getEncoding() != CompressedImageData::Encoding::JPG_RGBA) {
      return {false};
    }
    yRows = compressedImageData.getHeight();
    yCols = compressedImageData.getWidth();
    uvRows = compressedImageData.getHeight() / 2;
    uvCols = compressedImageData.getWidth() / 2;
    encoding = compressedImageData.getEncoding();
  } else {
    auto ly = loggedFrame.getImage().getOneOf().getGrayImageData();
    auto luv = loggedFrame.getUvImage().getOneOf().getGrayImageData();

    yRows = ly.getRows();
    yCols = ly.getCols();
    uvRows = luv.getRows();
    uvCols = luv.getCols();
  }

  bool swapDims = yRows < yCols;
  if (swapDims) {
    std::swap(yRows, yCols);
    std::swap(uvRows, uvCols);
  }

  return {true, encoding, yRows, yCols, uvRows, uvCols, swapDims};
}

void decodeFromCompressedImage(
  bool swapDims,
  CompressedImageData::Reader rgb,
  YPlanePixels *yPixels,
  UVPlanePixels *uvPixels,
  RGBA8888PlanePixels *rgbaPixels,
  DecodeCompressedImageScratchSpace &scratch) {
  if (rgb.getEncoding() != CompressedImageData::Encoding::JPG_RGBA) {
    C8_THROW("Currently only support JPG_RGBA compressed encoding for logged RGBA image");
    return;
  }

  auto rgbData = rgb.getData();
  if (!scratch.init) {
    readJpgToPixelsAllocate(
      rgbData.begin(), rgbData.size(), &scratch.yBuf, &scratch.uBuf, &scratch.vBuf);
  }

  readJpgToPixels(
    rgbData.begin(),
    rgbData.size(),
    scratch.yBuf.pixels(),
    scratch.uBuf.pixels(),
    scratch.vBuf.pixels());

  if (swapDims) {
    // This doesn't happen in recorder8 which is where this code path stays
    C8_THROW("Need implementation where swap dims is true");
  } else {
    yuvToRgb(scratch.yBuf.pixels(), scratch.uBuf.pixels(), scratch.vBuf.pixels(), rgbaPixels);
    mergePixels(scratch.uBuf.pixels(), scratch.vBuf.pixels(), uvPixels);
    copyPixels(scratch.yBuf.pixels(), yPixels);
  }
}

void decodeFromRawYuvImage(
  bool swapDims,
  GrayImageData::Reader ly,
  GrayImageData::Reader luv,
  YPlanePixels *yPixels,
  UVPlanePixels *uvPixels,
  RGBA8888PlanePixels *rgbaPixels) {
  ConstYPlanePixels ySrc(
    ly.getRows(), ly.getCols(), ly.getBytesPerRow(), ly.getUInt8PixelData().begin());
  ConstUVPlanePixels uvSrc(
    luv.getRows(), luv.getCols(), luv.getBytesPerRow(), luv.getUInt8PixelData().begin());
  if (swapDims) {
    downsizeAndRotate90Clockwise(ySrc, yPixels);
    downsizeAndRotate90Clockwise(uvSrc, uvPixels);
  } else {
    copyPixels(ySrc, yPixels);
    copyPixels(uvSrc, uvPixels);
  }
  yuvToRgb(ySrc, uvSrc, rgbaPixels);
}

}  // namespace

LogRecordCapture *LogRecordCapture::create(const char *logfile) {
  LogRecordReader *reader = nullptr;
  if (endsWith(logfile, "capture.json")) {
    reader = JsonReader::open(logfile);
  } else {
    reader = CapnpbinReader::open(logfile);
  }
  if (reader == nullptr) {
    return nullptr;
  }
  // Take ownership of the created reader.
  return new LogRecordCapture(reader);
}

LogRecordCapture::LogRecordCapture(LogRecordReader *reader_)
    : reader(reader_)
#if !C8_HAS_EAGL
      ,
      context_(OffscreenGlContext::createRGBA8888Context())
#endif
{
#if C8_HAS_CGL
  currcontext = CGLGetCurrentContext();
#endif
}

bool LogRecordCapture::isOpened() const { return true; }

bool LogRecordCapture::read(XRCapnpSensors *sensors, XRCapnpReality *reality) {
  ScopeTimer t("log-record-capture-read");

  MutableLogRecord loggedMessage;
  if (!reader->read(&loggedMessage)) {
    // No frame found. Clear the image.
    *sensors = XRCapnpSensors();
    return false;
  }

  auto record = loggedMessage.reader();

  auto loggedRequest = record.getRealityEngine().getRequest();
  if (reality) {
    reality->xrResponse =
      ConstRootMessage<RealityResponse>(record.getRealityEngine().getResponse());
  }

  // Copy the request that was logged.
  sensors->requestMessage.reset(new MutableRealityRequest(loggedRequest));
  auto requestBuilder = sensors->requestMessage->builder();

  auto loggedFrame = loggedRequest.getSensors().getCamera().getCurrentFrame();
  auto decodedImageInfo = getImageInfoFromFrame(loggedFrame);
  if (!decodedImageInfo.hasData) {
    return true;
  }

  int yRows = decodedImageInfo.yRows;
  int yCols = decodedImageInfo.yCols;
  int uvRows = decodedImageInfo.uvRows;
  int uvCols = decodedImageInfo.uvCols;

  // We need to do two things
  //  - Copy image data into buffers owned by the sensor struct before using its pointers.
  //  - Provide a RGBA image for processing
  // For this, we first prep our buffers. Then we produce the required 3 images y, uv and rgba

  // Prepping buffers
  if (
    sensors->yBuffer == nullptr || sensors->yBuffer->pixels().rows() != yRows
    || sensors->yBuffer->pixels().cols() != yCols) {
    sensors->yBuffer.reset(new YPlanePixelBuffer(yRows, yCols));
    sensors->uvBuffer.reset(new UVPlanePixelBuffer(uvRows, uvCols));
  }
  auto dy = sensors->yBuffer->pixels();
  auto duv = sensors->uvBuffer->pixels();

  if (srcImg_.pixels().rows() != yRows || srcImg_.pixels().cols() != yCols) {
    srcImg_ = RGBA8888PlanePixelBuffer(yRows, yCols);
  }
  auto destPix = srcImg_.pixels();

  // Produce images
  if (decodedImageInfo.encoding != CompressedImageData::Encoding::UNSPECIFIED) {
    decodeFromCompressedImage(
      decodedImageInfo.swapDims,
      loggedFrame.getRGBAImage().getOneOf().getCompressedImageData(),
      &dy,
      &duv,
      &destPix,
      decodeCompressedScratch_);
  } else {
    decodeFromRawYuvImage(
      decodedImageInfo.swapDims,
      loggedFrame.getImage().getOneOf().getGrayImageData(),
      loggedFrame.getUvImage().getOneOf().getGrayImageData(),
      &dy,
      &duv,
      &destPix);
  }

  // Replace the camera data with pointers to the buffers.
  auto cameraBuilder = requestBuilder.getSensors().getCamera();
  cameraBuilder.setCurrentFrame(capnp::defaultValue<CameraFrame>());
  cameraBuilder.getCurrentFrame().setVideoTimestampNanos(loggedFrame.getVideoTimestampNanos());
  cameraBuilder.getCurrentFrame().setFrameTimestampNanos(loggedFrame.getFrameTimestampNanos());
  cameraBuilder.getCurrentFrame().setTimestampNanos(loggedFrame.getTimestampNanos());
  setCameraPixelPointers(sensors->yBuffer->pixels(), sensors->uvBuffer->pixels(), &cameraBuilder);

#if C8_HAS_CGL
  auto restorecontext = CGLGetCurrentContext();
  if (restorecontext != currcontext) {
    // C8Log("[start] Context is %p, restoring to %p", restorecontext, currcontext);
    CGLSetCurrentContext(currcontext);
  }
#endif

#if !C8_HAS_EAGL
  // GL features
  if (srcTex_.width() == 0) {
    srcTex_ = makeLinearRGBA8888Texture2D(yCols, yRows);
  }

  srcTex_.bind();
  srcTex_.updateImage(srcImg_.pixels().pixels());
  srcTex_.unbind();

  sensors->rgbaTexture = srcTex_.tex();
#endif

#if C8_HAS_CGL
  if (restorecontext != currcontext) {
    // C8Log("[end] Context is %p, restoring to %p", currcontext, restorecontext);
    CGLSetCurrentContext(restorecontext);
  }
#endif
  return true;
}

void LogRecordCapture::release() {}

LogRecordCapture::~LogRecordCapture() noexcept { release(); }

}  // namespace c8
