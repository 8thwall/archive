// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include <memory>

#include "reality/app/xr/capnp/xr-capnp.h"
#include "reality/quality/visualization/protolog/log-record-capture.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"

#pragma once

namespace c8 {

class StdinRealityStream : public RealityStreamInterface {
public:
  void setCallback(RealityStreamCallback *callback) override;
  void spin() override;
  void stop() override;
  ConstRootMessage<XrQueryResponse> *query(XrQueryRequest::Reader request) override;

  // Default constructor.
  StdinRealityStream();
  virtual ~StdinRealityStream() {}

  // Default move constructors.
  StdinRealityStream(StdinRealityStream &&) = default;
  StdinRealityStream &operator=(StdinRealityStream &&) = default;

  // Disallow copying.
  StdinRealityStream(const StdinRealityStream &) = delete;
  StdinRealityStream &operator=(const StdinRealityStream &) = delete;

private:
  bool stopped_ = false;
  RealityStreamCallback *callback_ = nullptr;
  std::unique_ptr<LogRecordCapture> cap_;
  std::unique_ptr<XRCapnp> engine_;
  XRCapnpSensors sensors_;
};

}  // namespace c8
