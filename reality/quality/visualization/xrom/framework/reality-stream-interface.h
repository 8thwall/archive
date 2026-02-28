// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "c8/io/capnp-messages.h"
#include "reality/engine/api/reality.capnp.h"

namespace c8 {

class RealityStreamInterface;

class RealityStreamCallback {
public:
  virtual void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader request,
    RealityResponse::Reader response) = 0;
  virtual ~RealityStreamCallback() noexcept(false) {};
};

class RealityStreamInterface {
public:
  virtual ~RealityStreamInterface() noexcept(false) {};
  virtual void setCallback(RealityStreamCallback *callback) = 0;
  virtual void spin() = 0;
  virtual void stop() = 0;
  virtual ConstRootMessage<XrQueryResponse> *query(XrQueryRequest::Reader request) = 0;
};

}  // namespace c8
