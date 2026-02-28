// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

namespace c8 {

// Render thread callback to layout an imgui UI, maintain state, and process user input. It should
// be used as a callback from c8::startImGuiWindow. In addition to driving the UI on every frame,
// this thread is also responsible for starting and stopping the processing thread, and managing all
// bidirectional communication with that thread.
void layoutUiInRenderThread();

// Shut down all threads and release resources when the user closes the window.
void applicationWillTerminate();

}  // namespace c8
