// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <capnp/ez-rpc.h>

#include "c8/io/capnp-messages.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/quality/visualization/xrom/api/xrom-service.capnp.h"
#include "reality/quality/visualization/xrom/framework/xrom-client-interface.h"

namespace c8 {

class RpcXromClient : public XromClientInterface {
public:
  static String DEFAULT_HOST;
  static uint16_t DEFAULT_PORT;

  // Default constructor.
  RpcXromClient() : RpcXromClient(DEFAULT_HOST, DEFAULT_PORT) {}
  RpcXromClient(const String &host) : RpcXromClient(host, DEFAULT_PORT) {}
  RpcXromClient(const String &host, uint16_t port);
  virtual ~RpcXromClient() {};

  // Default move constructors.
  RpcXromClient(RpcXromClient &&) = default;
  RpcXromClient &operator=(RpcXromClient &&) = default;

  // Disallow copying.
  RpcXromClient(const RpcXromClient &) = delete;
  RpcXromClient &operator=(const RpcXromClient &) = delete;

  XromClientInterface *update(const MutableRootMessage<XromUpdateNode> &node) override;
  void flush() override;

private:
  Vector<ConstRootMessage<XromUpdateNode>> pendingMessages_;
  capnp::EzRpcClient ezrpcClient_;
  XromService::Client xrom_;
};

}  // namespace c8
