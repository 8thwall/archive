// Copyright (c) 2016 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// C-wrapper functions for starting the log service server.

#pragma once

#if defined(WIN32) || defined(_WIN32)
#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif

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
#endif

#include <kj/async-io.h>
// #include <event2/event.h>
#include <thread>

#include "reality/quality/visualization/xrom/frontend/server/xrom-callback.h"

namespace c8 {

/** A XromServiceThread spins up a server in its own thread that run the callback (cb) when the server
 * receives a log message. This class will register a mDNS entry on ctor and remove it on dtor
 * (this requires an extra thread). On dtor, the threads are joined and close down.
 */
class XromServiceThread {
public:
  // Listen on the default port
  XromServiceThread(XromCallback *cb, kj::AsyncIoProvider &ioProvider, kj::WaitScope &waitScope);

  XromServiceThread(XromCallback *cb, kj::AsyncIoProvider &ioProvider, kj::WaitScope &waitScope, int serverPort);

  virtual ~XromServiceThread();

  // Disallow copying.
  XromServiceThread(XromServiceThread &&) = delete;
  XromServiceThread(const XromServiceThread &) = delete;
  XromServiceThread &operator=(const XromServiceThread &) = delete;

private:
  kj::AsyncIoProvider::PipeThread pipeThread_;
  kj::WaitScope &waitScope_;
  int writeFd_;
};

}  // namespace c8

#if defined(WIN32) || defined(_WIN32)
#pragma pop_macro("ERROR")
#pragma pop_macro("VOID")
#pragma pop_macro("INTERFACE")
#pragma pop_macro("min")
#pragma pop_macro("max")
#endif
