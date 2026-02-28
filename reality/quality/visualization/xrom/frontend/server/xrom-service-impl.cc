#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "xrom-service-impl.h",
  };
  deps = {
    ":xrom-callback",
    "//bzl/inliner:rules",
    "//c8/io:capnp-messages",
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//reality/quality/visualization/xrom/api:xrom-service.capnp-cc",
  };
  visibility = {
    "//visibility:private",
  };
}

#include "reality/quality/visualization/xrom/frontend/server/xrom-service-impl.h"

#include "c8/c8-log.h"
#include "c8/c8-log-proto.h"
#include "c8/io/capnp-messages.h"

using kj::Own;
using kj::Promise;
using kj::PromiseFulfiller;

namespace c8 {

XromServiceImpl::XromServiceImpl(XromCallback *cb) : cb_(cb) {}

XromServiceImpl::~XromServiceImpl() {}

Promise<void> XromServiceImpl::updateXrom(UpdateXromContext context) {
  C8Log("[remote-service-impl] process %d records",
    context.getParams().getRequest().getUpdates().size());

  if (cb_ != nullptr) {
    cb_->processUpdate(context.getParams().getRequest());
  }
  C8Log("[remote-service-impl] %s", "ready now");
  return kj::READY_NOW;
}

Promise<void> XromServiceImpl::setXrom(SetXromContext context) {
  // Don't handle shutdown requests.
  C8Log("[remote-service-impl] %s", "setXrom [NOT IMPLEMENTED!]");
  return kj::READY_NOW;
}

}  // namespace c8
