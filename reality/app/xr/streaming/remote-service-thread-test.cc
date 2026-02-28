// Copyright(c) 2016 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":remote-service-thread",
    "//c8/protolog/api:remote-service.capnp-cc",
    "@com_google_googletest//:gtest_main",
  };
  visibility = {
    "//visibility:private",
  };
}
cc_end(0xc5531d4c);

#include "reality/app/xr/streaming/remote-service-thread.h"

#include <capnp/ez-rpc.h>
#include <iostream>
#include <gtest/gtest.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>
#include "c8/protolog/api/remote-service-interface.capnp.h"

using capnp::EzRpcClient;

namespace c8 {

namespace {

class TestCallback : public StreamingRecordCallback {
public:
  void processRecord(const XrRemoteRequest::Reader& record, XrRemoteResponse::Builder *response) {
    // NO-OP
  }
};

}  // namespace

#define DEBUG(msg) std::cerr << msg << std::endl;

class RemoteServiceThreadTest : public ::testing::Test {};

TEST_F(RemoteServiceThreadTest, CreateAndDestroyThread) {
  srand(time(nullptr));
  const int port = rand() % 100 + 23286; // 23285 is used during dev/prod
  char HOST_PORT[8];
  snprintf(HOST_PORT, 8, "*:%d", port);
  TestCallback cb;

  EzRpcClient client(HOST_PORT);
  auto &waitScope = client.getWaitScope();
  auto &ioProvider = client.getIoProvider();

  DEBUG("Launching RemoteServiceThread on port " << port);
  RemoteServiceThread *thread = new RemoteServiceThread(&cb, ioProvider, waitScope, port);

  DEBUG("Get client main");
  auto cap = client.getMain<RemoteService>();
  DEBUG("Sending log request");
  auto logRequest = cap.logRequest();
  auto logPromise = logRequest.send();
  DEBUG("Waiting on log response");
  auto response = logPromise.wait(waitScope);

  DEBUG("Preping the shutdown request");
  auto shutdownRequest = cap.shutdownRequest();
  auto exception = kj::runCatchingExceptions([&]() {
    DEBUG("Sending shut down request");
    auto shutdownPromise = shutdownRequest.send();
    auto shutdownReponse = shutdownPromise.wait(waitScope);
  });

  KJ_IF_MAYBE(e, exception) {
    // We just asked the server to terminate, so we're going to be
    // disconnected. This seems a better hack than adding a locked
    // resource to coordinate between server and main threads.
    if (e->getType() != kj::Exception::Type::DISCONNECTED) {
      // Rethrow if not a DISCONNECTED exception.
      DEBUG("Got exception that is not disconnected");
      kj::getExceptionCallback().onRecoverableException(kj::mv(*e));
    }
  }
  delete thread;
}

}  // namespace c8
