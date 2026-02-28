// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "single-client-server.h",
  };
  deps = {
    "//bzl/inliner:rules",
    "//c8:c8-log",
    "@capnproto//:kj",
    "@capnproto//:capnp-lib",
  };
  visibility = {
    "//visibility:public",
  };
}

#include "reality/quality/visualization/xrom/frontend/server/single-client-server.h"
#include "c8/c8-log.h"

namespace c8 {

SingleClientServer::SingleClientServer(capnp::Capability::Client bootstrapInterface)
    : bootstrapInterface(kj::mv(bootstrapInterface)), tasks(*this) {}

struct SingleClientServer::AcceptedConnection {
  kj::Own<kj::AsyncIoStream> connection;
  capnp::TwoPartyVatNetwork network;
  capnp::RpcSystem<capnp::rpc::twoparty::VatId> rpcSystem;

  explicit AcceptedConnection(capnp::Capability::Client bootstrapInterface,
                              kj::Own<kj::AsyncIoStream>&& connectionParam)
      : connection(kj::mv(connectionParam)),
        network(*connection, capnp::rpc::twoparty::Side::SERVER),
        rpcSystem(makeRpcServer(network, kj::mv(bootstrapInterface))) {}
};

void SingleClientServer::accept(kj::Own<kj::AsyncIoStream>&& connection) {
  C8Log("[single-client-server] attempt accept connection: %s",
    connected ?  "CONNECTED": "NOT CONNECTED");
  if (connected) {
    return;
  }

  auto connectionState = kj::heap<AcceptedConnection>(bootstrapInterface, kj::mv(connection));
  connected = true;

  // Run the connection until disconnect.
  auto promise = connectionState->network.onDisconnect().then([this]() {
    C8Log("[single-client-server] onDisconnected. %s", "Connection ended.");
    connected = false;
  });
  tasks.add(promise.attach(kj::mv(connectionState)));
}

kj::Promise<void> SingleClientServer::listen(kj::ConnectionReceiver& listener) {
  C8Log("[single-client-server] %s", "listen");
  return listener.accept()
    .then([this,&listener](kj::Own<kj::AsyncIoStream>&& connection) mutable {
      accept(kj::mv(connection));
      return listen(listener);
    });
}

void SingleClientServer::taskFailed(kj::Exception&& exception) {
  C8Log("[single-client-server] %s", "taskFailed");
  KJ_LOG(ERROR, exception);
}

}  // namespace c8
