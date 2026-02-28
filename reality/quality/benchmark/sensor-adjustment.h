#include "c8/io/capnp-messages.h"
#include "c8/vector.h"
#include "reality/engine/api/reality.capnp.h"

namespace c8 {

// Sets `realityRequest` eventQueue to a concatenation of `eventQueues`.
void setEventsOnFrame(
  const Vector<ConstRootMessage<RequestPose>> &eventQueues, RealityRequest::Builder realityRequest);
}  // namespace c8
