// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    ":implot-demo",
    "//c8/gui:imgui-app",
    "@imgui//:imgui",
    "@implot//:implot",
  };
}
cc_end(0xbca57956);

#include <imgui.h>

#include "c8/gui/imgui-app.h"
#include "implot.h"

using namespace c8;

// Shut down all threads and release resources when the user closes the window.
void applicationWillTerminate() {}

// Render thread callback to layout an imgui UI, maintain state, and process user input. It should
// be used as a callback from c8::startImGuiWindow.
void layoutUiInRenderThread() { ImPlot::ShowDemoWindow(); }

int main(int argc, char *argv[]) {
  c8::startImGuiWindow("Hello ImPlot", &layoutUiInRenderThread, &applicationWillTerminate);
  return 0;
}
