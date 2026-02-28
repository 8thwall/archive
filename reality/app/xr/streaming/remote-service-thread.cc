// Copyright (c) 2016 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "remote-service-thread.h",
  };
  deps = {
    ":remote-service-impl",
    ":single-client-server",
    ":streaming-record-callback",
    "//bzl/inliner:rules",
    "//c8:c8-log",
    "//c8:exceptions",
    "//c8/events:lev-event-listener",
    "//c8/network:dns-service-discovery",
    "@capnproto//:kj",
    "@capnproto//:capnp-lib",
  };
  visibility = {
    "//visibility:public",
  };
}

#if defined(WIN32) || defined(_WIN32)
#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#include <io.h>

#include <windows.h>
#include <kj/windows-sanity.h>

#pragma push_macro("ERROR")
#undef ERROR
#pragma push_macro("VOID")
#undef VOID
#pragma push_macro("INTERFACE")
#undef INTERFACE
#pragma push_macro("min")
#undef min
#pragma push_macro("max")
#undef max

#else
#include <unistd.h>
#endif

#include "reality/app/xr/streaming/remote-service-thread.h"

#include <capnp/ez-rpc.h>
#include <capnp/rpc-twoparty.h>
#include <dns_sd.h>
#include <kj/async.h>
#include <kj/async-io.h>
#include <kj/common.h>
#include <kj/exception.h>
#include <atomic>
#include <future>
#include <string>
#include <thread>
#include "c8/c8-log.h"
#include "c8/exceptions.h"
#include "c8/events/lev-event-listener.h"
#include "c8/network/dns-service-discovery.h"
#include "reality/app/xr/streaming/remote-service-impl.h"
#include "reality/app/xr/streaming/single-client-server.h"

using kj::Own;
using kj::Promise;

namespace c8 {

namespace {

constexpr int DEFAULT_PORT = 23285;
constexpr char regtype[] = "_8thWall_remote_service._tcp";

}  // namespace

RemoteServiceThread::RemoteServiceThread(StreamingRecordCallback *cb,
    kj::AsyncIoProvider &ioProvider,
    kj::WaitScope &waitScope) :
    RemoteServiceThread(cb, ioProvider, waitScope, DEFAULT_PORT) {
}

RemoteServiceThread::RemoteServiceThread(StreamingRecordCallback *cb,
    kj::AsyncIoProvider &ioProvider,
    kj::WaitScope &waitScope,
    int serverPort) :
    waitScope_(waitScope) {
  std::promise<bool> initPromise;
  std::future<bool> initFuture = initPromise.get_future();

  //NOTE(dat): C8Log won't print to avoid poluting Editor.log
  //           You can redirect it to a file with freopen("debug.txt", "a", stdout);
  // Open a read/write pipe so the desctructor can communicate 'done' to the server thead.
  // Read happens on this thread, write happens on the destructing thread.
  C8Log("[remote-service-thread] %s", "starting thread for capnp server.");
  pipeThread_ = ioProvider.newPipeThread([cb, &initPromise, serverPort](
      kj::AsyncIoProvider& ioProvider, kj::AsyncIoStream& stream, kj::WaitScope& waitScope) {
    const std::string serverAddress = "*:" + std::to_string(serverPort);
    C8Log("[remote-service-thread] %s listening on %s", "capnp server thread.", serverAddress.c_str());
    SingleClientServer server(kj::heap<RemoteServiceImpl>(cb));
    auto address = ioProvider.getNetwork().parseAddress(serverAddress).wait(waitScope);

    // TODO(nb): address->listen hangs if the serverPort is already in use. Figure out how to detect this
    // and fail.
    C8Log("[remote-service-thread] %s", "capnp get listener.");
    auto listener = address->listen();

    C8Log("[remote-service-thread] %s", "capnp start listen.");

    // listenPromise appears unused, but it's important that it's declared and it must remain in
    // scope for the duration of this thread.
    auto listenPromise = server.listen(*listener);

    C8Log("[remote-service-thread] %s", "capnp server initialized.");
    initPromise.set_value(true); // server is listening on the network

    // Wait for some message from the main thread
    C8Log("[remote-service-thread] %s", "capnp server waiting for shutdown.");
    char receiveBuffer[10];
    stream.tryRead(receiveBuffer, 0, 1).then([](size_t n) {
      C8Log("[remote-service-thread] %s", "capnp got shutdown.");
      // Got message to shutdown
    }).wait(waitScope);
    C8Log("[remote-service-thread] %s", "capnp thread ready for join.");
  });

  // Wait until our server is ready
  C8Log("[remote-service-thread] %s", "capnp waiting for server to init.");
  initFuture.wait();

  std::promise<bool> mDnsRegisteredPromise;
  std::future<bool> mDnsRegisteredFuture = mDnsRegisteredPromise.get_future();
  // Our mDNS thread handle registering/deregistering the service on the network
  evutil_socket_t sockets[2];
  if (LevEventListener::createSocketPair(sockets) < 0) {
    C8_THROW("Unable to create socket pair");
  }

  // Set up reading from one socket
  int listenSocketId = sockets[0];
  evutil_make_socket_nonblocking(listenSocketId);
  writeFd_ = sockets[1];

  C8Log("[remote-service-thread] %s", "starting thread for mdns server.");
  thrd_ = std::thread([&mDnsRegisteredPromise, listenSocketId, serverPort] {
  C8Log("[remote-service-thread] %s", "mdns server thread.");
  LevEventListener levEventListener; // NOTE(dat): This owns the event loop for this thread
  C8Log("[remote-service-thread] %s", "Making a DNS register request");
  auto dns = DnsServiceDiscovery::newRegisterRequest(
    regtype, serverPort, levEventListener, [&mDnsRegisteredPromise]() mutable {
      // At this point the server is initialized and running.
      C8Log("[remote-service-thread] %s", "mdns register server running.");
      mDnsRegisteredPromise.set_value(true);
    });

  levEventListener.addFdEvent(
    listenSocketId,
    EventFlag::READ | EventFlag::EDGE_TRIGGER | EventFlag::PERSIST,
    [&levEventListener]() {
      C8Log("[remote-service-thread] %s", "mdns register server stopping.");
      levEventListener.stop();
    });

    C8Log("[remote-service-thread] %s", "mdns server waiting for shutdown.");
    levEventListener.wait();
    C8Log("[remote-service-thread] %s", "mdns server thread ready for join.");
  });
  // Waiting on mDNS registration
  C8Log("[remote-service-thread] %s", "waiting for mdns register server.");
  mDnsRegisteredFuture.wait();
  C8Log("[remote-service-thread] %s", "done waiting for mdns register server.");
}

RemoteServiceThread::~RemoteServiceThread() {
  C8Log("[remote-service-thread] %s",
    "Destroying child threads. Sending terminate char. Will crash if socket doesn't work");

  // NOTE(dat): pipeThread_ owns the thread and will spin it down once it goes out of scope
  // Write an arbitrary charcter to pass data to the server thread to signal done.
  char terminateChar = 'T';
#ifdef _WIN32
  int n = send(writeFd_, &terminateChar, 1, 0);
  if (n == SOCKET_ERROR) {
    C8Log("[remote-service-thread] %s", "Error writing to socket = %d", WSAGetLastError());
  }
#else
  write(writeFd_, &terminateChar, 1);
#endif

  C8Log("[remote-service-thread] %s", "Writing to pipethread");
  pipeThread_.pipe->write(&terminateChar, 1).wait(waitScope_);
  C8Log("[remote-service-thread] %s", "Spinning thread");
  spin();
  C8Log("[remote-service-thread] %s", "Thread done joining. Shutdown completes.");
}

void RemoteServiceThread::spin() {
  // Wait for the thread to wind down.
  if (thrd_.joinable()) {
    thrd_.join();
  }
}

}  // namespace c8

#if defined(WIN32) || defined(_WIN32)
#pragma pop_macro("ERROR")
#pragma pop_macro("VOID")
#pragma pop_macro("INTERFACE")
#pragma pop_macro("min")
#pragma pop_macro("max")
#endif
