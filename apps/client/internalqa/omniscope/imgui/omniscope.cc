// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    ":omniscope-layout-thread",
    ":ui-config",
    "//c8:string",
    "//c8:parameter-data",
    "//c8:vector",
    "//c8/gui:imgui-app",
    "@cxxopts//:cxxopts",
  };
  data = {
    "//apps/client/internalqa/omniscope/opencv/img:img",
    "//reality/quality/benchmark:sequences",
  };
}
cc_end(0x9326539b);

#include <imgui.h>

#include <chrono>
#include <cxxopts.hpp>

#include "apps/client/internalqa/omniscope/imgui/omniscope-layout-thread.h"
#include "apps/client/internalqa/omniscope/imgui/ui-config.h"
#include "c8/gui/imgui-app.h"
#include "c8/parameter-data.h"
#include "c8/string.h"
#include "c8/vector.h"

using namespace c8;

int main(int argc, char *argv[]) {
  int gotoFrame = -1;
  int frameSkip = -1;
  int viewIdx = -1;
  int viewGroupIdx = -1;
  String realitySrc;
  String prebuiltMapSrc;
  String builtMapOut;
  String globalParameters;
  bool existingResponse;

  cxxopts::Options options(argv[0]);
  options.add_options()(
    "r,realitySrc",
    "Source for reality, 'remote' for remote; 'stdin' for stdin, otherwise filename.",
    cxxopts::value<String>()->default_value(""))(
    "v,view", "index of view", cxxopts::value(viewIdx))(
    "m,mode", "index of view group", cxxopts::value(viewGroupIdx))(
    "g,goto", "start at frame", cxxopts::value(gotoFrame))(
    "p,globalParameters",
    "JSON string to update PARAMETER_DATA with",
    cxxopts::value(globalParameters))(
    "s,skipFrames", "only process every nth frame", cxxopts::value(frameSkip))(
    "mapSrc",
    "Prebuilt map to load at start of sequence in some views",
    cxxopts::value<String>()->default_value(""))(
    "mapOut",
    "Built map to save at end of sequence in some views",
    cxxopts::value<String>()->default_value(""))(
    "e,existingResponse",
    "use existing response in log file",
    cxxopts::value<bool>()->default_value("false")->implicit_value("true"));
  auto result = options.parse(argc, argv);
  realitySrc = result["realitySrc"].as<String>();
  prebuiltMapSrc = result["mapSrc"].as<String>();
  builtMapOut = result["mapOut"].as<String>();
  existingResponse = result["existingResponse"].as<bool>();
  // Set global parameters.
  if (!globalParameters.empty()) {
    globalParams().mergeJsonString(globalParameters);
  }

  {  // Update or initialized saved config based on command line overrides.
    UiConfig uiConfig;
    auto newConfig = uiConfig.get();
    if (gotoFrame >= 0) {
      newConfig.gotoFrame = gotoFrame;
    }
    if (frameSkip >= 0) {
      newConfig.frameSkip = frameSkip;
    }
    if (viewIdx >= 0) {
      newConfig.viewIdx = viewIdx;
    }
    if (viewGroupIdx >= 0) {
      newConfig.viewGroupIdx = viewGroupIdx;
    }
    if (!realitySrc.empty()) {
      newConfig.setSource(realitySrc);
    }
    if (!prebuiltMapSrc.empty()) {
      newConfig.prebuiltMapSrc = prebuiltMapSrc;
    }
    if (!builtMapOut.empty()) {
      newConfig.builtMapOut = builtMapOut;
    }
    newConfig.existingResponse = existingResponse;

    uiConfig.set(newConfig);
  }

  c8::startImGuiWindow("Omniscope", &layoutUiInRenderThread, &applicationWillTerminate);

  return 0;
}
