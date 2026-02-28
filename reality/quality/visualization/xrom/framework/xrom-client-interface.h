// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "c8/io/capnp-messages.h"
#include "reality/quality/visualization/xrom/api/xrom.capnp.h"

namespace c8 {

class XromClientInterface {
public:
  virtual ~XromClientInterface() noexcept(false) {};

  // Update returns "this" for chaining, e.g.
  // client->update(nodeA)
  //   ->update(nodeB)
  //   ->update(nodeC)
  //   ->update(nodeD)
  //   ->flush();
  virtual XromClientInterface *update(const MutableRootMessage<XromUpdateNode> &node) = 0;
  virtual void flush() = 0;
};

}  // namespace c8
