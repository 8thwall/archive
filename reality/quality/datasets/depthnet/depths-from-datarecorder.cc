// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Lynn Dang (lynn@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/io:image-io",
    "//c8/io:file-io",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/protolog:xr-requests",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "//reality/quality/visualization/xrom/framework:reality-stream-interface",
    "@cli11//:cli11",
  };
}
cc_end(0x65c6a4bf);

#include <CLI/CLI.hpp>
#include "c8/c8-log.h"
#include "c8/io/file-io.h"
#include "c8/io/image-io.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/protolog/xr-requests.h"
#include "c8/string/format.h"
#include "c8/string/join.h"
#include "c8/stats/scope-timer.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"

using namespace c8;

const char *APP_NAME = "depths-from-datarecorder";

class DataLogger : public RealityStreamCallback {
public:
  DataLogger(const char *sequencePath, const int frame_skip)
      : outPicName_(sequencePath), numProcessedFrames_(0), frame_skip_(frame_skip) {}
  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader request,
    RealityResponse::Reader response) override {
    ScopeTimer t("process");
    auto framePix = getFramePixels(request);

    // Getting the depth map information.
    DepthFloatPixelBuffer depthPixBuffer = depthMapPixelBuffer(request.getSensors());
    DepthFloatPixels depthPix = depthPixBuffer.pixels();

    // Don't write anything if no depth values were read.
    if (depthPix.cols() == 0) {
      return;
    } else if (
      (numProcessedFrames_ && numProcessedFrames_ % frame_skip_ == 0)  // Process every num frames.
      // Process the 5th frame instead of the first one to avoid the overexposure effect that
      // sometimes happens in the beginning of sequences
      || (numProcessedFrames_ == 5)) {
      // Writing image.
      String outPicName = format("%s-%d-preview.jpg", outPicName_.c_str(), numProcessedFrames_);
      writeImage(framePix, outPicName);

      // Depth map stored in bin files which will be read by np.fromfile() during training.
      String depthPicName = format("%s-%d-preview.bin", outPicName_.c_str(), numProcessedFrames_);
      writeFloatFile(depthPicName, depthPix.pixels(), depthPix.rows() * depthPix.cols());
    }
    numProcessedFrames_++;
  }

  void finish() {
    C8Log("----------------\nExecution summary:");
    ScopeTimer::logBriefSummary();
    if (numProcessedFrames_ == 0) {
      C8Log("No depth found.");
    }
  }

private:
  RGBA8888PlanePixels getFramePixels(RealityRequest::Reader r) {
    auto frame = r.getSensors().getCamera().getCurrentFrame();
    auto y = constFrameYPixels(frame);
    auto uv = constFrameUVPixels(frame);
    if (frameImage_.pixels().rows() != y.rows() && frameImage_.pixels().cols() != y.cols()) {
      frameImage_ = RGBA8888PlanePixelBuffer(y.rows(), y.cols());
    }
    auto cpix = frameImage_.pixels();
    yuvToRgb(y, uv, &cpix);
    return cpix;
  }

  RGBA8888PlanePixelBuffer frameImage_;
  String outPicName_;
  int numProcessedFrames_;
  int frame_skip_;
};

int main(int argc, char *argv[]) {
  CLI::App app{"diverse-images"};
  String logFile;
  int numFrames = 30;

  // This tool expects an input argument with the path to the log file and a number of frames it
  // should skip within that scene
  app.add_option(
    "--f, --file",
    logFile,
    "Log file that contains datarecorder sequence")
    ->required()
    ->check(CLI::ExistingFile);
  app.add_option(
    "--n, --numFrames",
    numFrames,
    "Height of the image. Dimensions should at least be the same image ratio as the images.");
  CLI11_PARSE(app, argc, argv);

  // Only allow disk input for reality stream. Since we are writing images, we need a finite length
  // input that can be cleanly detected to be done. Allowing remote input here would make that more
  // complicated.
  auto rStream = RealityStreamFactory::create(logFile.c_str());

  DataLogger processor(logFile.c_str(), numFrames);
  rStream->setCallback(&processor);
  rStream->spin();
  processor.finish();
  return 0;
}
