// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)
//

#pragma once

#include <capnp/rpc-twoparty.h>

namespace c8 {

// This is essentially capnp::TwoPartyServer taken from
//   capnproto/c++/src/capnp/rpc-twoparty.h
// and modified to only accept one connection at a time.
class SingleClientServer: private kj::TaskSet::ErrorHandler {

public:
  explicit SingleClientServer(capnp::Capability::Client bootstrapInterface);

  // Accepts the connection for servicing.
  void accept(kj::Own<kj::AsyncIoStream>&& connection);

  // Listens for connections on the given listener. The returned promise never resolves unless an
  // exception is thrown while trying to accept. You may discard the returned promise to cancel
  // listening.
  kj::Promise<void> listen(kj::ConnectionReceiver& listener);

private:
  capnp::Capability::Client bootstrapInterface;
  kj::TaskSet tasks;
  bool connected = false;
  struct AcceptedConnection;

  void taskFailed(kj::Exception&& exception) override;
};

}  // namespace c8
