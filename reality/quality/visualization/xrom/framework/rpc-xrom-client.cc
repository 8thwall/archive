// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "rpc-xrom-client.h",
  };
  deps = {
    ":xrom-client-interface",
    "//bzl/inliner:rules",
    "//c8:c8-log-proto",
    "//c8:string",
    "//c8:vector",
    "//c8/io:capnp-messages",
    "//c8/io:kj-event-loop",
    "//reality/quality/visualization/xrom/api:xrom-service.capnp-cc",
  };
  visibility = {
    "//visibility:public",
  };
}

#include "reality/quality/visualization/xrom/framework/rpc-xrom-client.h"

#include "c8/c8-log-proto.h"
#include "c8/io/kj-event-loop.h"

using namespace c8;

String RpcXromClient::DEFAULT_HOST = "127.0.0.1";
uint16_t RpcXromClient::DEFAULT_PORT = 27752;

XromClientInterface* RpcXromClient::update(const MutableRootMessage<XromUpdateNode> &node) {
  pendingMessages_.emplace_back(node.reader());
  return this;
}

void RpcXromClient::flush() {
  auto request = xrom_.updateXromRequest();
  auto b = request.getRequest();

  b.setFlush(UpdateXromRequest::Flush::FLUSH_AFTER_UPDATES);
  b.initUpdates(pendingMessages_.size());
  for (int i = 0; i < pendingMessages_.size(); ++i) {
    b.getUpdates().setWithCaveats(i, pendingMessages_[i].reader());
  }
  pendingMessages_.clear();

  auto &waitScope = ezrpcClient_.getWaitScope();
  auto promise = request.send();
  promise.wait(waitScope);
}

RpcXromClient::RpcXromClient(const String &host, uint16_t port)
    : ezrpcClient_(host.c_str(), port), xrom_(ezrpcClient_.getMain<XromService>()) {
  // Share the ezrpcClient event loop with other classes that need it.
  KjEventLoop::setKjEventLoop(ezrpcClient_.getIoProvider(), ezrpcClient_.getWaitScope());
}
