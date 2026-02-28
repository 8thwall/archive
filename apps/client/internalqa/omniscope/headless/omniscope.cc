// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//apps/client/internalqa/omniscope/native/lib:detection-image",
    "//apps/client/internalqa/omniscope/native:omniscope-app",
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//c8:color",
    "//c8:parameter-data",
    "//c8:quaternion",
    "//c8:vector",
    "//c8/camera:device-infos",
    "//c8/geometry:parameterized-geometry",
    "//c8/io:capnp-messages",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "//c8/io:video-writer",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels/pipeline:gl-texture-pipeline",
    "//c8/pixels:draw2",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/protolog:xr-requests",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/engine/api/device:info.capnp-cc",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/quality/benchmark:sensor-adjustment",
    "//reality/quality/imagetargets:image-target-json-loader",
    "//reality/quality/visualization/xrom/framework:disk-reality-stream",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "//reality/quality/visualization/xrom/framework:reality-stream-interface",
    "//reality/quality/visualization/xrom/framework:remote-reality-stream",
    "@cli11//:cli11",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0x4eaafbde);

#include <CLI/CLI.hpp>
#include <iostream>
#include <memory>

#include "apps/client/internalqa/omniscope/native/lib/detection-image.h"
#include "apps/client/internalqa/omniscope/native/omniscope-app.h"
#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/color.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/parameterized-geometry.h"
#include "c8/io/capnp-messages.h"
#include "c8/io/file-io.h"
#include "c8/io/image-io.h"
#include "c8/io/video-writer.h"
#include "c8/parameter-data.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pipeline/gl-texture-pipeline.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/protolog/xr-requests.h"
#include "c8/quaternion.h"
#include "c8/string/format.h"
#include "c8/string/join.h"
#include "c8/vector.h"
#include "reality/engine/api/device/info.capnp.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/imagedetection/detection-image-loader.h"
#include "reality/quality/benchmark/sensor-adjustment.h"
#include "reality/quality/imagetargets/image-target-json-loader.h"
#include "reality/quality/visualization/xrom/framework/disk-reality-stream.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"
#include "reality/quality/visualization/xrom/framework/remote-reality-stream.h"

using namespace c8;

CurvyImageGeometry geometryFromText(const String &text) {
  std::stringstream stream(text);
  String elem;
  Vector<float> data;
  while (std::getline(stream, elem, ',')) {
    data.push_back(std::stof(elem));
  }

  return CurvyImageGeometry::fromWidthHeight(
    data[0], data[1], {data[2], data[3], data[4], data[5]});
}

using TexCopier = std::function<void(GlTexture src, GlFramebufferObject *dest)>;

class OmniscopeCallback : public RealityStreamCallback {
public:
  OmniscopeCallback() {}

  void initializeView(
    int rotation, int captureWidth, int captureHeight, DeviceInfo::Reader deviceInfo) {
    ScopeTimer rt("init");
    AppConfiguration appConfig;
    appConfig.rotation = rotation;
    appConfig.captureWidth = captureWidth;
    appConfig.captureHeight = captureHeight;
    appConfig.deviceInfo = deviceInfo;
    appConfig.realitySrcName = absSequencePath_;
    appConfig.prebuiltMapSrc = prebuiltMapSrc_;
    appConfig.builtMapOut = builtMapOut_;
    appConfig.deviceModel = DeviceInfos::getDeviceModel(deviceInfo);
    appConfig.deviceManufacturer = deviceInfo.getManufacturer();
    appConfig.imageTargets = &detectionImages_;

    app_.current()->configure(appConfig);
    app_.current()->initialize(lastData_.viewData);
    app_.current()->initialize(thisData_.viewData);
    hasLastData_ = false;
    hasThisData_ = false;

    pipeline_.initialize(captureWidth, captureHeight, 1, 9);

    // NOTE(nathan): this doesn't always seems to work, such as for MapTrackingView... I believe
    // the most accurate assessment of the video output is the renderer.result() dimensions.
    auto displayWidth = lastData_.viewData->displayTex().width();
    auto displayHeight = lastData_.viewData->displayTex().height();

    // If the output dimensions are specified via the command line input, use those values.
    if (outputHeight_ > -1) {
      displayHeight = outputHeight_;
      displayWidth = outputWidth_;
    }

    displayFramebuffer_.initialize(
      makeLinearRGBA8888Texture2D(displayWidth, displayHeight),
      GL_FRAMEBUFFER,
      GL_COLOR_ATTACHMENT0);
    displaybuf_ = RGBA8888PlanePixelBuffer(displayHeight, displayWidth);
    appdisplay_ = displaybuf_.pixels();

    needsViewInit_ = false;
  }

  void glProcess(
    uint32_t cameraTexture,
    float qw,
    float qx,
    float qy,
    float qz,
    double videoTimeNanos,
    double frameTimeNanos,
    double timeNanos,
    double latitude,
    double longitude,
    double horizontalAccuracy,
    RequestPose::Reader requestPoseReader,
    RealityRequest::Reader rawRequest,
    RealityResponse::Reader rawResponse) {
    ScopeTimer rt("glProcess");
    std::swap(lastData_, thisData_);

    hasLastData_ |= hasThisData_;
    hasThisData_ = true;

    app_.current()->readGl(lastData_.viewData.get());
    thisData_.frameData.cameraTexture = cameraTexture;
    thisData_.frameData.devicePose = Quaternion{qw, qx, qy, qz};
    thisData_.frameData.videoTimeNanos = static_cast<int64_t>(videoTimeNanos);
    thisData_.frameData.frameTimeNanos = static_cast<int64_t>(frameTimeNanos);
    thisData_.frameData.timeNanos = static_cast<int64_t>(timeNanos);
    thisData_.frameData.latitude = latitude;
    thisData_.frameData.longitude = longitude;
    thisData_.frameData.horizontalAccuracy = horizontalAccuracy;
    thisData_.frameData.eventQueue = requestPoseReader;
    thisData_.frameData.rawDataRecorderFrame.request = {rawRequest};
    thisData_.frameData.rawDataRecorderFrame.response = {rawResponse};
    app_.current()->drawGl(thisData_);
  }

  void cpuProcessAndRenderDisplay(RealityStreamInterface *stream) {
    if (!hasLastData_) {
      return;
    }
    ScopeTimer rt("cpuProcessAndRenderDisplay");
    app_.current()->processCpu(lastData_.viewData.get());

    if (videoName_ != "NONE") {
      app_.current()->renderDisplay(lastData_.viewData.get());
      texCopier_(lastData_.viewData->displayTex(), &displayFramebuffer_);
      readFramebufferRGBA8888Pixels(displayFramebuffer_, appdisplay_);
      video_.encode(videoName_, appdisplay_, lastData_.frameData.timeNanos / 1e9);
    }
  }

  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader originalRequest,
    RealityResponse::Reader response) override {
    MutableRootMessage<RealityRequest> requestMessage(originalRequest);
    if (frameSkip_ > 1) {
      // If we are skipping frames, save sensor events to a queue until we are ready to consume all
      // events on the next processed frame.
      savedEventQueues_.push_back(originalRequest.getSensors().getPose());
      if (rawStreamFrameNum_++ % frameSkip_ != 0) {
        // Skip this frame.
        return;
      } else {
        // Process this frame.
        setEventsOnFrame(savedEventQueues_, requestMessage.builder());
        savedEventQueues_.clear();
      }
    }

    auto request = requestMessage.reader();

    auto frame = request.getSensors().getCamera().getCurrentFrame();
    auto ypix = constFrameYPixels(frame);
    auto uvpix = constFrameUVPixels(frame);

    // Create luminance  source
    ScopeTimer rt("omniscope-process-reality");

    if (!didInit_) {
      didInit_ = true;
      glShader_.reset(new Gr8FeatureShader());
      glShader_->initialize();
      rgbpixbuf_ = RGBA8888PlanePixelBuffer(ypix.rows(), ypix.cols());
      fill(Color::BLACK, rgbpixbuf_.pixels());
      texCopier_ = compileCopyTexture2D();
      loadImageTargets(DeviceInfos::getDeviceModel(request.getDeviceInfo()));
    }

    if (needsViewInit_) {
      initializeView(0 /* rotation */, ypix.cols(), ypix.rows(), request.getDeviceInfo());
    }

    auto p = rgbpixbuf_.pixels();
    yuvToRgb(ypix, uvpix, &p);

    auto tex =
      wrapRGBA8888Texture(pipeline_.getReady(ypix.cols(), ypix.rows()), ypix.cols(), ypix.rows());

    tex.bind();
    tex.setPixels(p.pixels());
    tex.unbind();

    auto dp = request.getSensors().getPose().getDevicePose();
    auto eq = request.getSensors().getPose();
    auto videoTimeNanos =
      request.getSensors().getCamera().getCurrentFrame().getVideoTimestampNanos();
    auto frameTimeNanos =
      request.getSensors().getCamera().getCurrentFrame().getFrameTimestampNanos();
    auto timeNanos = request.getSensors().getCamera().getCurrentFrame().getTimestampNanos();
    auto latitude = request.getSensors().getGps().getLatitude();
    auto longitude = request.getSensors().getGps().getLongitude();
    auto horizontalAccuracy = request.getSensors().getGps().getHorizontalAccuracy();
    glProcess(
      tex.id(),
      dp.getW(),
      dp.getX(),
      dp.getY(),
      dp.getZ(),
      videoTimeNanos,
      frameTimeNanos,
      timeNanos,
      latitude,
      longitude,
      horizontalAccuracy,
      eq,
      request,
      response);
    cpuProcessAndRenderDisplay(stream);
  }

  void processFinalFrame() {
    Vector<String> outFiles;
    {
      ScopeTimer rt("process-final-frame");
      std::swap(lastData_, thisData_);
      hasLastData_ |= hasThisData_;
      hasThisData_ = true;
      app_.current()->readGl(lastData_.viewData.get());
      cpuProcessAndRenderDisplay(nullptr);
      outFiles = video_.finish();
    }
    app_.current()->onEndOfSequence();

    C8Log("[omniscope] %s", "Done.");
    C8Log("[omniscope] %s", "");
    C8Log("[omniscope] %s", "");
    C8Log("[omniscope] %s", "===================================");
    C8Log("[omniscope] %s", "");
    C8Log("[omniscope] %s", "");
    C8Log("[omniscope] %s", "");
    ScopeTimer::logDetailedSummary();

    C8Log("----------------\nWrote files:");
    C8Log(strJoin(outFiles.begin(), outFiles.end(), "\n").c_str());
  }

  Vector<String> viewNames() const { return app_.viewNames(); }
  void setView(int v) { app_.setView(v); }
  void setViewGroup(const String &viewGroupName) { app_.setViewGroup(viewGroupName); }
  void setFrameSkip(int frameSkip) { frameSkip_ = frameSkip; }
  void setVideoName(String path) { videoName_ = path; }

  void loadImageTargets(const String &imageTargetPathSpec) {
    imageTargetPathSpec_ = imageTargetPathSpec;
  }

  void setImageTargetType(DetectionImageType imageTargetType) {
    imageTargetType_ = imageTargetType;
  }

  void setCurvySpec(const CurvySpec &spec) { curvySpec_ = spec; }

  void setOutputDimensions(int width, int height) {
    outputWidth_ = width;
    outputHeight_ = height;
  }

  // Create a unique temporary path given the cli arguments so that we can run omniscope headless in
  // parallel.
  void setTmpPath(const String &realitySrc) {
    const auto sequenceNameIndex = realitySrc.find_last_of("/\\");
    sequenceName_ = realitySrc.substr(sequenceNameIndex + 1);

    // This does not use RandomNumbers because RandomNumbers
    std::random_device osSeed;
    RandomNumbers randNum(osSeed());

    videoName_ =
      format("/tmp/%s_%d.mp4", sequenceName_.c_str(), randNum.nextUniformInt(0, RAND_MAX));
    C8Log("Writing to temporary path: %s", videoName_.c_str());
  }

  void setPrebuiltMap(const String &prebuiltMapSrc) { prebuiltMapSrc_ = prebuiltMapSrc; }
  void setAbsSequencePath(const String &absSequencePath) { absSequencePath_ = absSequencePath; }
  void setBuiltMapOut(const String &builtMapOut) { builtMapOut_ = builtMapOut; }

private:
  bool didInit_ = false;
  bool needsViewInit_ = true;
  GlTexturePipeline pipeline_;

  // The requested output width/height.  If not specified via the command line, the output video's
  // dimensions will default to the Omniscope view's display width/height.
  int outputWidth_ = -1;
  int outputHeight_ = -1;

  OmniscopeApp app_;
  FrameInput lastData_;
  FrameInput thisData_;
  bool hasLastData_ = false;
  bool hasThisData_ = false;

  std::unique_ptr<Gr8FeatureShader> glShader_;
  OmniDetectionImageMap detectionImages_;
  RGBA8888PlanePixelBuffer rgbpixbuf_;

  GlFramebufferObject displayFramebuffer_;
  TexCopier texCopier_;
  RGBA8888PlanePixelBuffer displaybuf_;

  RGBA8888PlanePixels appdisplay_;

  String imageTargetPathSpec_;
  CurvySpec curvySpec_;
  DetectionImageType imageTargetType_;

  String sequenceName_;
  String absSequencePath_;
  String videoName_ = "/tmp/omniscope.mp4";
  VideoCollection video_;

  String prebuiltMapSrc_;
  String builtMapOut_;

  int rawStreamFrameNum_ = 0;
  int frameSkip_ = 1;
  // If we are skipping frames, queue up sensor events and set them on the next processed frame.
  Vector<ConstRootMessage<RequestPose>> savedEventQueues_;

  void loadImageTargets(DeviceInfos::DeviceModel model) {
    if (imageTargetPathSpec_.empty()) {
      return;
    }
    // TODO(nb): parse imageTargetPathSpec as a json array of metadata.
    detectionImages_.clear();
    {
      RGBA8888PlanePixelBuffer imbuffer = readImageToRGBA(imageTargetPathSpec_);

      auto im = imbuffer.pixels();
      OmniDetectionImage dim;
      // We call DetectionImageLoader's initialize with the PLANAR geometry, which will put the
      // loader into an incomplete state for CURVY image targets. We set the correct
      // geometry and object pose afterward.
      MutableRootMessage<ImageTargetMetadata> imageTargetMetadata;
      imageTargetMetadata.builder().setType(ImageTargetTypeMsg::PLANAR);
      imageTargetMetadata.builder().setName(imageTargetPathSpec_);
      imageTargetMetadata.builder().setImageWidth(im.cols());
      imageTargetMetadata.builder().setImageHeight(im.rows());
      // Set ImageTargetMetadata isRotated so detection-image-loader initializes k_.
      if (imageTargetType_ == DetectionImageType::CURVY) {
        imageTargetMetadata.builder().setIsRotated(curvySpec_.isRotated);
      }
      dim.initialize(
        glShader_.get(), imageTargetMetadata.reader(), Intrinsics::getCameraIntrinsics(model));
      if (imageTargetType_ == DetectionImageType::CURVY) {
        auto cropWidth = imbuffer.pixels().cols();
        auto cropHeight = imbuffer.pixels().rows();
        dim.setGeometry(cropWidth, cropHeight, curvySpec_);
      }
      dim.imTexture().bind();
      dim.imTexture().setPixels(im.pixels());
      dim.imTexture().unbind();
      dim.processBlocking();
      detectionImages_.insert(std::make_pair(dim.detectionImage().getName(), std::move(dim)));
    }
  }
};

CurvyOuterCrop parseCropStr(const String &cropString) {
  std::stringstream stream(cropString);
  String elem;
  Vector<float> data;
  while (std::getline(stream, elem, ',')) {
    data.push_back(std::stof(elem));
  }

  return {data[0], data[1], data[2], data[3]};
}

// Run omniscope two different ways:
//  1) bazel run //apps/client/internalqa/omniscope/headless:omniscope -- -i
//  /path/to/datarecorder_file -v 1 -t /path/to/target.jpg -j /path/to/targets.json
//    - target.jpg is the key that we will look for in targets.json to construct the image target
//    geometry.
//  2) bazel run //apps/client/internalqa/omniscope/headless:omniscope -- -i
//  /path/to/datarecorder_file -v 1 -t /path/to/target.jpg -a 0.399 -c 1.0,1.0,0.0,0.0 -b 1.0
int main(int argc, char *argv[]) {
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  CLI::App app{"omniscope-headless"};
  String realitySrc;
  String prebuiltMapSrc;
  String builtMapOut;
  String globalParametersJsonString;
  String syntheticSceneName;
  String outPath;
  String targetPathSpec;
  String targetsJson;
  // NOTE(nathan): I should be able to use std::pair for this but it was causing a build error
  // with CLI11.
  Vector<int> dimensions = {-1, -1};
  int viewIdx = -1;
  String viewGroupName;
  int frameSkip = 1;
  bool isPlanar = false;
  float arc = 0.5f;
  Vector<float> cropVals = {1.0f, 1.0f, 0.0f, 0.0f};
  float base = 1.0f;
  bool existingResponse = false;
  app
    .add_option(
      "-i,--in",
      realitySrc,
      "Source for reality, 'remote' for remote; 'stdin' for stdin, otherwise filename.")
    ->required();
  app.add_option("-v,--view", viewIdx, "index of view.")->required();
  app.add_option("-m,--mode", viewGroupName, "Name of view group.")->required();
  app
    .add_option(
      "-d,--dimensions",
      dimensions,
      "Output width & height.  Default is the view's display dimensions.  Comma-separated, like -d "
      "1920,1080.")
    ->delimiter(',')
    ->expected(2);
  app.add_option(
    "-g,--globalParameters",
    globalParametersJsonString,
    "JSON string to update PARAMETER_DATA with.");
  app.add_option("-s,--skipFrames", frameSkip, "Only process every nth frame");
  app.add_flag("-p,--planar", isPlanar, "Whether this is a planar image target");
  app.add_option("-t,--target", targetPathSpec, "Image target path");
  app.add_option("-j,--targetsJson", targetsJson, "Path to the targets JSON file");
  app.add_option("-a,--arc", arc, "Arc value between (0, 1]");
  app
    .add_option(
      "-c,--crop", cropVals, "CurvyOuterCrop values comma-separated, e.g. -crop 1.2,1.0,0.0,0.0")
    ->delimiter(',')
    ->expected(4);
  app.add_option("-b,--base", base, "CurvySpec.base value");
  app.add_option("-o,--out", outPath, "Output mp4 path (use \"NONE\" for no video output)")
    ->required();
  app.add_option(
    "--mapSrc", prebuiltMapSrc, "Prebuilt map to load at start of sequence in some views");
  app.add_option("--mapOut", builtMapOut, "Write map to file at end of sequence in some views");
  app.add_flag(
    "-e,--existingResponse", existingResponse, "Whether to use existing response in log file");
  CLI11_PARSE(app, argc, argv);

  if (realitySrc.empty() || viewIdx < 0 || outPath.empty()) {
    C8Log(
      "ERROR: Invalid argument(s).\n"
      "\n"
      "Run with the following arguments:\n"
      "   bazel run //apps/client/internalqa/omniscope/headless:omniscope -- "
      "-i /path/to/datarecorder/log.123456-600 "
      "-o /path/to/out.mp4 "
      "-v 3 "
      "[-m 0] "
      "[-s 1] "
      "[-t /path/to/image-target.jpg]\n\n"
      "Plus, optionally, either:\n"
      "a) JSON file target geometry input (we will look for the 'image-target.jpg' key): specify "
      "with -j\n"
      "   -j /path/to/targets.json\n\n"
      "b) Command line target geometry input: specify with -a, -c, -b\n"
      "   -a 0.7 "
      "-c 2.0,2.0,0.5,0.5 "
      "-b 1.0\n\n"
      "c) A planar flag\n"
      "   -p\n"
      "Views:");
    auto views = OmniscopeCallback().viewNames();
    for (int i = 0; i < views.size(); ++i) {
      C8Log("  %2d: %s", i, views[i].c_str());
    }
    return -1;
  }

  // Set global parameters.
  if (!globalParametersJsonString.empty()) {
    globalParams().mergeJsonString(globalParametersJsonString);
  }

  auto rStream = RealityStreamFactory::create(realitySrc);

  OmniscopeCallback omniscope;
  omniscope.setTmpPath(realitySrc);
  omniscope.setAbsSequencePath(realitySrc);
  omniscope.setPrebuiltMap(prebuiltMapSrc);
  omniscope.setBuiltMapOut(builtMapOut);
  omniscope.setViewGroup(viewGroupName);
  omniscope.setView(viewIdx);
  omniscope.setFrameSkip(frameSkip);
  omniscope.setVideoName(outPath);
  omniscope.setOutputDimensions(dimensions[0], dimensions[1]);
  if (isPlanar) {
    omniscope.setImageTargetType(DetectionImageType::PLANAR);
  } else if (!std::empty(targetsJson)) {
    C8Log("[omniscope] JSON file target geometry input");
    auto targetName = targetPathSpec;
    const size_t lastSlashIdx = targetPathSpec.find_last_of("\\/");
    if (std::string::npos != lastSlashIdx) {
      targetName.erase(0, lastSlashIdx + 1);
    }
    C8Log(
      "[omniscope] Looking in JSON file %s for target with key: \"%s\"",
      targetsJson.c_str(),
      targetName.c_str());
    auto targetJson = readJsonFile(targetsJson, targetName);
    omniscope.setCurvySpec(curvySpecFromTargetJson(targetJson));
    omniscope.setImageTargetType(DetectionImageType::CURVY);
  } else {
    if (app.count("--arc")) {
      C8Log("[omniscope] Command line target geometry input");

      CurvyOuterCrop crop = {cropVals[0], cropVals[1], cropVals[2], cropVals[3]};
      omniscope.setCurvySpec({arc, false, crop, base});
      omniscope.setImageTargetType(DetectionImageType::CURVY);
    }
  }
  if (!targetPathSpec.empty()) {
    omniscope.loadImageTargets(targetPathSpec);
  }

  rStream->setCallback(&omniscope);

  if (auto diskStream = dynamic_cast<DiskRealityStream *>(rStream.get())) {
    diskStream->setUseExistingResponse(existingResponse);
  }

  // For non-remote streams, start paused.
  rStream->spin();

  omniscope.processFinalFrame();

  // 'key:used_params' and '/end/' used in stitcher.ts
  C8Log("[omniscope(headless)] key:used_params /end/%s", globalParams().toJsonString().c_str());

  return 0;
}
