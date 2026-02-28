#pragma once

#include <capnp/message.h>
#include <mutex>
#include "c8/protolog/api/remote-service-interface.capnp.h"
#include "reality/app/xr/streaming/streaming-record-callback.h"

namespace c8 {

class RemoteServiceImpl final : public RemoteService::Server {
public:
  RemoteServiceImpl(StreamingRecordCallback *cb_);
  ~RemoteServiceImpl();

  kj::Promise<void> log(LogContext context) override;
  kj::Promise<void> shutdown(ShutdownContext context) override;

  // NOTE(nbutko): Strangely required for windows builds. Dat might find out why someday?
  // NOTE(datchu): This is now failing for MacOs. To be removed completely in the future.
  // ::kj::Promise<void> dispatchCall(uint64_t interfaceId, uint16_t methodId,
  //       ::capnp::CallContext< ::capnp::AnyPointer, ::capnp::AnyPointer> context)
  //       override { return RemoteService::Server::dispatchCall(interfaceId, methodId, context); }

private:
  RemoteServiceImpl(RemoteServiceImpl &) = delete;
  RemoteServiceImpl &operator=(const RemoteServiceImpl &) = delete;

  StreamingRecordCallback *cb;
  std::mutex fileWriteGuard;
};

}  // namespace c8
