// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:color-maps",
    "//c8/io:video-writer",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/protolog:xr-requests",
    "//c8/pixels:gpu-pixels-resizer",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "//reality/quality/visualization/xrom/framework:reality-stream-interface",
  };
}
cc_end(0xda63bae4);

#include <cstdlib>
#include <deque>

#include "c8/c8-log.h"
#include "c8/color-maps.h"
#include "c8/io/video-writer.h"
#include "c8/pixels/gpu-pixels-resizer.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/protolog/xr-requests.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "c8/string/join.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"

using namespace c8;

const char *APP_NAME = "video-from-datarecorder";

class StreamProcessor : public RealityStreamCallback {
public:
  StreamProcessor(const char *inFileName) {
    outFileName_ = format("%s-preview.mp4", inFileName);
    depthFileName_ = format("%s-depth.mp4", inFileName);
  }

  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader request,
    RealityResponse::Reader response) override {
    ScopeTimer t("process");

    if (!started_) {
      auto deviceInfo = request.getDeviceInfo();
      C8Log(
        "[video-from-datarecorder] Manufacturer %s, Model %s, Os %s %s",
        deviceInfo.getManufacturer().cStr(),
        deviceInfo.getModel().cStr(),
        deviceInfo.getOs().cStr(),
        deviceInfo.getOsVersion().cStr());
      started_ = true;
    }

    double frameTime = request.getSensors().getCamera().getCurrentFrame().getTimestampNanos() / 1e9;
    auto framePix = getFramePixels(request);

    auto status = videos_.encode(outFileName_, framePix, frameTime);
    if (status.code()) {
      C8Log(
        "[video-from-data-recorder] Error writing video '%s': '%s'",
        outFileName_.c_str(),
        status.message());
      std::exit(1);
    }

    // Get the depth map if it exists.  Note that a sequence can have depth information missing in
    // the first few frames, which is why we have the hasDepthMap() check.
    auto depthPix = getFrameDepth(request);
    if (depthPix.rows() > 0) {
      // If we didn't have depth images for a while, and we suddenly get one, fill in everything
      // up to this point with empty data.
      if (!skippedDepthTimes_.empty()) {
        RGBA8888PlanePixelBuffer zeros(depthPix.rows(), depthPix.cols());
        auto zim = zeros.pixels();
        fill(0, 0, 0, 0, &zim);
        while (!skippedDepthTimes_.empty()) {
          videos_.encode(depthFileName_, zeros.pixels(), skippedDepthTimes_.front());
          skippedDepthTimes_.pop_front();
        }
      }
      videos_.encode(depthFileName_, depthPix, frameTime);
    } else {
      skippedDepthTimes_.push_back(frameTime);
    }
  }

  void finish() {
    auto written = videos_.finish();
    C8Log("----------------\nExecution summary:");
    ScopeTimer::logBriefSummary();
    C8Log("----------------\nWrote files:");
    C8Log(strJoin(written.begin(), written.end(), "\n").c_str());
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

  RGBA8888PlanePixels getFrameDepth(RealityRequest::Reader r) {
    // Original depth buffer in grayscale.
    DepthFloatPixelBuffer depthPixBuffer = depthMapPixelBuffer(r.getSensors());

    DepthFloatPixels depthPix = depthPixBuffer.pixels();

    if (!depthPix.rows()) {
      return {};
    }

    auto depthRGBA = RGBA8888PlanePixelBuffer(depthPix.rows(), depthPix.cols());
    auto depthRGBAPix = depthRGBA.pixels();

    // Apply the viridis colormap onto the black and white grayscale depth image.
    floatToRgba(depthPix, &depthRGBAPix, VIRIDIS_RGB_256, 0, 3);

    if (
      depthImageResized_.pixels().rows() != frameImage_.pixels().rows()
      && depthImageResized_.pixels().cols() != frameImage_.pixels().cols()) {
      depthImageResized_ =
        RGBA8888PlanePixelBuffer(frameImage_.pixels().rows(), frameImage_.pixels().cols());
    }

    // Make the depth map video the same dimensions as the camera feed.
    auto depthImageResized_ =
      resizer_.resizeOnGpu(depthRGBAPix, frameImage_.pixels().rows(), frameImage_.pixels().cols());

    // Return the resized, colormapped depth video.
    return depthImageResized_.pixels();
  }

  RGBA8888PlanePixelBuffer frameImage_;
  RGBA8888PlanePixelBuffer depthImageResized_;
  VideoCollection videos_;
  String outFileName_;
  // Only creates a depth video if depth data exists.
  String depthFileName_;
  GpuPixelsResizer resizer_;
  // Has the stream been run yet?
  bool started_ = false;
  std::deque<double> skippedDepthTimes_;
};

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "ERROR: Missing input path(s).\n"
      "\n"
      "%s usage:\n"
      "    bazel run //reality/quality/codelab/pixels:%s -- /path/to/datarecorder/log.123456-600\n",
      APP_NAME,
      APP_NAME);
    return -1;
  }

  // Only allow disk input for reality stream. Since we are writing videos, we need a finite length
  // input that can be cleanly detected to be done. Allowing remote input here would make that more
  // complicated.
  auto rStream = RealityStreamFactory::create(argv[1]);

  StreamProcessor processor(argv[1]);
  rStream->setCallback(&processor);
  rStream->spin();
  processor.finish();
  return 0;
}
