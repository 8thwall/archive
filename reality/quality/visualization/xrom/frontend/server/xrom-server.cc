// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "reality/quality/visualization/xrom/frontend/server/xrom-server.h"
#include "reality/quality/visualization/xrom/frontend/server/xrom-server-decl.h"

#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"

namespace c8 {

XromServer *XromServer::createInstance() {
  if (singleton_ != nullptr) {
    destroyInstance();
  }

  singleton_ = new XromServer();
  return singleton_;
}

// Returns a reference to a previously created instance of XromServer. Results in an error if
// called before an instance is created.
XromServer *XromServer::getInstance() { return singleton_; }

// Destroys the instance of XromServer, if it exists.
void XromServer::destroyInstance() {
  C8Log("[xrom-server] %s", "Destroying instance");
  if (singleton_ != nullptr) {
    delete singleton_;
    singleton_ = nullptr;
  } else {
    C8Log("[xrom-server] %s", "Already destroyed. Nothing to do");
  }
}

// Constructor.
XromServer::XromServer()
    : ioContext_(kj::setupAsyncIo()) {
  C8Log("[xrom-server] %s", "Constructing Xrom Service Thread");
  serverThread_ = new XromServiceThread(this, *ioContext_.provider, ioContext_.waitScope);
}

XromServer::~XromServer() {
  C8Log("[xrom-server] %s", "Destructor called");
  if (serverThread_ != nullptr) {
    delete serverThread_;
    serverThread_ = nullptr;
  }
}

// Main method to execute a request.
void XromServer::processUpdate(UpdateXromRequest::Reader request) {
  std::lock_guard<std::mutex> lock(updatesLock_);
  C8Log("[xrom-server] %s", "Processing a new record");

  if (request.getFlush() != UpdateXromRequest::Flush::FLUSH_AFTER_UPDATES) {
    updatesAwaitingFlush_.emplace_back(request);
    return;
  }

  for (auto &pendingUpdate : updatesAwaitingFlush_) {
    flushedUpdates_.emplace_back(std::move(pendingUpdate));
  }
  updatesAwaitingFlush_.clear();

  flushedUpdates_.emplace_back(request);
}

ConstRootMessage<UpdateXromRequest> *XromServer::getUpdates() {
  std::lock_guard<std::mutex> lock(updatesLock_);
  int totalUpdates = 0;
  for (const auto &update : flushedUpdates_) {
    totalUpdates += update.reader().getUpdates().size();
  }

  if (totalUpdates == 0) {
    return &FALLBACK_XROM_DATA;
  }

  MutableRootMessage<UpdateXromRequest> m;
  auto b = m.builder();
  b.initUpdates(totalUpdates);

  int currIndex = 0;
  for (const auto &update : flushedUpdates_) {
    for (const auto &node : update.reader().getUpdates()) {
      b.getUpdates().setWithCaveats(currIndex, node);
      ++currIndex;
    }
  }
  b.setFlush(UpdateXromRequest::Flush::FLUSH_AFTER_UPDATES);

  externalUpdates_ = ConstRootMessage<UpdateXromRequest>(m);
  flushedUpdates_.clear();

  return &externalUpdates_;
}

ConstRootMessage<UpdateXromRequest> XromServer::FALLBACK_XROM_DATA;

// Singleton streaming engine instance used across Unity threads.
XromServer *XromServer::singleton_ = nullptr;

}  // namespace c8

using namespace c8;

DLLEXPORT void c8XromServer_create() { XromServer::createInstance(); }

// Destroy a reality engine.
DLLEXPORT void c8XromServer_destroy() { XromServer::destroyInstance(); }

// Get the most recent reality.
DLLEXPORT int c8XromServer_getUpdates(struct c8_NativeByteArray *updates) {
  auto *xr = XromServer::getInstance();
  if (xr == nullptr) {
    C8Log("[xrom-server] %s", "xrom-server getUpdates after destroy");
    return -1;
  }

  auto *u = xr->getUpdates();
  *updates = c8_NativeByteArray{static_cast<const void *>(u->bytes().begin()),
                                static_cast<int>(u->bytes().size())};
  return 0;
}

#ifdef WIN32

BOOL APIENTRY DllMain(HANDLE hModule, DWORD ul_reason_for_call, LPVOID lpReserved) { return TRUE; }
#endif
