#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "remote-service-impl.h",
  };
  deps = {
    ":streaming-record-callback",
    "//bzl/inliner:rules",
    "//c8/io:capnp-messages",
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//c8/protolog/api:remote-service.capnp-cc",
  };
  visibility = {
    "//visibility:private",
  };
}

#include "c8/c8-log.h"
#include "c8/c8-log-proto.h"
#include "c8/io/capnp-messages.h"
#include "reality/app/xr/streaming/remote-service-impl.h"

using kj::Own;
using kj::Promise;
using kj::PromiseFulfiller;

namespace c8 {

RemoteServiceImpl::RemoteServiceImpl(StreamingRecordCallback *cb_) : cb(cb_) {}

RemoteServiceImpl::~RemoteServiceImpl() {}

Promise<void> RemoteServiceImpl::log(LogContext context) {
  C8Log("[remote-service-impl] process %d records",
    context.getParams().getRequest().getRecords().size());
  for (auto record : context.getParams().getRequest().getRecords()) {
    std::lock_guard<std::mutex> guard(fileWriteGuard);
    MutableRootMessage<XrRemoteResponse> msg;
    XrRemoteResponse::Builder response = msg.builder();

    cb->processRecord(record, &response);
    context.getResults().getResponse().setRecord(response);
  }
  C8Log("[remote-service-impl] %s", "ready now");
  return kj::READY_NOW;
}

Promise<void> RemoteServiceImpl::shutdown(ShutdownContext context) {
  // Don't handle shutdown requests.
  C8Log("[remote-service-impl] %s", "shutdown");
  return kj::READY_NOW;
}

}  // namespace c8
