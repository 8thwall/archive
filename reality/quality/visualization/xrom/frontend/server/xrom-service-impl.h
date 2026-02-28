#pragma once

#include <capnp/message.h>
#include <mutex>
#include "reality/quality/visualization/xrom/api/xrom-service.capnp.h"
#include "reality/quality/visualization/xrom/frontend/server/xrom-callback.h"

namespace c8 {

class XromServiceImpl final : public XromService::Server {
public:
  XromServiceImpl(XromCallback *cb_);
  ~XromServiceImpl();

  kj::Promise<void> setXrom(SetXromContext context) override;
  kj::Promise<void> updateXrom(UpdateXromContext context) override;

  // NOTE(nbutko): Strangely required for windows builds. Dat might find out why someday?
  // NOTE(datchu): This is now failing for MacOs. To be removed completely in the future.
  // ::kj::Promise<void> dispatchCall(uint64_t interfaceId, uint16_t methodId,
  //       ::capnp::CallContext< ::capnp::AnyPointer, ::capnp::AnyPointer> context)
  //       override { return XromService::Server::dispatchCall(interfaceId, methodId, context); }

private:
  XromServiceImpl(XromServiceImpl &) = delete;
  XromServiceImpl &operator=(const XromServiceImpl &) = delete;

  XromCallback *cb_;
};

}  // namespace c8
