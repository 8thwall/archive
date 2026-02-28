// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <kj/io.h>

#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/opengl/gl-version.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "reality/app/xr/capnp/xr-capnp.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/quality/visualization/protolog/capnpbin-reader.h"
#include "reality/quality/visualization/protolog/json-reader.h"

namespace c8 {
namespace {
struct DecodeCompressedImageScratchSpace {
  bool init = false;
  YPlanePixelBuffer yBuf;
  UPlanePixelBuffer uBuf;
  VPlanePixelBuffer vBuf;
};
}  // namespace

class LogRecordCapture {
public:
  // Read from the provided logfile, or stdin if logfile is null or empty.
  static LogRecordCapture *create(const char *logfile);

  // Prefer these to the overridden methods below, since they give a more accurate and complete
  // picture of the data in the phone.
  bool read(XRCapnpSensors *sensors, XRCapnpReality *reality = nullptr);

  // Overrides to let opencv samples (e.g. camera calibration) use this class with minimal delta.
  bool isOpened() const;
  void release();
  ~LogRecordCapture() noexcept;

  // Disable default construction, copy and move.
  LogRecordCapture(const char *logfile) = delete;
  LogRecordCapture(LogRecordCapture &&) = delete;
  LogRecordCapture &operator=(LogRecordCapture &&) = delete;
  LogRecordCapture(const LogRecordCapture &) = delete;
  LogRecordCapture &operator=(const LogRecordCapture &) = delete;

private:
  LogRecordCapture(LogRecordReader *reader_);
  std::unique_ptr<LogRecordReader> reader;
#if !C8_HAS_EAGL
  OffscreenGlContext context_;
#endif
  GlTexture2D srcTex_;
  RGBA8888PlanePixelBuffer srcImg_;
  DecodeCompressedImageScratchSpace decodeCompressedScratch_;
};

}  // namespace c8
