// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <memory>
#include <thread>
#include "apps/client/internalqa/omniscope/imgui/omniscope-thread-channel.h"
#include "apps/client/internalqa/omniscope/imgui/ui-config.h"

namespace c8 {

// Start a new background thread that processes the realitySrc specified in uiConfig and produces
// display textures in the sharedContext. While this thread is running, it can be controlled by
// passing in events in the channel, and its current output is passed out through the channel.
// After the thread has stopped processing the stream, it will remain running so that the final
// frame can continue to display and be updated with UI events. The thread will only shut down when
// it receives a shutdown event on the channel.
std::unique_ptr<std::thread> processOmniscopeStream(
  void *sharedContext,
  std::shared_ptr<UiConfig> uiConfig,
  std::shared_ptr<OmniscopeThreadChannel> channel);

}  // namespace c8
