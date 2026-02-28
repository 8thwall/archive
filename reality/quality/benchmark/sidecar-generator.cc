// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Akul Gupta (akulgupta@nainticlabs.com)

// This script calculates the fps of any sequences in ~/datasets not already in `sequences.json`,
// and writes the newly calculated fps values into `sequences.json`.

// Run with bazel run //reality/quality/benchmark:sidecar-generator

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//apps/client/internalqa/omniscope/imgui:load-datasets",
    "//c8:c8-log",
    "//c8:json-conversions",
    "//c8/geometry:device-pose",
    "//c8/geometry:intrinsics",
    "//c8/io:file-io",
    "//c8/pixels:pixel-transforms",
    "//c8/protolog:xr-requests",
    "//reality/engine/features:gl-reality-frame",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "//reality/quality/visualization/xrom/framework:reality-stream-interface",
    "@json//:json",
  };
  data = {
    "//reality/quality/benchmark:sequences",
  };
}
cc_end(0xe4194081);

#include <chrono>
#include <fstream>
#include <nlohmann/json.hpp>
#include <thread>

#include "apps/client/internalqa/omniscope/imgui/load-datasets.h"
#include "c8/c8-log.h"
#include "c8/geometry/device-pose.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/file-io.h"
#include "c8/json-conversions.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/protolog/xr-requests.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"

using namespace c8;

namespace {
constexpr double NANOS_TO_SECONDS = 1e-9;
constexpr double NANOS_TO_MILLIS = 1e-6;

double computeMeanDt(const Vector<double> &timestamps) {
  auto sum = 0.0;
  for (int i = 1; i < timestamps.size(); i++) {
    sum += timestamps[i] - timestamps[i - 1];
  }
  return sum / (timestamps.size() - 1);
}

}  // namespace

class SidecarGeneratorCallback : public RealityStreamCallback {
public:
  SidecarGeneratorCallback(const String &realitySrcName) {}

  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader request,
    RealityResponse::Reader response) override {
    ///////////////////// FRAME RATE \\\\\\\\\\\\\\\\\\\\\\/
    auto timeStampSecs =
      request.getSensors().getCamera().getCurrentFrame().getTimestampNanos() * NANOS_TO_SECONDS;
    timeStampSecs_.push_back(timeStampSecs);
  }

  void score() { meanFps_ = 1.0 / computeMeanDt(timeStampSecs_); }

  double meanFps() const { return meanFps_; }

private:
  GlRealityFrame gl;
  std::unique_ptr<Gr8FeatureShader> glShader;
  GlTexture srcTex_;

  Vector<double> timeStampSecs_;
  double meanFps_ = -1.f;
};

int main(int argc, char *argv[]) {
  const String benchmarkJsonFilePath = "reality/quality/benchmark/sequences.json";

  auto sequencesJson = readJsonFile(benchmarkJsonFilePath);
  nlohmann::json fpsJson;

  const auto rootNode = crawlPath(defaultPath());
  // Iterate through all sequences in the benchmark folder.
  for (const auto &realitySrc : filePaths(&rootNode)) {
    auto realitySrcName = realitySrc.substr(realitySrc.rfind("/") + 1, realitySrc.size());
    // If the fileName does not exist or does not have the `fps` key in sequences.json, calculate
    // the fps for this sequence.

    auto hasFps = sequencesJson[realitySrcName].contains("fps");
    if (!sequencesJson.contains(realitySrcName) || !hasFps) {
      auto rStream = RealityStreamFactory::create(realitySrc);
      SidecarGeneratorCallback benchmark(realitySrcName);
      C8Log("[sidecar-generator] Processing frames for %s.", realitySrcName.c_str());
      rStream->setCallback(&benchmark);
      rStream->spin();
      benchmark.score();
      // Round to 3 decimal places.
      fpsJson[realitySrcName]["fps"] = std::round(benchmark.meanFps() * 1000.0) / 1000.0;
    }
  }

  if (fpsJson.empty()) {
    C8Log("[sidecar-generator] No new sequences to process in '~/datasets' folder.");
    return 0;
  }

  // Append the new json files to the original input json files.
  if (!fpsJson.empty()) {
    sequencesJson.update(fpsJson, true);
    std::ofstream file(benchmarkJsonFilePath);
    file << sequencesJson.dump(2);  // Pretty print the json.
    file.close();
  }
  return 0;
}
