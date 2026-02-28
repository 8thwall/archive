// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include <memory>

#include "c8/io/capnp-messages.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"

#pragma once

namespace c8 {

class RemoteRealityStream : public RealityStreamInterface {
public:
  void setCallback(RealityStreamCallback *callback) override;
  void spin() override;
  void stop() override;
  ConstRootMessage<XrQueryResponse> *query(XrQueryRequest::Reader request) override;

  // Default constructor.
  RemoteRealityStream();
  virtual ~RemoteRealityStream();

  // Default move constructors.
  RemoteRealityStream(RemoteRealityStream &&) = default;
  RemoteRealityStream &operator=(RemoteRealityStream &&) = default;

  // Disallow copying.
  RemoteRealityStream(const RemoteRealityStream &) = delete;
  RemoteRealityStream &operator=(const RemoteRealityStream &) = delete;

private:
  bool stopped_ = false;
  int64_t lastUpdateMicros_ = 0;
  RealityStreamCallback *callback_ = nullptr;
};

}  // namespace c8
