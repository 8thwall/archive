// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include <memory>

#include "c8/protolog/xr-extern.h"
#include "c8/string.h"
#include "reality/app/xr/capnp/xr-capnp.h"
#include "reality/quality/visualization/protolog/log-bytes-capture.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"

#pragma once

namespace c8 {

class BytesRealityStream : public RealityStreamInterface {
public:
  void setCallback(RealityStreamCallback *callback) override;
  RealityStreamCallback *getCallback();

  void spin() override;
  bool spinOnce();
  void stop() override;
  void loop(bool loop) { loop_ = loop; }
  ConstRootMessage<XrQueryResponse> *query(XrQueryRequest::Reader request) override;

  // Constructor.
  BytesRealityStream(c8_NativeByteArray data);
  virtual ~BytesRealityStream() {}

  // Default move constructors.
  BytesRealityStream(BytesRealityStream &&) = default;
  BytesRealityStream &operator=(BytesRealityStream &&) = default;

  // Disallow copying.
  BytesRealityStream(const BytesRealityStream &) = delete;
  BytesRealityStream &operator=(const BytesRealityStream &) = delete;

private:
  bool stopped_ = false;
  bool loop_ = false;
  c8_NativeByteArray data_;
  RealityStreamCallback *callback_ = nullptr;
  std::unique_ptr<LogBytesCapture> cap_;
  std::unique_ptr<XRCapnp> engine_;
  XRCapnpSensors sensors_;
};

}  // namespace c8
