// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// Internal-use header for streaming RealityEngine.

#pragma once

#include <memory>
#include <mutex>
#include "c8/io/capnp-messages.h"
#include "c8/vector.h"
#include "reality/quality/visualization/xrom/api/xrom.capnp.h"
#include "reality/quality/visualization/xrom/frontend/server/xrom-service-thread.h"
#include "reality/quality/visualization/xrom/frontend/server/xrom-callback.h"

namespace c8 {

class XromServer : public XromCallback {
public:
  static ConstRootMessage<UpdateXromRequest> FALLBACK_XROM_DATA;
  // Creates and returns a singleton instance of XromServer. Subsequent calls to
  // this will result in an error if the instance is not destroyed through destroyInstance first.
  // Use getInstance to receive a reference of a previously created instance.
  static XromServer *createInstance();

  // Returns a reference to a previously created instance of XromServer. Results in an error if
  // called before an instance is created.
  static XromServer *getInstance();

  // Destroys the instance of XromServer, if it exists.
  static void destroyInstance();

  // Constructor.
  XromServer();
  virtual ~XromServer();

  // Default move constructors.
  XromServer(XromServer &&) = default;
  XromServer &operator=(XromServer &&) = default;

  // Disallow copying.
  XromServer(const XromServer &) = delete;
  XromServer &operator=(const XromServer &) = delete;

  // Main method to execute a request.
  void processUpdate(UpdateXromRequest::Reader request) override;

  ConstRootMessage<UpdateXromRequest> *getUpdates();

private:
  static XromServer *singleton_;
  kj::AsyncIoContext ioContext_;

  Vector<ConstRootMessage<UpdateXromRequest>> updatesAwaitingFlush_;
  Vector<ConstRootMessage<UpdateXromRequest>> flushedUpdates_;

  ConstRootMessage<UpdateXromRequest> externalUpdates_;
  XromServiceThread *serverThread_;

  std::mutex updatesLock_;
};  // XromServer

} // namespace c8
